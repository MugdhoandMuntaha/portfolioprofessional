import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase, signOut, getSession } from "../utils/supabaseClient";
import {
  User,
  Briefcase,
  Sliders,
  FolderKanban,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Code2,
  ShieldAlert,
  BookOpen,
} from "lucide-react";

const menuItems = [
  { path: "/admin/personal", label: "Personal Info", icon: User },
  { path: "/admin/projects", label: "Projects", icon: FolderKanban },
  { path: "/admin/skills", label: "Skills & Category", icon: Sliders },
  { path: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { path: "/admin/notes", label: "Study Notes", icon: BookOpen },
  { path: "/admin/messages", label: "Contact Messages", icon: Mail },
];

export default function AdminLayout() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Initial Session Check
    const checkInitialSession = async () => {
      try {
        const activeSession = await getSession();
        if (activeSession) {
          setSession(activeSession);
        } else {
          navigate("/admin/login");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        navigate("/admin/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkInitialSession();

    // 2. Auth State Subscriptions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      } else {
        setSession(null);
        navigate("/admin/login");
      }
      setCheckingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/admin/login");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Authenticating session...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-white/5">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5 bg-gray-950/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white">Admin CMS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              View Portfolio
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition border border-transparent"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-64 max-w-xs bg-gray-900 border-r border-white/5 p-6 animate-[slide-in_0.2s_ease-out]">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">Admin CMS</span>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={14} />
                  View Portfolio
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition border border-transparent"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-white/5 flex items-center justify-between px-6 lg:px-8 relative z-25">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-lg font-bold font-heading text-white">
              {menuItems.find((i) => i.path === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 hidden sm:inline-block">
              Logged in as admin
            </span>
          </div>
        </header>

        {/* Panel Page Outlet */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
