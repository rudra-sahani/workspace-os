export type WorkspaceCategory =
  | 'Trip'
  | 'Trek'
  | 'Tour'
  | 'Hackathon'
  | 'Workshop'
  | 'Conference'
  | 'Meetup'
  | 'Corporate Event'
  | 'College Event'
  | 'NGO Event'
  | 'Sports Event'
  | 'Marathon';

export interface WorkspaceModules {
  registration: boolean;
  participants: boolean;
  payments: boolean;
  qrSmartPass: boolean;
  attendance: boolean;
  qrScanner: boolean;
  announcements: boolean;
  schedule: boolean;
  gallery: boolean;
  documents: boolean;
  chat: boolean;
  sos: boolean;
  liveLocation: boolean;
  checklists: boolean;
  volunteers: boolean;
  sponsors: boolean;
  certificates: boolean;
  reports: boolean;
  analytics: boolean;
  aiAssistant: boolean;
  feedback: boolean;
  merchandise: boolean;
}

export type ParticipantRole =
  | 'Owner'
  | 'Organizer'
  | 'Coordinator'
  | 'Volunteer'
  | 'Scanner'
  | 'Judge'
  | 'Moderator'
  | 'Participant';

export interface FormQuestion {
  id: string;
  label: string;
  type: 'Short Text' | 'Paragraph' | 'Email' | 'Phone' | 'Dropdown' | 'Radio' | 'Checkbox' | 'Date' | 'Number' | 'File Upload';
  required: boolean;
  description?: string;
  options?: string[]; // For dropdown, radio, checkbox
}

export interface FormSubmission {
  id: string;
  participantId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: WorkspaceCategory;
  startDate: string;
  endDate: string;
  visibility: 'Public' | 'Private';
  inviteCode: string;
  inviteLink: string;
  modules: WorkspaceModules;
  upiId?: string;
  upiQrCode?: string;
  upiInstructions?: string;
  questions: FormQuestion[];
  isArchived?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: ParticipantRole;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  paymentStatus: 'Unpaid' | 'Pending Verification' | 'Paid';
  paymentScreenshot?: string;
  checkedIn: boolean;
  checkInCount: number;
  lastCheckIn?: string;
  avatarUrl?: string;
  answers?: Record<string, string | string[]>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: ParticipantRole;
  avatarUrl?: string;
  content: string;
  type: 'text' | 'announcement';
  timestamp: string;
  isPinned?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  category: 'Important' | 'General' | 'Schedule' | 'Emergency';
  postedBy: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  timestamp: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  isCompleted: boolean;
  roleType: 'organizer' | 'participant';
}

export interface ScheduleEvent {
  id: string;
  title: string;
  speaker?: string;
  description: string;
  time: string;
  location: string;
  date: string;
  type: 'session' | 'break' | 'activity' | 'emergency';
}

export interface DocumentFile {
  id: string;
  title: string;
  size: string;
  url: string;
  category: 'Guide' | 'Map' | 'Pass' | 'Legal';
}

export interface SOSAlert {
  id: string;
  senderName: string;
  senderEmail: string;
  timestamp: string;
  coordinates?: { lat: number; lng: number };
  status: 'Active' | 'Resolved';
}

export interface LiveMemberLocation {
  id: string;
  name: string;
  role: ParticipantRole;
  lat: number;
  lng: number;
  lastUpdated: string;
  avatar: string;
}

// ==========================================
// REDESIGNED SAAS PRODUCTION SCHEMAS (TYPES)
// ==========================================

