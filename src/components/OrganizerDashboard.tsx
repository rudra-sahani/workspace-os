import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Megaphone,
  CreditCard,
  QrCode,
  Sliders,
  Plus,
  Trash2,
  Check,
  X,
  Eye,
  AlertTriangle,
  FileText,
  UserCheck,
  MapPin,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  ClipboardList,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Search,
  Mail,
  ListFilter,
  Layers2,
  Lock,
  ChevronRight,
  BarChart2,
  HelpCircle,
  Menu,
  Shield,
  Award,
  Activity,
  Bell,
  User,
  Folder,
  Map,
  Heart,
  Share2,
  Compass,
  FileCode,
  CheckSquare,
  Briefcase
} from 'lucide-react';
import {
  Workspace,
  Participant,
  FormQuestion,
  ParticipantRole,
  WorkspaceModules,
  EmailCampaign,
  WorkspaceImport,
  SaaSAnnouncement,
  SaaSDocument,
  MODULE_METADATA,
  ModuleMetadata
} from '../types';
import {
  WorkspaceSettingsService,
  ModuleConfigurationService,
  AIService,
  AnalyticsService,
  ImportService
} from '../services/SaaSServices';

interface OrganizerDashboardProps {
  workspace: Workspace;
  participants: Participant[];
  announcements: SaaSAnnouncement[];
  onUpdateWorkspace: (updated: Workspace) => void;
  onUpdateParticipants: (updated: Participant[]) => void;
  onAddAnnouncement: (title: string, content: string, category: 'Important' | 'General' | 'Schedule' | 'Emergency') => void;
  submissions: Record<string, any>[];
  onToggleModule: (moduleKey: keyof WorkspaceModules) => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function OrganizerDashboard({
  workspace,
  participants,
  announcements,
  onUpdateWorkspace,
  onUpdateParticipants,
  onAddAnnouncement,
  submissions,
  onToggleModule,
  onShowToast,
}: OrganizerDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'workspaces'
    | 'registration'
    | 'participants'
    | 'payments'
    | 'attendance'
    | 'smartpass'
    | 'scanner'
    | 'announcements'
    | 'schedule'
    | 'gallery'
    | 'documents'
    | 'sponsors'
    | 'volunteers'
    | 'chat'
    | 'liveLocation'
    | 'sos'
    | 'analytics'
    | 'reports'
    | 'certificates'
    | 'roles'
    | 'integrations'
    | 'settings'
    | 'profile'
    | 'notifications'
    | 'support'
  >('overview');

  const [activeModuleConfigTab, setActiveModuleConfigTab] = useState<'attendance' | 'payments' | 'sos' | 'liveLocation' | 'chat'>('attendance');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showWorkspaceSwitcher, setShowWorkspaceSwitcher] = useState(false);

  // Simulated live back-office data states
  const [scheduleEvents, setScheduleEvents] = useState([
    { id: '1', title: 'Main Stage Keynote & Welcome Address', time: '09:00 AM - 10:30 AM', speaker: 'Elena Rostova (CTO)', venue: 'Auditorium A', status: 'Upcoming' },
    { id: '2', title: 'Interactive Panel: Scaling Multi-tenant Architectures', time: '11:00 AM - 12:30 PM', speaker: 'Sarah Connor & Rudra', venue: 'Bento Hall', status: 'Live' },
    { id: '3', title: 'Advanced Supabase RLS and PostgREST Deep Dive', time: '02:00 PM - 03:30 PM', speaker: 'Devon Patel', venue: 'Sandbox Suite', status: 'Upcoming' }
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventSpeaker, setNewEventSpeaker] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');

  const [sponsors, setSponsors] = useState([
    { id: '1', name: 'Google Cloud Platform', tier: 'Platinum', link: 'https://cloud.google.com', logo: '☁️', impressions: 1420 },
    { id: '2', name: 'Supabase Inc.', tier: 'Gold', link: 'https://supabase.com', logo: '⚡', impressions: 980 },
    { id: '3', name: 'Vercel Platform', tier: 'Gold', link: 'https://vercel.com', logo: '▲', impressions: 1250 },
    { id: '4', name: 'Resend SMTP', tier: 'Silver', link: 'https://resend.com', logo: '✉️', impressions: 640 }
  ]);
  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorTier, setNewSponsorTier] = useState('Gold');
  const [newSponsorLink, setNewSponsorLink] = useState('');

  const [volunteers, setVolunteers] = useState([
    { id: '1', name: 'Arjun Mehta', assignment: 'Gate 3 Main Entry Access Scanner', checkInTime: '08:15 AM', status: 'On Duty' },
    { id: '2', name: 'Zoe Dubois', assignment: 'SOS Desk Dispatcher', checkInTime: '08:45 AM', status: 'On Duty' },
    { id: '3', name: 'Yuki Tanaka', assignment: 'Speaker Coordinator (Sandbox Suite)', checkInTime: '—', status: 'Offline' }
  ]);
  const [newVolName, setNewVolName] = useState('');
  const [newVolAssignment, setNewVolAssignment] = useState('');

  const [chatMessages, setChatMessages] = useState([
    { sender: 'Arjun Mehta (Volunteer)', message: 'Hello! Gate 3 entry queue is swelling. Scanner working perfectly though.', time: '09:12 AM', channel: 'staff' },
    { sender: 'Rudra (Organizer)', message: 'Acknowledged Arjun, sending Zoe with backup devices shortly.', time: '09:14 AM', channel: 'staff' },
    { sender: 'Elena Rostova (CTO)', message: 'Are the slides ready for the Auditorium A screen?', time: '09:18 AM', channel: 'general' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatChannel, setChatChannel] = useState<'general' | 'staff'>('general');

  const [activeSOSAlerts, setActiveSOSAlerts] = useState([
    { id: '1', memberName: 'Zoe Dubois', coords: '12.9716, 77.5946', severity: 'High', message: 'Medical emergency near Cafe, twisted ankle.', status: 'Dispatched', timestamp: '09:15 AM' },
    { id: '2', memberName: 'Ananya Rao', coords: '12.9722, 77.5950', severity: 'Critical', message: 'Power failure on Sandbox presentation server.', status: 'Triggered', timestamp: '09:20 AM' }
  ]);

  const [permissionsMatrix, setPermissionsMatrix] = useState({
    Owner: { fullAccess: true, editBranding: true, managePayments: true, triggerSOS: true },
    Organizer: { fullAccess: true, editBranding: true, managePayments: true, triggerSOS: true },
    Volunteer: { fullAccess: false, editBranding: false, managePayments: false, triggerSOS: true },
    Participant: { fullAccess: false, editBranding: false, managePayments: false, triggerSOS: false }
  });

  const [integrationStatuses, setIntegrationStatuses] = useState({
    supabase: true,
    resend: true,
    googleMaps: false,
    twilio: false
  });

  const [certificateTemplate, setCertificateTemplate] = useState({
    title: 'Certificate of Excellence',
    subtext: 'This is awarded to {{name}} for successful completion of {{event}}.',
    themePreset: 'modern-dark'
  });

  const [smartPassTemplate, setSmartPassTemplate] = useState({
    headerColor: '#6366f1',
    showAvatar: true,
    showQRCode: true,
    disclaimer: 'This pass is non-transferable and requires manual gate validation.'
  });

  const [inAppAlerts, setInAppAlerts] = useState([
    { id: '1', title: 'New Payment Screenshot', text: 'Sarah Connor uploaded a receipt for 4,000 INR.', time: '2 mins ago', unread: true },
    { id: '2', title: 'Critical SOS Dispatched', text: 'Zoe Dubois reported medical assistance required.', time: '10 mins ago', unread: true },
    { id: '3', title: 'Resend API Connection Success', text: 'Email campaigns are live.', time: '1 hour ago', unread: false }
  ]);

  // SaaS state integrations
  const settings = WorkspaceSettingsService.getSettings(workspace.id);

  // Redirection when viewed module gets dynamically disabled
  useEffect(() => {
    const tabToModuleMap: Record<string, keyof WorkspaceModules> = {
      schedule: 'schedule',
      registration: 'registration',
      payments: 'payments',
      smartpass: 'qrSmartPass',
      scanner: 'qrScanner',
      volunteers: 'volunteers',
      chat: 'chat',
      sos: 'sos',
      campaigns: 'announcements',
      announcements: 'announcements',
      imports: 'documents',
      ai: 'aiAssistant',
      sponsors: 'sponsors',
      certificates: 'certificates',
    };
    const mappedModule = tabToModuleMap[activeTab];
    if (mappedModule && !workspace.modules[mappedModule]) {
      setActiveTab('overview');
    }
  }, [activeTab, workspace.modules]);
  const moduleConfigs = ModuleConfigurationService.getModuleConfigs(workspace.id);
  const analytics = AnalyticsService.getMetrics(workspace.id);
  const imports = ImportService.getImports(workspace.id);
  const aiPrompts = AIService.getPrompts(workspace.id);
  const aiDocs = AIService.getAIDocuments(workspace.id);

  // Form Builder state
  const [newQuestionLabel, setNewQuestionLabel] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<FormQuestion['type']>('Short Text');
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [newQuestionOptions, setNewQuestionOptions] = useState('');
  const [newQuestionDesc, setNewQuestionDesc] = useState('');

  // Module settings search and category states
  const [wizModuleSearch, setWizModuleSearch] = useState('');
  const [wizModuleCategory, setWizModuleCategory] = useState<'All' | 'Core' | 'Communication' | 'Safety' | 'Content' | 'Operations' | 'Analytics' | 'Advanced'>('All');

  // AI Generation states
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiPromptType, setAiPromptType] = useState<'Event' | 'Form' | 'Itinerary' | 'Announcement' | 'Email'>('Itinerary');
  const [aiResult, setAiResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // CSV Import States
  const [importSourceType, setImportSourceType] = useState<WorkspaceImport['sourceType']>('CSV_Members');
  const [csvRawText, setCsvRawText] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState('');

  // Email Campaign States
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [campaignList, setCampaignList] = useState<EmailCampaign[]>([
    {
      id: 'camp-welcome',
      workspaceId: workspace.id,
      name: 'Welcome Series Campaign',
      subject: 'Welcome to WorkspaceOS!',
      body: 'Thank you for registering. Here is your dashboard link.',
      status: 'Sent',
      sentCount: 120,
      deliveredCount: 118,
      openedCount: 92,
      createdAt: new Date().toISOString(),
    }
  ]);

  // Scanner options
  const [scannerSelectedPart, setScannerSelectedPart] = useState<string>('');
  const [scanStatus, setScanStatus] = useState<'Checked In' | 'Checked Out' | 'Rejected'>('Checked In');
  const [scanRemarks, setScanRemarks] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  // Module settings update states (Rule 2)
  const [attendanceSettings, setAttendanceSettings] = useState({
    singleScan: true,
    requirePayment: true,
    manualCheckIn: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    amount: 4000,
    currency: 'INR',
    allowRefunds: false,
    upiId: 'workspaceos@ybl',
    autoApprove: false,
    upiInstructions: 'Please transfer to the UPI ID above and upload your transaction screenshot.',
  });

  const [sosSettings, setSosSettings] = useState({
    emergencyContacts: '112, +91 9999999999 (Rescue Ops)',
    notifyOrganizers: true,
    shareLiveLocation: true,
  });

  const [liveLocationSettings, setLiveLocationSettings] = useState({
    updateInterval: 10,
    privacyMode: 'Exact',
    visibleRoles: ['Organizer', 'Volunteer', 'Participant'],
  });

  const [chatSettings, setChatSettings] = useState({
    allowMedia: true,
    allowPinned: true,
    mode: 'ParticipantChat',
  });

  // Workspace Settings States
  const [metaName, setMetaName] = useState(workspace.name);
  const [metaDesc, setMetaDesc] = useState(workspace.description);
  const [metaCategory, setMetaCategory] = useState(workspace.category);
  const [metaVisibility, setMetaVisibility] = useState(workspace.visibility);
  const [metaCover, setMetaCover] = useState(workspace.coverImage || '');
  const [metaInvite, setMetaInvite] = useState(workspace.inviteCode || '');
  const [metaUpiId, setMetaUpiId] = useState(workspace.upiId || '');
  const [metaUpiInstructions, setMetaUpiInstructions] = useState(workspace.upiInstructions || '');
  const [metaStart, setMetaStart] = useState(workspace.startDate || '');
  const [metaEnd, setMetaEnd] = useState(workspace.endDate || '');

  // Branding preferences states
  const [brandingTheme, setBrandingTheme] = useState<"light" | "dark">(settings?.branding?.theme || 'dark');
  const [brandingColor, setBrandingColor] = useState(settings?.branding?.primaryColor || '#6366f1');
  const [brandingLang, setBrandingLang] = useState(settings?.defaultLanguage || 'en');

  // Chart animation and Floating Quick Actions states
  const [chartMounted, setChartMounted] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    setChartMounted(false);
    const timer = setTimeout(() => setChartMounted(true), 250);
    return () => clearTimeout(timer);
  }, [workspace.id]);

