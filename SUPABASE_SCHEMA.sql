-- WorkspaceOS Production Database Setup Script for Supabase
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- This script provisions the required tables, keys, index structures, and Row Level Security (RLS) policies.

-- Disable RLS momentarily to run structural scripts or handle migration
-- Standard tables:

-- 1. WORKSPACES
CREATE TABLE IF NOT EXISTS public.workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    category TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    visibility TEXT DEFAULT 'Public',
    invite_code TEXT UNIQUE,
    invite_link TEXT,
    upi_id TEXT,
    upi_qr_code TEXT,
    upi_instructions TEXT,
    modules JSONB DEFAULT '{"registration": true, "payments": true, "qrSmartPass": true, "attendance": true, "chat": true, "gallery": true, "announcements": true, "sos": true, "liveLocation": true, "checklists": true, "schedule": true, "documents": true}'::jsonb,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.participants (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'Participant',
    status TEXT DEFAULT 'Pending',
    payment_status TEXT DEFAULT 'Unpaid',
    payment_screenshot TEXT,
    checked_in BOOLEAN DEFAULT FALSE,
    check_in_count INTEGER DEFAULT 0,
    last_check_in TEXT,
    avatar_url TEXT,
    answers JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES public.workspaces(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    avatar_url TEXT,
    content TEXT,
    type TEXT DEFAULT 'text',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT FALSE,
    media_url TEXT,
    media_type TEXT
);

-- 4. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category TEXT DEFAULT 'General',
    posted_by TEXT NOT NULL
);

-- 5. GALLERY PHOTOS
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES public.workspaces(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    uploaded_by TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CHECKLIST ITEMS
CREATE TABLE IF NOT EXISTS public.checklist_items (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES public.workspaces(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    role_type TEXT DEFAULT 'participant'
);

-- 7. SCHEDULE EVENTS
CREATE TABLE IF NOT EXISTS public.schedule_events (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    speaker TEXT,
    description TEXT,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT DEFAULT 'session'
);

-- 8. SOS ALERTS
CREATE TABLE IF NOT EXISTS public.sos_alerts (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES public.workspaces(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    coordinates JSONB,
    status TEXT DEFAULT 'Active'
);

-- Enable Row Level Security (RLS) on all core tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SAAS MULTI-TENANCY
-- ========================================================

-- A. WORKSPACES POLICIES
-- 1. Anyone is allowed to insert (create) a workspace
CREATE POLICY "Allow workspace creation" ON public.workspaces
    FOR INSERT WITH CHECK (true);

-- 2. Members (Owners, Organizers, Volunteers, Participants) can select workspace details
CREATE POLICY "Allow workspace read access to members" ON public.workspaces
    FOR SELECT USING (
        id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
        OR visibility = 'Public'
    );

-- 3. Only Owners or Organizers can modify/delete workspace definitions
CREATE POLICY "Allow workspace management to administrators" ON public.workspaces
    FOR ALL USING (
        id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email') AND role IN ('Owner', 'Organizer')
        )
    );

-- B. PARTICIPANTS POLICIES
-- 1. Anyone is allowed to register as a participant in a workspace
CREATE POLICY "Allow participant self-registration" ON public.participants
    FOR INSERT WITH CHECK (true);

-- 2. Any verified member of a workspace can view the participant roster
CREATE POLICY "Allow participant roster access to workspace members" ON public.participants
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );

-- 3. Owners/Organizers can update/delete participant details. Standard users can update their own profile.
CREATE POLICY "Allow profile and roster management" ON public.participants
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email') AND role IN ('Owner', 'Organizer')
        )
        OR LOWER(email) = LOWER(auth.jwt() ->> 'email')
    );

-- C. OTHER SUB-RESOURCES (Chat, Announcements, Checklists, SOS, Schedule, Gallery)
-- They inherit RLS protection by checking if the user is an active participant in the associated workspace_id

CREATE POLICY "Allow member access to chats" ON public.chat_messages
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Allow member access to announcements" ON public.announcements
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Allow member access to checklists" ON public.checklist_items
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Allow member access to schedule" ON public.schedule_events
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Allow member access to gallery" ON public.gallery_photos
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Allow member access to SOS alerts" ON public.sos_alerts
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM public.participants
            WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
        )
    );


