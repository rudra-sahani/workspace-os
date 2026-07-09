import { SmartPass, AttendanceLog, Participant } from '../types';
import { ModuleConfigurationService } from './SaaSServices';

const getStore = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`saas_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const setStore = (key: string, data: any) => {
  localStorage.setItem(`saas_${key}`, JSON.stringify(data));
};

export class SmartPassService {
  /**
   * Generates a unique Smart Pass for a participant.
   */
  static generateSmartPass(workspaceId: string, participant: Participant): SmartPass {
    const passes = getStore<SmartPass[]>('smart_passes', []);
    
    // Check if an active pass already exists for this participant
    const existingPass = passes.find(p => p.workspaceId === workspaceId && p.memberId === participant.id && p.status === 'Active');
    if (existingPass) {
      return existingPass;
    }

    const uniqueId = `pass-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const qrToken = `PASS-${workspaceId}-${participant.id}-${Date.now().toString().slice(-6)}`;
    const ticketNumber = `TK-${participant.id.slice(-5).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newPass: SmartPass = {
      id: uniqueId,
      workspaceId,
      memberId: participant.id,
      qrToken,
      ticketNumber,
      scanCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    passes.push(newPass);
    setStore('smart_passes', passes);
    return newPass;
  }

  /**
   * Retrieves a Smart Pass for a member.
   */
  static getSmartPassForMember(workspaceId: string, memberId: string): SmartPass | null {
    const passes = getStore<SmartPass[]>('smart_passes', []);
    return passes.find(p => p.workspaceId === workspaceId && p.memberId === memberId && p.status === 'Active') || null;
  }

  /**
   * Retrieves a Smart Pass by QR token.
   */
  static getSmartPassByToken(workspaceId: string, token: string): SmartPass | null {
    const passes = getStore<SmartPass[]>('smart_passes', []);
    return passes.find(p => p.workspaceId === workspaceId && p.qrToken === token) || null;
  }

  /**
   * Verifies a Smart Pass and records the attendance log.
   */
  static verifySmartPass(
    workspaceId: string,
    token: string,
    scannerUserId: string,
    action: 'Checked In' | 'Checked Out' | 'Rejected',
    remarks?: string,
    participantList?: Participant[] // Optionally pass current in-memory participant list to check real-time payment/status
  ): { 
    success: boolean; 
    message: string; 
    pass?: SmartPass; 
    errorReason?: 'Already Checked In' | 'Ticket Cancelled' | 'Wrong Event' | 'Expired' | 'Payment Pending' | 'Invalid QR' 
  } {
    const passes = getStore<SmartPass[]>('smart_passes', []);
    const pass = passes.find(p => p.qrToken === token);

    // 1. Check if Ticket Exists
    if (!pass) {
      return {
        success: false,
        message: 'The scanned ticket does not exist in our systems.',
        errorReason: 'Invalid QR'
      };
    }

    // 2. Check if Ticket belongs to this event/workspace
    if (pass.workspaceId !== workspaceId) {
      return {
        success: false,
        message: 'This ticket belongs to a different workspace/event.',
        errorReason: 'Wrong Event'
      };
    }

    // 3. Check if Ticket is Cancelled/Revoked
    if (pass.status === 'Revoked') {
      return {
        success: false,
        message: 'This ticket has been cancelled or revoked by the organizer.',
        errorReason: 'Ticket Cancelled'
      };
    }

    // 4. Check if Ticket is Expired
    if (pass.status === 'Expired' || (pass.expiresAt && new Date(pass.expiresAt) < new Date())) {
      return {
        success: false,
        message: 'This ticket has expired and is no longer valid.',
        errorReason: 'Expired'
      };
    }

    // Find the participant profile associated with the pass
    let participant: Participant | undefined;
    if (participantList) {
      participant = participantList.find(p => p.id === pass.memberId);
    } else {
      const allParticipants = getStore<Participant[]>(`participants_${workspaceId}`, []);
      participant = allParticipants.find(p => p.id === pass.memberId);
    }

    if (!participant) {
      return {
        success: false,
        message: 'No associated participant profile was found for this ticket.',
        errorReason: 'Invalid QR'
      };
    }

    // 5. Check if Payment is Approved (Paid)
    const configs = ModuleConfigurationService.getModuleConfigs(workspaceId);
    const attendanceConfig = configs.find(c => c.moduleKey === 'attendance')?.settings || {
      singleScan: true,
      requirePayment: true,
      manualCheckIn: false
    };

    if (attendanceConfig.requirePayment && participant.paymentStatus !== 'Paid') {
      return {
        success: false,
        message: `Check-in Blocked: Participant payment status is "${participant.paymentStatus}". Confirm payment before gate check-in.`,
        errorReason: 'Payment Pending'
      };
    }

    // 6. Check if Already Checked In (Prevent duplicate entry if singleScan is enabled)
    if (action === 'Checked In' && attendanceConfig.singleScan && pass.scanCount > 0) {
      return {
        success: false,
        message: `Access Denied: Ticket was already scanned and checked in at ${pass.lastScanAt ? new Date(pass.lastScanAt).toLocaleTimeString() : 'an earlier time'}.`,
        errorReason: 'Already Checked In'
      };
    }

    // If the scanner explicitly rejected the entry:
    if (action === 'Rejected') {
      this.logAttendance(workspaceId, pass.id, scannerUserId, 'Rejected', remarks);
      return {
        success: false,
        message: `Check-in rejected by scanner. Remarks: "${remarks || 'No remarks provided'}"`,
        pass
      };
    }

    // Successful Verification! Update scan counts and log
    pass.scanCount += (action === 'Checked In' ? 1 : 0);
    pass.lastScanAt = new Date().toISOString();

    // Save updated pass state
    const passIndex = passes.findIndex(p => p.id === pass.id);
    if (passIndex >= 0) {
      passes[passIndex] = pass;
      setStore('smart_passes', passes);
    }

    // Create Attendance Log
    this.logAttendance(workspaceId, pass.id, scannerUserId, action, remarks);

    return {
      success: true,
      message: `Access verified successfully! Welcome, ${participant.name}. Mode: ${action}.`,
      pass
    };
  }

  /**
   * Logs an attendance scan.
   */
  private static logAttendance(
    workspaceId: string,
    smartPassId: string,
    scannedBy: string,
    status: AttendanceLog['status'],
    remarks?: string
  ): AttendanceLog {
    const logs = getStore<AttendanceLog[]>('attendance_logs', []);
    const newLog: AttendanceLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      workspaceId,
      smartPassId,
      scannedBy,
      scannedAt: new Date().toISOString(),
      status,
      remarks
    };
    logs.push(newLog);
    setStore('attendance_logs', logs);
    return newLog;
  }

  /**
   * Retrieves all attendance logs for a workspace.
   */
  static getAttendanceLogs(workspaceId: string): AttendanceLog[] {
    const logs = getStore<AttendanceLog[]>('attendance_logs', []);
    return logs.filter(l => l.workspaceId === workspaceId);
  }
}
