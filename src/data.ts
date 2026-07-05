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
} from './types';

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-hackathon',
    name: 'Decentralized SaaS Hackathon 2026',
    description: 'Build premium, production-ready modules on top of modular web frameworks. 48 hours of pure building, mentoring, and venture funding opportunities with $150K in cash prizes.',
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    category: 'Hackathon',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    visibility: 'Public',
    inviteCode: 'HACK26',
    inviteLink: 'https://workspaceos.io/join/HACK26',
    upiId: 'workspaceos@ybl',
    upiQrCode: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=300&q=80', // A simulated QR Code visual
    upiInstructions: 'Please scan the QR code above or pay directly to the UPI ID: workspaceos@ybl. Enter the exact amount of $49 (₹4,000 INR) and upload the payment screenshot below along with the transaction reference ID.',
    modules: {
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
      liveLocation: true,
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
    questions: [
      {
        id: 'q-github',
        label: 'GitHub Username',
        type: 'Short Text',
        required: true,
        description: 'Provide your GitHub handle to access workspace templates.',
      },
      {
        id: 'q-role',
        label: 'Primary Role / Skillset',
        type: 'Dropdown',
        required: true,
        options: ['Frontend Engineer', 'Backend Engineer', 'Product Designer', 'Mobile Engineer', 'AI/ML Engineer'],
      },
      {
        id: 'q-experience',
        label: 'Years of Experience',
        type: 'Number',
        required: true,
      },
      {
        id: 'q-diet',
        label: 'Dietary Restrictions',
        type: 'Radio',
        required: false,
        options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'],
      },
      {
        id: 'q-resume',
        label: 'Upload Resume/Portfolio',
        type: 'File Upload',
        required: false,
        description: 'PDF or cloud storage links acceptable.',
      }
    ],
  },
  {
    id: 'ws-retreat',
    name: 'Executive Leadership Offsite - Bali',
    description: 'Annual strategic planning retreat for senior leadership and board members at Ubud Oasis Resort. High privacy, wellness integration, and long-range product roadmap reviews.',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    category: 'Corporate Event',
    startDate: '2026-08-15',
    endDate: '2026-08-20',
    visibility: 'Private',
    inviteCode: 'BALI26',
    inviteLink: 'https://workspaceos.io/join/BALI26',
    upiId: 'executiveos@icici',
    upiInstructions: 'Company fully sponsors all invitees. External consultants and guest speakers, please transfer $299 or enter sponsored credit token code.',
    modules: {
      registration: true,
      participants: true,
      payments: false, // Sponsored, payment module hidden for standard members!
      qrSmartPass: true,
      attendance: true,
      qrScanner: true,
      announcements: true,
      schedule: true,
      gallery: true,
      documents: true,
      chat: true,
      sos: true,
      liveLocation: true,
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
    questions: [
      {
        id: 'q-flight',
        label: 'Flight Arrival Details',
        type: 'Paragraph',
        required: true,
        description: 'Specify flight number, arrival time, and airport (DPS). We will coordinate airport pick-up.',
      },
      {
        id: 'q-accom',
        label: 'Villa Preference',
        type: 'Dropdown',
        required: true,
        options: ['River-facing Suite', 'Forest Canopy Villa', 'Private Pool Villa'],
      }
    ],
  }
];

export const INITIAL_PARTICIPANTS: Record<string, Participant[]> = {
  'ws-hackathon': [
    {
      id: 'part-owner',
      name: 'Sarah Jenkins',
      email: 'sarah.j@workspaceos.io',
      phone: '+1 (555) 019-2834',
      role: 'Owner',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      checkedIn: true,
      checkInCount: 1,
      lastCheckIn: '2026-07-10T08:30:00Z',
    },
    {
      id: 'part-lucas',
      name: 'Lucas Chen',
      email: 'lucas.chen@gmail.com',
      phone: '+1 (555) 022-4412',
      role: 'Participant',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      checkedIn: true,
      checkInCount: 1,
      lastCheckIn: '2026-07-10T09:15:00Z',
    },
    {
      id: 'part-elena',
      name: 'Elena Rostova',
      email: 'elena.rostova@techcorp.io',
      phone: '+44 20 7946 0912',
      role: 'Participant',
      status: 'Pending',
      paymentStatus: 'Pending Verification',
      paymentScreenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=600&q=80',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      checkedIn: false,
      checkInCount: 0,
    },
    {
      id: 'part-marcus',
      name: 'Marcus Brody',
      email: 'marcus.brody@designstudio.co',
      phone: '+1 (555) 902-1209',
      role: 'Coordinator',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      checkedIn: false,
      checkInCount: 0,
    },
    {
      id: 'part-vol1',
      name: 'Devon Carter',
      email: 'devon.c@volunteer.org',
      phone: '+1 (555) 304-9021',
      role: 'Volunteer',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      checkedIn: true,
      checkInCount: 2,
      lastCheckIn: '2026-07-10T08:00:00Z',
    },
    {
      id: 'part-unpaid',
      name: 'Ananya Sharma',
      email: 'ananya.sh@codeforge.in',
      phone: '+91 98765 43210',
      role: 'Participant',
      status: 'Pending',
      paymentStatus: 'Unpaid',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      checkedIn: false,
      checkInCount: 0,
    },
  ],
  'ws-retreat': [
    {
      id: 'part-owner',
      name: 'Sarah Jenkins',
      email: 'sarah.j@workspaceos.io',
      phone: '+1 (555) 019-2834',
      role: 'Owner',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      checkedIn: true,
      checkInCount: 1,
    },
    {
      id: 'part-cfo',
      name: 'William Sterling',
      email: 'sterling.w@workspaceos.io',
      phone: '+1 (555) 123-4567',
      role: 'Organizer',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      checkedIn: true,
      checkInCount: 1,
    }
  ],
};