-- Seed initial default workspaces for first launch:
INSERT INTO public.workspaces (id, name, description, cover_image, category, start_date, end_date, visibility, invite_code, invite_link, upi_id, upi_instructions, modules, questions)
VALUES (
    'ws-hackathon',
    'Decentralized SaaS Hackathon 2026',
    'Build premium, production-ready modules on top of modular web frameworks. 48 hours of pure building, mentoring, and venture funding opportunities.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    'Hackathon',
    '2026-07-10',
    '2026-07-12',
    'Public',
    'HACK26',
    'https://workspaceos.io/join/HACK26',
    'workspaceos@ybl',
    'Please scan the QR code above or pay directly to the UPI ID: workspaceos@ybl. Enter the exact amount of $49 (₹4,000 INR) and upload the payment screenshot below.',
    '{"registration": true, "payments": true, "qrSmartPass": true, "attendance": true, "chat": true, "gallery": true, "announcements": true, "sos": true, "liveLocation": true, "checklists": true, "schedule": true, "documents": true}'::jsonb,
    '[{"id": "q-github", "label": "GitHub Username", "type": "Short Text", "required": true, "description": "Provide your GitHub handle"}, {"id": "q-role", "label": "Primary Skillset", "type": "Dropdown", "required": true, "options": ["Frontend Engineer", "Backend Engineer", "Product Designer"]}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.participants (id, workspace_id, name, email, phone, role, status, payment_status, checked_in, check_in_count)
VALUES 
('part-owner', 'ws-hackathon', 'Sarah Jenkins', 'sarah.j@workspaceos.io', '+1 (555) 019-2834', 'Owner', 'Confirmed', 'Paid', true, 1),
('part-lucas', 'ws-hackathon', 'Lucas Chen', 'lucas.chen@gmail.com', '+1 (555) 022-4412', 'Participant', 'Confirmed', 'Paid', true, 1),
('part-elena', 'ws-hackathon', 'Elena Rostova', 'elena.rostova@techcorp.io', '+44 20 7946 0912', 'Participant', 'Pending', 'Pending Verification', false, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chat_messages (id, workspace_id, sender_id, sender_name, sender_role, content, type)
VALUES 
('msg-1', 'ws-hackathon', 'part-owner', 'Sarah Jenkins', 'Owner', 'Hey everyone! Welcome to WorkspaceOS group chat!', 'text'),
('msg-2', 'ws-hackathon', 'part-lucas', 'Lucas Chen', 'Participant', 'Incredible setup here! Anyone looking for a frontend developer?', 'text')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.announcements (id, workspace_id, title, content, category, posted_by)
VALUES 
('ann-1', 'ws-hackathon', '🚨 Venue doors open + API keys published!', 'Welcome builders! The primary venue doors (3rd floor) are now officially unlocked. You can pick up your dynamic NFC smart badges.', 'Important', 'Sarah Jenkins')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.checklist_items (id, workspace_id, task, is_completed, role_type)
VALUES 
('chk-1', 'ws-hackathon', 'Review volunteer duty rosters', true, 'organizer'),
('chk-2', 'ws-hackathon', 'Calibrate QR smart pass hardware readers', true, 'organizer'),
('chk-p1', 'ws-hackathon', 'Download Smart Pass QR code', true, 'participant')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.schedule_events (id, workspace_id, title, speaker, description, time, location, date, type)
VALUES 
('sch-1', 'ws-hackathon', 'Opening Ceremony & Ideation Keynote', 'Sarah Jenkins', 'Orientation, event rules, and API endpoints walk-through.', '09:00 - 10:30', 'Main Auditorium, Level 3', '2026-07-10', 'session')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gallery_photos (id, workspace_id, url, caption, uploaded_by)
VALUES 
('gal-1', 'ws-hackathon', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', 'Main entrance and welcome booth getting ready!', 'Sarah Jenkins')
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime for standard tables to enable collaborative capabilities!
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.participants;
alter publication supabase_realtime add table public.announcements;
alter publication supabase_realtime add table public.sos_alerts;
alter publication supabase_realtime add table public.gallery_photos;
alter publication supabase_realtime add table public.checklist_items;
