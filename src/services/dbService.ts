import { getSupabaseClient } from '../supabaseClient';
import {
  Workspace,
  Participant,
  ChatMessage,
  Announcement,
  GalleryPhoto,
  ChecklistItem,
  ScheduleEvent,
  FormQuestion,
  WorkspaceCategory,
  WorkspaceModules,
  SOSAlert
} from '../types';
import {
  INITIAL_WORKSPACES,
  INITIAL_PARTICIPANTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_CHECKLISTS,
  INITIAL_SCHEDULE,
  INITIAL_GALLERY
} from '../data';

// ==========================================
// DUAL-MODE SERVICE MAPPERS
// ==========================================

export function mapDbWorkspace(db: any): Workspace {
  return {
    id: db.id,
    name: db.name,
    description: db.description || '',
    coverImage: db.cover_image || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80',
    category: db.category as WorkspaceCategory,
    startDate: db.start_date || '',
    endDate: db.end_date || '',
    visibility: (db.visibility || 'Public') as 'Public' | 'Private',
    inviteCode: db.invite_code || '',
    inviteLink: db.invite_link || '',
    modules: db.modules || {
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
    },
    upiId: db.upi_id || '',
    upiQrCode: db.upi_qr_code || '',
    upiInstructions: db.upi_instructions || '',
    questions: db.questions || [],
  };
}

export function mapWorkspaceToDb(ws: Workspace): any {
  return {
    id: ws.id,
    name: ws.name,
    description: ws.description,
    cover_image: ws.coverImage,
    category: ws.category,
    start_date: ws.startDate,
    end_date: ws.endDate,
    visibility: ws.visibility,
    invite_code: ws.inviteCode,
    invite_link: ws.inviteLink,
    modules: ws.modules,
    upi_id: ws.upiId,
    upi_qr_code: ws.upiQrCode,
    upi_instructions: ws.upiInstructions,
    questions: ws.questions,
  };
}

export function mapDbParticipant(db: any): Participant {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    phone: db.phone || '',
    role: db.role || 'Participant',
    status: db.status || 'Pending',
    paymentStatus: db.payment_status || 'Unpaid',
    paymentScreenshot: db.payment_screenshot,
    checkedIn: !!db.checked_in,
    checkInCount: db.check_in_count || 0,
    lastCheckIn: db.last_check_in,
    avatarUrl: db.avatar_url,
    answers: db.answers || {},
  };
}

export function mapParticipantToDb(p: Participant, workspaceId: string): any {
  return {
    id: p.id,
    workspace_id: workspaceId,
    name: p.name,
    email: p.email,
    phone: p.phone,
    role: p.role,
    status: p.status,
    payment_status: p.paymentStatus,
    payment_screenshot: p.paymentScreenshot,
    checked_in: p.checkedIn,
    check_in_count: p.checkInCount,
    last_check_in: p.lastCheckIn,
    avatar_url: p.avatarUrl,
    answers: p.answers,
  };
}

// ==========================================
// LOCAL STORAGE SIMULATED DATABASE
// ==========================================

