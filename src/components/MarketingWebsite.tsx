import React, { useState } from 'react';
import {
  Layers,
  Users,
  Briefcase,
  Sparkles,
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
  ChevronRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Search,
  BadgeAlert,
  Send,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  HeartHandshake,
  DollarSign
} from 'lucide-react';

interface MarketingWebsiteProps {
  marketingPage: 'home' | 'features' | 'solutions' | 'pricing' | 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'login' | 'signup';
  setMarketingPage: (page: any) => void;
  authTab: 'login' | 'signup';
  setAuthTab: (tab: 'login' | 'signup') => void;
  authMethod: 'password' | 'magic';
  setAuthMethod: (method: 'password' | 'magic') => void;
  authName: string;
  setAuthName: (name: string) => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPassword: string;
  setAuthPassword: (password: string) => void;
  authMagicSent: boolean;
  setAuthMagicSent: (sent: boolean) => void;
  onLogin: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  joinCode: string;
  setJoinCode: (code: string) => void;
  onJoinCodeSubmit: (e: React.FormEvent) => void;
  isAuthSubmitting?: boolean;
  isGoogleLoading?: boolean;
  showGoogleSignIn?: boolean;
}

export default function MarketingWebsite({
  marketingPage,
  setMarketingPage,
  authTab,
  setAuthTab,
  authMethod,
  setAuthMethod,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authMagicSent,
  setAuthMagicSent,
  onLogin,
  onSignUp,
  onGoogleLogin,
  joinCode,
  setJoinCode,
  onJoinCodeSubmit,
  isAuthSubmitting = false,
  isGoogleLoading = false,
  showGoogleSignIn = false,
}: MarketingWebsiteProps) {

  // Contact Page States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactDept, setContactDept] = useState('Sales & Enterprise');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Pricing Interval State
  const [pricingInterval, setPricingInterval] = useState<'monthly' | 'annually'>('annually');

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 4000);
  };

  return (
    <div className="animate-fade-in text-slate-100 min-h-screen">
      
      {/* ---------------------------------------------------- */}
      {/* 1. HOME PAGE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'home' && (
        <div className="space-y-24 py-12 md:py-20 overflow-hidden">
          
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Value Proposition Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-4 py-1.5 rounded-full font-semibold shadow-sm shadow-indigo-500/5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Next-Gen Event OS for High-Scale Operations
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] font-sans">
                  Everything your event needs. <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">One powerful platform.</span>
                </h1>
                
                <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-[500px]">
                  WorkspaceOS is the premium all-in-one platform for planning, managing and running events from start to finish. Loved by colleges, NGOs, conference hosts, and trek teams.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => {
                    setAuthTab('signup');
                    setMarketingPage('signup');
                  }}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Plus className="w-5 h-5" /> Create Workspace
                </button>

                <button
                  onClick={() => {
                    setAuthTab('login');
                    setMarketingPage('login');
                  }}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-800 transition-all hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <UserCheck className="w-5 h-5 text-indigo-400" /> Join Workspace
                </button>
              </div>

              {/* Quick Workspace Finder (Inline Join Workspace) */}
              <div className="pt-8 max-w-md border-t border-slate-800/80">
                <form onSubmit={onJoinCodeSubmit} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Have an access code (e.g. HACK26)?"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="flex-grow px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono uppercase tracking-widest text-center shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    Quick Join
                  </button>
                </form>
              </div>
            </div>

            {/* Beautiful Dashboard Mockup & Overlapping Phone Mockup from the Screenshot */}
            <div className="lg:col-span-5 relative flex items-center justify-center mt-12 lg:mt-0 w-full max-w-lg mx-auto lg:max-w-none h-[300px] xs:h-[340px] sm:h-[400px] md:h-[450px] lg:h-[420px] xl:h-[460px]">
              
              {/* Inner wrapper that applies high-fidelity responsive scale so all components adapt perfectly across all screen sizes */}
              <div className="relative w-full h-full flex items-center justify-center scale-[0.62] xs:scale-[0.7] sm:scale-[0.82] md:scale-95 lg:scale-[0.8] xl:scale-100 transition-all duration-300">
                
                {/* Style tag injection for subtle, professional flat floating animations */}
                <style>{`
                  @keyframes float-dashboard {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                  }
                  @keyframes float-phone {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                  }
                  .animate-float-dashboard {
                    animation: float-dashboard 6s ease-in-out infinite;
                  }
                  .animate-float-phone {
                    animation: float-phone 5s ease-in-out infinite;
                  }
                `}</style>

                <div className="absolute -top-12 -left-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Main Console Card Layout matching the screenshot */}
                <div className="w-[560px] h-[400px] bg-[#070b15]/95 border border-slate-800/80 rounded-3xl p-5 space-y-4 absolute top-0 left-0 z-10 animate-float-dashboard shadow-[0_30px_100px_rgba(0,0,0,0.95)] hover:shadow-indigo-500/5 transition-all duration-300">
                  
                  {/* Top Row Grid */}
                  <div className="grid grid-cols-12 gap-4">
                    
                    {/* Left Column: Gate Velocity Card (7 cols) */}
                    <div className="col-span-7 bg-[#0b1122]/90 border border-slate-800/70 rounded-2xl p-4 flex flex-col justify-between h-[190px] text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider font-sans uppercase">GATE VELOCITY</span>
                        <span className="text-[10px] font-black text-[#10b981] font-mono tracking-tight">+284/min</span>
                      </div>
                      
                      {/* Custom Bar Chart from the screenshot */}
                      <div className="flex items-end justify-between h-20 px-1 pt-3 pb-1">
                        <div className="w-2.5 bg-indigo-500/30 rounded-t h-[25%] transition-all" />
                        <div className="w-2.5 bg-indigo-500/40 rounded-t h-[40%] transition-all" />
                        <div className="w-2.5 bg-indigo-500/50 rounded-t h-[65%] transition-all" />
                        <div className="w-2.5 bg-indigo-500/60 rounded-t h-[52%] transition-all" />
                        <div className="w-2.5 bg-indigo-500/80 rounded-t h-[82%] transition-all" />
                        <div className="w-2.5 bg-[#10b981] rounded-t h-[95%] shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all" />
                      </div>
                      
                      {/* Bar Labels */}
                      <div className="flex justify-between text-[9px] text-slate-500 font-sans px-0.5">
                        <span>8 AM</span>
                        <span>10 AM</span>
                        <span>12 PM</span>
                        <span>2 PM</span>
                        <span>4 PM</span>
                        <span>6 PM</span>
                      </div>
                      
                      {/* Footer Row */}
                      <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-800/60 pt-2 mt-1">
                        <span>Peak Ingress</span>
                        <span className="text-white font-mono font-bold">12:05 PM</span>
                      </div>
                    </div>

                    {/* Right Column (5 cols) */}
                    <div className="col-span-5 flex flex-col justify-between h-[190px]">
                      
                      {/* Console tab row */}
                      <div className="bg-[#0b1122]/90 border border-slate-800/70 rounded-xl px-3 py-2 flex justify-between items-center h-[45px]">
                        <span className="text-[9px] text-[#38bdf8] font-mono">&gt; workspace_console.sh</span>
                        <span className="text-[8px] font-bold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase">
                          <span className="w-1 h-1 bg-[#10b981] rounded-full animate-ping" />
                          LIVE
                        </span>
                      </div>

                      {/* Sub-cards side-by-side */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Revenue Card */}
                        <div className="bg-[#0b1122]/90 border border-slate-800/70 rounded-xl p-3 flex flex-col justify-between h-[130px] text-left">
                          <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">REVENUE ANALYTICS</span>
                          <div className="mt-2 space-y-0.5">
                            <div className="text-xs font-black text-white leading-none">₹8,45,200</div>
                            <div className="text-[8px] font-bold text-[#10b981] leading-none">+18.4%</div>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-[#070b15] h-1.5 rounded-full overflow-hidden mt-2">
                            <div className="bg-[#6366f1] h-full w-[82%]" />
                          </div>
                        </div>

                        {/* Gate Rate Card */}
                        <div className="bg-[#0b1122]/90 border border-slate-800/70 rounded-xl p-3 flex flex-col justify-between h-[130px] text-left">
                          <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">GATE RATE</span>
                          <div className="text-base font-black text-[#10b981] mt-2">94.6%</div>
                          <span className="text-[8px] text-slate-500">vs last event</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Bottom Row: Upcoming Agenda */}
                  <div className="bg-[#0b1122]/90 border border-slate-800/70 rounded-2xl p-4 flex flex-col justify-between h-[145px] text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">UPCOMING AGENDA</span>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-[#070b15]/60 border border-slate-800/40 rounded-xl p-2.5 px-3.5 text-[11px] text-white">
                        <span className="font-medium">Opening Keynote & Pitching</span>
                        <span className="text-slate-400 font-mono text-[10px]">10:00 AM</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#070b15]/60 border border-slate-800/40 rounded-xl p-2.5 px-3.5 text-[11px] text-white">
                        <span className="font-medium">Mentor Match Panel</span>
                        <span className="text-slate-400 font-mono text-[10px]">02:30 PM</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* OVERLAPPING PHONE MOCKUP (Smart Pass Ticket) */}
                <div className="absolute -bottom-6 -right-6 w-[200px] bg-[#030712] border-4 border-slate-800 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.95)] p-3 space-y-3 z-20 border-indigo-500/10 animate-float-phone">
                  {/* Speaker Grill / Notch */}
                  <div className="w-14 h-3 bg-slate-800 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <div className="w-1 h-1 bg-slate-950 rounded-full" />
                  </div>

                  {/* Smart Pass Content */}
                  <div className="space-y-3 bg-indigo-950/20 border border-indigo-500/10 p-3 rounded-2xl text-center shadow-inner">
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">SMART PASS</span>
                    
                    {/* Glowing QR Code */}
                    <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto shadow-lg shadow-indigo-500/15 flex items-center justify-center">
                      <QrCode className="w-full h-full text-slate-950" />
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black text-white leading-tight">Sarah Jenkins</p>
                      <p className="text-[8px] text-indigo-300 font-mono tracking-wider">PASS-2026-X83</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Supported Event Types */}
          <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-800/60">
            <p className="text-xs font-bold text-indigo-400/80 uppercase tracking-widest text-center mb-6">
              SUPPORTED EVENT ARCHITECTURES
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
              {[
                "Hackathons & DevFests",
                "Professional Tech Conferences",
                "Academic Symposia",
                "Corporate Summits & Meets",
                "Trekking & Outdoor Expeditions",
                "NGO Workshops & Campaigns"
              ].map((evType, idx) => (
                <span key={idx} className="text-xs font-bold bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 shadow-sm">
                  {evType}
                </span>
              ))}
            </div>
          </div>

          {/* Home Feature Highlight Grid */}
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Designed for scale</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Packed with Enterprise-Grade Capabilities</h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">Everything you need to plan, register, collect payments, and manage attendees securely in real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/30 transition-all">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Secure Multi-Tenancy</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Row Level Security guarantees strict isolation. Organizers, volunteers, and participants only access permitted resources.
                </p>
              </div>

              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/30 transition-all">
                <div className="w-10 h-10 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Instant QR Smart Passes</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  System triggers secure, offline-scannable gate passes immediately upon payment approval. Zero lines at registration.
                </p>
              </div>

              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/30 transition-all">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Custom Module Toggles</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enable only what you need. Toggled-off features vanish from participant feeds immediately, maintaining zero noise.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setMarketingPage('features')}
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm hover:translate-x-1 transition-all"
              >
                Explore all 17 features <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 3. HOW IT WORKS TIMELINE SECTION */}
          {/* ========================================================== */}
          <div className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/60 space-y-16">
            <div className="text-center space-y-3">
              <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Simplified Lifecycle</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">How WorkspaceOS Works</h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Go from initial concept to a fully published and checked-in event ecosystem in minutes. Follow our streamlined operational flow.
              </p>
            </div>

            {/* Timeline Row Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-500/10 via-indigo-500/40 to-indigo-500/10 -translate-y-12 z-0" />

              {/* Step 1 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 01 • Setup
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">1. Create Workspace</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Define your event scope, categories, timeline, and security parameters instantly using our 8-step creator wizard.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 02 • Customize
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">2. Enable Modules</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Toggle only the modules you need (Payments, Chat, SOS, Photo Gallery). Unrequested options disappear from feeds instantly.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 03 • Invite
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">3. Share Invite Link</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Distribute your unique workspace invite code or dynamic URL. No app store downloads required for attendees.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 04 • Onboard
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">4. Participants Join</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Attendees sign up, fill custom-built form fields (e.g., t-shirt sizes, medical details), and log in securely.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 05 • Transact
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">5. Collect Payments</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Review and verify manual UPI screenshots and transaction IDs in real-time from a secure dashboard control desk.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 06 • Credential
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">6. Generate Smart Pass</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    System instantly compiles offline-scannable QR codes and issues high-fidelity digital event passes to users.
                  </p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 07 • Admission
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">7. Scan QR</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Gate crews scan attendee passes via mobile cameras. The system handles offline validation and blocks double entries.
                  </p>
                </div>
              </div>

              {/* Step 8 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 08 • Coordinate
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">8. Manage Event</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Broadcast critical emergency announcements, synchronize field coordinates, and dispatch real-time emergency SOS alerts.
                  </p>
                </div>
              </div>

              {/* Step 9 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10 hover:border-indigo-500/20 transition-all shadow-xl group">
                <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[10px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Phase 09 • Review
                </div>
                <div className="w-12 h-12 bg-[#0c1425] text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">9. View Analytics</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Track ingress velocity curves, total cash flow logs, and check-in times inside beautiful dashboards.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================== */}
          {/* 4. WHY WORKSPACEOS SECTION */}
          {/* ========================================================== */}
          <div className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/60 space-y-16">
            <div className="text-center space-y-3">
              <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Built Different</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Why Organizers Choose WorkspaceOS</h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Discover the engineering core that replaces chaotic spreadsheets, disconnected chat threads, and manual check-in friction.
              </p>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Feature 1 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 p-8 rounded-3xl md:col-span-8 space-y-4 hover:border-indigo-500/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Strict Row-Level Isolation (Multi-Tenancy)</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  Unlike traditional platforms that co-mingle organizational parameters, WorkspaceOS enforces strict multi-tenant sandboxing. No participant can query secondary database logs, waivers, or payment screenshots belonging to external workspaces. Your metrics remain secure and locked to your committee.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 p-8 rounded-3xl md:col-span-4 space-y-4 hover:border-indigo-500/30 transition-all relative overflow-hidden group">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Reliable Offline Scanning</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gate Passes use cryptographically signed tokens. Check-in crews can securely parse admissions even at high-altitude camp gates with unstable internet networks.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 p-8 rounded-3xl md:col-span-4 space-y-4 hover:border-indigo-500/30 transition-all relative overflow-hidden group">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Adaptive Form Fields</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Design bespoke registration templates instantly. Support short text entries, file-upload uploads for receipts, or t-shirt selectors with automatic sheet summaries.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#0a1122]/40 border border-slate-800 p-8 rounded-3xl md:col-span-8 space-y-4 hover:border-indigo-500/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Dynamic Modular Customization</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  WorkspaceOS evolves with your event scale. Toggle core operations on or off in real-time. Turn off the payment ledger for free hackathons or suppress location coordinates when coordinate tracking is not required. The participant view updates instantly, keeping the user experience completely clutter-free.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. FEATURES PAGE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'features' && (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Workspace Core</span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">The WorkspaceOS Feature Ecosystem</h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Every tool and utility your planning committee, volunteer teams, and event attendees need to stay synchronized in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Registration */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Registration Forms</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visual custom form builder. Support short text, radio button selectors, drop-downs, date pickers, and file uploads.
              </p>
            </div>

            {/* 2. Payments */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">UPI & QR Payments</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                UPI QR uploader and screenshot manual verification system with transaction reference ID lookup and collection stats.
              </p>
            </div>

            {/* 3. Attendance */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Attendance Desk</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Event check-in dashboard to monitor gate speeds, total headcounts, check-in history, and manual enrollment overrides.
              </p>
            </div>

            {/* 4. Smart Pass */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Smart Pass Ticket</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elegant, downloadable digital passes displaying high-definition secure QR tokens, seat allocations, and payment tier markers.
              </p>
            </div>

            {/* 5. QR Check-in */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">QR Check-in Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan passes directly via front/back cameras or simulation selector. Block unpaid passes or already checked-in attendees.
              </p>
            </div>

            {/* 6. Chat */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Workspace Chat</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sleek real-time discussion boards. Support nested thread replies, pins, media uploads, and filter logs.
              </p>
            </div>

            {/* 7. Announcements */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Announcements Board</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Broadcast priority news to participants. Automatically categorizes as Important, Schedule change, or Emergency.
              </p>
            </div>

            {/* 8. Schedule */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Event Schedules</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visual timeline tracker mapping speaking slots, coffee breaks, emergency drills, and live venue directions.
              </p>
            </div>

            {/* 9. Gallery */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Photo Gallery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shared image gallery for attendees and organizers. Upload high-res snaps, add captions, and download event highlights.
              </p>
            </div>

            {/* 10. Documents */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Document Library</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Host official trek itineraries, legal waivers, hackathon criteria templates, or map guides for easy download.
              </p>
            </div>

            {/* 11. Sponsors */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Sponsor Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Feature Platinum, Gold, and Silver corporate partners, track click-through rates, and showcase logos.
              </p>
            </div>

            {/* 12. Volunteer Management */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Volunteer Roster</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coordinate coordinators and check-in teams with specific permissions matrix, task lists, and profiles.
              </p>
            </div>

            {/* 13. SOS Alerts */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">SOS Emergency Desk</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant red emergency alerts dispatch coordinates and metadata directly to organizers for rescue operations.
              </p>
            </div>

            {/* 14. Live Location */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Live Location Mapping</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulate exact coordinate tracking for organizers, transport buses, or trek groups on high-contrast vector maps.
              </p>
            </div>

            {/* 15. AI Assistant */}
            <div className="p-5 bg-[#0e1628] border border-indigo-500/20 rounded-2xl hover:border-indigo-500/50 hover:-translate-y-1 transition-all group duration-300 shadow-lg shadow-indigo-600/5">
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm flex items-center gap-1.5">
                AI Assistant <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">SaaS Plus</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate custom form schemas, detailed multi-day agendas, or announcement templates instantly using the Gemini Engine.
              </p>
            </div>

            {/* 16. Analytics */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Custom Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Graph signups, cash inflows, and hourly check-in speed metrics. Review campaign click rates and volunteer performance.
              </p>
            </div>

            {/* 17. Certificates */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all group duration-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white mb-2 text-sm">Smart Certificates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Design custom templates, auto-fill attendee name tags, and dispatch high-resolution PDF certificates instantly.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. SOLUTIONS PAGE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'solutions' && (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Use Cases</span>
            <h1 className="text-4xl md:text-5xl font-black text-white">Designed for Every Organizational Need</h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Custom-tailored workflows designed to coordinate and manage participants across diverse outdoor, professional, and corporate events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Hackathons */}
            <div className="bg-[#0a1122]/90 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all shadow-xl shadow-black/35 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Hackathons & Buildathons</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify hacker GitHub accounts during custom signups, manage hardware checkout logs, enable real-time mentor coordinate maps, and manage secure judge role-permissions matrices.
              </p>
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest bg-indigo-950/40 w-fit px-3 py-1 rounded-full border border-indigo-500/15">
                Popular with: MLH, Colleges
              </div>
            </div>

            {/* Trips & Treks */}
            <div className="bg-[#0a1122]/90 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all shadow-xl shadow-black/35 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-all" />
              <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Treks & Outdoor Expeditions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintain medical waivers in the Document Library, activate live coordinator GPS dots, configure high-contrast red SOS desks, and keep travelers synchronized offline.
              </p>
              <div className="text-[10px] text-violet-400 font-bold uppercase tracking-widest bg-violet-950/40 w-fit px-3 py-1 rounded-full border border-violet-500/15">
                Popular with: Trek Agencies, NGOs
              </div>
            </div>

            {/* Conferences */}
            <div className="bg-[#0a1122]/90 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all shadow-xl shadow-black/35 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Conferences & Summits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Design custom Platinum/Gold sponsor slides, coordinate multiple volunteer scanning desks, deploy check-in speeds metrics, and dispatch automated certificates post-keynote.
              </p>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/40 w-fit px-3 py-1 rounded-full border border-emerald-500/15">
                Popular with: Tech Hubs, Corporates
              </div>
            </div>

            {/* Meetups */}
            <div className="bg-[#0a1122]/90 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all shadow-xl shadow-black/35 relative overflow-hidden group">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Local Meetups & Workshops</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quick onboarding via simple invite codes, instant QR ticket generation, direct photo galleries for participant memory sharing, and easy chat channels.
              </p>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/40 w-fit px-3 py-1 rounded-full border border-amber-500/15">
                Popular with: Dev Groups, Artists
              </div>
            </div>

            {/* Corporate Events */}
            <div className="bg-[#0a1122]/90 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all shadow-xl shadow-black/35 relative overflow-hidden group">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Corporate Offsites & Festivals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enterprise security controls, bulk attendee CSV data imports, email broadcast automation, visual check-in histories, and custom legal templates.
              </p>
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest bg-indigo-950/40 w-fit px-3 py-1 rounded-full border border-indigo-500/15">
                Popular with: Fortune 500s
              </div>
            </div>

            {/* NGO campaigns */}
            <div className="bg-[#0a1122]/90 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all shadow-xl shadow-black/35 relative overflow-hidden group">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">NGO Campaigns & Marathons</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage volunteer gate passes, track zero-cost community registrations, keep water-station coordinators synchronized on map coordinates, and broadcast emergency updates.
              </p>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/40 w-fit px-3 py-1 rounded-full border border-emerald-500/15">
                Popular with: NGO Hosts, Organizers
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. PRICING PAGE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'pricing' && (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Simple transparent pricing</span>
            <h1 className="text-4xl md:text-5xl font-black text-white">Pricing Plans for Every Scale</h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Start hosting community events for free, or upgrade to Pro and Enterprise to unlock automated email broadcasts and custom branding.
            </p>

            {/* Billing interval switch */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit mx-auto mt-4">
              <button
                onClick={() => setPricingInterval('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  pricingInterval === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setPricingInterval('annually')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  pricingInterval === 'annually' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annually (Save 20%) <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-black">20% Off</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Community Free */}
            <div className="bg-[#0a1122]/80 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Community</span>
                  <h3 className="text-xl font-extrabold text-white">Free / Tripper</h3>
                </div>
                <p className="text-xs text-slate-400">Perfect for small group treks, weekend meetups, and temporary hacks.</p>
                <div className="text-3xl font-black text-white">
                  ₹0 <span className="text-xs font-bold text-slate-500">/ forever</span>
                </div>
                <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> up to 25 registered members
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Standard QR smart tickets
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Basic schedule & map guides
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 line-through">
                    <X className="w-4 h-4 text-slate-600" /> Resend broadcast campaigns
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 line-through">
                    <X className="w-4 h-4 text-slate-600" /> AI-powered generators
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setAuthTab('signup'); setMarketingPage('signup'); }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Professional Pro */}
            <div className="bg-[#0a1122]/90 border-2 border-indigo-500/50 p-6 md:p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-500/10 hover:scale-[1.01] transition-all">
              <span className="absolute -top-3.5 right-6 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow border border-indigo-500/20">
                Most Popular
              </span>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Professional</span>
                  <h3 className="text-xl font-extrabold text-white">Pro Planner</h3>
                </div>
                <p className="text-xs text-slate-400">Excellent for mid-sized college festivals, corporate offsites, and paid treks.</p>
                <div className="text-3xl font-black text-white">
                  {pricingInterval === 'annually' ? '₹3,999' : '₹4,999'} 
                  <span className="text-xs font-bold text-slate-500"> / month</span>
                </div>
                <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> up to 500 registered members
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Manual UPI QR screenshot approval
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Core check-in scanning desks
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Resend campaign integration
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Custom branding theme setups
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setAuthTab('signup'); setMarketingPage('signup'); }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                Try Pro Plan
              </button>
            </div>

            {/* Scale Enterprise */}
            <div className="bg-[#0a1122]/80 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise</span>
                  <h3 className="text-xl font-extrabold text-white">Scale & Agency</h3>
                </div>
                <p className="text-xs text-slate-400">Engineered for global tech conferences, agency treks, and national campaigns.</p>
                <div className="text-3xl font-black text-white">
                  {pricingInterval === 'annually' ? '₹15,999' : '₹19,999'} 
                  <span className="text-xs font-bold text-slate-500"> / month</span>
                </div>
                <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Unlimited enrolled members
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Multi-scanning volunteer desks
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Full Gemini API key integrations
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Dedicated 24/7 Slack support channel
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400" /> Bulk CSV member/payment imports
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMarketingPage('contact')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Contact Sales Office
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. ABOUT PAGE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'about' && (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-20">
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Our Mission</span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Structuring the Chaos of Live Event Logistics.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                WorkspaceOS was born in 2024 with a clear mandate: build an offline-first, highly scalable multi-tenant operating system for physical group coordination. Planning a 3-day high-altitude trek with 150 college juniors or running a 48-hour decentralized tech hackathon should not require stitching together Google Sheets, Discord servers, UPI verification threads, and SMS gateways.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                We empower organizers with single-screen central dashboard control over registration builders, verified manual UPI collections, priority announcements, interactive vector participant maps, and zero-wait QR ticketing check-ins.
              </p>
            </div>
            
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-1">
                <div className="text-2xl font-black text-indigo-400">Isolated</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Workspace Sandboxing</div>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-1">
                <div className="text-2xl font-black text-indigo-400">Offline-First</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secure QR Scans</div>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-1">
                <div className="text-2xl font-black text-indigo-400">99.9%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scanner Gate Uptime</div>
              </div>
              <div className="p-6 bg-[#0c1425] border border-indigo-500/25 rounded-2xl text-center space-y-1 shadow-md shadow-indigo-600/5">
                <div className="text-2xl font-black text-emerald-400">Real-time</div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">UPI Approval Desk</div>
              </div>
            </div>
          </div>

          {/* Timeline History */}
          <div className="space-y-8 border-t border-slate-800/60 pt-16">
            <div className="text-center space-y-2">
              <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Our journey</span>
              <h2 className="text-2xl md:text-3xl font-black text-white">How WorkspaceOS Redefined Event Logistics</h2>
            </div>

            <div className="relative border-l-2 border-slate-800 ml-4 md:ml-32 py-4 space-y-8">
              <div className="relative pl-6">
                <span className="absolute -left-2.5 top-1.5 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#030712]" />
                <span className="text-xs font-black text-indigo-400 font-mono">MARCH 2024</span>
                <h4 className="text-sm font-extrabold text-white mt-1">Founding Idea & Seed Concept</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Started as an internal college script to verify manual payment receipts and dispatch QR tickets for a 400-hacker buildathon. Code went viral.
                </p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-2.5 top-1.5 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#030712]" />
                <span className="text-xs font-black text-indigo-400 font-mono">SEPTEMBER 2024</span>
                <h4 className="text-sm font-extrabold text-white mt-1">Multi-Tenant Engine Launch</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Rewrote the core schema to support secure, row-isolated multi-tenancy. Launched community free version for sports and treks.
                </p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-2.5 top-1.5 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#030712]" />
                <span className="text-xs font-black text-indigo-400 font-mono">JANUARY 2025</span>
                <h4 className="text-sm font-extrabold text-white mt-1">Pro Tier & Resend Campaigns</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Introduced manual payment review controls, automated resend verification workflows, and bento dashboard layouts.
                </p>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-2.5 top-1.5 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#030712]" />
                <span className="text-xs font-black text-indigo-400 font-mono">JULY 2026</span>
                <h4 className="text-sm font-extrabold text-white mt-1">Commercial Launch (WorkspaceOS 2.0)</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Rolled out complete SaaS workspace settings, collapsible sidebars, custom module controls, and advanced role matrices.
                </p>
              </div>
            </div>
          </div>

          {/* Core Leadership Team */}
          <div className="space-y-8 border-t border-slate-800/60 pt-16">
            <div className="text-center space-y-2">
              <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">The team</span>
              <h2 className="text-2xl md:text-3xl font-black text-white">Engineered by Event Organizers</h2>
              <p className="text-slate-400 text-xs">A remote-first distributed group of developers, hikers, and community builders.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-slate-800 mx-auto overflow-hidden border-2 border-indigo-500/30">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Elena Rostova" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Elena Rostova</h4>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black mt-0.5">Founder & CEO</p>
                  <p className="text-[11px] text-slate-500 mt-2">Former MLH mentor and avid Himalayan trekker.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-slate-800 mx-auto overflow-hidden border-2 border-indigo-500/30">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Sandro Kovac" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Sandro Kovac</h4>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black mt-0.5">Chief Architect</p>
                  <p className="text-[11px] text-slate-500 mt-2">Specialist in multi-tenancy models and database optimization.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-slate-800 mx-auto overflow-hidden border-2 border-indigo-500/30">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Priya Nair" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Priya Nair</h4>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black mt-0.5">Head of Operations</p>
                  <p className="text-[11px] text-slate-500 mt-2">Managed check-in desks for events with over 10,000 attendees.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-slate-800 mx-auto overflow-hidden border-2 border-indigo-500/30">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Aris Thorne" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Aris Thorne</h4>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black mt-0.5">Lead Designer</p>
                  <p className="text-[11px] text-slate-500 mt-2">Linear, Vercel design language purist. Visual minimalist.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. CONTACT PAGE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'contact' && (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Get in touch</span>
            <h1 className="text-4xl md:text-5xl font-black text-white">Contact Our Enterprise Desk</h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Ready to deploy WorkspaceOS for your national summit or outdoor campaign? Contact our planning specialists for custom quotation and priority support setup.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
            
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#0a1122]/90 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-extrabold text-white">Submit a Consultation Inquiry</h3>
              
              {contactSuccess ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-center space-y-3 animate-scale-up">
                  <CheckCircle className="w-8 h-8 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Consultation Dispatched Successfully</h4>
                  <p className="text-xs text-slate-400">
                    Thank you! A designated WorkspaceOS regional account manager has received your parameter request and will verify calendar availability within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Rostova"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Email</label>
                      <input
                        type="email"
                        required
                        placeholder="elena@workspaceos.io"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designated Department</label>
                    <select
                      value={contactDept}
                      onChange={(e) => setContactDept(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>Sales & Enterprise Plans</option>
                      <option>College / Community Sponsorships</option>
                      <option>Custom Feature Integrations</option>
                      <option>Support Desk escalations</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tell us about your event scale</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="e.g. Hosting a 500-member high-altitude trek across Ladakh in August. Need automated offline pass QR dispatch and a priority red SOS rescue desk."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Request
                  </button>
                </form>
              )}
            </div>

            {/* Support details */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col justify-between text-left">
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-white">Alternative Channels</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">General Inquiries</h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">support@workspaceos.io</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Headquarters</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Baker Street, London, WC1E 6BT</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Slack Workspace</h4>
                      <p className="text-xs text-indigo-400 mt-0.5 cursor-pointer hover:underline">join.workspaceos-slack.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl text-[11px] text-indigo-300 mt-6 leading-relaxed">
                💡 <strong>Community Sponsor Program:</strong> NGO and non-profit sports organizers are eligible for up to 50% discount on Pro Plans. Submit your valid certificate of charity with inquiry!
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. FAQ PAGE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'faq' && (
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-indigo-400 font-extrabold text-xs uppercase tracking-widest">Help center</span>
            <h1 className="text-4xl font-black text-white">Frequently Asked Questions</h1>
            <p className="text-slate-400 text-sm">Everything you need to know about setting up payment review, QR passes, and role isolation.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is WorkspaceOS?",
                a: "WorkspaceOS is an all-in-one Event Operating System designed to simplify physical logistics. We aggregate custom registration form builders, manual UPI QR payment screenshot reviews, offline-scannable QR ticket dispatch, priority announcement broadcast feeds, emergency SOS alerts, and live participant mapping into a single, row-isolated multi-tenant interface."
              },
              {
                q: "How does the manual UPI QR verification workflow operate?",
                a: "Organizers can upload a custom UPI payment QR image and set up details like pricing and instructions. Participants upload their transaction screenshot and enter reference IDs. Organizers review these in real-time, click 'Approve', which immediately releases the participant's secure QR Smart Pass ticket."
              },
              {
                q: "Are Smart Passes scannable offline?",
                a: "Yes! The Smart Pass utilizes highly secure encrypted tokens. Gate volunteers can scan attendees directly using the Check-in Desk. Scanned data persists securely on the system and prevents double-check-ins."
              },
              {
                q: "Can I toggle individual modules off dynamically?",
                a: "Absolutely! Organizers have absolute control. Inside Module Management, click the ON/OFF switch. For example, if you disable the chat or payment module, it vanishes from the participant's portal instantly without needing to rebuild or redeploy."
              },
              {
                q: "How does row-level isolation work?",
                a: "WorkspaceOS enforces strict Multi-Tenancy. Every database record maps strictly to its workspace ID. Non-authenticated guests, logged-in volunteers, and organizers can only fetch records mapping exactly to their role privileges. This prevents any accidental cross-workspace leak."
              },
              {
                q: "Do you support custom email broadcasts?",
                a: "Yes! Upgrading to Pro unlocks the Resend email campaigner. You can write custom markdown broadcasts, and they dispatch instantly to all approved workspace participant emails."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0a1122]/90 border border-slate-800 rounded-2xl overflow-hidden transition-all text-left">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-extrabold text-white text-sm hover:bg-slate-900/40 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronRight className={`w-4 h-4 text-indigo-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 bg-slate-950/20">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 8. PRIVACY POLICY */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'privacy' && (
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 text-left space-y-8">
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 font-mono">Last Updated: July 5, 2026</p>
          
          <div className="space-y-6 text-slate-300 text-xs leading-relaxed">
            <p>
              At WorkspaceOS, we treat your privacy and event data with the utmost seriousness. This document outlines the categories of data we gather, store, and process across our multi-tenant SaaS infrastructure.
            </p>
            
            <h3 className="text-base font-bold text-white">1. Information Gathered</h3>
            <p>
              When organizers configure event spaces, we store metadata including UPI IDs, covers, category tags, schedules, checklist templates, and custom form question arrays. For participants, we store name, phone numbers, transaction screenshot files, and answers.
            </p>

            <h3 className="text-base font-bold text-white">2. Security & Database Isolation</h3>
            <p>
              All customer resources are securely stored inside row-isolated multi-tenant frameworks. We use Row Level Security (RLS) policies to ensure that volunteers, coordinators, and non-authorized guests are blocked from reading sensitive payment verification receipts or medical records.
            </p>

            <h3 className="text-base font-bold text-white">3. Third-Party Integrations</h3>
            <p>
              If organizers choose to activate the Resend API or input manual Supabase keys, these are stored in system variables and are strictly isolated client-side or in secure, encrypted backends. We do not dispatch any personally identifiable data to other platforms without organizer authorization.
            </p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 9. TERMS OF SERVICE */}
      {/* ---------------------------------------------------- */}
      {marketingPage === 'terms' && (
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 text-left space-y-8">
          <h1 className="text-3xl font-black text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400 font-mono">Last Updated: July 5, 2026</p>
          
          <div className="space-y-6 text-slate-300 text-xs leading-relaxed">
            <p>
              By setting up a multi-tenant WorkspaceOS account or participating in active event rooms, you agree to comply with the legal conditions listed below.
            </p>
            
            <h3 className="text-base font-bold text-white">1. Use of Workspace Platform</h3>
            <p>
              WorkspaceOS is provided as a SaaS Multi-Tenant solution for physical coordination and logistics. You are prohibited from exploiting check-in desks, upload buckets, or chat rooms to share fraudulent, malicious, or non-compliant media.
            </p>

            <h3 className="text-base font-bold text-white">2. Manual UPI Transactions Disclaimer</h3>
            <p>
              We provide manual screenshot uploading and transaction reference tracking to simplify collections. However, the eventual approval, verification, or refunding of payments is strictly the responsibility of the designated workspace owner. WorkspaceOS is not liable for organizer disputes.
            </p>

            <h3 className="text-base font-bold text-white">3. Emergency SOS Tools</h3>
            <p>
              Our priority SOS alert system is a visual mapping coordination tool. It is not a replacement for national emergency dispatch services (such as 112 or police rescue operations).
            </p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 10. LOGIN & SIGN UP PAGES */}
      {/* ---------------------------------------------------- */}
      {(marketingPage === 'login' || marketingPage === 'signup') && (
        <div className="max-w-md mx-auto px-6 py-12 md:py-20">
          <div className="bg-[#0a1122]/95 border-2 border-slate-800/80 p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Ambient glows inside Auth box */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 rounded-full blur-xl" />

            <div className="text-center space-y-2 relative z-10">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white">
                {marketingPage === 'login' ? 'Welcome back' : 'Create secure account'}
              </h2>
              <p className="text-xs text-slate-400">
                {marketingPage === 'login' 
                  ? 'Access your event workspaces and participant smart passes.' 
                  : 'Get started with high-scale multi-tenant event logistics.'
                }
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-slate-800 p-0.5 bg-slate-900 rounded-xl relative z-10">
              <button
                onClick={() => { setMarketingPage('login'); setAuthTab('login'); setAuthMagicSent(false); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  marketingPage === 'login' ? 'bg-indigo-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMarketingPage('signup'); setAuthTab('signup'); setAuthMagicSent(false); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  marketingPage === 'signup' ? 'bg-indigo-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {authMagicSent ? (
              <div className="py-6 text-center space-y-4 animate-scale-up relative z-10">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white">Magic Link Dispatched!</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    We sent a secure simulated magic authentication URL to <strong className="text-indigo-400">{authEmail}</strong>.
                  </p>
                </div>
                <p className="text-[11px] text-indigo-300 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/15 max-w-xs mx-auto leading-relaxed">
                  💡 Since we are in simulation, please click the **Mail Logs** (the envelope icon in the header) to complete magic sign-in instantly!
                </p>
              </div>
            ) : (
              <form
                onSubmit={marketingPage === 'login' ? onLogin : onSignUp}
                className="space-y-4 text-left relative z-10"
              >
                {marketingPage === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="elena.rostova@techcorp.io"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {marketingPage === 'login' && authMethod === 'magic' ? null : (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {marketingPage === 'login' 
                    ? authMethod === 'magic' ? 'Send Magic Link' : 'Continue with Email'
                    : 'Create Secure Account'
                  }
                </button>

                {/* Google Sign-In */}
                {showGoogleSignIn && (
                  <>
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-800"></div>
                      <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">or</span>
                      <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    <button
                      type="button"
                      onClick={onGoogleLogin}
                      disabled={isGoogleLoading}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all border border-slate-800 cursor-pointer flex items-center justify-center gap-2 hover:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGoogleLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      Sign in with Google
                    </button>
                  </>
                )}

                {marketingPage === 'login' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod(authMethod === 'password' ? 'magic' : 'password');
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-extrabold tracking-wide uppercase transition-colors cursor-pointer"
                    >
                      {authMethod === 'password' ? '⚡ Magic Link Sign In' : '🔑 Password Sign In'}
                    </button>
                  </div>
                )}
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