export const INITIAL_ANNOUNCEMENTS: Record<string, Announcement[]> = {
  'ws-hackathon': [
    {
      id: 'ann-1',
      title: '🚨 Venue doors open + API keys published!',
      content: 'Welcome builders! The primary venue doors (3rd floor) are now officially unlocked. You can pick up your dynamic NFC smart badges at the registration kiosk. We have also pushed the Gemini AI Starter template links directly to the Documents tab. Let the building begin!',
      timestamp: '2026-07-10T08:00:00Z',
      category: 'Important',
      postedBy: 'Sarah Jenkins',
    },
    {
      id: 'ann-2',
      title: '🍽️ Lunch is served: Gourmet Poke Bowls & Vegan Tacos',
      content: 'Head to the main cafeteria wing for buffet lunch. Dietary tags (Gluten-Free, Halal, Vegan) are color-marked. Please ensure you carry your QR smart pass on your phone for verification.',
      timestamp: '2026-07-10T12:30:00Z',
      category: 'General',
      postedBy: 'Marcus Brody',
    },
  ],
  'ws-retreat': [
    {
      id: 'ann-bali-1',
      title: '🌅 Strategic Session tomorrow moves to the Ridge Pavilion',
      content: 'To maximize creative alignment, we are moving our 9:00 AM long-range visioning session outdoors. Dress comfortably. Golf carts depart the main lobby starting at 8:45 AM.',
      timestamp: '2026-08-15T18:00:00Z',
      category: 'Schedule',
      postedBy: 'William Sterling',
    }
  ]
};

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'ws-hackathon': [
    {
      id: 'msg-1',
      senderId: 'part-owner',
      senderName: 'Sarah Jenkins',
      senderRole: 'Owner',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      content: 'Hey everyone! Welcome to WorkspaceOS group chat! Use this to coordinate teammates, ask technical questions, or find your lost hardware.',
      type: 'text',
      timestamp: '2026-07-10T08:15:00Z',
    },
    {
      id: 'msg-2',
      senderId: 'part-lucas',
      senderName: 'Lucas Chen',
      senderRole: 'Participant',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      content: 'Incredible setup here! Anyone looking for a frontend developer fluent in Tailwind CSS and React state orchestration? Pushing for a smart dashboard idea.',
      type: 'text',
      timestamp: '2026-07-10T08:45:00Z',
    },
    {
      id: 'msg-3',
      senderId: 'part-vol1',
      senderName: 'Devon Carter',
      senderRole: 'Volunteer',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      content: 'Reminder to all participants: Make sure to fill in your food preferences under the Registration tab if you have not done so already!',
      type: 'text',
      timestamp: '2026-07-10T09:30:00Z',
      isPinned: true,
    }
  ],
  'ws-retreat': [
    {
      id: 'msg-bali-1',
      senderId: 'part-owner',
      senderName: 'Sarah Jenkins',
      senderRole: 'Owner',
      content: 'Welcome to Ubud, team! Take tonight to rest and acclimate. Group dinner starts at 7 PM near the infinity deck.',
      type: 'text',
      timestamp: '2026-08-15T15:00:00Z',
    }
  ]
};

export const INITIAL_CHECKLISTS: Record<string, ChecklistItem[]> = {
  'ws-hackathon': [
    { id: 'chk-1', task: 'Review volunteer duty rosters', isCompleted: true, roleType: 'organizer' },
    { id: 'chk-2', task: 'Calibrate QR smart pass hardware readers', isCompleted: true, roleType: 'organizer' },
    { id: 'chk-3', task: 'Verify incoming Stripe/UPI payment screenshots', isCompleted: false, roleType: 'organizer' },
    { id: 'chk-4', task: 'Audit catering headcounts', isCompleted: false, roleType: 'organizer' },
    { id: 'chk-5', task: 'Prepare demo-day pitch slides and template', isCompleted: false, roleType: 'organizer' },
    // Participant tasks
    { id: 'chk-p1', task: 'Download Smart Pass QR code', isCompleted: true, roleType: 'participant' },
    { id: 'chk-p2', task: 'Upload payment confirmation reference', isCompleted: true, roleType: 'participant' },
    { id: 'chk-p3', task: 'Find a team of 3 builders', isCompleted: false, roleType: 'participant' },
    { id: 'chk-p4', task: 'Complete primary milestone review on Github', isCompleted: false, roleType: 'participant' },
  ],
  'ws-retreat': [
    { id: 'chk-r1', task: 'Confirm resort airport transfers', isCompleted: true, roleType: 'organizer' },
    { id: 'chk-r2', task: 'Prepare board slides booklet', isCompleted: false, roleType: 'organizer' },
    { id: 'chk-rp1', task: 'Confirm flight boarding pass upload', isCompleted: true, roleType: 'participant' },
    { id: 'chk-rp2', task: 'Pre-register for the spa alignment session', isCompleted: false, roleType: 'participant' }
  ]
};