const getLocalData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`ws_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = (key: string, data: any) => {
  localStorage.setItem(`ws_${key}`, JSON.stringify(data));
};

// Seed LocalStorage with default simulation data if empty
if (!localStorage.getItem('ws_workspaces')) {
  setLocalData('workspaces', INITIAL_WORKSPACES);
}
if (!localStorage.getItem('ws_participants')) {
  setLocalData('participants', INITIAL_PARTICIPANTS);
}
if (!localStorage.getItem('ws_announcements')) {
  setLocalData('announcements', INITIAL_ANNOUNCEMENTS);
}
if (!localStorage.getItem('ws_chats')) {
  setLocalData('chats', INITIAL_CHAT_MESSAGES);
}
if (!localStorage.getItem('ws_checklists')) {
  setLocalData('checklists', INITIAL_CHECKLISTS);
}
if (!localStorage.getItem('ws_gallery')) {
  setLocalData('gallery', INITIAL_GALLERY);
}

// Seed Simulated Users list with password 'password123'
const INITIAL_SIMULATED_USERS = [
  { id: 'usr-sarah', email: 'sarah.j@workspaceos.io', fullName: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', password: 'password' },
  { id: 'usr-lucas', email: 'lucas.chen@gmail.com', fullName: 'Lucas Chen', password: 'password' },
  { id: 'usr-elena', email: 'elena.rostova@techcorp.io', fullName: 'Elena Rostova', password: 'password' },
  { id: 'usr-rudra', email: 'w3b.rudra@gmail.com', fullName: 'Rudra', password: 'password' }
];

if (!localStorage.getItem('ws_sim_users')) {
  setLocalData('sim_users', INITIAL_SIMULATED_USERS);
}

export interface AuthSessionUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

// ==========================================
// UNIFIED AUTH & DATABASE SERVICE
// ==========================================

export class DBService {
  // ----------------------------------------
  // AUTHENTICATION FLOWS
  // ----------------------------------------
  
  static async signUp(email: string, password: string, fullName: string): Promise<AuthSessionUser> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      if (!data.user) throw new Error('Sign up failed');
      return {
        id: data.user.id,
        email: data.user.email || email,
        fullName: fullName,
      };
    } else {
      // Offline emulation
      const users = getLocalData<any[]>('sim_users', INITIAL_SIMULATED_USERS);
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
      }
      const newUser = {
        id: `usr-${Date.now()}`,
        email: email.toLowerCase(),
        fullName,
        password,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`
      };
      users.push(newUser);
      setLocalData('sim_users', users);
      
      const session = { id: newUser.id, email: newUser.email, fullName: newUser.fullName, avatarUrl: newUser.avatarUrl };
      setLocalData('sim_session', session);
      return session;
    }
  }

  static async signIn(email: string, password?: string, isGoogle: boolean = false, isMagic: boolean = false): Promise<AuthSessionUser> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      if (isGoogle) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
            skipBrowserRedirect: true
          }
        });
        if (error) throw error;
        if (data?.url) {
          return {
            id: 'oauth-url',
            email: 'oauth',
            fullName: data.url
          };
        }
        throw new Error('Google Sign-In failed to generate authorization URL.');
      }
      
      if (isMagic) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        // Mock session returned for immediate preview feedback while waiting
        return {
          id: 'temp-magic-link',
          email,
          fullName: email.split('@')[0],
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });
      if (error) throw error;
      if (!data.user) throw new Error('Sign in failed');
      return {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: data.user.user_metadata?.avatar_url,
      };
    } else {
      // Offline emulation
      const users = getLocalData<any[]>('sim_users', INITIAL_SIMULATED_USERS);
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (isGoogle) {
        // Dynamic simulated login for google
        const simUser = matched || {
          id: `usr-${Date.now()}`,
          email: email.toLowerCase(),
          fullName: email.split('@')[0],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        };
        if (!matched) {
          users.push(simUser);
          setLocalData('sim_users', users);
        }
        setLocalData('sim_session', simUser);
        return simUser;
      }

      if (isMagic) {
        // Return active simulation
        const simUser = matched || {
          id: `usr-${Date.now()}`,
          email: email.toLowerCase(),
          fullName: email.split('@')[0]
        };
        if (!matched) {
          users.push(simUser);
          setLocalData('sim_users', users);
        }
        // Save temporary login link details to simulate the inbox
        return simUser;
      }

      if (!matched) {
        throw new Error('Account not found. Please register.');
      }
      if (password && matched.password !== password) {
        throw new Error('Incorrect password.');
      }

      const session = { id: matched.id, email: matched.email, fullName: matched.fullName, avatarUrl: matched.avatarUrl };
      setLocalData('sim_session', session);
      return session;
    }
  }

  static async signOut(): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('ws_sim_session');
  }

  static onAuthStateChange(callback: (user: AuthSessionUser | null) => void): () => void {
    let unsubscribe = () => {};
    let active = true;

    getSupabaseClient().then(supabase => {
      if (!active) return;
      if (supabase) {
        // Initial session fetch
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!active) return;
          if (session?.user) {
            callback({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
              avatarUrl: session.user.user_metadata?.avatar_url
            });
          } else {
            callback(null);
          }
        });

        // Live subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!active) return;
          if (session?.user) {
            callback({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
              avatarUrl: session.user.user_metadata?.avatar_url
            });
          } else {
            callback(null);
          }
        });
        unsubscribe = () => {
          subscription.unsubscribe();
        };
      } else {
        // Offline simulation session checker
        const checkSession = () => {
          if (!active) return;
          const simSession = localStorage.getItem('ws_sim_session');
          if (simSession) {
            try {
              callback(JSON.parse(simSession));
            } catch {
              callback(null);
            }
          } else {
            callback(null);
          }
        };

        checkSession();
        const interval = setInterval(checkSession, 1000);
        unsubscribe = () => {
          clearInterval(interval);
        };
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }

  // ----------------------------------------
  // WORKSPACE QUERY & ACTIONS
  // ----------------------------------------

  static async getWorkspacesForUser(email: string): Promise<Workspace[]> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      // Fetch workspaces where this email is a participant
      const { data: partData, error: partError } = await supabase
        .from('participants')
        .select('workspace_id')
        .eq('email', email.toLowerCase());

      if (partError) throw partError;
      if (!partData || partData.length === 0) return [];

      const workspaceIds = partData.map(p => p.workspace_id);
      const { data: wsData, error: wsError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds);

      if (wsError) throw wsError;
      return (wsData || []).map(mapDbWorkspace);
    } else {
      // Offline emulation
      const allWorkspaces = getLocalData<Workspace[]>('workspaces', INITIAL_WORKSPACES);
      const participantsMap = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);

      // Filter workspaces where the user email matches any participant
      return allWorkspaces.filter(ws => {
        const pList = participantsMap[ws.id] || [];
        return pList.some(p => p.email.toLowerCase() === email.toLowerCase());
      });
    }
  }

  static async fetchWorkspaceByCode(code: string): Promise<Workspace> {
    const cleanedCode = code.trim().toUpperCase();
    const supabase = await getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .or(`invite_code.eq.${cleanedCode},id.eq.${code.trim()}`)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('WORKSPACE_NOT_FOUND');
      return mapDbWorkspace(data);
    } else {
      // Offline emulation
      const allWorkspaces = getLocalData<Workspace[]>('workspaces', INITIAL_WORKSPACES);
      const matched = allWorkspaces.find(
        w => w.inviteCode?.toUpperCase() === cleanedCode || w.id.toLowerCase() === code.trim().toLowerCase()
      );
      if (!matched) throw new Error('WORKSPACE_NOT_FOUND');
      return matched;
    }
  }

  static async joinWorkspace(email: string, userName: string, workspaceId: string, customAnswers: Record<string, any> = {}): Promise<Participant> {
    const supabase = await getSupabaseClient();
    
    // Check validation constraints: Expiry, limits, active participants
    let currentWorkspace: Workspace;
    let currentParticipantsCount = 0;

    if (supabase) {
      const { data: wsData, error: wsErr } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();
      if (wsErr || !wsData) throw new Error('Workspace not found');
      currentWorkspace = mapDbWorkspace(wsData);

      const { count, error: countErr } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);
      if (!countErr) {
        currentParticipantsCount = count || 0;
      }
    } else {
      const wsList = getLocalData<Workspace[]>('workspaces', INITIAL_WORKSPACES);
      const ws = wsList.find(w => w.id === workspaceId);
      if (!ws) throw new Error('Workspace not found');
      currentWorkspace = ws;

      const pMap = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);
      currentParticipantsCount = (pMap[workspaceId] || []).length;
    }

    // 1. Expired invite check
    if (currentWorkspace.endDate) {
      const end = new Date(currentWorkspace.endDate);
      const now = new Date();
      if (end < now) {
        throw new Error('INVITE_EXPIRED');
      }
    }

    // 2. Capacity Check (Simulated maximum 100 members limit)
    if (currentParticipantsCount >= 100) {
      throw new Error('WORKSPACE_FULL');
    }

    // 3. Revoked Check (Simulate check if custom workspace allows join)
    if (currentWorkspace.visibility === 'Private' && !currentWorkspace.inviteCode) {
      throw new Error('INVITE_REVOKED');
    }

    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      name: userName,
      email: email.toLowerCase(),
      phone: '',
      role: 'Participant',
      status: 'Confirmed', // Automatically confirm registration
      paymentStatus: 'Unpaid',
      checkedIn: false,
      checkInCount: 0,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
      answers: customAnswers
    };

    if (supabase) {
      // RLS protected insert
      const dbData = mapParticipantToDb(newParticipant, workspaceId);
      const { error } = await supabase
        .from('participants')
        .insert(dbData);
      if (error) throw error;
      return newParticipant;
    } else {
      // Offline simulation
      const participantsMap = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);
      const currentList = participantsMap[workspaceId] || [];
      
      // Check if user is already a participant
      const existing = currentList.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (existing) return existing;

      currentList.push(newParticipant);
      participantsMap[workspaceId] = currentList;
      setLocalData('participants', participantsMap);
      return newParticipant;
    }
  }

  static async createWorkspace(ws: Workspace, creatorEmail: string, creatorName: string): Promise<Workspace> {
    const supabase = await getSupabaseClient();
    
    const ownerParticipant: Participant = {
      id: `part-owner-${Date.now()}`,
      name: creatorName,
      email: creatorEmail.toLowerCase(),
      phone: '',
      role: 'Owner',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      checkedIn: false,
      checkInCount: 0,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(creatorName)}`,
    };

    if (supabase) {
      const dbWs = mapWorkspaceToDb(ws);
      const { error: wsErr } = await supabase.from('workspaces').insert(dbWs);
      if (wsErr) throw wsErr;

      const dbPart = mapParticipantToDb(ownerParticipant, ws.id);
      const { error: partErr } = await supabase.from('participants').insert(dbPart);
      if (partErr) throw partErr;

      // Seed a welcome announcement
      const dbAnn = {
        id: `ann-${Date.now()}`,
        workspace_id: ws.id,
        title: `Welcome to ${ws.name}`,
        content: `Workspace successfully initialized by ${creatorName}.`,
        category: 'General',
        posted_by: creatorName
      };
      await supabase.from('announcements').insert(dbAnn);

      return ws;
    } else {
      // Offline emulation
      const wsList = getLocalData<Workspace[]>('workspaces', INITIAL_WORKSPACES);
      wsList.unshift(ws);
      setLocalData('workspaces', wsList);

      const participantsMap = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);
      participantsMap[ws.id] = [ownerParticipant];
      setLocalData('participants', participantsMap);

      const announcementsMap = getLocalData<Record<string, Announcement[]>>('announcements', INITIAL_ANNOUNCEMENTS);
      announcementsMap[ws.id] = [
        {
          id: `ann-${Date.now()}`,
          title: `Welcome to ${ws.name}`,
          content: `Workspace successfully initialized by ${creatorName}.`,
          timestamp: new Date().toLocaleTimeString(),
          category: 'General',
          postedBy: 'System'
        }
      ];
      setLocalData('announcements', announcementsMap);

      return ws;
    }
  }

  static async fetchWorkspaceDetails(workspaceId: string): Promise<{
    participants: Participant[];
    announcements: Announcement[];
    chats: ChatMessage[];
    checklists: ChecklistItem[];
    gallery: GalleryPhoto[];
  }> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      // Run concurrent requests to speed up
      const [partsRes, annsRes, chatsRes, chksRes, galRes] = await Promise.all([
        supabase.from('participants').select('*').eq('workspace_id', workspaceId),
        supabase.from('announcements').select('*').eq('workspace_id', workspaceId).order('timestamp', { ascending: false }),
        supabase.from('chat_messages').select('*').eq('workspace_id', workspaceId).order('timestamp', { ascending: true }),
        supabase.from('checklist_items').select('*').eq('workspace_id', workspaceId),
        supabase.from('gallery_photos').select('*').eq('workspace_id', workspaceId).order('timestamp', { ascending: false })
      ]);

      return {
        participants: (partsRes.data || []).map(mapDbParticipant),
        announcements: (annsRes.data || []).map(db => ({
          id: db.id,
          title: db.title,
          content: db.content,
          timestamp: new Date(db.timestamp).toLocaleTimeString(),
          category: (db.category || 'General') as any,
          postedBy: db.posted_by
        })),
        chats: (chatsRes.data || []).map(db => ({
          id: db.id,
          senderId: db.sender_id,
          senderName: db.sender_name,
          senderRole: db.sender_role as any,
          avatarUrl: db.avatar_url,
          content: db.content || '',
          type: (db.type || 'text') as any,
          timestamp: new Date(db.timestamp).toLocaleTimeString(),
          isPinned: !!db.is_pinned,
          mediaUrl: db.media_url,
          mediaType: db.media_type as any
        })),
        checklists: (chksRes.data || []).map(db => ({
          id: db.id,
          task: db.task,
          isCompleted: !!db.is_completed,
          roleType: (db.role_type || 'participant') as any
        })),
        gallery: (galRes.data || []).map(db => ({
          id: db.id,
          url: db.url,
          caption: db.caption || '',
          uploadedBy: db.uploaded_by,
          timestamp: new Date(db.timestamp).toLocaleDateString()
        }))
      };
    } else {
      // Offline emulation
      const participantsMap = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);
      const announcementsMap = getLocalData<Record<string, Announcement[]>>('announcements', INITIAL_ANNOUNCEMENTS);
      const chatMap = getLocalData<Record<string, ChatMessage[]>>('chats', INITIAL_CHAT_MESSAGES);
      const checklistMap = getLocalData<Record<string, ChecklistItem[]>>('checklists', INITIAL_CHECKLISTS);
      const galleryMap = getLocalData<Record<string, GalleryPhoto[]>>('gallery', INITIAL_GALLERY);

      return {
        participants: participantsMap[workspaceId] || [],
        announcements: announcementsMap[workspaceId] || [],
        chats: chatMap[workspaceId] || [],
        checklists: checklistMap[workspaceId] || [],
        gallery: galleryMap[workspaceId] || []
      };
    }
  }

  // ----------------------------------------
  // MUTATION SYNCERS (Realtime updates + offline backup)
  // ----------------------------------------
  
  static async addChatMessage(workspaceId: string, msg: ChatMessage): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('chat_messages').insert({
        id: msg.id,
        workspace_id: workspaceId,
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        sender_role: msg.senderRole,
        avatar_url: msg.avatarUrl,
        content: msg.content,
        type: msg.type,
        media_url: msg.mediaUrl,
        media_type: msg.mediaType
      });
    } else {
      const chats = getLocalData<Record<string, ChatMessage[]>>('chats', INITIAL_CHAT_MESSAGES);
      chats[workspaceId] = [...(chats[workspaceId] || []), msg];
      setLocalData('chats', chats);
    }
  }

  static async toggleChecklistItem(workspaceId: string, itemId: string, isCompleted: boolean): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('checklist_items').update({ is_completed: isCompleted }).eq('id', itemId);
    } else {
      const checklists = getLocalData<Record<string, ChecklistItem[]>>('checklists', INITIAL_CHECKLISTS);
      checklists[workspaceId] = (checklists[workspaceId] || []).map(it => 
        it.id === itemId ? { ...it, isCompleted } : it
      );
      setLocalData('checklists', checklists);
    }
  }

  static async addGalleryPhoto(workspaceId: string, photo: GalleryPhoto): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('gallery_photos').insert({
        id: photo.id,
        workspace_id: workspaceId,
        url: photo.url,
        caption: photo.caption,
        uploaded_by: photo.uploadedBy
      });
    } else {
      const gallery = getLocalData<Record<string, GalleryPhoto[]>>('gallery', INITIAL_GALLERY);
      gallery[workspaceId] = [photo, ...(gallery[workspaceId] || [])];
      setLocalData('gallery', gallery);
    }
  }

  static async addAnnouncement(workspaceId: string, ann: Announcement): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('announcements').insert({
        id: ann.id,
        workspace_id: workspaceId,
        title: ann.title,
        content: ann.content,
        category: ann.category,
        posted_by: ann.postedBy
      });
    } else {
      const announcements = getLocalData<Record<string, Announcement[]>>('announcements', INITIAL_ANNOUNCEMENTS);
      announcements[workspaceId] = [ann, ...(announcements[workspaceId] || [])];
      setLocalData('announcements', announcements);
    }
  }

  static async updateParticipantPayment(workspaceId: string, participantId: string, screenshotUrl: string, status: 'Pending Verification' | 'Paid'): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('participants').update({
        payment_screenshot: screenshotUrl,
        payment_status: status
      }).eq('id', participantId);
    } else {
      const participants = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);
      participants[workspaceId] = (participants[workspaceId] || []).map(p => 
        p.id === participantId ? { ...p, paymentScreenshot: screenshotUrl, paymentStatus: status } : p
      );
      setLocalData('participants', participants);
    }
  }

  static async updateParticipantStatus(
    workspaceId: string,
    participantId: string,
    status: 'Pending' | 'Confirmed' | 'Rejected',
    paymentStatus: 'Unpaid' | 'Pending Verification' | 'Paid',
    checkedIn: boolean
  ): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('participants').update({
        status,
        payment_status: paymentStatus,
        checked_in: checkedIn,
        check_in_count: checkedIn ? 1 : 0
      }).eq('id', participantId);
    } else {
      const participants = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);
      participants[workspaceId] = (participants[workspaceId] || []).map(p => 
        p.id === participantId ? { ...p, status, paymentStatus, checkedIn, checkInCount: checkedIn ? 1 : 0 } : p
      );
      setLocalData('participants', participants);
    }
  }

  static async addSOSAlert(workspaceId: string, alert: SOSAlert): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('sos_alerts').insert({
        id: alert.id,
        workspace_id: workspaceId,
        sender_name: alert.senderName,
        sender_email: alert.senderEmail,
        coordinates: alert.coordinates,
        status: alert.status
      });
    } else {
      const sos = getLocalData<Record<string, SOSAlert[]>>('sos', {});
      sos[workspaceId] = [alert, ...(sos[workspaceId] || [])];
      setLocalData('sos', sos);
    }
  }

  static async updateParticipantAnswers(workspaceId: string, participantId: string, answers: Record<string, string | string[]>): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('participants').update({
        answers,
        status: 'Pending'
      }).eq('id', participantId);
    } else {
      const participants = getLocalData<Record<string, Participant[]>>('participants', INITIAL_PARTICIPANTS);
      participants[workspaceId] = (participants[workspaceId] || []).map(p => 
        p.id === participantId ? { ...p, answers, status: 'Pending' } : p
      );
      setLocalData('participants', participants);
    }
  }

  static async updateWorkspaceModules(workspaceId: string, modules: WorkspaceModules): Promise<void> {
    const supabase = await getSupabaseClient();
    if (supabase) {
      await supabase.from('workspaces').update({
        modules
      }).eq('id', workspaceId);
    } else {
      const workspaces = getLocalData<Workspace[]>('workspaces', INITIAL_WORKSPACES);
      const idx = workspaces.findIndex(w => w.id === workspaceId);
      if (idx !== -1) {
        workspaces[idx].modules = modules;
        setLocalData('workspaces', workspaces);
      }
    }
  }
}