  // Sync state if active workspace switches
  useEffect(() => {
    setMetaName(workspace.name);
    setMetaDesc(workspace.description);
    setMetaCategory(workspace.category);
    setMetaVisibility(workspace.visibility);
    setMetaCover(workspace.coverImage || '');
    setMetaInvite(workspace.inviteCode || '');
    setMetaUpiId(workspace.upiId || '');
    setMetaUpiInstructions(workspace.upiInstructions || '');
    setMetaStart(workspace.startDate || '');
    setMetaEnd(workspace.endDate || '');
    setBrandingTheme(settings?.branding?.theme || 'dark');
    setBrandingColor(settings?.branding?.primaryColor || '#6366f1');
    setBrandingLang(settings?.defaultLanguage || 'en');

    // Load detailed module configurations from service
    const configs = ModuleConfigurationService.getModuleConfigs(workspace.id);
    const att = configs.find(c => c.moduleKey === 'attendance');
    if (att && att.settings) {
      setAttendanceSettings({
        singleScan: att.settings.singleScan ?? true,
        requirePayment: att.settings.requirePayment ?? true,
        manualCheckIn: att.settings.manualCheckIn ?? false,
      });
    }
    const pay = configs.find(c => c.moduleKey === 'payments');
    if (pay && pay.settings) {
      setPaymentSettings({
        amount: pay.settings.amount ?? 4000,
        currency: pay.settings.currency ?? 'INR',
        allowRefunds: pay.settings.allowRefunds ?? false,
        upiId: pay.settings.upiId ?? 'workspaceos@ybl',
        autoApprove: pay.settings.autoApprove ?? false,
        upiInstructions: pay.settings.upiInstructions ?? 'Please transfer to the UPI ID above and upload your transaction screenshot.',
      });
    }
    const sos = configs.find(c => c.moduleKey === 'sos');
    if (sos && sos.settings) {
      setSosSettings({
        emergencyContacts: sos.settings.emergencyContacts ?? '112, +91 9999999999 (Rescue Ops)',
        notifyOrganizers: sos.settings.notifyOrganizers ?? true,
        shareLiveLocation: sos.settings.shareLiveLocation ?? true,
      });
    }
    const loc = configs.find(c => c.moduleKey === 'liveLocation');
    if (loc && loc.settings) {
      setLiveLocationSettings({
        updateInterval: loc.settings.updateInterval ?? 10,
        privacyMode: loc.settings.privacyMode ?? 'Exact',
        visibleRoles: loc.settings.visibleRoles ?? ['Organizer', 'Volunteer', 'Participant'],
      });
    }
    const ch = configs.find(c => c.moduleKey === 'chat');
    if (ch && ch.settings) {
      setChatSettings({
        allowMedia: ch.settings.allowMedia ?? true,
        allowPinned: ch.settings.allowPinned ?? true,
        mode: ch.settings.mode ?? 'ParticipantChat',
      });
    }
    const sp = configs.find(c => c.moduleKey === 'smartpass');
    if (sp && sp.settings) {
      setSmartPassTemplate({
        headerColor: sp.settings.headerColor ?? '#6366f1',
        showAvatar: sp.settings.showAvatar ?? true,
        showQRCode: sp.settings.showQRCode ?? true,
        disclaimer: sp.settings.disclaimer ?? 'This pass is non-transferable and requires manual gate validation.',
      });
    } else {
      setSmartPassTemplate({
        headerColor: '#6366f1',
        showAvatar: true,
        showQRCode: true,
        disclaimer: 'This pass is non-transferable and requires manual gate validation.',
      });
    }
    const cert = configs.find(c => c.moduleKey === 'certificates');
    if (cert && cert.settings) {
      setCertificateTemplate({
        title: cert.settings.title ?? 'Certificate of Excellence',
        subtext: cert.settings.subtext ?? 'This is awarded to {{name}} for successful completion of {{event}}.',
        themePreset: cert.settings.themePreset ?? 'modern-dark',
      });
    } else {
      setCertificateTemplate({
        title: 'Certificate of Excellence',
        subtext: 'This is awarded to {{name}} for successful completion of {{event}}.',
        themePreset: 'modern-dark',
      });
    }
  }, [workspace]);

  const handleSaveMetaSettings = () => {
    onUpdateWorkspace({
      ...workspace,
      name: metaName,
      description: metaDesc,
      category: metaCategory,
      visibility: metaVisibility,
      coverImage: metaCover,
      inviteCode: metaInvite,
      upiId: metaUpiId,
      upiInstructions: metaUpiInstructions,
      startDate: metaStart,
      endDate: metaEnd,
    });
    if (onShowToast) {
      onShowToast('Workspace metadata updated with immediate, real-world effect!', 'success');
    } else {
      alert('Workspace metadata updated with immediate, real-world effect!');
    }
  };

  const handleSaveBranding = () => {
    WorkspaceSettingsService.updateSettings(workspace.id, {
      branding: {
        theme: brandingTheme,
        primaryColor: brandingColor,
        fontFamily: settings?.branding?.fontFamily || 'sans',
      },
      defaultLanguage: brandingLang,
    });
    if (onShowToast) {
      onShowToast('Branding and theme settings applied successfully to SaaS configurations!', 'success');
    } else {
      alert('Branding and theme settings applied successfully to SaaS configurations!');
    }
  };