export const INITIAL_SCHEDULE: Record<string, ScheduleEvent[]> = {
  'ws-hackathon': [
    {
      id: 'sch-1',
      title: 'Opening Ceremony & Ideation Keynote',
      speaker: 'Sarah Jenkins (Founder & CEO)',
      description: 'Orientation, event rules, and API endpoints walk-through.',
      time: '09:00 - 10:30',
      location: 'Main Auditorium, Level 3',
      date: '2026-07-10',
      type: 'session',
    },
    {
      id: 'sch-2',
      title: 'Lunch Break & Teaming Pitches',
      description: 'Quick informal micro-pitches to form last-minute groups.',
      time: '12:00 - 13:30',
      location: 'Atrium Courtyard',
      date: '2026-07-10',
      type: 'break',
    },
    {
      id: 'sch-3',
      title: 'Gemini 3.5 SDK Hands-on Workshop',
      speaker: 'Alex Rivera (Google Developer Advocate)',
      description: 'Learn rapid prototyping patterns with Gemini models.',
      time: '14:00 - 15:30',
      location: 'Workshop Suite A',
      date: '2026-07-10',
      type: 'session',
    },
    {
      id: 'sch-4',
      title: 'Milestone 1 Pitch Review',
      speaker: 'SaaS Mentorship Board',
      description: 'Mandatory mock pitch review to unlock technical credits.',
      time: '18:00 - 21:00',
      location: 'Venture Office Room',
      date: '2026-07-10',
      type: 'activity',
    },
  ],
  'ws-retreat': [
    {
      id: 'sch-b1',
      title: 'Welcome Circle & Wellness Opening',
      description: 'Sound bath healing, tea ceremony, and setting strategic intentions.',
      time: '16:00 - 18:00',
      location: 'Zen Garden Deck',
      date: '2026-08-15',
      type: 'activity',
    }
  ]
};

export const INITIAL_GALLERY: Record<string, GalleryPhoto[]> = {
  'ws-hackathon': [
    {
      id: 'gal-1',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      caption: 'Main entrance and welcome booth getting ready!',
      uploadedBy: 'Sarah Jenkins',
      timestamp: '2026-07-10T07:45:00Z',
    },
    {
      id: 'gal-2',
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
      caption: 'Intense team brainstorming session starting.',
      uploadedBy: 'Marcus Brody',
      timestamp: '2026-07-10T10:15:00Z',
    }
  ],
  'ws-retreat': [
    {
      id: 'gal-b1',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      caption: 'Arrival morning at the Ubud Resort pavilion.',
      uploadedBy: 'William Sterling',
      timestamp: '2026-08-15T11:00:00Z',
    }
  ]
};

export const INITIAL_DOCUMENTS: Record<string, DocumentFile[]> = {
  'ws-hackathon': [
    { id: 'doc-1', title: 'WorkspaceOS Boilerplate Pack', size: '12.4 MB', url: '#', category: 'Guide' },
    { id: 'doc-2', title: 'Rules of Engagement & Criteria', size: '1.2 MB', url: '#', category: 'Legal' },
    { id: 'doc-3', title: '3D Building Layout Map', size: '5.6 MB', url: '#', category: 'Map' },
  ],
  'ws-retreat': [
    { id: 'doc-r1', title: 'Bali 5-Year Master Horizon Plan', size: '22.8 MB', url: '#', category: 'Guide' }
  ]
};

export const INITIAL_MEMBER_LOCATIONS: Record<string, LiveMemberLocation[]> = {
  'ws-hackathon': [
    {
      id: 'loc-sarah',
      name: 'Sarah Jenkins',
      role: 'Owner',
      lat: 37.7749,
      lng: -122.4194,
      lastUpdated: '10 seconds ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 'loc-lucas',
      name: 'Lucas Chen',
      role: 'Participant',
      lat: 37.7752,
      lng: -122.4188,
      lastUpdated: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 'loc-devon',
      name: 'Devon Carter',
      role: 'Volunteer',
      lat: 37.7745,
      lng: -122.4201,
      lastUpdated: '3 mins ago',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
    }
  ],
  'ws-retreat': [
    {
      id: 'loc-sterling',
      name: 'William Sterling',
      role: 'Organizer',
      lat: -8.5069,
      lng: 115.2625,
      lastUpdated: '2 mins ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    }
  ]
};
