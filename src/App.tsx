import React, { useState, useEffect } from 'react';
import {
  Layers,
  Users,
  Briefcase,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Globe,
  Lock,
  ArrowRight,
  Plus,
  Mail,
  HelpCircle,
  Bell,
  Sliders,
  CheckCircle,
  QrCode,
  Compass,
  LayoutGrid,
  Sun,
  Moon,
  TrendingUp,
  ExternalLink,
  X,
  FileText,
  CreditCard,
  UserCheck,
  MessageSquare,
  Megaphone,
  Image as ImageIcon,
  ClipboardList,
  Calendar,
  AlertTriangle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Search,
  BadgeAlert,
  Trash2,
  LogOut,
  Award,
  Folder
} from 'lucide-react';
import {
  Workspace,
  Participant,
  ChatMessage,
  Announcement,
  GalleryPhoto,
  ChecklistItem,
  ScheduleEvent,
  DocumentFile,
  LiveMemberLocation,
  FormSubmission,
  SOSAlert,
  WorkspaceCategory,
  WorkspaceModules,
  FormQuestion,
  MODULE_METADATA,
  ModuleMetadata
} from './types';
import {
  INITIAL_WORKSPACES,
  INITIAL_PARTICIPANTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_CHECKLISTS,
  INITIAL_SCHEDULE,
  INITIAL_GALLERY,
  INITIAL_DOCUMENTS,
  INITIAL_MEMBER_LOCATIONS
} from './data';
import OrganizerDashboard from './components/OrganizerDashboard';
import ParticipantDashboard from './components/ParticipantDashboard';
import MarketingWebsite from './components/MarketingWebsite';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  sendResendEmail,
  fetchBackendConfig,
  BackendConfig
} from './supabaseClient';
import { AIService } from './services/SaaSServices';
import { DBService, AuthSessionUser } from './services/dbService';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Custom Toast State
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Backend & Cloud synchronization states
  const [backendConfig, setBackendConfig] = useState<BackendConfig | null>(null);
  const [isCloudSyncActive, setIsCloudSyncActive] = useState<boolean>(false);
  const [showSetupDrawer, setShowSetupDrawer] = useState<boolean>(false);
  const [manualSupabaseUrl, setManualSupabaseUrl] = useState<string>('');
  const [manualSupabaseAnonKey, setManualSupabaseAnonKey] = useState<string>('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Auth States
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMagicSent, setAuthMagicSent] = useState(false);
  const [pendingJoinCode, setPendingJoinCode] = useState<string | null>(null);

  // Google Sign-In States
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('');

  // Marketing Navigation & Scroll states
  const [marketingPage, setMarketingPage] = useState<'home' | 'features' | 'solutions' | 'pricing' | 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'login' | 'signup'>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top smoothly on page transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [marketingPage]);

  // Workspaces state (dynamically fetched for logged-in user)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Current selected workspace state (starts as null to force Vercel-style Workspace Selector Page)
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(() => {
    return localStorage.getItem('ws_active_id') || null;
  });

  // Role selection state: 'Organizer' | 'Participant'
  const [activeRole, setActiveRole] = useState<'Organizer' | 'Participant'>('Participant');

  // Join Workspace States
  const [joinCode, setJoinCode] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Active Workspace Sub-resource states (dynamically loaded from DBService)
  const [activeParticipants, setActiveParticipants] = useState<Participant[]>([]);
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([]);
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistItem[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [activeSOS, setActiveSOS] = useState<SOSAlert[]>([]);

  // Simulated Email Notification Queue
  interface SimulatedEmail {
    id: string;
    to: string;
    subject: string;
    body: string;
    timestamp: string;
  }
  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>([]);
  const [showEmailDrawer, setShowEmailDrawer] = useState(false);

  // Wizard state: Handles beautiful 8-step creation flow
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Step 1: Basic Info state
  const [wizName, setWizName] = useState('');
  const [wizCategory, setWizCategory] = useState<WorkspaceCategory>('Hackathon');
  const [wizDesc, setWizDesc] = useState('');
  const [wizStart, setWizStart] = useState('2026-08-10');
  const [wizEnd, setWizEnd] = useState('2026-08-12');

  // Step 2: Workspace Type state
  const [wizVisibility, setWizVisibility] = useState<'Public' | 'Private'>('Public');
  const [wizInviteCode, setWizInviteCode] = useState(() => `WS-${Math.floor(1000 + Math.random() * 9000)}`);

  // Step 3: Modules selection state
  const [wizModules, setWizModules] = useState<WorkspaceModules>({
    registration: true,
    participants: true,
    payments: true,
    qrSmartPass: true,
    attendance: true,
    qrScanner: true,
    announcements: true,
    schedule: true,
    gallery: true,
    documents: true,
    chat: true,
    sos: true,
    liveLocation: false,
    checklists: true,
    volunteers: true,
    sponsors: true,
    certificates: true,
    reports: true,
    analytics: true,
    aiAssistant: true,
    feedback: true,
    merchandise: false,
  });
  const [wizModuleSearch, setWizModuleSearch] = useState('');
  const [wizModuleCategory, setWizModuleCategory] = useState<'All' | 'Core' | 'Communication' | 'Safety' | 'Content' | 'Operations' | 'Analytics' | 'Advanced'>('All');

  // Step 4: Registration questions state
  const [wizQuestions, setWizQuestions] = useState<FormQuestion[]>([
    { id: 'q-name', label: 'Full Legal Name', type: 'Short Text', required: true },
    { id: 'q-email', label: 'Work Email Address', type: 'Email', required: true },
  ]);
  const [newWizQuestion, setNewWizQuestion] = useState('');
  const [newWizQuestionType, setNewWizQuestionType] = useState<FormQuestion['type']>('Short Text');
  const [aiGenPrompt, setAiGenPrompt] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Step 5: Payments configuration state
  const [wizUpiId, setWizUpiId] = useState('workspaceos@ybl');
  const [wizUpiInstructions, setWizUpiInstructions] = useState('Please scan the QR code to complete manual payment of ₹4000. Send screenshot receipt for check-in smart pass release.');

  // Step 6: Branding / Style state
  const [wizTheme, setWizTheme] = useState<'light' | 'dark'>('dark');
  const [wizPrimaryColor, setWizPrimaryColor] = useState('#6366f1'); // Indigo

  // Active workspace calculations
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Persona
  const participantPersona = activeParticipants.find(p => p.email.toLowerCase() === currentUser?.email?.toLowerCase()) || {
    id: 'part-unregistered',
    name: currentUser?.fullName || 'Elena Rostova',
    email: currentUser?.email || 'elena.rostova@techcorp.io',
    phone: '+44 20 7946 0912',
    role: 'Participant' as const,
    status: 'Pending' as const,
    paymentStatus: 'Unpaid' as const,
    checkedIn: false,
    checkInCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    answers: {},
  };

  // Sync active workspace selection
  useEffect(() => {
    if (activeWorkspaceId) {
      localStorage.setItem('ws_active_id', activeWorkspaceId);
    } else {
      localStorage.removeItem('ws_active_id');
    }
  }, [activeWorkspaceId]);

  // Deep Link Invite Link Listener
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('join') || params.get('code');
    if (code) {
      const matched = workspaces.find(w => w.inviteCode?.toLowerCase() === code.trim().toLowerCase() || w.id.toLowerCase() === code.trim().toLowerCase());
      if (matched) {
        setActiveWorkspaceId(matched.id);
        setActiveRole('Participant');
        addToast(`Successfully joined "${matched.name}" via invite link!`, 'success');
        // Clean URL to avoid duplicate triggers on page reload
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        addToast(`Workspace invite code "${code}" not found.`, 'error');
      }
    }
  }, [workspaces]);

  // Backend Initialization Checks
  useEffect(() => {
    async function initializeCloudSync() {
      setIsSyncing(true);
      const config = await fetchBackendConfig();
      setBackendConfig(config);

      const hasEnvKeys = !!(config.supabaseUrl && config.supabaseAnonKey);
      const hasSessionKeys = !!(sessionStorage.getItem('manual_supabase_url') && sessionStorage.getItem('manual_supabase_key'));

      if (hasEnvKeys || hasSessionKeys) {
        if (hasSessionKeys) {
          (window as any).__SUPABASE_URL__ = sessionStorage.getItem('manual_supabase_url') || '';
          (window as any).__SUPABASE_ANON_KEY__ = sessionStorage.getItem('manual_supabase_key') || '';
        }
        setIsCloudSyncActive(true);
      }
      setIsSyncing(false);
    }
    initializeCloudSync();
  }, []);

  // Helper to dispatch email logs
  const triggerSimulatedEmail = async (to: string, subject: string, body: string) => {
    const newMail: SimulatedEmail = {
      id: `mail-${Date.now()}`,
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
    };
    setSimulatedEmails(prev => [newMail, ...prev]);

    if (isCloudSyncActive && backendConfig?.resendConfigured) {
      try {
        await sendResendEmail(to, subject, body);
      } catch (err) {
        console.error('Failed dispatching verified Resend API key email:', err);
      }
    }
  };

  // The ultimate workspace join workflow (auto-joining, deep-linking, and validation)
  const handleJoinCodeWorkflow = async (code: string) => {
    if (!code) return;
    const cleanCode = code.trim();

    try {
      // 1. Resolve workspace code (must exist)
      const workspace = await DBService.fetchWorkspaceByCode(cleanCode);
      if (!workspace) {
        addToast(`Invalid invite code "${cleanCode}". Workspace not found.`, 'error');
        return;
      }

      // 2. Check if the user is authenticated
      if (!currentUser) {
        // Save pending join code and prompt login
        setPendingJoinCode(cleanCode);
        sessionStorage.setItem('pending_join_code', cleanCode);
        setAuthTab('login');
        addToast('Please log in or create an account to join the workspace!', 'info');
        return;
      }

      // 3. User is logged in, try to join
      await DBService.joinWorkspace(workspace.id, cleanCode, currentUser.email, currentUser.fullName);

      // Successfully joined!
      addToast(`Successfully joined "${workspace.name}"!`, 'success');
      
      // Clear pending
      setPendingJoinCode(null);
      sessionStorage.removeItem('pending_join_code');
      
      // Reload workspaces
      await loadUserWorkspaces(currentUser.email);
      
      // Select the workspace
      setActiveWorkspaceId(workspace.id);
      setActiveRole('Participant');
      setShowJoinModal(false);
      setJoinCode('');
      
      // Clean URL parameters/paths
      window.history.replaceState({}, document.title, '/');

    } catch (err: any) {
      console.error('Error in join workflow:', err);
      addToast(err.message || 'An unexpected error occurred while joining.', 'error');
    }
  };

  // Process pending join code on login
  useEffect(() => {
    if (currentUser) {
      const code = pendingJoinCode || sessionStorage.getItem('pending_join_code');
      if (code) {
        handleJoinCodeWorkflow(code);
      }
    }
  }, [currentUser, pendingJoinCode]);

  // Initial Deep Link & URL path listener
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const joinIndex = pathParts.indexOf('join');
    let codeFromPath = null;
    if (joinIndex !== -1 && pathParts[joinIndex + 1]) {
      codeFromPath = pathParts[joinIndex + 1];
    }
    const params = new URLSearchParams(window.location.search);
    const code = codeFromPath || params.get('join') || params.get('code');
    if (code) {
      handleJoinCodeWorkflow(code);
    }
  }, [currentUser]);

  // Google OAuth Popup Callback Detection & Message dispatching
  useEffect(() => {
    if (window.opener && window.location.hash.includes('access_token=')) {
      try {
        window.opener.postMessage({
          type: 'OAUTH_AUTH_SUCCESS',
          hash: window.location.hash
        }, '*');
        window.close();
      } catch (err) {
        console.error('Failed to postMessage to opener:', err);
      }
    }
  }, []);

  // Parent window listener for Google OAuth messages
  useEffect(() => {
    const handleOAuthMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'OAUTH_AUTH_SUCCESS' && e.data?.hash) {
        try {
          const supabase = await getSupabaseClient();
          if (supabase) {
            const hash = e.data.hash;
            const params = new URLSearchParams(hash.replace('#', '?'));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              if (error) throw error;
              addToast('Signed in via Google successfully!', 'success');
            }
          }
        } catch (err: any) {
          console.error('Failed to establish Google Session:', err);
          addToast(err.message || 'Failed to establish Google Sign-In session.', 'error');
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  // Load user workspaces
  const loadUserWorkspaces = async (email: string) => {
    try {
      const list = await DBService.getWorkspacesForUser(email);
      setWorkspaces(list);
    } catch (err) {
      console.error('Failed to load user workspaces:', err);
    }
  };

  // Auth & Cloud Initialization Listener
  useEffect(() => {
    async function initAuth() {
      setIsSyncing(true);
      const config = await fetchBackendConfig();
      setBackendConfig(config);
      const hasEnvKeys = !!(config.supabaseUrl && config.supabaseAnonKey);
      const hasSessionKeys = !!(sessionStorage.getItem('manual_supabase_url') && sessionStorage.getItem('manual_supabase_key'));
      if (hasEnvKeys || hasSessionKeys) {
        if (hasSessionKeys) {
          (window as any).__SUPABASE_URL__ = sessionStorage.getItem('manual_supabase_url') || '';
          (window as any).__SUPABASE_ANON_KEY__ = sessionStorage.getItem('manual_supabase_key') || '';
        }
        setIsCloudSyncActive(true);
      }
      setIsSyncing(false);

      const unsubscribe = DBService.onAuthStateChange(async (user) => {
        setCurrentUser(user);
        setAuthLoading(false);
        if (user) {
          await loadUserWorkspaces(user.email);
        } else {
          setWorkspaces([]);
          setActiveWorkspaceId(null);
        }
      });

      return () => unsubscribe();
    }
    initAuth();
  }, [isCloudSyncActive]);

  // Load selected workspace detailed sub-resources when activeWorkspaceId changes
  useEffect(() => {
    if (!activeWorkspaceId) {
      setActiveParticipants([]);
      setActiveAnnouncements([]);
      setActiveChatMessages([]);
      setActiveChecklist([]);
      setGalleryPhotos([]);
      return;
    }

    async function loadWorkspaceDetails() {
      try {
        const details = await DBService.fetchWorkspaceDetails(activeWorkspaceId);
        setActiveParticipants(details.participants);
        setActiveAnnouncements(details.announcements);
        setActiveChatMessages(details.chats);
        setActiveChecklist(details.checklists);
        setGalleryPhotos(details.gallery);

        // Auto-determine active role based on participant record for this user
        if (currentUser) {
          const matchedPart = details.participants.find(
            p => p.email.toLowerCase() === currentUser.email.toLowerCase()
          );
          if (matchedPart) {
            if (['Owner', 'Organizer', 'Coordinator'].includes(matchedPart.role)) {
              setActiveRole('Organizer');
            } else {
              setActiveRole('Participant');
            }
          } else {
            setActiveRole('Participant');
          }
        }
      } catch (err) {
        console.error('Failed to load workspace sub-resources:', err);
        addToast('Failed to load workspace data. Please verify your permissions.', 'error');
        setActiveWorkspaceId(null);
      }
    }

    loadWorkspaceDetails();
  }, [activeWorkspaceId, currentUser]);

  // Trigger registration form answers submission
  const handleFormSubmission = async (answers: Record<string, string | string[]>) => {
    if (!activeWorkspaceId || !currentUser) return;
    try {
      await DBService.updateParticipantAnswers(activeWorkspaceId, participantPersona.id, answers);
      const details = await DBService.fetchWorkspaceDetails(activeWorkspaceId);
      setActiveParticipants(details.participants);
      
      await triggerSimulatedEmail(
        participantPersona.email,
        `Form Submitted: ${activeWorkspace.name}`,
        `Hi ${participantPersona.name},\n\nThank you for completing your registration details.\nNext Step: Upload your manual UPI screenshot in your portal dashboard to generate your access Smart Pass.`
      );
      addToast('Registration form submitted successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to submit form', 'error');
    }
  };

  // Trigger manual payments screenshot submission
  const handlePaymentSubmission = async (screenshotUrl: string) => {
    if (!activeWorkspaceId || !currentUser) return;
    try {
      await DBService.updateParticipantPayment(activeWorkspaceId, participantPersona.id, screenshotUrl, 'Pending Verification');
      const details = await DBService.fetchWorkspaceDetails(activeWorkspaceId);
      setActiveParticipants(details.participants);

      await triggerSimulatedEmail(
        participantPersona.email,
        `UPI Receipt Received: ${activeWorkspace.name}`,
        `Hi ${participantPersona.name},\n\nWe have received your manual transaction reference screenshot. Administrators will verify details and activate your smart pass QR ticket shortly.`
      );
      addToast('Payment receipt uploaded successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to submit receipt', 'error');
    }
  };

  // Send real-time chat messages
  const handleAddChatMessage = async (
    text: string,
    mediaUrl?: string,
    mediaType?: 'image' | 'video' | 'document'
  ) => {
    if (!activeWorkspaceId || !currentUser) return;
    try {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: participantPersona.id,
        senderName: participantPersona.name,
        senderRole: participantPersona.role,
        avatarUrl: participantPersona.avatarUrl,
        content: text,
        type: 'text',
        timestamp: new Date().toISOString(),
        mediaUrl,
        mediaType,
      };
      await DBService.addChatMessage(activeWorkspaceId, newMsg);
      const details = await DBService.fetchWorkspaceDetails(activeWorkspaceId);
      setActiveChatMessages(details.chats);
    } catch (err: any) {
      addToast('Failed to send message', 'error');
    }
  };

  // Trigger participant checklists toggles
  const handleToggleChecklist = async (id: string) => {
    if (!activeWorkspaceId) return;
    const item = activeChecklist.find(it => it.id === id);
    if (!item) return;
    const nextVal = !item.isCompleted;
    try {
      await DBService.toggleChecklistItem(activeWorkspaceId, id, nextVal);
      const details = await DBService.fetchWorkspaceDetails(activeWorkspaceId);
      setActiveChecklist(details.checklists);
    } catch (err: any) {
      addToast('Failed to update task', 'error');
    }
  };

  // Add photos to gallery board
  const handleAddGalleryPhoto = async (url: string, caption: string) => {
    if (!activeWorkspaceId) return;
    try {
      const newPhoto: GalleryPhoto = {
        id: `gal-${Date.now()}`,
        url,
        caption,
        uploadedBy: participantPersona.name,
        timestamp: new Date().toISOString(),
      };
      await DBService.addGalleryPhoto(activeWorkspaceId, newPhoto);
      const details = await DBService.fetchWorkspaceDetails(activeWorkspaceId);
      setGalleryPhotos(details.gallery);
      addToast('Photo uploaded to gallery board!', 'success');
    } catch (err: any) {
      addToast('Failed to add photo', 'error');
    }
  };

  // Dispatch live emergency SOS alerts
  const handleTriggerSOS = async (coords?: { lat: number; lng: number }) => {
    if (!activeWorkspaceId) return;
    try {
      const newAlert: SOSAlert = {
        id: `sos-${Date.now()}`,
        senderName: participantPersona.name,
        senderEmail: participantPersona.email,
        timestamp: new Date().toISOString(),
        coordinates: coords,
        status: 'Active',
      };
      await DBService.addSOSAlert(activeWorkspaceId, newAlert);
      
      activeParticipants.filter(p => ['Owner', 'Organizer', 'Coordinator', 'Volunteer'].includes(p.role)).forEach(async (admin) => {
        await triggerSimulatedEmail(
          admin.email,
          `⚠️ EMERGENCY ALERT: SOS Triggered by ${participantPersona.name}!`,
          `ATTENTION ${admin.name.toUpperCase()}:\n${participantPersona.name} has pressed the emergency SOS button inside workspace "${activeWorkspace.name}".\nCoordinates shared: ${coords ? `Lat: ${coords.lat}, Lng: ${coords.lng}` : 'Live location coordinate telemetry disabled'}.\nProceed to checkpoints immediately.`
        );
      });
      addToast('SOS Emergency Alert triggered!', 'error');
    } catch (err: any) {
      addToast('Failed to trigger SOS', 'error');
    }
  };

  // Trigger broadcasting announcements
  const handleAddAnnouncement = async (
    title: string,
    content: string,
    category: 'Important' | 'General' | 'Schedule' | 'Emergency'
  ) => {
    if (!activeWorkspaceId) return;
    try {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title,
        content,
        timestamp: new Date().toLocaleTimeString(),
        category,
        postedBy: participantPersona.name || 'WorkspaceOS Organizer',
      };
      await DBService.addAnnouncement(activeWorkspaceId, newAnn);
      const details = await DBService.fetchWorkspaceDetails(activeWorkspaceId);
      setActiveAnnouncements(details.announcements);

      activeParticipants.forEach(async (member) => {
        await triggerSimulatedEmail(
          member.email,
          `📢 Broadcast Notification: [${category}] ${title}`,
          `Hello ${member.name},\n\nAn announcement has been published inside "${activeWorkspace.name}":\n\n${content}\n\nReview details inside your active dashboard room.`
        );
      });
      addToast('Announcement broadcasted successfully!', 'success');
    } catch (err: any) {
      addToast('Failed to post announcement', 'error');
    }
  };

  // Module configuration toggles
  const handleToggleModule = async (moduleKey: keyof WorkspaceModules) => {
    if (!activeWorkspaceId) return;
    const updatedModules = {
      ...activeWorkspace.modules,
      [moduleKey]: !activeWorkspace.modules[moduleKey],
    };
    try {
      await DBService.updateWorkspaceModules(activeWorkspaceId, updatedModules);
      if (currentUser) {
        await loadUserWorkspaces(currentUser.email);
      }
      addToast(`Module "${moduleKey}" updated!`, 'success');
    } catch (err: any) {
      addToast('Failed to update modules', 'error');
    }
  };

  // AI Registration Questions Generator (within Wizard Step 4)
  const handleAIGeneratorQuestions = async () => {
    if (!aiGenPrompt.trim()) return;
    setIsGeneratingQuestions(true);
    try {
      const completion = await AIService.generateContent(activeWorkspaceId || 'ws-temp', 'Form', aiGenPrompt);
      const parsed = JSON.parse(completion);
      setWizQuestions([...wizQuestions, ...parsed]);
      setAiGenPrompt('');
      addToast('AI synthesized dynamic fields successfully added!', 'success');
    } catch (e) {
      addToast('AI synthesis error: Make sure input is clean or use the manual text adder.', 'error');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Manual Question adder in Step 4
  const handleAddManualQuestion = () => {
    if (!newWizQuestion.trim()) return;
    const newQ: FormQuestion = {
      id: `q-${Date.now()}`,
      label: newWizQuestion,
      type: newWizQuestionType,
      required: true,
    };
    setWizQuestions([...wizQuestions, newQ]);
    setNewWizQuestion('');
  };

  // Compile the Wizard Step 8 Publish action!
  const handlePublishWorkspace = async () => {
    if (!currentUser) {
      addToast('Please sign in to publish workspaces.', 'error');
      return;
    }

    const newId = `ws-${Date.now()}`;
    const newWs: Workspace = {
      id: newId,
      name: wizName || 'Default Custom Workspace OS',
      description: wizDesc || 'No description provided.',
      coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80',
      category: wizCategory,
      startDate: wizStart,
      endDate: wizEnd,
      visibility: wizVisibility,
      inviteCode: wizInviteCode,
      inviteLink: `https://workspaceos.io/invite/${wizInviteCode}`,
      modules: wizModules,
      upiId: wizUpiId,
      questions: wizQuestions,
    };

    try {
      await DBService.createWorkspace(newWs, currentUser.email, currentUser.fullName);
      await loadUserWorkspaces(currentUser.email);

      // Reset wizard
      setWizName('');
      setWizDesc('');
      setWizardStep(1);
      setShowWizard(false);

      // Launch instantly
      setActiveWorkspaceId(newId);
      setActiveRole('Organizer');
      addToast('Workspace created and published successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to publish workspace.', 'error');
    }
  };

  const handleJoinWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    handleJoinCodeWorkflow(joinCode);
  };

  const handleGoogleSimulateSelect = async (email: string) => {
    setSelectedGoogleEmail(email);
    setIsGoogleLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const user = await DBService.signIn(email, '', true);
      addToast(`Welcome back, ${user.fullName || email.split('@')[0]}!`, 'success');
      setShowGoogleChooser(false);
      setMarketingPage('home');
    } catch (err: any) {
      addToast(err.message || 'Google Sign-In failed.', 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const config = await fetchBackendConfig();
      const hasEnvKeys = !!(config.supabaseUrl && config.supabaseAnonKey);
      const hasSessionKeys = !!(sessionStorage.getItem('manual_supabase_url') && sessionStorage.getItem('manual_supabase_key'));
      if (hasEnvKeys || hasSessionKeys) {
        addToast('Initiating Google OAuth authentication...', 'info');
        const user = await DBService.signIn('', '', true);
        if (user && user.id === 'oauth-url' && user.fullName) {
          const width = 600;
          const height = 650;
          const left = window.screenX + (window.innerWidth - width) / 2;
          const top = window.screenY + (window.innerHeight - height) / 2;
          
          const popup = window.open(
            user.fullName,
            'google_oauth_popup',
            `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
          );
          if (!popup) {
            addToast('Popup blocker detected. Please enable popups for this site.', 'error');
          }
        }
      } else {
        setShowGoogleChooser(true);
      }
    } catch (err: any) {
      console.error('Google Login Error:', err);
      addToast(err.message || 'Google Sign-In failed.', 'error');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* GLOBAL BANNER HEADER */}
      <header className={`sticky top-0 z-40 border-b border-slate-800/80 transition-all duration-300 backdrop-blur-md ${
        isScrolled ? 'py-2.5 bg-[#070d19]/95 shadow-xl shadow-black/30' : 'py-4 bg-[#070d19]/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" 
              onClick={() => {
                setActiveWorkspaceId(null);
                setMarketingPage('home');
              }}
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/25">
                <Layers className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">Workspace<span className="text-indigo-400">OS</span></span>
            </div>

            {/* MARKETING NAVBAR (Only shown when not inside an active workspace) */}
            {!activeWorkspaceId && (
              <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
                <button 
                  onClick={() => setMarketingPage('home')}
                  className={`hover:text-indigo-400 transition-colors cursor-pointer ${marketingPage === 'home' ? 'text-indigo-400' : ''}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setMarketingPage('features')}
                  className={`hover:text-indigo-400 transition-colors cursor-pointer ${marketingPage === 'features' ? 'text-indigo-400' : ''}`}
                >
                  Features
                </button>
                <button 
                  onClick={() => setMarketingPage('solutions')}
                  className={`hover:text-indigo-400 transition-colors cursor-pointer ${marketingPage === 'solutions' ? 'text-indigo-400' : ''}`}
                >
                  Solutions
                </button>
                <button 
                  onClick={() => setMarketingPage('pricing')}
                  className={`hover:text-indigo-400 transition-colors cursor-pointer ${marketingPage === 'pricing' ? 'text-indigo-400' : ''}`}
                >
                  Pricing
                </button>
                <button 
                  onClick={() => setMarketingPage('about')}
                  className={`hover:text-indigo-400 transition-colors cursor-pointer ${marketingPage === 'about' ? 'text-indigo-400' : ''}`}
                >
                  About
                </button>
                
                {/* RESOURCES DROPDOWN / LINK TRIO */}
                <div className="relative group">
                  <span className="hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1">
                    Resources <ChevronRight className="w-3 h-3 rotate-90" />
                  </span>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#0a1122] border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block animate-fade-in">
                    <button 
                      onClick={() => setMarketingPage('faq')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                    >
                      Help & FAQs
                    </button>
                    <button 
                      onClick={() => setMarketingPage('privacy')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                    >
                      Privacy Policy
                    </button>
                    <button 
                      onClick={() => setMarketingPage('terms')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                    >
                      Terms of Service
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setMarketingPage('contact')}
                  className={`hover:text-indigo-400 transition-colors cursor-pointer ${marketingPage === 'contact' ? 'text-indigo-400' : ''}`}
                >
                  Contact
                </button>
              </nav>
            )}

            {activeWorkspaceId && (
              <button
                onClick={() => setActiveWorkspaceId(null)}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold rounded-xl border border-slate-700/50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Launcher
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Mail Inbox logs */}
            <button
              onClick={() => setShowEmailDrawer(true)}
              className="relative p-2 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer"
              title="Mail Logs"
            >
              <Mail className="w-4 h-4" />
              {simulatedEmails.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Cloud setup drawer */}
            <button
              onClick={() => setShowSetupDrawer(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isCloudSyncActive
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-indigo-600/10 border-indigo-500/25 text-indigo-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isCloudSyncActive ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
              {isCloudSyncActive ? 'Cloud Synced' : 'Sync Offline'}
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* AUTH SECT IN HEADER */}
            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-slate-800/80 pl-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-[11px] font-bold text-white leading-none">{currentUser.fullName}</span>
                  <span className="text-[9px] text-slate-400 font-medium mt-0.5">{currentUser.email}</span>
                </div>
                <button
                  onClick={async () => {
                    await DBService.signOut();
                    addToast('Logged out successfully', 'info');
                    setMarketingPage('home');
                  }}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-800/80 pl-3">
                <button
                  onClick={() => setMarketingPage('login')}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => setMarketingPage('signup')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* RENDER VIEW 1: LANDING EXPERIENCE / USER PORTAL */}
      {!activeWorkspaceId ? (
        authLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Authorizing secure workspace session...</p>
          </div>
        ) : !currentUser ? (
          <MarketingWebsite
            marketingPage={marketingPage}
            setMarketingPage={setMarketingPage}
            authTab={authTab}
            setAuthTab={setAuthTab}
            authMethod={authMethod}
            setAuthMethod={setAuthMethod}
            authName={authName}
            setAuthName={setAuthName}
            authEmail={authEmail}
            setAuthEmail={setAuthEmail}
            authPassword={authPassword}
            setAuthPassword={setAuthPassword}
            authMagicSent={authMagicSent}
            setAuthMagicSent={setAuthMagicSent}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            onJoinCodeSubmit={handleJoinWorkspaceSubmit}
            onLogin={async (e) => {
              e.preventDefault();
              try {
                if (authMethod === 'magic') {
                  await DBService.signIn(authEmail, '', true);
                  setAuthMagicSent(true);
                  addToast('Simulated magic link dispatched! Check mail logs.', 'success');
                } else {
                  await DBService.signIn(authEmail, authPassword);
                  addToast('Welcome back to WorkspaceOS!', 'success');
                }
              } catch (err: any) {
                addToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
              }
            }}
            onSignUp={async (e) => {
              e.preventDefault();
              try {
                await DBService.signUp(authEmail, authPassword, authName);
                addToast('Secure account created successfully!', 'success');
              } catch (err: any) {
                addToast(err.message || 'Account creation failed.', 'error');
              }
            }}
            onGoogleLogin={handleGoogleLogin}
          />
        ) : (
          // AUTHENTICATED USER PORTAL (LAUNCHER)
          <main className="max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-10 animate-fade-in">
            
            {/* Header Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
              <div className="space-y-1.5">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">WorkspaceOS Portal</span>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  Welcome back, {currentUser.fullName}!
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Select a workspace below to enter its controller operations, communications feed, and Smart Pass.
                </p>
              </div>

              {/* TWO PRIMARY ACTIONS (Spec 1) */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowWizard(true);
                    setWizardStep(1);
                  }}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg hover:scale-[1.01] cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Workspace
                </button>

                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-5 py-3 bg-[#0d1527] hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all border border-slate-800 hover:scale-[1.01] cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4 text-indigo-400" /> Join Workspace
                </button>
              </div>
            </div>

            {/* MY WORKSPACES SECTION */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">My Active Workspaces</h3>
                <span className="text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                  {workspaces.length} Spaces Joined
                </span>
              </div>

              {workspaces.length === 0 ? (
                // BEAUTIFUL EMPTY STATE (Spec 4)
                <div className="p-12 md:p-16 border-2 border-dashed border-slate-800 rounded-3xl text-center space-y-6 max-w-lg mx-auto bg-[#0a1122]/30">
                  <div className="w-16 h-16 bg-slate-900 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-white">No active workspaces linked</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      You are not currently enrolled in any WorkspaceOS instances. Create your own custom event space or enter an organizer code to join!
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowWizard(true);
                        setWizardStep(1);
                      }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Create Workspace
                    </button>
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl border border-slate-800 transition-all cursor-pointer"
                    >
                      Join Workspace
                    </button>
                  </div>
                </div>
              ) : (
                // BENTO GRID OF WORKSPACES
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workspaces.map(ws => {
                    const activeCount = Object.values(ws.modules).filter(Boolean).length;
                    return (
                      <div
                        key={ws.id}
                        onClick={() => setActiveWorkspaceId(ws.id)}
                        className="bg-[#0a1122]/80 border border-slate-800 hover:border-indigo-500/30 p-6 rounded-2xl hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl transition-all group-hover:bg-indigo-500/10" />
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between relative z-10">
                            <span className="text-[9px] font-black bg-indigo-950/40 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/15 uppercase tracking-wider">
                              {ws.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Code: <strong className="font-mono text-slate-200">{ws.inviteCode}</strong>
                            </span>
                          </div>

                          <div className="space-y-1 relative z-10">
                            <h4 className="text-base font-black text-white group-hover:text-indigo-400 transition-colors">
                              {ws.name}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {ws.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 text-[10px] font-bold text-slate-400 relative z-10">
                          <div className="flex gap-4">
                            <span className="text-slate-300">Enrolled Space</span>
                            <span>•</span>
                            <span className="text-slate-300">{activeCount} Core Modules</span>
                          </div>
                          <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Enter Room <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* JOIN MODAL IN PORTAL */}
            {showJoinModal && (
              <div className="fixed inset-0 bg-black/80 z-55 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#0a1122] border border-slate-800 p-6 rounded-3xl space-y-4 relative shadow-2xl">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-extrabold text-white">Join Secure Workspace</h3>
                    <button
                      onClick={() => setShowJoinModal(false)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleJoinWorkspaceSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Enter Workspace Invite Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. HACK26"
                        value={joinCode}
                        onChange={e => setJoinCode(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-sm rounded-xl text-white focus:outline-hidden font-mono text-center tracking-widest uppercase"
                      />
                      <p className="text-[10px] text-slate-400 text-center">
                        Invite codes are case-insensitive. Your profile will auto-sync with the tenant workspace parameters.
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Continue to Workspace
                    </button>
                  </form>
                </div>
              </div>
            )}

          </main>
        )
      ) : (
        /* RENDER VIEW 2: ACTIVE WORKSPACE INTERFACE (Protected by RLS Multi-Tenancy) */
        <main className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Controller Info Header */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="font-bold text-white">
                  💡 SaaS Sandbox Persona Control Room
                </p>
                <p className="text-slate-400 mt-0.5">
                  Simulating current active views as <strong className="text-indigo-400">{activeRole}</strong>. Toggle views to test end-to-end payments manual UPI review and smart pass credentials.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveRole(activeRole === 'Organizer' ? 'Participant' : 'Organizer')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs whitespace-nowrap"
              >
                Switch Role ⇆
              </button>
            </div>
          </div>

          <div className="transition-opacity duration-300">
            {activeRole === 'Organizer' ? (
              <OrganizerDashboard
                workspace={activeWorkspace}
                participants={activeParticipants}
                announcements={activeAnnouncements}
                onUpdateWorkspace={async (updated) => {
                  if (currentUser) {
                    await loadUserWorkspaces(currentUser.email);
                  }
                }}
                onUpdateParticipants={async (updated) => {
                  for (const p of updated) {
                    await DBService.updateParticipantStatus(activeWorkspaceId!, p.id, p.status, p.paymentStatus, p.checkedIn);
                  }
                  setActiveParticipants(updated);
                }}
                onAddAnnouncement={handleAddAnnouncement}
                submissions={activeParticipants
                  .filter(p => p.answers && Object.keys(p.answers).length > 0)
                  .map(p => ({
                    id: `sub-${p.id}`,
                    participantId: p.id,
                    answers: p.answers || {},
                    submittedAt: p.lastCheckIn || new Date().toISOString()
                  }))}
                onToggleModule={handleToggleModule}
                onShowToast={addToast}
              />
            ) : (
              <ParticipantDashboard
                workspace={activeWorkspace}
                participant={participantPersona}
                participants={activeParticipants}
                announcements={activeAnnouncements}
                chatMessages={activeChatMessages}
                checklist={activeChecklist}
                schedule={INITIAL_SCHEDULE[activeWorkspaceId!] || []}
                gallery={galleryPhotos}
                documents={INITIAL_DOCUMENTS[activeWorkspaceId!] || []}
                memberLocations={INITIAL_MEMBER_LOCATIONS[activeWorkspaceId!] || []}
                onAddChatMessage={handleAddChatMessage}
                onToggleChecklist={handleToggleChecklist}
                onAddGalleryPhoto={handleAddGalleryPhoto}
                onSubmitRegistration={handleFormSubmission}
                onSubmitPayment={handlePaymentSubmission}
                triggerSOS={handleTriggerSOS}
                activeSOSAlerts={activeSOS}
                onShowToast={addToast}
              />
            )}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 bg-[#040813] py-12 text-xs text-slate-400 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 text-left">
            <div 
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                setActiveWorkspaceId(null);
                setMarketingPage('home');
              }}
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/25">
                <Layers className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight text-white">Workspace<span className="text-indigo-400">OS</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional Event Management Operating System. Refined for planning, executing, and monitoring high-scale coordination.
            </p>
            <div className="text-[10px] text-slate-500">
              © {new Date().getFullYear()} WorkspaceOS. All rights reserved.
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-300">Product</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setMarketingPage('home')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Home</button>
              <button onClick={() => setMarketingPage('features')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Features</button>
              <button onClick={() => setMarketingPage('solutions')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Solutions</button>
              <button onClick={() => setMarketingPage('pricing')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Pricing</button>
            </div>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-300">Resources</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => { addToast('Documentation sandbox loaded.', 'success'); }} className="hover:text-indigo-400 transition-colors text-left cursor-pointer flex items-center gap-1">Documentation <ExternalLink className="w-3 h-3" /></button>
              <button onClick={() => setMarketingPage('faq')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Help & FAQs</button>
              <button onClick={() => setMarketingPage('privacy')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Privacy Policy</button>
              <button onClick={() => setMarketingPage('terms')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Terms of Service</button>
            </div>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-3 text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-300">Contact & Support</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setMarketingPage('contact')} className="hover:text-indigo-400 transition-colors text-left cursor-pointer">Contact Sales</button>
              <a href="mailto:support@workspaceos.io" className="hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> support@workspaceos.io
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5">
                <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">GH</span> GitHub Repository
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5">
                <span className="font-mono text-[10px] bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded">LN</span> LinkedIn Profile
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* WIZARD MODAL CONTAINER (8 Steps UI) */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/80 z-55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#090f1d] rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowWizard(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Wizard Header Progress Bar */}
            <div className="pb-4 border-b border-slate-800/80">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Workspace Creation Wizard</span>
              <h3 className="text-lg font-black text-white mt-1">Step {wizardStep} of 8: {
                wizardStep === 1 ? 'Basic Information' :
                wizardStep === 2 ? 'Workspace Type' :
                wizardStep === 3 ? 'Enable Modules' :
                wizardStep === 4 ? 'Registration Builder' :
                wizardStep === 5 ? 'Payment Config' :
                wizardStep === 6 ? 'Custom Branding' :
                wizardStep === 7 ? 'Review Config' :
                'Publish Workspace'
              }</h3>
              
              {/* Process Bar segments */}
              <div className="grid grid-cols-8 gap-1.5 mt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full ${step <= wizardStep ? 'bg-indigo-600' : 'bg-slate-800'}`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: Basic Info */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">WORKSPACE TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. wiredTech summit 2026"
                    value={wizName}
                    onChange={e => setWizName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">CATEGORY</label>
                    <select
                      value={wizCategory}
                      onChange={e => setWizCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-hidden"
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Conference">Conference</option>
                      <option value="Meetup">Meetup</option>
                      <option value="Corporate Event">Corporate Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">TIMELINE START DATE</label>
                    <input
                      type="date"
                      value={wizStart}
                      onChange={e => setWizStart(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">WORKSPACE DESCRIPTION</label>
                  <textarea
                    rows={3}
                    placeholder="Tell your members about the rules, details and schedule of this workspace..."
                    value={wizDesc}
                    onChange={e => setWizDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Workspace Type */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">VISIBILITY PRIVILEGES</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setWizVisibility('Public')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        wizVisibility === 'Public'
                          ? 'bg-indigo-950/40 border-indigo-500/30'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <h4 className="text-xs font-black text-white">Public Access</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Available to browse on open launchers.</p>
                    </button>

                    <button
                      onClick={() => setWizVisibility('Private')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        wizVisibility === 'Private'
                          ? 'bg-indigo-950/40 border-indigo-500/30'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <h4 className="text-xs font-black text-white">Private Room</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Requires an explicit invite-code to join.</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">AUTO-GENERATED JOIN CODE</label>
                  <input
                    type="text"
                    readOnly
                    value={wizInviteCode}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900 text-indigo-400 font-mono focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Enable Modules */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                {/* Title & Info */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Choose Features</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Customize your workspace with exactly the capabilities your event requires. Toggle modules anytime.</p>
                </div>

                {/* Search and Category Filters */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={wizModuleSearch}
                      onChange={e => setWizModuleSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-hidden"
                    />
                  </div>
                  
                  {/* Category Dropdown/Pills */}
                  <div className="flex gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
                    {(['All', 'Core', 'Communication', 'Safety', 'Content', 'Operations', 'Analytics', 'Advanced'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setWizModuleCategory(cat)}
                        className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg whitespace-nowrap transition-all ${
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

                {/* Modules Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  {MODULE_METADATA.filter(m => {
                    const matchesCategory = wizModuleCategory === 'All' || m.category === wizModuleCategory;
                    const matchesSearch = m.name.toLowerCase().includes(wizModuleSearch.toLowerCase()) || m.description.toLowerCase().includes(wizModuleSearch.toLowerCase());
                    return matchesCategory && matchesSearch;
                  }).map(m => {
                    const IconComponent = {
                      FileText, Users, CreditCard, Award, UserCheck, QrCode, Megaphone, Calendar, ImageIcon, Folder, MessageSquare, AlertTriangle, MapPin, ClipboardList, Briefcase, TrendingUp, Sparkles, Layers
                    }[m.icon] || FileText;

                    return (
                      <div
                        key={m.key}
                        onClick={() => setWizModules({ ...wizModules, [m.key]: !wizModules[m.key] })}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                          wizModules[m.key]
                            ? 'bg-indigo-950/20 border-indigo-500/40 hover:border-indigo-500/60 shadow-md shadow-indigo-950/20'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex gap-2.5 items-start">
                          <div className={`p-2 rounded-xl shrink-0 ${wizModules[m.key] ? 'bg-indigo-600/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-white">{m.name}</span>
                              {m.recommended && (
                                <span className="text-[8px] px-1.5 py-0.2 bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 rounded-full font-bold uppercase tracking-wider">
                                  Rec
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal">{m.description}</p>
                          </div>
                        </div>

                        {/* Premium Toggle Switch */}
                        <div className="shrink-0 pt-0.5">
                          <div className={`w-8 h-4.5 rounded-full transition-all relative ${wizModules[m.key] ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${wizModules[m.key] ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Registration Builder & AI Generator */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/10 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="w-4 h-4" /> AI Question Schema Generator
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. food restrictions, portfolio links, t-shirt sizes"
                      value={aiGenPrompt}
                      onChange={e => setAiGenPrompt(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                    <button
                      onClick={handleAIGeneratorQuestions}
                      disabled={isGeneratingQuestions}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 cursor-pointer"
                    >
                      {isGeneratingQuestions ? 'Generating...' : 'Generate Fields'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400">MANUAL SCHEMA ADDER</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Custom question label"
                      value={newWizQuestion}
                      onChange={e => setNewWizQuestion(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                    <select
                      value={newWizQuestionType}
                      onChange={e => setNewWizQuestionType(e.target.value as any)}
                      className="px-2.5 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="Short Text">Short Text</option>
                      <option value="Email">Email</option>
                      <option value="Number">Number</option>
                    </select>
                    <button
                      onClick={handleAddManualQuestion}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {wizQuestions.map((q, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                      <span>{q.label} <strong className="text-indigo-400 font-mono">({q.type})</strong></span>
                      <button
                        onClick={() => setWizQuestions(wizQuestions.filter(item => item.id !== q.id))}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Payment Configuration */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">RECEIVING ORGANISER UPI ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. workspaceos@ybl"
                    value={wizUpiId}
                    onChange={e => setWizUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">TRANSACTION TRANSFER INSTRUCTIONS</label>
                  <textarea
                    rows={4}
                    value={wizUpiInstructions}
                    onChange={e => setWizUpiInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Custom Branding */}
            {wizardStep === 6 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">BRAND COLOR PALETTE</label>
                  <div className="flex gap-3">
                    {['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setWizPrimaryColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-9 h-9 rounded-full cursor-pointer transition-all transform hover:scale-105 ${
                          wizPrimaryColor === color ? 'ring-4 ring-offset-2 ring-indigo-500' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">BRAND THEMING STYLE</label>
                  <div className="flex bg-slate-900 p-1 rounded-xl w-fit">
                    <button
                      type="button"
                      onClick={() => setWizTheme('light')}
                      className={`px-4 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer ${
                        wizTheme === 'light' ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400'
                      }`}
                    >
                      Light Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizTheme('dark')}
                      className={`px-4 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer ${
                        wizTheme === 'dark' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
                      }`}
                    >
                      Dark Mode
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Review Config */}
            {wizardStep === 7 && (
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                  <p>🚀 <strong>WORKSPACE NAME</strong>: {wizName || 'Custom Event'}</p>
                  <p>📁 <strong>CATEGORY</strong>: {wizCategory}</p>
                  <p>👁️ <strong>VISIBILITY</strong>: {wizVisibility}</p>
                  <p>⚙️ <strong>MODULES ENABLED</strong>: {Object.entries(wizModules).filter(([k, v]) => v).map(([k]) => k).join(', ')}</p>
                  <p>❓ <strong>REGISTRATION FORM FIELDS</strong>: {wizQuestions.length} Questions configured</p>
                  <p>💳 <strong>RECEIVER UPI</strong>: {wizUpiId}</p>
                </div>
              </div>
            )}

            {/* STEP 8: Publish Workspace */}
            {wizardStep === 8 && (
              <div className="text-center space-y-4 py-6">
                <div className="w-16 h-16 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
                  🚀
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Your SaaS room is configured!</h4>
                  <p className="text-xs text-slate-400 mt-1">Click the final Publish button below to securely instantiate the WorkspaceOS tenant.</p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
              <button
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl disabled:opacity-50 cursor-pointer"
              >
                Previous Step
              </button>

              {wizardStep < 8 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePublishWorkspace}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer"
                >
                  Publish Workspace OS
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: Simulated Background Automated Emails Inbox logs */}
      {showEmailDrawer && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-[#050b18] border-l border-slate-100 dark:border-slate-800/50 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">WorkspaceOS Automated Emails</h3>
                </div>
                <button
                  onClick={() => setShowEmailDrawer(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 font-medium">
                WorkspaceOS automatically dispatches notification emails to participants during key milestones (Registration, Confirmation, Payments and Broadcast announcements), completely eliminating WhatsApp manual outreach.
              </p>

              {/* Emails List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {simulatedEmails.map(email => (
                  <div
                    key={email.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-[#020617]/50 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-slate-400">
                      <span>To: <strong>{email.to}</strong></span>
                      <span>{new Date(email.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{email.subject}</h4>
                    <p className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{email.body}</p>
                  </div>
                ))}

                {simulatedEmails.length === 0 && (
                  <div className="py-12 text-center text-slate-400">
                    No emails dispatched yet. Submit a registration or pay to see real-time triggers!
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSimulatedEmails([])}
              className="w-full py-2 bg-slate-100 dark:bg-[#020617] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-[#050b18] transition-all cursor-pointer border dark:border-slate-800/50"
            >
              Clear Mail Logs
            </button>
          </div>
        </div>
      )}

      {/* DRAWER: SECURE DATABASE & EMAIL CONNECTION MANAGER */}
      {showSetupDrawer && (
        <div className="fixed inset-0 bg-black/60 z-55 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-md h-full bg-white dark:bg-[#050b18] border-l border-slate-100 dark:border-slate-800/50 p-6 shadow-2xl relative flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Backend Connection Hub</h3>
                </div>
                <button
                  onClick={() => setShowSetupDrawer(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Monitor Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-2xl border ${
                    isCloudSyncActive 
                      ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    <p className="text-[10px] font-semibold text-slate-400">SUPABASE DATABASE</p>
                    <p className="text-sm font-extrabold mt-1">{isCloudSyncActive ? '● Connected' : '○ Offline Mode'}</p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${
                    backendConfig?.resendConfigured
                      ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    <p className="text-[10px] font-semibold text-slate-400">RESEND EMAIL SERVICE</p>
                    <p className="text-sm font-extrabold mt-1">{backendConfig?.resendConfigured ? '● Configured' : '○ Local Simulator'}</p>
                  </div>
                </div>
              </div>

              {/* Secure Input Form */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Temporary Override Session Sync</h4>
                  <p className="text-[11px] text-slate-500 mb-3 font-medium leading-relaxed">
                    If you don't want to re-run your container, enter your keys below. They are saved securely in your browser's sessionStorage only.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      SUPABASE URL (Client-Side)
                    </label>
                    <input
                      type="password"
                      placeholder="https://your-project.supabase.co"
                      value={manualSupabaseUrl}
                      onChange={e => setManualSupabaseUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      SUPABASE ANON KEY (Client-Side)
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={manualSupabaseAnonKey}
                      onChange={e => setManualSupabaseAnonKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  {connectionError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[11px] font-medium leading-relaxed">
                      ⚠️ Connection Error: {connectionError}
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={async () => {
                        if (!manualSupabaseUrl.trim() || !manualSupabaseAnonKey.trim()) {
                          setConnectionError('Both Supabase URL and Anon Key are required');
                          return;
                        }
                        sessionStorage.setItem('manual_supabase_url', manualSupabaseUrl.trim());
                        sessionStorage.setItem('manual_supabase_key', manualSupabaseAnonKey.trim());
                        window.location.reload();
                      }}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Apply Session Override
                    </button>
                    <button
                      onClick={() => {
                        sessionStorage.removeItem('manual_supabase_url');
                        sessionStorage.removeItem('manual_supabase_key');
                        setManualSupabaseUrl('');
                        setManualSupabaseAnonKey('');
                        window.location.reload();
                      }}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Secure Production Instructions */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100/30 dark:border-indigo-500/10 rounded-2xl space-y-3">
                <h4 className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Secure Production Setup Guide
                </h4>
                <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300 leading-relaxed font-medium">
                  For a secure production deployment, <strong>never paste credentials into chat messages or hardcode them</strong>. Set them as environment variables inside the AI Studio Secrets Panel or your local workspace environment:
                </p>
                <div className="space-y-1.5 text-[10px] font-mono text-indigo-950/70 dark:text-indigo-200/70 bg-indigo-950/5 dark:bg-black/35 p-2.5 rounded-xl border border-indigo-200/20">
                  <div>SUPABASE_URL=...</div>
                  <div>SUPABASE_ANON_KEY=...</div>
                  <div>SUPABASE_SERVICE_ROLE_KEY=...</div>
                  <div>RESEND_API_KEY=...</div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">
                  * Note: The backend Express API proxy keeps the <strong>Service Role Key</strong> and <strong>Resend API Key</strong> strictly secure and never exposes them to the browser.
                </p>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 text-[10px] text-slate-400 text-center">
              WorkspaceOS Connection Manager • Premium Back-office Suite
            </div>

          </div>
        </div>
      )}

      {/* Elegant Toast Notifications Stack */}
      <div className="fixed bottom-6 right-6 z-60 space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-in-right ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/30'
                : toast.type === 'info'
                ? 'bg-indigo-950/90 text-indigo-200 border-indigo-500/30'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              toast.type === 'error' ? 'bg-rose-500' : toast.type === 'info' ? 'bg-indigo-400' : 'bg-emerald-400'
            }`} />
            <p className="text-xs font-bold leading-normal">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* Simulated Google Account Chooser Modal (Sandbox Environment) */}
      {showGoogleChooser && (
        <div className="fixed inset-0 bg-black/80 z-55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a1122] border border-slate-800 p-8 rounded-3xl space-y-6 relative shadow-2xl overflow-hidden animate-scale-up">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 rounded-full blur-xl" />

            <div className="text-center space-y-3 relative z-10">
              {/* Google Brand Identity Header */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h3 className="text-lg font-black text-white">Sign in with Google</h3>
              <p className="text-xs text-slate-400">to continue to <span className="font-extrabold text-indigo-400">WorkspaceOS</span></p>
            </div>

            {isGoogleLoading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 relative z-10 animate-fade-in">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <div className="space-y-1 text-center">
                  <p className="text-xs text-white font-bold">Authenticating Google secure credentials...</p>
                  <p className="text-[10px] text-indigo-400 font-mono tracking-wider">{selectedGoogleEmail}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 relative z-10 max-h-[280px] overflow-y-auto pr-1">
                {/* Active Simulated Google Profiles */}
                {[
                  { name: 'Rudra', email: 'w3b.rudra@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Elena Rostova', email: 'elena.rostova@techcorp.io', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Lucas Chen', email: 'lucas.chen@gmail.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Sarah Jenkins', email: 'sarah.j@workspaceos.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
                ].map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleGoogleSimulateSelect(account.email)}
                    className="w-full flex items-center gap-3.5 p-3.5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all cursor-pointer text-left group"
                  >
                    <img src={account.avatar} alt={account.name} className="w-8.5 h-8.5 rounded-full border border-slate-800 object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{account.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{account.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </button>
                ))}

                {/* Simulated Custom Profile Setup */}
                <div className="border-t border-slate-800/80 pt-4 mt-2">
                  <div className="space-y-2">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Use a different Google account
                    </label>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const email = formData.get('google_custom_email') as string;
                      if (email && email.trim()) {
                        handleGoogleSimulateSelect(email.trim());
                      }
                    }} className="flex gap-2">
                      <input
                        type="email"
                        name="google_custom_email"
                        required
                        placeholder="your.google.account@gmail.com"
                        className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        Sign In
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {!isGoogleLoading && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 relative z-10">
                <button
                  onClick={() => setShowGoogleChooser(false)}
                  className="hover:text-white transition-colors cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  <span className="hover:underline cursor-pointer">Privacy</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Terms</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
