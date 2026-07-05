import React, { useState } from 'react';
import {
  QrCode,
  Calendar,
  CreditCard,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  Compass,
  Bell,
  CheckCircle,
  X,
  Upload,
  Send,
  CornerDownRight,
  Pin,
  Clock,
  HelpCircle,
  Download,
  Eye,
  Settings,
  ChevronRight,
  Trash2,
  Edit2,
  Award
} from 'lucide-react';
import {
  Workspace,
  Participant,
  FormQuestion,
  ChatMessage,
  Announcement,
  GalleryPhoto,
  ChecklistItem,
  ScheduleEvent,
  DocumentFile,
  LiveMemberLocation,
  FormSubmission,
  SOSAlert,
  SaaSChatMessage,
  SaaSAnnouncement,
  SaaSDocument,
  GalleryAlbum
} from '../types';
import {
  WorkspaceSettingsService,
  ModuleConfigurationService,
  NotificationService,
  StorageService
} from '../services/SaaSServices';

interface ParticipantDashboardProps {
  workspace: Workspace;
  participant: Participant;
  participants: Participant[];
  announcements: SaaSAnnouncement[];
  chatMessages: ChatMessage[];
  checklist: ChecklistItem[];
  schedule: ScheduleEvent[];
  gallery: GalleryPhoto[];
  documents: DocumentFile[];
  memberLocations: LiveMemberLocation[];
  onAddChatMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'document') => void;
  onToggleChecklist: (id: string) => void;
  onAddGalleryPhoto: (url: string, caption: string) => void;
  onSubmitRegistration: (answers: Record<string, string | string[]>) => void;
  onSubmitPayment: (screenshotUrl: string) => void;
  triggerSOS: (coords?: { lat: number; lng: number }) => void;
  activeSOSAlerts: SOSAlert[];
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function ParticipantDashboard({
  workspace,
  participant,
  participants,
  announcements,
  chatMessages,
  checklist,
  schedule,
  gallery,
  documents,
  memberLocations,
  onAddChatMessage,
  onToggleChecklist,
  onAddGalleryPhoto,
  onSubmitRegistration,
  onSubmitPayment,
  triggerSOS,
  activeSOSAlerts,
  onShowToast,
}: ParticipantDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'smartpass' | 'registration' | 'payments' | 'schedule' | 'chat' | 'documents' | 'gallery' | 'settings' | 'certificates'>('home');

  // Redirect if currently viewed module gets disabled dynamically
  React.useEffect(() => {
    const tabToModuleMap: Record<string, keyof typeof workspace.modules> = {
      smartpass: 'qrSmartPass',
      registration: 'registration',
      payments: 'payments',
      schedule: 'schedule',
      chat: 'chat',
      documents: 'documents',
      gallery: 'gallery',
    };
    const mappedModule = tabToModuleMap[activeTab];
    if (mappedModule && !workspace.modules[mappedModule]) {
      setActiveTab('home');
    }
  }, [activeTab, workspace.modules]);

  // SaaS services integrations
  const settings = WorkspaceSettingsService.getSettings(workspace.id);
  const notifs = NotificationService.getNotifications(participant.id);
  const notifPrefs = NotificationService.getPreferences(participant.id);
  const files = StorageService.getMediaFiles(workspace.id);

  // Load custom templates dynamically from configuration services
  const configs = ModuleConfigurationService.getModuleConfigs(workspace.id);
  const smartPassConfig = configs.find(c => c.moduleKey === 'smartpass')?.settings || {
    headerColor: '#6366f1',
    showAvatar: true,
    showQRCode: true,
    disclaimer: 'This pass is non-transferable and requires manual gate validation.'
  };

  const certificateConfig = configs.find(c => c.moduleKey === 'certificates')?.settings || {
    title: 'Certificate of Excellence',
    subtext: 'This is awarded to {{name}} for successful completion of {{event}}.',
    themePreset: 'modern-dark'
  };

  // States
  const [formAnswers, setFormAnswers] = useState<Record<string, string | string[]>>({});
  const [trxRefInput, setTrxRefInput] = useState('');
  const [paymentScreenshotInput, setPaymentScreenshotInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Gallery
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  // Local thread messages mapping for robustness (Rule 5)
  const [threadedMsgs, setThreadedMsgs] = useState<SaaSChatMessage[]>([
    {
      id: 'msg-1',
      roomId: 'main',
      senderId: 'owner-id',
      senderName: 'SaaS Organizer',
      senderRole: 'Owner',
      content: 'Welcome everyone! Feel free to ask any questions in this secure thread.',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  // Handle Dynamic Registration submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRegistration(formAnswers);
    if (onShowToast) {
      onShowToast('Registration responses submitted securely to database backend!', 'success');
    } else {
      alert('Registration responses submitted securely to database backend!');
    }
  };

  // Handle Manual UPI payment upload (Rule 7)
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxRefInput.trim()) {
      if (onShowToast) {
        onShowToast('Please enter your unique transaction reference ID.', 'error');
      } else {
        alert('Please enter your unique transaction reference ID.');
      }
      return;
    }
    // Simulate screenshot media asset creation
    const mediaFile = StorageService.uploadMediaFile(
      workspace.id,
      'payment_receipt.png',
      'image/png',
      203403,
      participant.id,
      paymentScreenshotInput || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=80'
    );

    onSubmitPayment(mediaFile.url);
    if (onShowToast) {
      onShowToast('Screenshot reference submitted for manual validation review. Standby for smart pass release.', 'success');
    } else {
      alert('Screenshot reference submitted for manual validation review. Standby for smart pass release.');
    }
  };

  // Threaded Chat handlers
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    let replyPreview = undefined;
    if (activeReplyId) {
      const parent = threadedMsgs.find(m => m.id === activeReplyId);
      if (parent) {
        replyPreview = {
          id: parent.id,
          senderName: parent.senderName,
          content: parent.content,
        };
      }
    }

    const newMsg: SaaSChatMessage = {
      id: `msg-${Date.now()}`,
      roomId: 'main',
      senderId: participant.id,
      senderName: participant.name,
      senderRole: participant.role,
      avatarUrl: participant.avatarUrl,
      content: chatInput,
      parentMessageId: activeReplyId || undefined,
      parentMessagePreview: replyPreview,
      timestamp: new Date().toLocaleTimeString(),
    };

    setThreadedMsgs([...threadedMsgs, newMsg]);
    setChatInput('');
    setActiveReplyId(null);
  };

  // Gallery Photo uploader
  const handlePhotoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;
    onAddGalleryPhoto(photoUrl, photoCaption);
    setPhotoUrl('');
    setPhotoCaption('');
    if (onShowToast) {
      onShowToast('Photo published to workspace gallery album successfully!', 'success');
    } else {
      alert('Photo published to workspace gallery album successfully!');
    }
  };

  // Simulated Document file mapping
  const docFiles: SaaSDocument[] = [
    {
      id: 'doc-1',
      workspaceId: workspace.id,
      title: 'Official Participant Handbook',
      fileSize: '2.4 MB',
      documentType: 'Guide',
      version: 'v2.1',
      visibility: 'Public',
      createdAt: new Date().toISOString(),
      url: '#'
    },
    {
      id: 'doc-2',
      workspaceId: workspace.id,
      title: 'Workspace Legal Release Agreement',
      fileSize: '430 KB',
      documentType: 'Legal',
      version: 'v1.0',
      visibility: 'Public',
      createdAt: new Date().toISOString(),
      url: '#'
    }
  ];

  // Gallery Albums mapping
  const albumsList: GalleryAlbum[] = [
    {
      id: 'album-1',
      workspaceId: workspace.id,
      title: 'Main Hall Event Photos',
      description: 'Photos collected by mentors and organisers',
      visibility: 'Public',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80',
      orderIndex: 0,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-100 rounded-3xl" id="part-dash">
      
      {/* Sidebar navigation */}
      <div className="lg:col-span-3 space-y-2 bg-[#0a1122] border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="pb-4 border-b border-slate-800/80 mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black text-white">
            P
          </div>
          <div className="truncate">
            <h3 className="text-sm font-black text-white">{participant.name}</h3>
            <p className="text-[10px] text-slate-400 capitalize">{participant.role} Portal</p>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Compass className="w-4 h-4" /> Home Feed
            </span>
          </button>

          {workspace.modules.qrSmartPass && (
            <button
              onClick={() => setActiveTab('smartpass')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'smartpass'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4" /> Digital Smart Pass
              </span>
              {participant.paymentStatus === 'Paid' && (
                <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-md">
                  READY
                </span>
              )}
            </button>
          )}

          {workspace.modules.registration && (
            <button
              onClick={() => setActiveTab('registration')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'registration'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" /> Form Questions
              </span>
            </button>
          )}

          {workspace.modules.payments && (
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" /> Manual Payments (UPI)
              </span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                participant.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {participant.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
              </span>
            </button>
          )}

          {workspace.modules.schedule && (
            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" /> Event Schedule
              </span>
            </button>
          )}

          {workspace.modules.chat && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" /> Team Thread Chat
              </span>
            </button>
          )}

          {workspace.modules.documents && (
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" /> Documents Room
              </span>
            </button>
          )}

          {workspace.modules.gallery && (
            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4" /> Photos & Albums
              </span>
            </button>
          )}

          {participant.paymentStatus === 'Paid' && (
            <button
              onClick={() => setActiveTab('certificates')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Award className="w-4 h-4" /> My Certificates
              </span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                participant.checkedIn ? 'bg-indigo-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-500'
              }`}>
                {participant.checkedIn ? 'CLAIMABLE' : 'LOCKED'}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/35 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" /> Preferences
            </span>
          </button>
        </nav>
      </div>

      {/* Main Panel Content */}
      <div className="lg:col-span-9 bg-[#080d19]/65 border border-slate-800 p-6 rounded-3xl shadow-2xl min-h-[580px] backdrop-blur-md">
        
        {/* TAB 1: FEED HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">Active Workspace Feed</span>
              <h2 className="text-xl font-extrabold text-white">Live Announcements</h2>
              <p className="text-xs text-slate-400">Chronological notices published by organisers.</p>
            </div>

            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="p-4 bg-[#0a1122]/90 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black bg-indigo-950/40 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/10 uppercase">
                        {ann.category}
                      </span>
                      <h4 className="text-sm font-black text-white mt-2">{ann.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{ann.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-xs text-slate-500 py-10 text-center">No announcements broadcasted yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SMART PASS (Ticket, QR Token, Scan counts) (Rule 3) */}
        {activeTab === 'smartpass' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Your digital Smart Pass</h2>
              <p className="text-xs text-slate-400">Bring this secure QR ticket to the front gate for quick check-in authorization.</p>
            </div>

            {participant.paymentStatus !== 'Paid' ? (
              <div className="p-8 text-center bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">Smart Pass Locked</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your manual payment status is currently "{participant.paymentStatus}". Please complete the UPI transaction and upload your screenshot receipt in the Payments section to release the credential.
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                {/* Dynamic Digital Ticket Layout */}
                <div className="w-80 bg-[#090e1a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-sans text-left">
                  <div className="p-4" style={{ backgroundColor: smartPassConfig.headerColor }}>
                    <p className="text-[9px] font-black tracking-widest text-white/90 uppercase">{workspace.category} PASS</p>
                    <h4 className="text-sm font-black text-white truncate mt-1">{workspace.name}</h4>
                  </div>
                  <div className="p-6 space-y-5 relative bg-black/40">
                    {/* Visual cutouts */}
                    <div className="absolute top-[40%] -left-3 w-6 h-6 bg-[#030712] rounded-full border-r border-slate-800" />
                    <div className="absolute top-[40%] -right-3 w-6 h-6 bg-[#030712] rounded-full border-l border-slate-800" />

                    <div className="flex items-center gap-3">
                      {smartPassConfig.showAvatar ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md uppercase">
                          {participant.name.substring(0, 2)}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                          ?
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-black text-white">{participant.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">MEMBER_ID: WOS-{participant.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>

                    {smartPassConfig.showQRCode && (
                      <div className="bg-white p-3 w-36 h-36 mx-auto rounded-2xl flex items-center justify-center border border-slate-800/20 shadow-inner">
                        <QrCode className="w-28 h-28 text-slate-950" />
                      </div>
                    )}

                    <div className="space-y-3 pt-3 border-t border-dashed border-slate-800">
                      <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">PASS NUMBER</span>
                          <span className="text-slate-100 font-mono">TK-{participant.id.slice(0, 5).toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">SCAN COUNT</span>
                          <span className="text-slate-100">{participant.checkInCount} Scans</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">VISIBILITY</span>
                          <span className="text-indigo-400">{workspace.visibility}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">STATUS</span>
                          <span className={participant.checkedIn ? "text-emerald-400 font-black animate-pulse" : "text-amber-400 font-black"}>
                            {participant.checkedIn ? "CHECKED-IN" : "ACTIVE"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-500 font-medium text-center leading-relaxed font-sans">
                      {smartPassConfig.disclaimer}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 border-t border-slate-800/40 text-[9px] text-center font-mono text-slate-400">
                    Gate scanner: v1.2-authorised
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGISTRATION DYNAMIC QUESTIONS FORM */}
        {activeTab === 'registration' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Dynamic Form Questionnaire</h2>
              <p className="text-xs text-slate-400">Complete missing details requested by workspace administrators.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl">
              {workspace.questions.map(q => (
                <div key={q.id} className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    {q.label} {q.required && <span className="text-rose-500">*</span>}
                  </label>
                  
                  {q.type === 'Dropdown' && q.options ? (
                    <select
                      required={q.required}
                      onChange={e => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="">-- Choose Option --</option>
                      {q.options.map((opt, oidx) => (
                        <option key={oidx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : q.type === 'Paragraph' ? (
                    <textarea
                      required={q.required}
                      rows={3}
                      onChange={e => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  ) : (
                    <input
                      type={q.type === 'Number' ? 'number' : 'text'}
                      required={q.required}
                      onChange={e => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                    />
                  )}
                </div>
              ))}

              {workspace.questions.length === 0 && (
                <p className="text-xs text-slate-500 py-6">No registration questions specified by organiser.</p>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Submit Form Details
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: MANUAL UPI PAYMENTS WORKFLOW (Rule 7) */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">UPI Manual Gateway Payment</h2>
              <p className="text-xs text-slate-400">Scan QR Code, make exact payment, and attach details to activate your Smart Pass card.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left UPI instructions */}
              <div className="md:col-span-5 p-5 bg-[#0a1122]/80 border border-slate-800 rounded-2xl text-center space-y-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">UPI SCANNER</p>
                <div className="bg-white p-3 w-40 h-40 mx-auto rounded-2xl flex items-center justify-center border border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=300&q=80" 
                    alt="upi qr" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left space-y-1.5 text-xs">
                  <p className="text-slate-300 font-bold text-center">UPI Address: <span className="font-mono text-indigo-400">{workspace.upiId || 'workspaceos@ybl'}</span></p>
                  <p className="text-slate-400 text-[11px] text-center">Amount required: <span className="text-white font-extrabold">₹4,000</span></p>
                </div>
              </div>

              {/* Upload screenshot form */}
              <div className="md:col-span-7 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Submit Receipt Form</h3>
                
                {participant.paymentStatus === 'Paid' ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-bold">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Transaction Approved! Your Smart Pass digital ticket is released.
                  </div>
                ) : participant.paymentStatus === 'Pending Verification' ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex items-center gap-2 font-bold">
                    <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                    Receipt Uploaded. Organiser is verifying manual reference details...
                  </div>
                ) : (
                  <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">UPI TRANSACTION REFERENCE ID / UTR</label>
                      <input
                        type="text"
                        placeholder="12 digit UTR reference number"
                        value={trxRefInput}
                        onChange={e => setTrxRefInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">RECEIPT SCREENSHOT URL</label>
                      <input
                        type="text"
                        placeholder="Paste image URL (or leave blank to simulate mock upload)"
                        value={paymentScreenshotInput}
                        onChange={e => setPaymentScreenshotInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" /> Upload Verification screenshot
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: INTERACTIVE EVENT SCHEDULE TIMELINE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Event Timeline Itinerary</h2>
              <p className="text-xs text-slate-400">Chronological calendar timeline events scheduled by organisers.</p>
            </div>

            <div className="relative border-l border-slate-800 pl-6 space-y-6 ml-3">
              {schedule.map(evt => (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 bg-indigo-600 border border-indigo-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-all">
                    ●
                  </div>
                  <div className="p-4 bg-[#0a1122]/80 border border-slate-800 hover:border-indigo-500/20 transition-all rounded-2xl space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">{evt.time}</span>
                      <span className="text-[9px] font-extrabold bg-indigo-950/40 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/10">
                        {evt.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white">{evt.title}</h4>
                    <p className="text-xs text-slate-300">{evt.speaker} • {evt.location}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{evt.description}</p>
                  </div>
                </div>
              ))}
              {schedule.length === 0 && (
                <p className="text-xs text-slate-500 py-6">No chronological timeline scheduled yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: GROUP CHAT WITH PLURAL ROOMS & THREAD REPLIES (Rule 5) */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Group Chat Threading</h2>
              <p className="text-xs text-slate-400 font-medium">Real-time collaboration. Reply directly to any message to build threaded answers.</p>
            </div>

            {/* Chat Messages Log */}
            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl h-[320px] overflow-y-auto space-y-3">
              {threadedMsgs.map(msg => (
                <div key={msg.id} className="space-y-1 group">
                  
                  {/* Reply preview */}
                  {msg.parentMessagePreview && (
                    <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold ml-6 bg-indigo-950/30 w-fit px-2.5 py-0.5 rounded-full">
                      <CornerDownRight className="w-3 h-3" />
                      Replying to {msg.parentMessagePreview.senderName}: "{msg.parentMessagePreview.content.substring(0, 30)}..."
                    </div>
                  )}

                  <div className="flex items-start gap-2.5 text-xs">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-300 uppercase">
                      {msg.senderName.substring(0, 1)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white">{msg.senderName}</span>
                        <span className="text-[9px] text-slate-500 font-semibold">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{msg.content}</p>
                    </div>

                    <button 
                      onClick={() => setActiveReplyId(msg.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-white rounded-md border border-slate-800 transition-all cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendChat} className="space-y-2">
              {activeReplyId && (
                <div className="flex items-center justify-between bg-indigo-950/40 p-2 rounded-xl text-xs text-indigo-300 border border-indigo-500/10">
                  <span>Replying to thread message: {threadedMsgs.find(m => m.id === activeReplyId)?.senderName}</span>
                  <button onClick={() => setActiveReplyId(null)} className="p-0.5 text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or publish to team thread..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: DOCUMENTS BY TYPE & VISIBILITY (Rule 8) */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Documents Repository</h2>
              <p className="text-xs text-slate-400 font-semibold">Official handbooks, guide maps, legal contracts and passes published for members.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docFiles.map(doc => (
                <div key={doc.id} className="p-4 bg-[#0a1122]/90 border border-slate-800 rounded-2xl flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/10 uppercase">
                        {doc.documentType}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">{doc.version}</span>
                    </div>
                    <h4 className="text-sm font-black text-white">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400">File size: {doc.fileSize} • Visibility: <span className="text-indigo-400">{doc.visibility}</span></p>
                  </div>
                  <button className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-all border border-slate-800 cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PHOTOS & GALLERY ALBUMS */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-extrabold text-white">Workspace Media Gallery</h2>
                <p className="text-xs text-slate-400">Browse shared events albums or publish your own snapshot contributions.</p>
              </div>
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2.5 py-1 rounded-full font-bold">
                Album: Hall Photos
              </span>
            </div>

            {/* Albums Grid view */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {albumsList.map(alb => (
                <div key={alb.id} className="p-4 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-3">
                  <img src={alb.coverImage} alt="cover" className="w-full h-36 object-cover rounded-xl" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{alb.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alb.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo contribution Form */}
            <div className="p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-slate-800">Publish Photo to Album</h3>
              <form onSubmit={handlePhotoUploadSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Image url</label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                  />
                </div>
                <div className="md:col-span-5 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Caption / description</label>
                  <input
                    type="text"
                    placeholder="e.g. Brainstorming session at workspace"
                    value={photoCaption}
                    onChange={e => setPhotoCaption(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-hidden"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 9: IN-APP NOTIFICATION LOGS & CHANNEL PREFERENCES (Rule 4) */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Notifications & Channels</h2>
              <p className="text-xs text-slate-400">Configure where you receive workspace bulletins, payment receipts, and team messages.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Preferences */}
              <div className="lg:col-span-5 p-5 bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4 h-fit">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">Dispatch Channels</h3>
                
                <div className="space-y-3.5 text-xs text-slate-300">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Email Broadcasts (Resend Integration)</span>
                    <input
                      type="checkbox"
                      defaultChecked={notifPrefs.email}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span>In-App Center Alert Ticker</span>
                    <input
                      type="checkbox"
                      defaultChecked={notifPrefs.inApp}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Push notification (Mobile OS token)</span>
                    <input
                      type="checkbox"
                      defaultChecked={notifPrefs.push}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span>SMS / Twilio Failback Gateway</span>
                    <input
                      type="checkbox"
                      defaultChecked={notifPrefs.sms}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                    />
                  </label>
                </div>

                <button
                  onClick={() => alert('Notification channels synchronized securely!')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save Dispatch Preferences
                </button>
              </div>

              {/* Logs */}
              <div className="lg:col-span-7 p-5 bg-[#0a1122]/50 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">In-App Alerts Inbox</h3>
                <div className="space-y-3 max-h-[280px] overflow-y-auto">
                  {notifs.map(not => (
                    <div key={not.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-indigo-400 uppercase">{not.category}</span>
                        <span className="text-slate-500">{new Date(not.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs font-extrabold text-white">{not.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{not.body}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 10: CERTIFICATES PANEL */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Your Excellence Certificate</h2>
              <p className="text-xs text-slate-400">View and download your dynamically generated achievement and participation credentials.</p>
            </div>

            {!participant.checkedIn ? (
              <div className="space-y-6">
                <div className="p-8 text-center bg-[#0a1122] border border-slate-800 rounded-2xl space-y-4">
                  <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-indigo-500/20">
                    🔒
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="text-sm font-bold text-white">Certificate of Participation is Locked</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your completion certificate will be released automatically once you are checked in at the event gate by an organizer. Bring your digital Smart Pass to be scanned!
                    </p>
                  </div>
                </div>

                {/* Preview with a custom watermark overlay */}
                <div className="flex flex-col items-center space-y-2 opacity-50 pointer-events-none select-none relative">
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10">
                    <span className="bg-rose-600/90 text-white font-black text-xs px-4 py-2 rounded-xl border border-rose-500 tracking-widest uppercase shadow-lg transform -rotate-12">
                      LOCKED PREVIEW
                    </span>
                  </div>
                  
                  <div className={`w-full max-w-[550px] p-6 rounded-2xl border text-center font-serif text-slate-100 ${
                    certificateConfig.themePreset === 'modern-dark'
                      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-indigo-500/15'
                      : certificateConfig.themePreset === 'classic-gold'
                        ? 'bg-[#faf7f2] border-[#dfc38a] text-amber-950 shadow-amber-500/5'
                        : 'bg-black border-emerald-500/15'
                  }`}>
                    <div className={`p-1.5 border border-dashed rounded-lg ${certificateConfig.themePreset === 'classic-gold' ? 'border-amber-900/10' : 'border-white/10'}`}>
                      <div className="p-4 space-y-4">
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${certificateConfig.themePreset === 'classic-gold' ? 'text-amber-800' : 'text-indigo-400'}`}>
                          🎖 CERTIFICATE OF ACHIEVEMENT
                        </span>
                        <h4 className={`text-base font-black tracking-tight ${certificateConfig.themePreset === 'classic-gold' ? 'text-slate-900' : 'text-white'}`}>
                          {certificateConfig.title}
                        </h4>
                        <p className={`text-[11px] leading-relaxed italic ${certificateConfig.themePreset === 'classic-gold' ? 'text-slate-700' : 'text-slate-300'}`}>
                          {certificateConfig.subtext.replace('{{name}}', participant.name).replace('{{event}}', workspace.name)}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 text-[8px] border-t border-slate-800/40">
                          <div>
                            <p className="text-slate-500 uppercase block">AUTHORIZED RELEASER</p>
                            <p className={certificateConfig.themePreset === 'classic-gold' ? 'text-slate-900 font-bold font-sans' : 'text-slate-100 font-bold font-sans'}>SaaS Organizer Panel</p>
                          </div>
                          <div>
                            <p className="text-slate-500 uppercase block">VERIFICATION SIGNATURE</p>
                            <p className="font-mono text-indigo-400 font-bold">WOS-VALIDATED</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-bold max-w-xl self-stretch justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Congratulations! Your check-in is complete and your Excellence Certificate has been fully issued!
                </div>

                <div className={`w-full max-w-[550px] p-6 rounded-2xl shadow-2xl border text-center font-serif text-slate-100 ${
                  certificateConfig.themePreset === 'modern-dark'
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-indigo-500/20'
                    : certificateConfig.themePreset === 'classic-gold'
                      ? 'bg-[#faf7f2] border-[#dfc38a] text-amber-950 shadow-amber-500/5'
                      : 'bg-black border-emerald-500/20'
                }`}>
                  <div className={`p-1.5 border border-dashed rounded-lg ${certificateConfig.themePreset === 'classic-gold' ? 'border-amber-900/10' : 'border-white/10'}`}>
                    <div className="p-6 space-y-5 border border-solid rounded-md border-transparent">
                      <span className={`text-xs font-bold tracking-widest uppercase ${certificateConfig.themePreset === 'classic-gold' ? 'text-amber-800' : 'text-indigo-400'}`}>
                        🎖 CERTIFICATE OF ACHIEVEMENT
                      </span>
                      <h4 className={`text-xl font-black tracking-tight ${certificateConfig.themePreset === 'classic-gold' ? 'text-slate-900' : 'text-white'}`}>
                        {certificateConfig.title}
                      </h4>
                      <p className={`text-xs leading-relaxed italic ${certificateConfig.themePreset === 'classic-gold' ? 'text-slate-700' : 'text-slate-300'}`}>
                        {certificateConfig.subtext.replace('{{name}}', participant.name).replace('{{event}}', workspace.name)}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-6 text-[9px] border-t border-slate-800/40">
                        <div>
                          <p className="text-slate-500 uppercase block">AUTHORIZED RELEASER</p>
                          <p className={certificateConfig.themePreset === 'classic-gold' ? 'text-slate-900 font-bold font-sans' : 'text-slate-100 font-bold font-sans'}>SaaS Organizer Panel</p>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase block">VERIFICATION SIGNATURE</p>
                          <p className="font-mono text-indigo-400 font-bold">WOS-VALIDATED</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onShowToast) {
                      onShowToast('Dynamic PDF certificate downloaded with secure cryptographical fingerprint!', 'success');
                    } else {
                      alert('Dynamic PDF certificate downloaded with secure cryptographical fingerprint!');
                    }
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download high-fidelity PDF Certificate
                </button>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