export interface User {
  id: string; // auth.users.id reference
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface WorkspaceSettings {
  workspaceId: string;
  branding: {
    theme: 'light' | 'dark';
    primaryColor: string;
    fontFamily: string;
  };
  timezone: string;
  currency: string;
  defaultLanguage: string;
  registrationBehavior: {
    autoApproveFree: boolean;
    requirePaymentVerification: boolean;
  };
  notificationPreferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
}

export interface WorkspaceModuleConfig {
  id: string;
  workspaceId: string;
  moduleKey: string;
  isEnabled: boolean;
  settings: Record<string, any>; // JSONB schema validation based on module
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  workspaceId: string;
  filename: string;
  bucketName: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string; // User ID
  url: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  workspaceId: string;
  memberId: string;
  amount: number;
  currency: string;
  paymentMethod: string; // 'UPI', 'Stripe_Intent', 'Bank_Transfer'
  status: 'Pending' | 'Verified' | 'Rejected';
  trxRefId: string;
  screenshotMediaId?: string; // Links to MediaFile
  approvedBy?: string; // User ID
  approvedAt?: string;
  createdAt: string;
}

export interface PaymentVerification {
  id: string;
  paymentId: string;
  verifiedBy: string; // User ID
  status: 'Verified' | 'Rejected';
  remarks?: string;
  createdAt: string;
}

export interface SmartPass {
  id: string;
  workspaceId: string;
  memberId: string;
  qrToken: string;
  ticketNumber: string;
  expiresAt?: string;
  lastScanAt?: string;
  scanCount: number;
  status: 'Active' | 'Revoked' | 'Expired';
  createdAt: string;
}

export interface AttendanceLog {
  id: string;
  workspaceId: string;
  smartPassId: string;
  scannedBy: string; // Member/User ID
  scannedAt: string;
  status: 'Checked In' | 'Checked Out' | 'Rejected';
  remarks?: string;
}

export interface ChatRoom {
  id: string;
  workspaceId: string;
  name: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface SaaSRepliedMessage {
  id: string;
  senderName: string;
  content: string;
}

export interface SaaSChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: ParticipantRole;
  avatarUrl?: string;
  content: string;
  parentMessageId?: string; // Thread reply support
  parentMessagePreview?: SaaSRepliedMessage;
  attachments?: string[]; // MediaFile IDs or raw URLs for robustness
  editedAt?: string;
  deletedAt?: string;
  timestamp: string;
}

export interface SaaSAnnouncement {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  postedBy: string;
  category: 'Important' | 'General' | 'Schedule' | 'Emergency';
  attachments?: string[]; // MediaFile IDs
  publishAt?: string;
  expiresAt?: string;
  emailSent: boolean;
  pushSent: boolean;
  timestamp: string;
}

export interface GalleryAlbum {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  visibility: 'Public' | 'Private' | 'Password';
  coverImage?: string; // URL or MediaFile ID
  orderIndex: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  albumId: string;
  mediaFileId: string;
  uploadedBy: string;
  caption?: string;
  createdAt: string;
}

export interface SaaSDocument {
  id: string;
  workspaceId: string;
  title: string;
  fileSize: string;
  mediaFileId?: string;
  documentType: 'Guide' | 'Map' | 'Pass' | 'Legal' | 'Template';
  version: string;
  visibility: 'Public' | 'Restricted' | 'Internal';
  createdAt: string;
  url: string;
}

export interface EmailTemplate {
  id: string;
  workspaceId: string;
  name: string;
  subject: string;
  htmlBody: string;
  category: 'Confirmation' | 'Alert' | 'Reminder' | 'Broadcast';
  createdAt: string;
}

export interface EmailCampaign {
  id: string;
  workspaceId: string;
  templateId?: string;
  name: string;
  subject: string;
  body: string;
  status: 'Draft' | 'Sending' | 'Sent' | 'Failed';
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  createdAt: string;
}

export interface AIPrompt {
  id: string;
  workspaceId: string;
  promptType: 'Event' | 'Form' | 'Itinerary' | 'Announcement' | 'Email';
  promptText: string;
  createdAt: string;
}

export interface AIGeneration {
  id: string;
  workspaceId: string;
  promptId?: string;
  generatorType: string;
  completionText: string;
  tokensUsed: number;
  createdAt: string;
}

export interface AIDocument {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  documentType: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: 'Unread' | 'Read';
  category: 'System' | 'Payment' | 'Chat' | 'Announcement';
  createdAt: string;
}

export interface NotificationPreference {
  userId: string;
  email: boolean;
  inApp: boolean;
  push: boolean;
  sms: boolean;
}

export interface GlobalSearchItem {
  id: string;
  workspaceId: string;
  entityType: 'Participant' | 'Payment' | 'Announcement' | 'Schedule' | 'Document' | 'Chat' | 'Form';
  entityId: string;
  title: string;
  content: string;
}

export interface WorkspaceImport {
  id: string;
  workspaceId: string;
  sourceType: 'CSV_Members' | 'Google_Forms' | 'CSV_Payments';
  status: 'Pending_Validation' | 'Validated' | 'Importing' | 'Completed' | 'Failed';
  progress: number; // 0 to 100
  previewData: Record<string, any>[]; // Array of row previews
  errorReport?: string; // Multi-line error reports
  rollbackToken?: string;
  createdAt: string;
}

export interface AnalyticsMetrics {
  workspaceId: string;
  registrationCountByDay: Record<string, number>;
  paymentCollectionByDay: Record<string, number>;
  attendanceCountByHour: Record<string, number>;
  emailDeliveryRates: { sent: number; delivered: number; opened: number };
  workspaceGrowthRate: number; // Percentage
  totalRevenueCollected: number;
}

export interface ModuleMetadata {
  key: keyof WorkspaceModules;
  name: string;
  description: string;
  category: 'Core' | 'Communication' | 'Safety' | 'Content' | 'Operations' | 'Analytics' | 'Advanced';
  recommended?: boolean;
  icon: string;
}

export const MODULE_METADATA: ModuleMetadata[] = [
  {
    key: 'registration',
    name: 'Registration',
    description: 'Set up and design custom forms for incoming member intake.',
    category: 'Core',
    recommended: true,
    icon: 'FileText'
  },
  {
    key: 'participants',
    name: 'Participants',
    description: 'Manage workspace members, assign custom roles, and track status.',
    category: 'Core',
    recommended: true,
    icon: 'Users'
  },
  {
    key: 'payments',
    name: 'Payments',
    description: 'Support peer-to-peer UPI screenshots collections with automated receipt audits.',
    category: 'Core',
    recommended: true,
    icon: 'CreditCard'
  },
  {
    key: 'qrSmartPass',
    name: 'Smart Pass',
    description: 'Issue encrypted 2D ticket passes with avatar validation details.',
    category: 'Core',
    recommended: true,
    icon: 'Award'
  },
  {
    key: 'attendance',
    name: 'Attendance',
    description: 'Track presence checkpoints across different venues and sessions.',
    category: 'Operations',
    recommended: true,
    icon: 'UserCheck'
  },
  {
    key: 'qrScanner',
    name: 'QR Scanner',
    description: 'Instantiate gate validation scanner cameras on organizer consoles.',
    category: 'Operations',
    icon: 'QrCode'
  },
  {
    key: 'announcements',
    name: 'Announcements',
    description: 'Broadcast important notifications and emergency bulletins directly to feeds.',
    category: 'Communication',
    icon: 'Megaphone'
  },
  {
    key: 'schedule',
    name: 'Schedule',
    description: 'Design and present dynamic, time-aligned itineraries.',
    category: 'Content',
    recommended: true,
    icon: 'Calendar'
  },
  {
    key: 'gallery',
    name: 'Gallery',
    description: 'Allow organizers and participants to upload photos on a shared board.',
    category: 'Content',
    icon: 'ImageIcon'
  },
  {
    key: 'documents',
    name: 'Documents',
    description: 'Upload and centralize legal agreements, templates, and guides.',
    category: 'Content',
    icon: 'Folder'
  },
  {
    key: 'chat',
    name: 'Chat',
    description: 'Engage teams in multi-channel threaded conversations.',
    category: 'Communication',
    icon: 'MessageSquare'
  },
  {
    key: 'sos',
    name: 'SOS',
    description: 'Provide urgent safety-trigger coordinates tracking.',
    category: 'Safety',
    icon: 'AlertTriangle'
  },
  {
    key: 'liveLocation',
    name: 'Live Location',
    description: 'Expose real-time location telemetry overlay maps for operations.',
    category: 'Safety',
    icon: 'MapPin'
  },
  {
    key: 'checklists',
    name: 'Checklists',
    description: 'Establish sub-task lists for organizer orchestration.',
    category: 'Operations',
    icon: 'ClipboardList'
  },
  {
    key: 'volunteers',
    name: 'Volunteers',
    description: 'Delegate scanning permissions and assign shifts to staff.',
    category: 'Operations',
    icon: 'UserCheck'
  },
  {
    key: 'sponsors',
    name: 'Sponsors',
    description: 'Backpack logos, brand tiers, and monitor click-through backlink impressions.',
    category: 'Content',
    icon: 'Briefcase'
  },
  {
    key: 'certificates',
    name: 'Certificates',
    description: 'Automate achievement recognition certificates with dynamic PDF generation.',
    category: 'Advanced',
    icon: 'Award'
  },
  {
    key: 'reports',
    name: 'Reports',
    description: 'Compile and export custom membership CSV dumps.',
    category: 'Analytics',
    icon: 'FileText'
  },
  {
    key: 'analytics',
    name: 'Analytics',
    description: 'Expose timeline signups, revenues, and notification metrics.',
    category: 'Analytics',
    icon: 'TrendingUp'
  },
  {
    key: 'aiAssistant',
    name: 'AI Assistant',
    description: 'Power smart schedule constructors and question generation engines.',
    category: 'Advanced',
    icon: 'Sparkles'
  },
  {
    key: 'feedback',
    name: 'Feedback',
    description: 'Collect and view survey submissions from participants.',
    category: 'Communication',
    icon: 'MessageSquare'
  },
  {
    key: 'merchandise',
    name: 'Merchandise',
    description: 'Configure physical items, sizes, and tracking criteria.',
    category: 'Advanced',
    icon: 'Layers'
  }
];