  // Calculate high-fidelity stats
  const totalUsersCount = participants.length;
  const confirmedUsersCount = participants.filter(p => p.status === 'Confirmed').length;
  const pendingPaymentsCount = participants.filter(p => p.paymentStatus === 'Pending Verification').length;
  const verifiedRevenue = participants
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + (paymentSettings.amount || 4000), 0);

  const totalScans = participants.filter(p => p.checkedIn).length;

  // Handle adding custom question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionLabel.trim()) return;

    const newQuestion: FormQuestion = {
      id: `q-${Date.now()}`,
      label: newQuestionLabel,
      type: newQuestionType,
      required: newQuestionRequired,
      description: newQuestionDesc ? newQuestionDesc : undefined,
      options: ['Dropdown', 'Radio', 'Checkbox'].includes(newQuestionType) && newQuestionOptions
        ? newQuestionOptions.split(',').map(o => o.trim())
        : undefined,
    };

    const updatedQuestions = [...workspace.questions, newQuestion];
    onUpdateWorkspace({
      ...workspace,
      questions: updatedQuestions,
    });

    // Reset state
    setNewQuestionLabel('');
    setNewQuestionType('Short Text');
    setNewQuestionRequired(false);
    setNewQuestionOptions('');
    setNewQuestionDesc('');
  };

  const handleRemoveQuestion = (id: string) => {
    const updated = workspace.questions.filter(q => q.id !== id);
    onUpdateWorkspace({
      ...workspace,
      questions: updated,
    });
  };

  // Safe isolated module configuration updates with real validations
  const handleSaveAttendanceSettings = () => {
    try {
      ModuleConfigurationService.updateModuleSettings(workspace.id, 'attendance', true, attendanceSettings);
      if (onShowToast) {
        onShowToast('Attendance Module Settings updated and validated successfully!', 'success');
      } else {
        alert('Attendance Module Settings updated and validated successfully!');
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(e.message, 'error');
      } else {
        alert(e.message);
      }
    }
  };

  const handleSavePaymentSettings = () => {
    try {
      ModuleConfigurationService.updateModuleSettings(workspace.id, 'payments', true, paymentSettings);
      // Synchronize back to the master workspace fields for seamless UI
      onUpdateWorkspace({
        ...workspace,
        upiId: paymentSettings.upiId,
      });
      if (onShowToast) {
        onShowToast('Payments Module Settings updated and validated successfully!', 'success');
      } else {
        alert('Payments Module Settings updated and validated successfully!');
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(e.message, 'error');
      } else {
        alert(e.message);
      }
    }
  };

  const handleSaveSosSettings = () => {
    try {
      ModuleConfigurationService.updateModuleSettings(workspace.id, 'sos', true, sosSettings);
      if (onShowToast) {
        onShowToast('Emergency SOS Module Settings updated successfully!', 'success');
      } else {
        alert('Emergency SOS Module Settings updated successfully!');
      }
    } catch (e: any) {
      if (onShowToast) onShowToast(e.message, 'error');
    }
  };

  const handleSaveLiveLocationSettings = () => {
    try {
      ModuleConfigurationService.updateModuleSettings(workspace.id, 'liveLocation', true, liveLocationSettings);
      if (onShowToast) {
        onShowToast('Live Location Tracking Settings updated successfully!', 'success');
      } else {
        alert('Live Location Tracking Settings updated successfully!');
      }
    } catch (e: any) {
      if (onShowToast) onShowToast(e.message, 'error');
    }
  };

  const handleSaveChatSettings = () => {
    try {
      ModuleConfigurationService.updateModuleSettings(workspace.id, 'chat', true, chatSettings);
      if (onShowToast) {
        onShowToast('Group Chat Module Settings updated successfully!', 'success');
      } else {
        alert('Group Chat Module Settings updated successfully!');
      }
    } catch (e: any) {
      if (onShowToast) onShowToast(e.message, 'error');
    }
  };

  const handleSaveSmartPassSettings = () => {
    try {
      ModuleConfigurationService.updateModuleSettings(workspace.id, 'smartpass', true, smartPassTemplate);
      if (onShowToast) {
        onShowToast('Smart Pass customized template saved and published successfully!', 'success');
      } else {
        alert('Smart Pass customized template saved and published successfully!');
      }
    } catch (e: any) {
      if (onShowToast) onShowToast(e.message, 'error');
    }
  };

  const handleSaveCertificateSettings = () => {
    try {
      ModuleConfigurationService.updateModuleSettings(workspace.id, 'certificates', true, certificateTemplate);
      if (onShowToast) {
        onShowToast('Excellence Certificate template saved and active successfully!', 'success');
      } else {
        alert('Excellence Certificate template saved and active successfully!');
      }
    } catch (e: any) {
      if (onShowToast) onShowToast(e.message, 'error');
    }
  };

  // Smart Attendance Scanner Checks (Checked In, Checked Out, Rejected with Remarks)
  const handleProcessScan = () => {
    if (!scannerSelectedPart) {
      setScanResult({ success: false, message: 'Please select a participant first.' });
      return;
    }

    const participant = participants.find(p => p.id === scannerSelectedPart);
    if (!participant) {
      setScanResult({ success: false, message: 'Participant profile not found.' });
      return;
    }

    if (scanStatus === 'Checked In' && participant.paymentStatus !== 'Paid') {
      setScanResult({
        success: false,
        message: `Check-in Blocked: ${participant.name} is "${participant.paymentStatus}". Verify manual payment before gate check-in.`,
      });
      return;
    }

    const updated = participants.map(p => {
      if (p.id === scannerSelectedPart) {
        return {
          ...p,
          checkedIn: scanStatus === 'Checked In',
          checkInCount: scanStatus === 'Checked In' ? p.checkInCount + 1 : p.checkInCount,
          lastCheckIn: new Date().toISOString(),
        };
      }
      return p;
    });

    onUpdateParticipants(updated);
    setScanResult({
      success: true,
      message: `Access logs recorded successfully as "${scanStatus}". Remarks: "${scanRemarks || 'No remarks added'}"`,
    });
    setScanRemarks('');
  };

  // AI-first generation runner (Rule 3)
  const runAIGenerator = async () => {
    if (!aiPromptInput.trim()) return;
    setIsGenerating(true);
    setAiResult('');
    try {
      const completion = await AIService.generateContent(workspace.id, aiPromptType, aiPromptInput);
      setAiResult(completion);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // CSV Import Runner
  const runCSVImport = () => {
    if (!csvRawText.trim()) {
      setImportStatusMsg('Error: Please paste some valid CSV rows to start.');
      return;
    }
    setImportStatusMsg('Parsing and validating CSV headers...');
    setTimeout(() => {
      const imp = ImportService.triggerImport(workspace.id, importSourceType, csvRawText);
      if (imp.status === 'Failed') {
        setImportStatusMsg(`Validation Failed:\n${imp.errorReport}`);
      } else {
        setImportStatusMsg(`Import Successful! Validated and synchronized ${imp.previewData.length} records.`);
        // Let's seed these imported members into the live state
        const importedParticipants: Participant[] = imp.previewData.map((row, index) => ({
          id: `imported-p-${Date.now()}-${index}`,
          name: row.name || row.Name || 'Imported User',
          email: row.email || row.Email || `imported-${index}@workspaceos.io`,
          phone: row.phone || row.Phone || '9999999999',
          role: 'Participant',
          status: 'Confirmed',
          paymentStatus: 'Paid',
          checkedIn: false,
          checkInCount: 0,
        }));
        onUpdateParticipants([...participants, ...importedParticipants]);
        setCsvRawText('');
      }
    }, 1200);
  };

  // Trigger campaign broadcast simulation
  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject.trim() || !campaignBody.trim()) return;

    const newCamp: EmailCampaign = {
      id: `camp-${Date.now()}`,
      workspaceId: workspace.id,
      name: campaignSubject,
      subject: campaignSubject,
      body: campaignBody,
      status: 'Sent',
      sentCount: participants.length,
      deliveredCount: participants.length,
      openedCount: Math.floor(participants.length * 0.78),
      createdAt: new Date().toISOString(),
    };

    setCampaignList([newCamp, ...campaignList]);
    setCampaignSubject('');
    setCampaignBody('');
    if (onShowToast) {
      onShowToast(`Campaign broadcasted to all ${participants.length} registered emails using Resend!`, 'success');
    } else {
      alert(`Campaign broadcasted to all ${participants.length} registered emails using Resend!`);
    }
  };

  // Manual payment verification (approve/reject workflow) (Rule 7)
  const handleVerifyManualPayment = (participantId: string, action: 'Approve' | 'Reject') => {
    const updated = participants.map(p => {
      if (p.id === participantId) {
        return {
          ...p,
          paymentStatus: (action === 'Approve' ? 'Paid' : 'Unpaid') as any,
          status: (action === 'Approve' ? 'Confirmed' : 'Pending') as any,
        };
      }
      return p;
    });
    onUpdateParticipants(updated);
    if (action === 'Approve') {
      AnalyticsService.incrementRevenue(workspace.id, paymentSettings.amount || 4000);
    }
  };

  return (
    <div className="flex flex-col min-h-[850px] text-slate-100 bg-[#030712] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl" id="org-dash">
      
      {/* 1. HIGH-POLISHED TOP BAR */}
      <div className="h-16 border-b border-slate-800/80 bg-[#0a1122]/90 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
        
        {/* Left Side: Collapse Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span className="text-sm font-black tracking-wider text-white uppercase hidden sm:inline-block">WorkspaceOS</span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Workspace Switcher */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowWorkspaceSwitcher(!showWorkspaceSwitcher)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800/80 text-xs font-bold rounded-xl hover:border-slate-700 transition-all text-slate-300 cursor-pointer"
            >
              <span>{workspace.name}</span>
              <ChevronRight className="w-3 h-3 transform rotate-90 text-slate-500" />
            </button>

            {showWorkspaceSwitcher && (
              <div className="absolute left-0 mt-2 w-56 bg-[#0a1122] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in space-y-2">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest px-2">SWITCH WORKSPACE</p>
                <div className="space-y-1">
                  <button type="button" className="w-full text-left px-2.5 py-2 text-xs rounded-xl bg-indigo-600/10 text-indigo-300 border border-indigo-500/10 font-bold">
                    {workspace.name} (Current)
                  </button>
                  <button type="button" onClick={() => alert('Setup other workspaces in database.')} className="w-full text-left px-2.5 py-2 text-xs rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all cursor-pointer">
                    + Sandbox Enterprise
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Side: Universal Search */}
        <div className="hidden md:flex items-center bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-1.5 w-64 focus-within:border-indigo-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500 mr-2" />
          <input 
            type="text"
            placeholder="Global search console..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white focus:outline-hidden w-full focus:ring-0"
          />
        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center gap-4">
          
          {/* Notification bell */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer relative"
            >
              <Bell className="w-4.5 h-4.5" />
              {inAppAlerts.filter(a => a.unread).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0a1122] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">SYSTEM NOTIFICATIONS</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setInAppAlerts(inAppAlerts.map(a => ({ ...a, unread: false })));
                      setShowNotificationsDropdown(false);
                    }}
                    className="text-[9px] text-indigo-400 hover:underline font-bold cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                  {inAppAlerts.map(alert => (
                    <div key={alert.id} className={`p-2.5 rounded-xl border transition-all text-left ${alert.unread ? 'bg-indigo-950/10 border-indigo-500/10' : 'bg-slate-900/40 border-slate-800/60'}`}>
                      <p className="text-xs font-bold text-white">{alert.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{alert.text}</p>
                      <span className="text-[8px] text-slate-500 mt-1 block">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 hover:opacity-85 transition-all cursor-pointer"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                R
              </div>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0a1122] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in space-y-3 text-left">
                <div className="px-2 py-1">
                  <p className="text-xs font-bold text-white">Rudra (Root Owner)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">w3b.rudra@gmail.com</p>
                </div>
                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <button type="button" onClick={() => alert('Access Matrix: Role - Workspace creator')} className="w-full text-left px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
                    <Shield className="w-3.5 h-3.5" /> Security Status
                  </button>
                  <button type="button" onClick={() => alert('Workspace OS parameters loaded successfully.')} className="w-full text-left px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
                    <Settings className="w-3.5 h-3.5" /> General Settings
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 2. FLEX CONTAINER FOR SIDEBAR + MAIN AREA */}
      <div className="flex flex-row flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* COLLAPSIBLE SIDEBAR */}
        <div className={`transition-all duration-300 bg-[#0a1122]/90 border-r border-slate-800/80 flex flex-col justify-between py-5 overflow-y-auto ${isSidebarCollapsed ? 'w-16 px-2' : 'w-64 px-4'}`}>
          <div className="space-y-6">
            
            {!isSidebarCollapsed && (
              <div className="px-2">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">CONSOLE WORKSPACES</p>
                <p className="text-xs font-bold text-slate-400 mt-1 truncate">{workspace.category} OS</p>
              </div>
            )}

             <nav className="space-y-1">
               
               {/* Overview */}
               <button
                 type="button"
                 onClick={() => setActiveTab('overview')}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                   activeTab === 'overview'
                     ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                     : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                 }`}
                 title="Overview"
               >
                 <TrendingUp className="w-4 h-4 flex-shrink-0" />
                 {!isSidebarCollapsed && <span>Overview</span>}
               </button>
 
               {/* Module Settings / Capabilities */}
               <button
                 type="button"
                 onClick={() => setActiveTab('modules')}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                   activeTab === 'modules'
                     ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                     : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                 }`}
                 title="Capabilities Management"
               >
                 <Sliders className="w-4 h-4 flex-shrink-0" />
                 {!isSidebarCollapsed && <span>Module Settings</span>}
               </button>
 
               {/* Schedule */}
               {workspace.modules.schedule && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('schedule')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'schedule'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Schedule Agenda"
                 >
                   <Calendar className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Schedule Agenda</span>}
                 </button>
               )}
 
               {/* Registration Form */}
               {workspace.modules.registration && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('registration')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'registration'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Form Designer"
                 >
                   <FileText className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Form Designer</span>}
                 </button>
               )}
 
               {/* Payments */}
               {workspace.modules.payments && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('payments')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'payments'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Payments Queue"
                 >
                   <CreditCard className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && (
                     <div className="flex items-center justify-between w-full">
                       <span>UPI Audits</span>
                       {pendingPaymentsCount > 0 && (
                         <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded-md">
                           {pendingPaymentsCount}
                         </span>
                       )}
                     </div>
                   )}
                 </button>
               )}
 
               {/* Smart Pass builder */}
               {workspace.modules.qrSmartPass && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('smartpass')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'smartpass'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Smart Pass Passways"
                 >
                   <Award className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Pass Customizer</span>}
                 </button>
               )}
 
               {/* Scanner gate */}
               {workspace.modules.qrScanner && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('scanner')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'scanner'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Scanner Gate"
                 >
                   <QrCode className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Scanner Gate</span>}
                 </button>
               )}
 
               {/* Volunteers */}
               {workspace.modules.volunteers && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('volunteers')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'volunteers'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Volunteers Desk"
                 >
                   <UserCheck className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Volunteers</span>}
                 </button>
               )}
 
               {/* Staff Chat */}
               {workspace.modules.chat && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('chat')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'chat'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Staff Live Chat"
                 >
                   <MessageSquare className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Staff Live Chat</span>}
                 </button>
               )}
 
               {/* SOS alerts desk */}
               {workspace.modules.sos && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('sos')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'sos'
                       ? 'bg-rose-950/20 text-rose-400 border border-rose-500/10'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="SOS Dispatcher"
                 >
                   <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                   {!isSidebarCollapsed && (
                     <div className="flex items-center justify-between w-full">
                       <span>SOS Dispatcher</span>
                       {activeSOSAlerts.length > 0 && (
                         <span className="bg-rose-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-md animate-pulse">
                           {activeSOSAlerts.length}
                         </span>
                       )}
                     </div>
                   )}
                 </button>
               )}
 
               {/* Broadcast Campaigns */}
               {workspace.modules.announcements && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('campaigns')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'campaigns'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Campaigns Broadcasts"
                 >
                   <Mail className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Broadcast Feeds</span>}
                 </button>
               )}
 
               {/* Announcements Tab */}
               {workspace.modules.announcements && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('announcements')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'announcements'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Urgent Broadcasts"
                 >
                   <Megaphone className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Urgent News</span>}
                 </button>
               )}
 
               {/* Member Imports */}
               {workspace.modules.documents && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('imports')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'imports'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Member Imports"
                 >
                   <Download className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Sheets Imports</span>}
                 </button>
               )}
 
               {/* AI Assistant */}
               {workspace.modules.aiAssistant && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('ai')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'ai'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="AI Copilot"
                 >
                   <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>AI Sandbox</span>}
                 </button>
               )}
 
               {/* Sponsors */}
               {workspace.modules.sponsors && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('sponsors')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'sponsors'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Sponsors Control"
                 >
                   <Folder className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Sponsors Grid</span>}
                 </button>
               )}
 
               {/* Certificates templates */}
               {workspace.modules.certificates && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('certificates')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'certificates'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Certificates Designer"
                 >
                   <CheckSquare className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Certificates</span>}
                 </button>
               )}
 
               {/* Permissions Roles matrix */}
               {(workspace.modules.volunteers || workspace.modules.participants) && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('roles')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'roles'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Roles Matrix"
                 >
                   <Shield className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Access Matrix</span>}
                 </button>
               )}
 
               {/* Core Integrations */}
               {workspace.modules.reports && (
                 <button
                   type="button"
                   onClick={() => setActiveTab('integrations')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                     activeTab === 'integrations'
                       ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                       : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                   }`}
                   title="Integrations API"
                 >
                   <Activity className="w-4 h-4 flex-shrink-0" />
                   {!isSidebarCollapsed && <span>Integrations</span>}
                 </button>
               )}
 
               {/* Settings */}
               <button
                 type="button"
                 onClick={() => setActiveTab('settings')}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                   activeTab === 'settings'
                     ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                     : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
                 }`}
                 title="Workspace Settings"
               >
                 <Settings className="w-4 h-4 flex-shrink-0" />
                 {!isSidebarCollapsed && <span>Workspace settings</span>}
               </button>
 
             </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/60 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              {isSidebarCollapsed ? "v1.2" : "WorkspaceOS v1.2.0"}
            </span>
          </div>

        </div>

        {/* MAIN PANEL CONTENT WRAPPER */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#080d19]/40">

        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/50">
              <div>
                <h2 className="text-xl font-extrabold text-white">Actionable Workspace Health</h2>
                <p className="text-xs text-slate-400">Real-time indicators across membership, payment verifications and access gates.</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                title="Refresh Metrics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-[#0c1425] hover:bg-[#0e172a] border border-slate-800/80 hover:border-indigo-500/30 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Members</span>
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white mt-3">{totalUsersCount}</p>
                <p className="text-[10px] text-indigo-400 font-semibold mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                  Growth: +{analytics.workspaceGrowthRate}% this month
                </p>
              </div>

              <div className="p-5 bg-[#0c1425] hover:bg-[#0e172a] border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Confirmed smart pass</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white mt-3">{confirmedUsersCount}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-2">Active access credentials</p>
              </div>

              <div className="p-5 bg-[#0c1425] hover:bg-[#0e172a] border border-slate-800/80 hover:border-amber-500/30 rounded-2xl hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pending UPI Reviews</span>
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white mt-3">{pendingPaymentsCount}</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-2">Manual screenshot queues</p>
              </div>

              <div className="p-5 bg-[#0c1425] hover:bg-[#0e172a] border border-slate-800/80 hover:border-violet-500/30 rounded-2xl hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Verified Revenue</span>
                  <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white mt-3">₹{verifiedRevenue.toLocaleString()}</p>
                <p className="text-[10px] text-violet-400 font-semibold mt-2">Target currency: {settings.currency}</p>
              </div>
            </div>

            {/* Simulated Trend Charts (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 p-6 bg-[#0a1122]/90 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Registration & Collection Activity</h4>
                    <p className="text-[10px] text-slate-400">Visual trend representation across workspace lifecycles.</p>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full" /> Registrations
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Cash Flows
                    </span>
                  </div>
                </div>

                {/* Simulated Chart Bars */}
                <div className="h-48 flex items-end justify-between pt-6 px-2">
                  {Object.entries(analytics.registrationCountByDay).map(([day, val]) => {
                    const payVal = analytics.paymentCollectionByDay[day] || 0;
                    const regHeight = Math.min(100, (val / 100) * 100);
                    const payHeight = Math.min(100, (payVal / 100000) * 100);
                    return (
                      <div key={day} className="flex flex-col items-center gap-2 flex-1 group/bar">
                        <div className="w-full flex justify-center gap-2 h-36 items-end">
                          <div 
                            style={{ height: chartMounted ? `${Math.max(5, regHeight)}%` : '0%' }}
                            className="w-3 bg-indigo-500/80 hover:bg-indigo-400 hover:scale-y-105 rounded-t-sm transition-all duration-1000 ease-out cursor-pointer shadow-lg shadow-indigo-500/25"
                            title={`${val} signups`}
                          />
                          <div 
                            style={{ height: chartMounted ? `${Math.max(5, payHeight)}%` : '0%' }}
                            className="w-3 bg-emerald-500/80 hover:bg-emerald-400 hover:scale-y-105 rounded-t-sm transition-all duration-1000 ease-out cursor-pointer shadow-lg shadow-emerald-500/25"
                            title={`₹${payVal} collected`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold group-hover/bar:text-slate-300 transition-colors">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-4 p-6 bg-[#0a1122]/90 border border-slate-800 rounded-3xl space-y-5">
                <div className="pb-2 border-b border-slate-800/40">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Broadcast Performance</h4>
                  <p className="text-[10px] text-slate-400">Real-time email campaigns reach metrics (Resend Engine).</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                      <span>EMAILS DISPATCHED</span>
                      <span className="text-indigo-400 font-mono">{analytics.emailDeliveryRates.sent}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-full transition-all duration-1000" style={{ width: chartMounted ? '100%' : '0%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                      <span>DELIVERY RATE</span>
                      <span className="text-emerald-400 font-mono">{Math.floor((analytics.emailDeliveryRates.delivered / analytics.emailDeliveryRates.sent) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: chartMounted ? '99%' : '0%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                      <span>UNIQUE OPEN RATE</span>
                      <span className="text-violet-400 font-mono">{Math.floor((analytics.emailDeliveryRates.opened / analytics.emailDeliveryRates.delivered) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-violet-500 h-full transition-all duration-1000" style={{ width: chartMounted ? '77%' : '0%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-[10px] text-slate-400 leading-relaxed border-t border-slate-800/50">
                  ⚡ Connected Resend template handles notifications securely.
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-4 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-200">Want to auto-generate a comprehensive schedule with AI?</h4>
                  <p className="text-[11px] text-indigo-300">Run the AI assistant to instantly construct an agenda, custom form questions or confirmation letters.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('ai')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Go to AI Sandbox
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MODULE CONFIGURATIONS */}
        {activeTab === 'modules' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
              <div>
                <h2 className="text-xl font-extrabold text-white">Module Configurations</h2>
                <p className="text-xs text-slate-400">Tweak rules, gateways, intervals, and access criteria for each active capability.</p>
              </div>
              <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                {(['attendance', 'payments', 'sos', 'liveLocation', 'chat'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveModuleConfigTab(tab)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer capitalize ${
                      activeModuleConfigTab === tab
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'liveLocation' ? 'Live Location' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab 1: Attendance */}
            {activeModuleConfigTab === 'attendance' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 bg-[#0a1122] border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800/50">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Attendance Checking Parameters</h3>
                      <p className="text-[10px] text-slate-400">Configure entry validation rules for scanners and volunteers.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Enforce Single-Scan Limit</span>
                        <span className="text-[10px] text-slate-400 block">Prevent duplicate scans; a member can check-in only once.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={attendanceSettings.singleScan}
                        onChange={e => setAttendanceSettings({ ...attendanceSettings, singleScan: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Require Verified Payment</span>
                        <span className="text-[10px] text-slate-400 block">Only allow entry if UPI transaction screenshot is approved.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={attendanceSettings.requirePayment}
                        onChange={e => setAttendanceSettings({ ...attendanceSettings, requirePayment: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Allow Manual Check-In Overrides</span>
                        <span className="text-[10px] text-slate-400 block">Let organizers mark attendance manually on the desk.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={attendanceSettings.manualCheckIn}
                        onChange={e => setAttendanceSettings({ ...attendanceSettings, manualCheckIn: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveAttendanceSettings}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Apply Attendance Parameters
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-slate-900/20 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Attendance Insights</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The check-in desk reads participant QR Smart Passes. Rules updated here apply instantly on active scanning terminals.
                  </p>
                  <div className="p-4 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Total Scans Today</span>
                      <span className="font-bold text-white">{totalScans}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Require Verified Payment</span>
                      <span className={`font-bold ${attendanceSettings.requirePayment ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {attendanceSettings.requirePayment ? 'Yes (Enforced)' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Payments */}
            {activeModuleConfigTab === 'payments' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 bg-[#0a1122] border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800/50">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Manual UPI Payment Settings</h3>
                      <p className="text-[10px] text-slate-400">Set event price, currency, UPI target ID, and guidelines.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1.5">BASE AMOUNT</label>
                        <input
                          type="number"
                          value={paymentSettings.amount}
                          onChange={e => setPaymentSettings({ ...paymentSettings, amount: parseInt(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1.5">CURRENCY</label>
                        <select
                          value={paymentSettings.currency}
                          onChange={e => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5">UPI ID FOR QR CODES</label>
                      <input
                        type="text"
                        value={paymentSettings.upiId}
                        onChange={e => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5">PAYMENT INSTRUCTIONS</label>
                      <textarea
                        value={paymentSettings.upiInstructions}
                        onChange={e => setPaymentSettings({ ...paymentSettings, upiInstructions: e.target.value })}
                        rows={3}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Auto-Approve Payments</span>
                        <span className="text-[10px] text-slate-400 block">Instantly confirm registration on screenshot upload.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentSettings.autoApprove}
                        onChange={e => setPaymentSettings({ ...paymentSettings, autoApprove: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </div>

                    <div className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Allow Refund Options</span>
                        <span className="text-[10px] text-slate-400 block">Offer automatic rollback upon verification rejection.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentSettings.allowRefunds}
                        onChange={e => setPaymentSettings({ ...paymentSettings, allowRefunds: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSavePaymentSettings}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Save Financial Parameters
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-slate-900/20 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Gateway Status</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    WorkspaceOS utilizes high-fidelity manual UPI verifications to eliminate high transaction processing fees.
                  </p>
                  <div className="p-4 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Base Ticket Cost</span>
                      <span className="font-bold text-white">{paymentSettings.currency} {paymentSettings.amount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>UPI ID Address</span>
                      <span className="font-bold text-indigo-400 font-mono text-[11px]">{paymentSettings.upiId}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Approval Flow</span>
                      <span className="font-bold text-white">{paymentSettings.autoApprove ? 'Auto-Approve' : 'Manual Review'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: SOS */}
            {activeModuleConfigTab === 'sos' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 bg-[#0a1122] border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800/50">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Emergency SOS Control Panel</h3>
                      <p className="text-[10px] text-slate-400">Manage rescue hotlines, participant safety triggers, and automated logging.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5">EMERGENCY HOTLINES & CONTACTS (COMMA SEPARATED)</label>
                      <textarea
                        value={sosSettings.emergencyContacts}
                        onChange={e => setSosSettings({ ...sosSettings, emergencyContacts: e.target.value })}
                        rows={3}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-mono"
                      />
                    </div>

                    <label className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Instantly Notify All Organizers</span>
                        <span className="text-[10px] text-slate-400 block">Send automated sound broadcasts to staff consoles when triggered.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={sosSettings.notifyOrganizers}
                        onChange={e => setSosSettings({ ...sosSettings, notifyOrganizers: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Auto-Share GPS Coordinates</span>
                        <span className="text-[10px] text-slate-400 block">Attach precise participant coordinates to alert notifications.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={sosSettings.shareLiveLocation}
                        onChange={e => setSosSettings({ ...sosSettings, shareLiveLocation: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveSosSettings}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Save Safety Configurations
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-slate-900/20 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Safety Status</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The SOS widget allows participants on trails, trips, or campuses to signal coordinators immediately when distressed.
                  </p>
                  <div className="p-4 bg-rose-950/10 border border-rose-500/10 rounded-2xl">
                    <p className="text-[10px] font-bold text-rose-400 uppercase">🚨 REAL-TIME MONITORS ACTIVE</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Coordinators are notified instantly when an alert triggers. GPS tracking is active for participants.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Live Location */}
            {activeModuleConfigTab === 'liveLocation' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 bg-[#0a1122] border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800/50">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Live Tracking Rules</h3>
                      <p className="text-[10px] text-slate-400">Configure update frequencies, coordinate privacy, and access rights.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5">COORDINATE UPDATE FREQUENCY</label>
                      <select
                        value={liveLocationSettings.updateInterval}
                        onChange={e => setLiveLocationSettings({ ...liveLocationSettings, updateInterval: parseInt(e.target.value) || 10 })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      >
                        <option value={5}>Every 5 seconds (Real-time telemetry)</option>
                        <option value={10}>Every 10 seconds (Recommended)</option>
                        <option value={30}>Every 30 seconds (Eco battery-saver)</option>
                        <option value={60}>Every minute</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5">LOCATION PRIVACY MODE</label>
                      <select
                        value={liveLocationSettings.privacyMode}
                        onChange={e => setLiveLocationSettings({ ...liveLocationSettings, privacyMode: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      >
                        <option value="Exact">Exact Coordinates (Highly precise)</option>
                        <option value="Obfuscated">Fuzzy Obfuscated Zones (Fuzzes location within 50 meters)</option>
                        <option value="Off">Coordinators Only (Hide from general participants list)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveLiveLocationSettings}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Save Tracking Rules
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-slate-900/20 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Telemetry Policy</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real-time position logging improves group safety on treks and trips. Fuzzing keeps members comfortable while maintaining visibility.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tab 5: Chat Settings */}
            {activeModuleConfigTab === 'chat' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 bg-[#0a1122] border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800/50">
                    <MessageSquare className="w-5 h-5 text-violet-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Group Chat Privileges</h3>
                      <p className="text-[10px] text-slate-400">Toggle media sharing, announcements broadcast rules, and moderator rights.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Allow Media Attachments</span>
                        <span className="text-[10px] text-slate-400 block">Let participants post screenshots, pictures, and PDFs in the chat feed.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={chatSettings.allowMedia}
                        onChange={e => setChatSettings({ ...chatSettings, allowMedia: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-start justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Allow Pinned Messages</span>
                        <span className="text-[10px] text-slate-400 block">Permit coordinators to pin crucial agenda alerts at the header.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={chatSettings.allowPinned}
                        onChange={e => setChatSettings({ ...chatSettings, allowPinned: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 w-4 h-4"
                      />
                    </label>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5">FEED MODE</label>
                      <select
                        value={chatSettings.mode}
                        onChange={e => setChatSettings({ ...chatSettings, mode: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      >
                        <option value="ParticipantChat">Open Discussion (All members can post)</option>
                        <option value="BroadcastOnly">Broadcast Only (Only staff can publish posts)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveChatSettings}
                      className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Apply Chat Rules
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 bg-slate-900/20 border border-slate-800 rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Feed Metrics</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instant message synchronizations help coordinate dynamic updates like weather details, route maps, or schedule shifts.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DYNAMIC REGISTRATION FORM BUILDER */}
        {activeTab === 'registration' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-extrabold text-white">Registration Forms Designer</h2>
                <p className="text-xs text-slate-400">Design structural form schema inputs to collect verified participants data.</p>
              </div>
              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold">
                ● Published
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Builder Left */}
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Add Field Schema</h3>
                <form onSubmit={handleAddQuestion} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">FIELD LABEL / QUESTION</label>
                    <input
                      type="text"
                      placeholder="e.g. GitHub Profile"
                      value={newQuestionLabel}
                      onChange={e => setNewQuestionLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">INPUT DATA TYPE</label>
                    <select
                      value={newQuestionType}
                      onChange={e => setNewQuestionType(e.target.value as FormQuestion['type'])}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="Short Text">Short Text</option>
                      <option value="Paragraph">Paragraph</option>
                      <option value="Dropdown">Dropdown Menu</option>
                      <option value="Radio">Radio Buttons</option>
                      <option value="Number">Numeric Input</option>
                      <option value="File Upload">Document File Upload</option>
                    </select>
                  </div>

                  {['Dropdown', 'Radio', 'Checkbox'].includes(newQuestionType) && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">OPTIONS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        placeholder="Option 1, Option 2, Option 3"
                        value={newQuestionOptions}
                        onChange={e => setNewQuestionOptions(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">FIELD HELPER DESCRIPTION</label>
                    <input
                      type="text"
                      placeholder="Instructions for participants"
                      value={newQuestionDesc}
                      onChange={e => setNewQuestionDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newQuestionRequired}
                      onChange={e => setNewQuestionRequired(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                    />
                    <span>Enforce field is Required</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Schema Field
                  </button>
                </form>
              </div>

              {/* Builder Right: Schema Live Preview */}
              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Form Fields Definition</h3>
                {workspace.questions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No registration fields configured yet.</p>
                ) : (
                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                    {workspace.questions.map((q, idx) => (
                      <div key={q.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl relative group">
                        <button
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="absolute top-3.5 right-3.5 p-1 text-slate-500 hover:text-rose-500 hover:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-start gap-2.5">
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded-md">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">{q.label} {q.required && <span className="text-rose-500">*</span>}</p>
                            <p className="text-[10px] text-indigo-300 font-semibold mt-0.5">{q.type}</p>
                            {q.description && <p className="text-[10px] text-slate-400 mt-1">{q.description}</p>}
                            {q.options && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {q.options.map((o, oidx) => (
                                  <span key={oidx} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50">
                                    {o}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: MANUAL PAYMENTS GATEWAY REVIEW (Rule 7) */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Manual Payment & screenshot Verification</h2>
              <p className="text-xs text-slate-400">Review scanned UPI transaction screenshot uploads, verify reference numbers, and approve Smart Pass tickets.</p>
            </div>

            {participants.filter(p => p.paymentStatus === 'Pending Verification').length === 0 ? (
              <div className="p-8 text-center bg-[#0a1122]/40 border border-slate-800 rounded-2xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">Queue completely cleared</h4>
                <p className="text-xs text-slate-400">No manual screenshot approvals are pending at this moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {participants.filter(p => p.paymentStatus === 'Pending Verification').map(p => (
                  <div key={p.id} className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    
                    {/* Left: Info */}
                    <div className="md:col-span-5 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">PENDING MANUAL AUDIT</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{p.name}</h4>
                        <p className="text-xs text-slate-400">{p.email}</p>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <span className="font-semibold text-slate-400">Uploaded Screenshot: </span>
                        Yes (Stored in securely isolated bucket: <span className="font-mono text-[10px] text-indigo-400">payments</span>)
                      </div>
                    </div>

                    {/* Middle: Simulated screenshot */}
                    <div className="md:col-span-4 flex justify-center">
                      <div className="relative border border-slate-800 p-2 rounded-xl bg-slate-900/60 max-w-[150px] group">
                        <img 
                          src={p.paymentScreenshot || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=80'} 
                          alt="receipt" 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl">
                          <a 
                            href={p.paymentScreenshot} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            View Original
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="md:col-span-3 flex flex-col gap-2.5">
                      <button
                        onClick={() => handleVerifyManualPayment(p.id, 'Approve')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Confirm & Issue Pass
                      </button>
                      <button
                        onClick={() => handleVerifyManualPayment(p.id, 'Reject')}
                        className="w-full py-2 bg-rose-900/35 hover:bg-rose-900/50 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Reject Screenshot
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACCESS GATE SCANNER CONTROLLER (Checked In, Checked Out, Rejected with Remarks) */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Smart Access Gate Controller</h2>
              <p className="text-xs text-slate-400">Simulate front-gate scanning. Track ticket scans, checkout events, or trigger check-in rejections with remarks.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Input */}
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Scan Simulator Card</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">SELECT MEMBER TO SCAN</label>
                    <select
                      value={scannerSelectedPart}
                      onChange={e => setScannerSelectedPart(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="">-- Choose Profile --</option>
                      {participants.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.status} - Pass status: {p.paymentStatus})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">SCAN STATUS ACTION</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Checked In', 'Checked Out', 'Rejected'] as const).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setScanStatus(opt)}
                          className={`py-1.5 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                            scanStatus === opt
                              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">ACCESS REMARKS / REASONING</label>
                    <input
                      type="text"
                      placeholder="e.g. Cleared main VIP lobby"
                      value={scanRemarks}
                      onChange={e => setScanRemarks(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  {scanResult && (
                    <div className={`p-3.5 rounded-xl border text-xs font-semibold leading-relaxed ${
                      scanResult.success 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      {scanResult.success ? '✓ Scan Registered: ' : '⚠️ Scan Failed: '}
                      {scanResult.message}
                    </div>
                  )}

                  <button
                    onClick={handleProcessScan}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" /> Execute Scanned Entry
                  </button>
                </div>
              </div>

              {/* Active Log List */}
              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Scanned Gate Logs</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {participants.filter(p => p.checkedIn).map(p => (
                    <div key={p.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-extrabold text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-400">Total Scans: {p.checkInCount} • {p.lastCheckIn ? new Date(p.lastCheckIn).toLocaleTimeString() : 'N/A'}</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-md font-bold">
                        ● Checked In
                      </span>
                    </div>
                  ))}
                  {participants.filter(p => p.checkedIn).length === 0 && (
                    <p className="text-xs text-slate-500 py-6 text-center">No active scanned logs present.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: EMAIL CAMPAIGNS & BROADCASTS */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Email Campaigns & Custom Templates</h2>
              <p className="text-xs text-slate-400">Compose confirmation series, critical reminders, or customized HTML campaigns to your entire member base.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Campaign Composer */}
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Create Campaign</h3>
                <form onSubmit={handleSendCampaign} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">EMAIL SUBJECT</label>
                    <input
                      type="text"
                      placeholder="e.g. Schedule Update or Ticket Reminder"
                      value={campaignSubject}
                      onChange={e => setCampaignSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">EMAIL HTML/BODY CONTENT</label>
                    <textarea
                      placeholder="Write your email body..."
                      rows={5}
                      value={campaignBody}
                      onChange={e => setCampaignBody(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" /> Broadcast Campaign
                  </button>
                </form>
              </div>

              {/* History list */}
              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Campaign logs</h3>
                <div className="space-y-3 max-h-[360px] overflow-y-auto">
                  {campaignList.map(camp => (
                    <div key={camp.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{camp.name}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full font-bold">
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed truncate">{camp.body}</p>
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/40 text-[10px] text-slate-400">
                        <div>Sent: <strong className="text-slate-200">{camp.sentCount}</strong></div>
                        <div>Delivered: <strong className="text-slate-200">{camp.deliveredCount}</strong></div>
                        <div>Opened: <strong className="text-slate-200">{camp.openedCount}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 7: DATA IMPORT ENGINE (CSV MEMBERS, ERROR LOGS, ROLLBACKS) (Rule 13) */}
        {activeTab === 'imports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Advanced Import Engine</h2>
              <p className="text-xs text-slate-400">Import existing sheets/CSV data of members, registrations, or payments with structural validation, logs, and rollback controls.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Form */}
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">New CSV Feed</h3>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">IMPORT DESTINATION TYPE</label>
                    <select
                      value={importSourceType}
                      onChange={e => setImportSourceType(e.target.value as WorkspaceImport['sourceType'])}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="CSV_Members">CSV Members List</option>
                      <option value="Google_Forms">Google Forms JSON Schema</option>
                      <option value="CSV_Payments">CSV Receipts Records</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">PASTE CSV CONTENT (Comma Separated)</label>
                    <textarea
                      placeholder="name,email,phone&#10;Alice Dev,alice@dev.com,9998881112&#10;Bob Architect,bob@arch.com,9991112223"
                      rows={6}
                      value={csvRawText}
                      onChange={e => setCsvRawText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  {importStatusMsg && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 rounded-xl text-[10px] whitespace-pre-line font-medium leading-relaxed">
                      💡 System Feedback: {importStatusMsg}
                    </div>
                  )}

                  <button
                    onClick={runCSVImport}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Trigger Parser & Validate
                  </button>
                </div>
              </div>

              {/* Right History logs & Rollbacks */}
              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Import Records & Rollback Tools</h3>
                <div className="space-y-3 max-h-[380px] overflow-y-auto">
                  {imports.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No historic imports registered.</p>
                  ) : (
                    imports.map(imp => (
                      <div key={imp.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white uppercase">{imp.sourceType.replace('_', ' ')}</span>
                            <p className="text-[9px] text-slate-400">{new Date(imp.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            imp.status === 'Completed' || imp.status === 'Validated'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {imp.status}
                          </span>
                        </div>

                        {/* Preview grid */}
                        <div className="text-[10px] font-mono bg-black/40 p-2 rounded-lg text-slate-300">
                          <p className="text-[9px] font-bold text-indigo-400 mb-1">SAMPLE ROW PREVIEWS:</p>
                          {imp.previewData.map((row, idx) => (
                            <div key={idx} className="truncate">
                              {JSON.stringify(row)}
                            </div>
                          ))}
                        </div>

                        {imp.status === 'Validated' && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => {
                                ImportService.rollbackImport(workspace.id, imp.id);
                                alert('Import successfully rolled back!');
                              }}
                              className="px-3 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15 text-[10px] font-bold rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                            >
                              Rollback Feed Records
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 8: AI-FIRST CORE SANDBOX (Rule 3) */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/50">
              <div>
                <h2 className="text-xl font-extrabold text-white">AI-First Core Operations</h2>
                <p className="text-xs text-slate-400">Auto-generate itineraries, registration forms, announcements, and confirmations safely using the workspace LLM module.</p>
              </div>
              <Sparkles className="w-5 h-5 text-indigo-400 animate-bounce" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LLM Runner */}
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Operations Composer</h3>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">OPERATION TYPE</label>
                    <select
                      value={aiPromptType}
                      onChange={e => setAiPromptType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="Itinerary">Schedule Itinerary Planner</option>
                      <option value="Form">Registration Form Builder</option>
                      <option value="Announcement">Critical Broadcast Announcer</option>
                      <option value="Email">Confirmation Email Writer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">PROMPT AND FOCUS TOPICS</label>
                    <textarea
                      placeholder="e.g. 2-day developer conference with networking and mentoring sessions."
                      rows={5}
                      value={aiPromptInput}
                      onChange={e => setAiPromptInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <button
                    onClick={runAIGenerator}
                    disabled={isGenerating}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Simulating LLM Synthesis...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Synthesize AI Workspace Artifact
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generation Result */}
              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Synthetic Completion Output</h3>
                
                {aiResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950/60 border border-slate-800 text-slate-200 text-xs font-mono rounded-xl whitespace-pre-wrap leading-relaxed max-h-[280px] overflow-y-auto">
                      {aiResult}
                    </div>
                    {aiPromptType === 'Form' && (
                      <button
                        onClick={() => {
                          try {
                            const parsed = JSON.parse(aiResult);
                            onUpdateWorkspace({
                              ...workspace,
                              questions: parsed,
                            });
                            alert('AI Generated registration fields applied successfully!');
                          } catch (e) {
                            alert('Failed to parse dynamic AI schema JSON template.');
                          }
                        }}
                        className="w-full py-2 bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/20 transition-all cursor-pointer"
                      >
                        Apply AI Schema to Registration Form
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-12 text-center">Your synthesized LLM outputs will appear here instantly.</p>
                )}

                {/* Prompts History */}
                {aiPrompts.length > 0 && (
                  <div className="pt-4 border-t border-slate-800/60 space-y-2">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">PROMPTS AUDIT LOG</p>
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto">
                      {aiPrompts.map(p => (
                        <div key={p.id} className="text-[10px] text-slate-400 flex justify-between">
                          <span>{p.promptType}: {p.promptText.substring(0, 40)}...</span>
                          <span className="text-slate-600 font-mono">{new Date(p.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: WORKSPACE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Workspace Control Center</h2>
              <p className="text-xs text-slate-400">Configure global metadata, brand identities, currencies, policies, and manual billing gateways with instant state synchronization.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Metadata Form */}
              <div className="lg:col-span-7 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Workspace Profiles & Parameters</h3>
                
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">EVENT/WORKSPACE NAME</label>
                      <input
                        type="text"
                        value={metaName}
                        onChange={e => setMetaName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">INVITE CODE RESTRICTION</label>
                      <input
                        type="text"
                        value={metaInvite}
                        onChange={e => setMetaInvite(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">DESCRIPTION</label>
                    <textarea
                      value={metaDesc}
                      onChange={e => setMetaDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">CATEGORY</label>
                      <select
                        value={metaCategory}
                        onChange={e => setMetaCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      >
                        <option value="Hackathon">Hackathon Challenge</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Meetup">Developer Meetup</option>
                        <option value="Conference">Industry Conference</option>
                        <option value="Retreat">Leadership Retreat</option>
                        <option value="Trip">Social Excursion</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">VISIBILITY PRIVACY</label>
                      <select
                        value={metaVisibility}
                        onChange={e => setMetaVisibility(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      >
                        <option value="Public">Public Access</option>
                        <option value="Private">Invite-Only Private</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">HERO COVER IMAGE URL</label>
                    <input
                      type="text"
                      value={metaCover}
                      onChange={e => setMetaCover(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">TIMELINE START DATE</label>
                      <input
                        type="date"
                        value={metaStart}
                        onChange={e => setMetaStart(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">TIMELINE END DATE</label>
                      <input
                        type="date"
                        value={metaEnd}
                        onChange={e => setMetaEnd(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveMetaSettings}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Save Workspace Profile Parameters
                    </button>
                  </div>
                </div>

                {/* Capabilities & Modules Settings */}
                <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4">
                  <div className="pb-2 border-b border-slate-800/40">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Capabilities (Modules)</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Enable or disable features on-the-fly. Changes are propagated in real-time without workspace recreation.</p>
                  </div>
                  
                  {/* Search and Category Filters inside Settings */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Filter features..."
                      value={wizModuleSearch}
                      onChange={e => setWizModuleSearch(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 text-[11px] rounded-xl text-white placeholder-slate-500 focus:outline-hidden"
                    />
                    <div className="flex gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
                      {(['All', 'Core', 'Communication', 'Safety', 'Content', 'Operations', 'Analytics', 'Advanced'] as const).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setWizModuleCategory(cat)}
                          className={`px-2 py-1 text-[9px] font-bold rounded-lg whitespace-nowrap transition-all ${
                            wizModuleCategory === cat
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {MODULE_METADATA.filter(m => {
                      const matchesCategory = wizModuleCategory === 'All' || m.category === wizModuleCategory;
                      const matchesSearch = m.name.toLowerCase().includes(wizModuleSearch.toLowerCase()) || m.description.toLowerCase().includes(wizModuleSearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    }).map(m => {
                      const IconComponent = {
                        FileText, Users, CreditCard, Award, UserCheck, QrCode, Megaphone, Calendar, ImageIcon, Folder, MessageSquare, AlertTriangle, MapPin, ClipboardList, Briefcase, TrendingUp, Sparkles, Layers
                      }[m.icon] || FileText;

                      const isEnabled = !!workspace.modules[m.key];

                      return (
                        <div
                          key={m.key}
                          onClick={() => onToggleModule(m.key)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                            isEnabled
                              ? 'bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50 shadow-sm shadow-indigo-950/10'
                              : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            <div className={`p-1.5 rounded-lg shrink-0 ${isEnabled ? 'bg-indigo-600/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[11px] font-bold text-white block">{m.name}</span>
                              <p className="text-[9px] text-slate-400 leading-normal">{m.description}</p>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <div className="shrink-0 pt-0.5">
                            <div className={`w-7 h-4 rounded-full transition-all relative ${isEnabled ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}>
                              <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${isEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Branding and UPI settings */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual look & feel */}
                <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Visual Look & Feel (Branding)</h3>
                  
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">VISUAL PRESET</label>
                      <select
                        value={brandingTheme}
                        onChange={e => setBrandingTheme(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      >
                        <option value="dark">Cosmic Slate (Dark Mode)</option>
                        <option value="light">Alpine Paper (Light Mode)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">PRIMARY COLOR SCHEME Accent</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={brandingColor}
                          onChange={e => setBrandingColor(e.target.value)}
                          className="w-10 h-8 p-0 bg-transparent border-0 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingColor}
                          onChange={e => setBrandingColor(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">DEFAULT SYSTEM LANGUAGE</label>
                      <select
                        value={brandingLang}
                        onChange={e => setBrandingLang(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Español (ES)</option>
                        <option value="de">Deutsch (DE)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSaveBranding}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                    >
                      Apply Visual Style
                    </button>
                  </div>
                </div>

                {/* Billing instructions */}
                <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">UPI Manual Gateway parameters</h3>
                  
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">UPI TARGET ID / ADDRESS</label>
                      <input
                        type="text"
                        value={metaUpiId}
                        onChange={e => setMetaUpiId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">UPI TRANSFER GUIDELINES</label>
                      <textarea
                        value={metaUpiInstructions}
                        onChange={e => setMetaUpiInstructions(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden text-[11px]"
                      />
                    </div>

                    <button
                      onClick={handleSaveMetaSettings}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Update Gateway Parameters
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 10: AGENDA SCHEDULE MANAGER */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Interactive Agenda Scheduler</h2>
              <p className="text-xs text-slate-400">Design schedules, allocate speakers, tag venues, and track live session status with real-time audience sync.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">New Agenda Slot</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">SESSION TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g. Advanced TypeScript Patterns"
                      value={newEventTitle}
                      onChange={e => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">TIME SLOT</label>
                    <input
                      type="text"
                      placeholder="e.g. 10:30 AM - 12:00 PM"
                      value={newEventTime}
                      onChange={e => setNewEventTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">SPEAKER</label>
                      <input
                        type="text"
                        placeholder="Elena Rostova"
                        value={newEventSpeaker}
                        onChange={e => setNewEventSpeaker(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">VENUE</label>
                      <input
                        type="text"
                        placeholder="Auditorium B"
                        value={newEventVenue}
                        onChange={e => setNewEventVenue(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newEventTitle || !newEventTime) {
                        alert('Title and Time are required.');
                        return;
                      }
                      setScheduleEvents([...scheduleEvents, {
                        id: Date.now().toString(),
                        title: newEventTitle,
                        time: newEventTime,
                        speaker: newEventSpeaker || 'TBA',
                        venue: newEventVenue || 'Main Hall',
                        status: 'Upcoming'
                      }]);
                      setNewEventTitle('');
                      setNewEventTime('');
                      setNewEventSpeaker('');
                      setNewEventVenue('');
                      onShowToast?.('Agenda Slot created successfully', 'success');
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Schedule Slot
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Timeline Agenda</h3>
                <div className="space-y-3">
                  {scheduleEvents.map(evt => (
                    <div key={evt.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-xs text-white">{evt.title}</p>
                          {evt.status === 'Live' && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-400 font-medium">
                          <span>⏱ {evt.time}</span>
                          <span>👤 {evt.speaker}</span>
                          <span>📍 {evt.venue}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={evt.status}
                          onChange={e => {
                            setScheduleEvents(scheduleEvents.map(s => s.id === evt.id ? { ...s, status: e.target.value as any } : s));
                          }}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 text-[9px] font-black rounded-lg text-slate-300 focus:outline-hidden"
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Live">Live</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setScheduleEvents(scheduleEvents.filter(s => s.id !== evt.id))}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: SPONSORS GRID */}
        {activeTab === 'sponsors' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Sponsors Board</h2>
              <p className="text-xs text-slate-400">Enlist, configure tier priorities, manage outward redirect backlinks, and monitor engagement telemetry.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Add New Sponsor</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">COMPANY NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={newSponsorName}
                      onChange={e => setNewSponsorName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">SPONSORSHIP TIER</label>
                    <select
                      value={newSponsorTier}
                      onChange={e => setNewSponsorTier(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="Platinum">Platinum (Top tier)</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">BACKLINK / REDIRECT URL</label>
                    <input
                      type="text"
                      placeholder="https://acme.org"
                      value={newSponsorLink}
                      onChange={e => setNewSponsorLink(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSponsorName) {
                        alert('Company name is required.');
                        return;
                      }
                      setSponsors([...sponsors, {
                        id: Date.now().toString(),
                        name: newSponsorName,
                        tier: newSponsorTier,
                        link: newSponsorLink || '#',
                        logo: '🏢',
                        impressions: 0
                      }]);
                      setNewSponsorName('');
                      setNewSponsorLink('');
                      onShowToast?.('Sponsor profile created', 'success');
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Enlist Brand
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Brand Board & Impressions Tracker</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sponsors.map(sp => (
                    <div key={sp.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{sp.logo}</span>
                          <div>
                            <p className="font-extrabold text-xs text-white">{sp.name}</p>
                            <a href={sp.link} target="_blank" rel="noreferrer" className="text-[9px] text-indigo-400 hover:underline truncate block max-w-[120px]">{sp.link}</a>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          sp.tier === 'Platinum' 
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25' 
                            : sp.tier === 'Gold'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                              : 'bg-slate-500/10 text-slate-300 border border-slate-700/25'
                        }`}>
                          {sp.tier}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/40">
                        <span>Telemetry: <strong>{sp.impressions}</strong> hits</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSponsors(sponsors.map(s => s.id === sp.id ? { ...s, impressions: s.impressions + 1 } : s));
                          }}
                          className="px-2 py-0.5 bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-[9px] font-bold rounded-md cursor-pointer"
                        >
                          Simulate Click
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: VOLUNTEERS */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Volunteers Command Centre</h2>
              <p className="text-xs text-slate-400">Track check-ins of security scouts and gate crew. Assign physical locations or gate-scanner rules.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Recruit Gate Crew</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">MEMBER NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Rohan Das"
                      value={newVolName}
                      onChange={e => setNewVolName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">CREW ASSIGNMENT</label>
                    <input
                      type="text"
                      placeholder="e.g. Gate 1 Ticket Scanner"
                      value={newVolAssignment}
                      onChange={e => setNewVolAssignment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newVolName) {
                        alert('Volunteer Name is required.');
                        return;
                      }
                      setVolunteers([...volunteers, {
                        id: Date.now().toString(),
                        name: newVolName,
                        assignment: newVolAssignment || 'General Duty',
                        checkInTime: '—',
                        status: 'Offline'
                      }]);
                      setNewVolName('');
                      setNewVolAssignment('');
                      onShowToast?.('Crew enlisted successfully', 'success');
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Enlist Crew Member
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Crew Deployment</h3>
                <div className="space-y-3">
                  {volunteers.map(vol => (
                    <div key={vol.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-xs text-white">{vol.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Assignment: <strong className="text-slate-300">{vol.assignment}</strong></p>
                        <p className="text-[9px] text-slate-500 font-mono">Duty Checkin: {vol.checkInTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${vol.status === 'On Duty' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                          ● {vol.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setVolunteers(volunteers.map(v => v.id === vol.id ? {
                              ...v,
                              status: v.status === 'On Duty' ? 'Offline' : 'On Duty',
                              checkInTime: v.status === 'On Duty' ? '—' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            } : v));
                          }}
                          className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-300 transition-all cursor-pointer"
                        >
                          Toggle Duty
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: STAFF LIVE CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Live Staff Communications</h2>
              <p className="text-xs text-slate-400">Collaborate with back-office and on-site crews. Broadcast queries, coordinate logistics, or track equipment status.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 space-y-2 h-fit">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">CHANNELS</p>
                <button
                  type="button"
                  onClick={() => setChatChannel('general')}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${chatChannel === 'general' ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'}`}
                >
                  # general-channel
                </button>
                <button
                  type="button"
                  onClick={() => setChatChannel('staff')}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${chatChannel === 'staff' ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'}`}
                >
                  # safety-and-staff
                </button>
              </div>

              <div className="lg:col-span-9 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl flex flex-col h-[420px] justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">#{chatChannel}-channel logs</span>
                  <span className="text-[9px] text-emerald-400 font-extrabold animate-pulse">● Live Synced</span>
                </div>

                <div className="flex-1 overflow-y-auto my-4 space-y-3 px-1">
                  {chatMessages.filter(m => m.channel === chatChannel).map((msg, i) => (
                    <div key={i} className="p-3 bg-slate-900/50 border border-slate-800/60 rounded-xl space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-white">{msg.sender}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{msg.message}</p>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!chatInput) return;
                    setChatMessages([...chatMessages, {
                      sender: 'Rudra (Organizer)',
                      message: chatInput,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      channel: chatChannel
                    }]);
                    setChatInput('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type team update..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 14: EMERGENCY SOS CONTROL */}
        {activeTab === 'sos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">SOS Disaster Control</h2>
                <p className="text-xs text-slate-400">Receive alarm signals directly from attendees or volunteers. Track coordinates, dispatch assistance, and manage resolution records.</p>
              </div>
            </div>

            <div className="p-5 bg-rose-950/5 border border-rose-500/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/10">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Emergency Signals</h3>
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">🔴 PRIORITY 1 QUEUE</span>
              </div>

              <div className="space-y-3.5">
                {activeSOSAlerts.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs font-medium">
                    Excellent: All SOS emergency alerts are currently resolved.
                  </div>
                ) : (
                  activeSOSAlerts.map(sos => (
                    <div key={sos.id} className="p-4 bg-slate-950/40 border border-rose-950/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-rose-400 uppercase">[{sos.severity} ALERT]</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs font-extrabold text-white">{sos.memberName}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] font-mono text-indigo-400 hover:underline cursor-pointer" onClick={() => alert(`GPS Telemetry coordinates: ${sos.coords}`)}>🌐 {sos.coords}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{sos.message}</p>
                        <p className="text-[9px] text-slate-500 font-mono">Alarm timestamp: {sos.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${sos.status === 'Triggered' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {sos.status}
                        </span>
                        {sos.status === 'Triggered' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSOSAlerts(activeSOSAlerts.map(a => a.id === sos.id ? { ...a, status: 'Dispatched' } : a));
                              onShowToast?.('Medical support dispatch trigger sent', 'info');
                            }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Dispatch Support
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSOSAlerts(activeSOSAlerts.filter(a => a.id !== sos.id));
                            onShowToast?.('Emergency signal marked resolved', 'success');
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 15: ACCESS MATRIX PERMISSIONS */}
        {activeTab === 'roles' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Platform RBAC Matrix</h2>
              <p className="text-xs text-slate-400">Configure Role-Based Access Controls (RBAC) dynamically across custom team members, crew volunteers, and attendees.</p>
            </div>

            <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl overflow-x-auto">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 mb-4">Roles & Capabilities</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-2.5">CAPABILITY</th>
                    <th className="py-2.5 text-center">OWNER</th>
                    <th className="py-2.5 text-center">ORGANIZER</th>
                    <th className="py-2.5 text-center">VOLUNTEER</th>
                    <th className="py-2.5 text-center">PARTICIPANT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300 font-medium">
                  <tr>
                    <td className="py-3">Full Workspace Access (Billing & Destructive)</td>
                    {(['Owner', 'Organizer', 'Volunteer', 'Participant'] as const).map(role => (
                      <td key={role} className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role].fullAccess}
                          onChange={e => {
                            setPermissionsMatrix({
                              ...permissionsMatrix,
                              [role]: { ...permissionsMatrix[role], fullAccess: e.target.checked }
                            });
                          }}
                          className="rounded-sm bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3">Edit Visual Branding & Metadata</td>
                    {(['Owner', 'Organizer', 'Volunteer', 'Participant'] as const).map(role => (
                      <td key={role} className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role].editBranding}
                          onChange={e => {
                            setPermissionsMatrix({
                              ...permissionsMatrix,
                              [role]: { ...permissionsMatrix[role], editBranding: e.target.checked }
                            });
                          }}
                          className="rounded-sm bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3">Audit Payments & Confirm Registrants</td>
                    {(['Owner', 'Organizer', 'Volunteer', 'Participant'] as const).map(role => (
                      <td key={role} className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role].managePayments}
                          onChange={e => {
                            setPermissionsMatrix({
                              ...permissionsMatrix,
                              [role]: { ...permissionsMatrix[role], managePayments: e.target.checked }
                            });
                          }}
                          className="rounded-sm bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3">Trigger Safety SOS Emergency Alert</td>
                    {(['Owner', 'Organizer', 'Volunteer', 'Participant'] as const).map(role => (
                      <td key={role} className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={permissionsMatrix[role].triggerSOS}
                          onChange={e => {
                            setPermissionsMatrix({
                              ...permissionsMatrix,
                              [role]: { ...permissionsMatrix[role], triggerSOS: e.target.checked }
                            });
                          }}
                          className="rounded-sm bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => onShowToast?.('RBAC Access parameters updated', 'success')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Apply RBAC Parameters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 16: INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">External Service Integrations</h2>
              <p className="text-xs text-slate-400">Expose live Webhooks, securely authenticate external databases, connect SMS alerts, and link maps grounding.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supabase */}
              <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚡</span>
                    <p className="font-extrabold text-xs text-white">Supabase Cloud SQL Database</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIntegrationStatuses({ ...integrationStatuses, supabase: !integrationStatuses.supabase })}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${integrationStatuses.supabase ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {integrationStatuses.supabase ? 'Connected' : 'Offline'}
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    disabled={!integrationStatuses.supabase}
                    value={integrationStatuses.supabase ? "https://your-proj.supabase.co" : ""}
                    onChange={() => {}}
                    placeholder="SUPABASE_URL"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-[11px] rounded-lg text-white font-mono focus:outline-hidden disabled:opacity-40"
                  />
                  <input
                    type="password"
                    disabled={!integrationStatuses.supabase}
                    value={integrationStatuses.supabase ? "••••••••••••••••••••••••" : ""}
                    onChange={() => {}}
                    placeholder="SUPABASE_ANON_KEY"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-[11px] rounded-lg text-white font-mono focus:outline-hidden disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Resend */}
              <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">✉️</span>
                    <p className="font-extrabold text-xs text-white">Resend SMTP Email delivery</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIntegrationStatuses({ ...integrationStatuses, resend: !integrationStatuses.resend })}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${integrationStatuses.resend ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {integrationStatuses.resend ? 'Connected' : 'Offline'}
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    disabled={!integrationStatuses.resend}
                    value={integrationStatuses.resend ? "re_123456789abcdefghijklmnopqrstuvwxyz" : ""}
                    onChange={() => {}}
                    placeholder="RESEND_API_KEY"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-[11px] rounded-lg text-white font-mono focus:outline-hidden disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Google Maps */}
              <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🗺️</span>
                    <p className="font-extrabold text-xs text-white">Google Maps Platform API</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIntegrationStatuses({ ...integrationStatuses, googleMaps: !integrationStatuses.googleMaps })}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${integrationStatuses.googleMaps ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {integrationStatuses.googleMaps ? 'Connected' : 'Offline'}
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    disabled={!integrationStatuses.googleMaps}
                    placeholder="MAPS_JAVASCRIPT_API_KEY"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-[11px] rounded-lg text-white font-mono focus:outline-hidden disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Twilio */}
              <div className="p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">💬</span>
                    <p className="font-extrabold text-xs text-white">Twilio SMS Gateway service</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIntegrationStatuses({ ...integrationStatuses, twilio: !integrationStatuses.twilio })}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${integrationStatuses.twilio ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {integrationStatuses.twilio ? 'Connected' : 'Offline'}
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    disabled={!integrationStatuses.twilio}
                    placeholder="TWILIO_ACCOUNT_SID"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-[11px] rounded-lg text-white font-mono focus:outline-hidden disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 17: SMART PASS TICKET CUSTOMIZER */}
        {activeTab === 'smartpass' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Smart Pass customization Panel</h2>
              <p className="text-xs text-slate-400">Design the ticketing layout delivered automatically to attendees upon successful registration.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Pass Parameters</h3>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">PASS THEME HEADER COLOR</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={smartPassTemplate.headerColor}
                        onChange={e => setSmartPassTemplate({ ...smartPassTemplate, headerColor: e.target.value })}
                        className="w-10 h-8 p-0 bg-transparent border-0 rounded-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={smartPassTemplate.headerColor}
                        onChange={e => setSmartPassTemplate({ ...smartPassTemplate, headerColor: e.target.value })}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400">SHOW USER PROFILE AVATAR</label>
                    <input
                      type="checkbox"
                      checked={smartPassTemplate.showAvatar}
                      onChange={e => setSmartPassTemplate({ ...smartPassTemplate, showAvatar: e.target.checked })}
                      className="rounded-sm bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400">INCLUDE QUICK SCAN QR CODE</label>
                    <input
                      type="checkbox"
                      checked={smartPassTemplate.showQRCode}
                      onChange={e => setSmartPassTemplate({ ...smartPassTemplate, showQRCode: e.target.checked })}
                      className="rounded-sm bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">PASSWAY RULES / DISCLAIMERS</label>
                    <textarea
                      value={smartPassTemplate.disclaimer}
                      onChange={e => setSmartPassTemplate({ ...smartPassTemplate, disclaimer: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveSmartPassSettings}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Save Passway Template
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4 flex flex-col items-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest self-start">Smart Pass Preview</h3>
                
                <div className="w-72 bg-[#090e1a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mt-4 font-sans text-left">
                  <div className="p-4" style={{ backgroundColor: smartPassTemplate.headerColor }}>
                    <p className="text-[9px] font-black tracking-widest text-white/90 uppercase">{workspace.category} PASS</p>
                    <h4 className="text-sm font-black text-white truncate mt-1">{workspace.name}</h4>
                  </div>
                  <div className="p-5 space-y-4 relative bg-black/40">
                    <div className="flex items-center gap-3">
                      {smartPassTemplate.showAvatar ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                          JD
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                          ?
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-black text-white">John Doe</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">MEMBER_ID: WOS-890214</p>
                      </div>
                    </div>

                    {smartPassTemplate.showQRCode && (
                      <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-lg">
                        <span className="text-4xl">🏁</span>
                      </div>
                    )}

                    <p className="text-[9px] text-slate-500 font-medium text-center leading-relaxed">
                      {smartPassTemplate.disclaimer}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 border-t border-slate-800/40 text-[9px] text-center font-mono text-slate-400">
                    Gate scanner: v1.2-authorised
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 18: CERTIFICATES DESIGNER */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Excellence Certificate Designer</h2>
              <p className="text-xs text-slate-400">Build and style custom dynamic certificates of participation. Automatically generate upon smart-pass attendance check-out.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Certificate Metadata</h3>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">CERTIFICATE MAIN HEADER</label>
                    <input
                      type="text"
                      value={certificateTemplate.title}
                      onChange={e => setCertificateTemplate({ ...certificateTemplate, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">AWARD STATEMENT (USE {"{{name}}"} KEY)</label>
                    <textarea
                      value={certificateTemplate.subtext}
                      onChange={e => setCertificateTemplate({ ...certificateTemplate, subtext: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">DESIGN PALETTE PRESET</label>
                    <select
                      value={certificateTemplate.themePreset}
                      onChange={e => setCertificateTemplate({ ...certificateTemplate, themePreset: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="modern-dark">Cosmic Dark (Indigo Slate)</option>
                      <option value="classic-gold">Alpine Gold (Cream & Classic)</option>
                      <option value="neon-emerald">Neon Emerald (Cyberpunk)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveCertificateSettings}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Sync Award Layout
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4 flex flex-col items-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest self-start">Dynamic Preview</h3>

                <div className={`w-full max-w-[450px] p-6 rounded-2xl shadow-2xl border text-center font-serif text-slate-100 ${
                  certificateTemplate.themePreset === 'modern-dark'
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-indigo-500/15'
                    : certificateTemplate.themePreset === 'classic-gold'
                      ? 'bg-[#faf7f2] border-[#dfc38a] text-amber-950 shadow-amber-500/5'
                      : 'bg-black border-emerald-500/15'
                }`}>
                  <div className={`p-1.5 border border-dashed rounded-lg ${certificateTemplate.themePreset === 'classic-gold' ? 'border-amber-900/10' : 'border-white/10'}`}>
                    <div className="p-4 space-y-4 border border-solid rounded-md border-transparent">
                      <span className={`text-xs font-bold tracking-widest uppercase ${certificateTemplate.themePreset === 'classic-gold' ? 'text-amber-800' : 'text-indigo-400'}`}>
                        🎖 CERTIFICATE OF ACHIEVEMENT
                      </span>
                      <h4 className={`text-lg font-black tracking-tight ${certificateTemplate.themePreset === 'classic-gold' ? 'text-slate-900' : 'text-white'}`}>
                        {certificateTemplate.title}
                      </h4>
                      <p className={`text-[10px] leading-relaxed italic ${certificateTemplate.themePreset === 'classic-gold' ? 'text-slate-700' : 'text-slate-300'}`}>
                        {certificateTemplate.subtext.replace('{{name}}', 'Sarah Connor').replace('{{event}}', workspace.name)}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-6 text-[9px] border-t border-slate-800/40">
                        <div>
                          <p className={`font-mono ${certificateTemplate.themePreset === 'classic-gold' ? 'text-amber-900' : 'text-indigo-300'}`}>Elena Rostova</p>
                          <p className="text-slate-500 mt-0.5">Workspace CTO</p>
                        </div>
                        <div>
                          <p className={`font-mono ${certificateTemplate.themePreset === 'classic-gold' ? 'text-amber-900' : 'text-indigo-300'}`}>Rudra Dev</p>
                          <p className="text-slate-500 mt-0.5">Platform Architect</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 19: URGENT BROADCASTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Urgent Broadcaster</h2>
              <p className="text-xs text-slate-400">Push immediate alert signals, schedule category announcements, or trigger emergency warning notifications directly to attendee screens.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Compose Broadcast</h3>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">BROADCAST TITLE</label>
                    <input
                      type="text"
                      id="announce-title"
                      placeholder="e.g. Schedule Alteration Auditorium A"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">BROADCAST CATEGORY / LEVEL</label>
                    <select
                      id="announce-cat"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="Important">Important warning</option>
                      <option value="General">General updates</option>
                      <option value="Schedule">Schedule announcement</option>
                      <option value="Emergency">Emergency Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">ANNOUNCEMENT TEXT</label>
                    <textarea
                      id="announce-text"
                      rows={4}
                      placeholder="Enter the detailed briefing details here..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const tEl = document.getElementById('announce-title') as HTMLInputElement;
                      const cEl = document.getElementById('announce-cat') as HTMLSelectElement;
                      const textEl = document.getElementById('announce-text') as HTMLTextAreaElement;
                      if (!tEl?.value || !textEl?.value) {
                        alert('Title and Content are required.');
                        return;
                      }
                      onAddAnnouncement(tEl.value, textEl.value, cEl.value as any);
                      tEl.value = '';
                      textEl.value = '';
                      onShowToast?.('Urgent announcement broadcasted!', 'success');
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Megaphone className="w-4 h-4" /> Trigger Broadcaster
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Active Signals Broadcast Logs</h3>
                <div className="space-y-3 max-h-[360px] overflow-y-auto">
                  {announcements.map((ann, i) => (
                    <div key={i} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">{ann.title}</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          ann.category === 'Emergency' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ann.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed text-left">{ann.content}</p>
                      <p className="text-[9px] text-slate-500 font-mono text-left">{ann.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FLOATING QUICK ACTIONS */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {showQuickActions && (
            <div className="absolute bottom-16 right-0 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 space-y-2 animate-scale-up text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-1.5 border-b border-slate-800">Quick Operations</h4>
              <button
                type="button"
                onClick={() => { setActiveTab('announcements'); setShowQuickActions(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-indigo-400" />
                <span>Broadcast Update</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('ai'); setShowQuickActions(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Agenda Creator</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('scanner'); setShowQuickActions(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-indigo-400" />
                <span>Gate QR Scanner</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('sos'); setShowQuickActions(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Emergency SOS Desk</span>
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Quick Actions"
          >
            <Plus className={`w-6 h-6 transition-transform duration-300 ${showQuickActions ? 'rotate-45' : ''}`} />
          </button>
        </div>
      </div>

    </div>

  </div>
  );
}
