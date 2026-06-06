import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  Info,
  QrCode,
  X
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./ui/Icons";
import { useActiveVirtualIdCard, usePersonalInfo } from "../hooks/useSupabaseData";
import { useTheme } from "../hooks/useTheme";
import Logo from "./ui/Logo";

// Card themes mappings based on website theme selector
const cardThemes = {
  emerald: {
    baseDark: "from-emerald-950 via-teal-900 to-green-950 text-emerald-100",
    baseLight: "from-emerald-50 via-teal-50 to-emerald-100 text-emerald-900",
    borderDark: "border-emerald-500/30",
    borderLight: "border-emerald-300/40",
    glowDark: "shadow-[0_0_40px_rgba(16,185,129,0.25)]",
    glowLight: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    accentDark: "text-emerald-400",
    accentLight: "text-emerald-600",
    accentBgDark: "bg-emerald-500/10",
    accentBgLight: "bg-emerald-600/10",
    circuitColor: "rgba(16,185,129,0.05)",
    labelDark: "text-emerald-500/70",
    labelLight: "text-emerald-700/70",
  },
  sakura: {
    baseDark: "from-rose-950 via-pink-900 to-purple-950 text-rose-100",
    baseLight: "from-rose-50 via-pink-50 to-rose-100 text-rose-900",
    borderDark: "border-rose-500/30",
    borderLight: "border-rose-300/40",
    glowDark: "shadow-[0_0_40px_rgba(244,63,94,0.25)]",
    glowLight: "shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    accentDark: "text-rose-400",
    accentLight: "text-rose-600",
    accentBgDark: "bg-rose-500/10",
    accentBgLight: "bg-rose-600/10",
    circuitColor: "rgba(244,63,94,0.05)",
    labelDark: "text-rose-500/70",
    labelLight: "text-rose-700/70",
  },
  warm: {
    baseDark: "from-amber-950 via-stone-900 to-orange-950 text-amber-100",
    baseLight: "from-amber-50 via-yellow-50 to-amber-100 text-amber-900",
    borderDark: "border-amber-500/30",
    borderLight: "border-amber-300/40",
    glowDark: "shadow-[0_0_40px_rgba(245,158,11,0.25)]",
    glowLight: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    accentDark: "text-amber-400",
    accentLight: "text-amber-600",
    accentBgDark: "bg-amber-500/10",
    accentBgLight: "bg-amber-600/10",
    circuitColor: "rgba(245,158,11,0.05)",
    labelDark: "text-amber-500/70",
    labelLight: "text-amber-700/70",
  },
  cyber: {
    baseDark: "from-slate-900 via-cyan-950 to-blue-950 text-cyan-100",
    baseLight: "from-cyan-50 via-slate-50 to-blue-100 text-cyan-900",
    borderDark: "border-cyan-500/30",
    borderLight: "border-cyan-300/40",
    glowDark: "shadow-[0_0_40px_rgba(6,182,212,0.25)]",
    glowLight: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    accentDark: "text-cyan-400",
    accentLight: "text-cyan-600",
    accentBgDark: "bg-cyan-500/10",
    accentBgLight: "bg-cyan-600/10",
    circuitColor: "rgba(6,182,212,0.05)",
    labelDark: "text-cyan-500/70",
    labelLight: "text-cyan-700/70",
  },
  indigo: {
    baseDark: "from-slate-800 via-slate-900 to-slate-950 text-slate-100",
    baseLight: "from-slate-100 via-slate-50 to-slate-200 text-slate-900",
    borderDark: "border-indigo-500/30",
    borderLight: "border-indigo-300/40",
    glowDark: "shadow-[0_0_40px_rgba(99,102,241,0.25)]",
    glowLight: "shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    accentDark: "text-indigo-400",
    accentLight: "text-indigo-600",
    accentBgDark: "bg-indigo-500/10",
    accentBgLight: "bg-indigo-600/10",
    circuitColor: "rgba(99,102,241,0.05)",
    labelDark: "text-indigo-500/70",
    labelLight: "text-indigo-700/70",
  },
};

export default function VirtualIdCard({ isOpen, onClose, isDark }) {
  const { data: activeVid } = useActiveVirtualIdCard();
  const { data: fallbackPersonal } = usePersonalInfo();
  const { theme } = useTheme();
  
  const personal = activeVid || fallbackPersonal;
  
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  
  // Parallax 3D tilt states
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineStyle, setShineStyle] = useState({ opacity: 0 });

  // Reset states when closed or theme changes
  useEffect(() => {
    if (!isOpen) {
      setIsFlipped(false);
      setRotateX(0);
      setRotateY(0);
      setShineStyle({ opacity: 0 });
    }
  }, [isOpen]);

  const activeTheme = cardThemes[theme] || cardThemes.indigo;

  // Handle 3D Parallax Rotation
  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coords relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Rotate max 15 degrees
    const rY = (mouseX / (width / 2)) * 14;
    const rX = -(mouseY / (height / 2)) * 14;
    
    setRotateX(rX);
    setRotateY(rY);

    // Shine reflection style
    const shineX = (e.clientX - rect.left) / width * 100;
    const shineY = (e.clientY - rect.top) / height * 100;
    setShineStyle({
      opacity: 0.25,
      background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShineStyle({ opacity: 0 });
  };

  const handleFlip = (e) => {
    // Avoid flipping if clicking links
    if (e.target.closest("a") || e.target.closest("button:not(.flip-trigger)")) return;
    setIsFlipped(!isFlipped);
    setRotateX(0);
    setRotateY(0);
  };

  if (!personal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-[430px] flex flex-col items-center gap-6"
          >
            {/* Header Hint / Help info */}
            <div className="text-center select-none text-gray-300 dark:text-gray-400 flex items-center gap-1.5 text-xs font-semibold bg-white/5 dark:bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
              <Info size={13} className={isDark ? activeTheme.accentDark : activeTheme.accentLight} />
              Hover to tilt • Click card to flip info
            </div>

            {/* Main Interactive Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleFlip}
              className="relative w-[360px] h-[550px] cursor-pointer"
              style={{
                perspective: "1200px",
              }}
            >
              {/* Card Inner Wrapper for Rotation */}
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                }}
                className={`relative w-full h-full rounded-[30px] border transition-shadow duration-300 ${
                  isDark
                    ? `${activeTheme.baseDark} ${activeTheme.borderDark} ${activeTheme.glowDark}`
                    : `${activeTheme.baseLight} ${activeTheme.borderLight} ${activeTheme.glowLight}`
                }`}
              >
                {/* Gloss / Reflection layer */}
                <div
                  className="absolute inset-0 rounded-[30px] pointer-events-none z-10 transition-opacity duration-300"
                  style={shineStyle}
                />

                {/* ============================================================== */}
                {/* FRONT SIDE */}
                {/* ============================================================== */}
                <div
                  className={`absolute inset-0 flex flex-col p-6 rounded-[30px] overflow-hidden justify-between bg-gradient-to-br ${
                    isDark ? activeTheme.baseDark : activeTheme.baseLight
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Decorative Circuit Design */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M-20,100 L120,100 L160,140 L160,200 L100,260 L20,260 L-10,230 Z"
                      fill="none"
                      stroke={activeTheme.circuitColor}
                      strokeWidth="1.5"
                    />
                    <circle cx="160" cy="200" r="3" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} />
                    <circle cx="120" cy="100" r="3" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} />
                    <path
                      d="M400,250 L280,250 L240,290 L240,350 L300,410 L380,410"
                      fill="none"
                      stroke={activeTheme.circuitColor}
                      strokeWidth="1.5"
                    />
                    <circle cx="240" cy="290" r="3" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} />
                  </svg>

                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <Logo className="h-9 w-auto text-black dark:text-white" />
                      <div className="h-5 w-[1px] bg-black/10 dark:bg-white/20" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-heading opacity-80">
                        Virtual ID
                      </span>
                    </div>
                    {/* Glowing Metal Badge Element */}
                    <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border select-none ${
                      isDark 
                        ? `${activeTheme.accentDark} bg-black/30 border-white/10` 
                        : `${activeTheme.accentLight} bg-white/50 border-black/10`
                    }`}>
                      Platinum
                    </div>
                  </div>

                  {/* Profile & Avatar Area */}
                  <div className="flex flex-col items-center text-center mt-4 relative z-10">
                    {/* Glowing Metal Frame around Avatar */}
                    <div className={`w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr ${
                      isDark
                        ? "from-zinc-700 via-indigo-500 to-zinc-800"
                        : "from-zinc-300 via-indigo-400 to-zinc-200"
                    } shadow-md overflow-hidden`}>
                      {/* Initials Placeholder / Photo */}
                      {personal.photoUrl ? (
                        <img
                          src={personal.photoUrl}
                          alt={personal.name}
                          className="w-full h-full rounded-full object-cover border border-black/10 select-none bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-extrabold text-white border border-black/10 font-heading select-none bg-gradient-to-br from-indigo-950 to-slate-900">
                          {personal.firstName?.[0] || personal.name?.[0] || "J"}
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl font-bold tracking-tight mt-4 font-heading">
                      {personal.name}
                    </h2>
                    <p className={`text-xs font-semibold uppercase tracking-wider mt-1.5 px-3 py-1 rounded-full ${
                      isDark ? activeTheme.accentBgDark : activeTheme.accentBgLight
                    } ${isDark ? activeTheme.accentDark : activeTheme.accentLight}`}>
                      {personal.role}
                    </p>
                  </div>

                  {/* Smart Card EMV Chip & Details */}
                  <div className="flex items-end justify-between mt-6 relative z-10">
                    {/* EMV Chip */}
                    <div className="flex flex-col gap-2.5">
                      {/* Chip component */}
                      <div className="w-11 h-8.5 rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 p-[1.5px] relative overflow-hidden shadow-md">
                        {/* Internal line segments inside gold chip */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                          <div className="border-r border-b border-amber-950/40" />
                          <div className="border-r border-b border-amber-950/40" />
                          <div className="border-b border-amber-950/40" />
                          <div className="border-r border-b border-amber-950/40" />
                          <div className="border-r border-b border-amber-950/40" />
                          <div className="border-b border-amber-950/40" />
                        </div>
                        <div className="absolute top-[3px] left-[3px] right-[3px] bottom-[3px] border border-amber-950/20 rounded-md" />
                      </div>
                      <div className="text-[9px] font-mono tracking-widest opacity-60">
                        ID: JID-{personal.firstName?.toUpperCase() || "JUNAID"}
                      </div>
                    </div>

                    {/* Barcode/QR Code Placeholder */}
                    <div className="flex flex-col items-end gap-1 select-none">
                      <QrCode size={40} className="opacity-80" strokeWidth={1.5} />
                      <span className="text-[8px] font-mono opacity-50">VERIFY ONLINE</span>
                    </div>
                  </div>

                  {/* Sparkly Micro Animation Badge */}
                  <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-3 text-[9px] font-medium tracking-wide opacity-50 select-none">
                    <span>SECURITY CHIP ENABLED</span>
                    <Sparkles size={11} className={isDark ? activeTheme.accentDark : activeTheme.accentLight} />
                  </div>
                </div>

                {/* ============================================================== */}
                {/* BACK SIDE */}
                {/* ============================================================== */}
                <div
                  className={`absolute inset-0 flex flex-col p-6 rounded-[30px] overflow-hidden justify-between bg-gradient-to-br ${
                    isDark ? activeTheme.baseDark : activeTheme.baseLight
                  }`}
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Black Magnetic Stripe */}
                  <div className="absolute top-8 left-0 right-0 h-11 bg-slate-950 border-y border-white/5 opacity-90" />

                  {/* Stripe Info / Label */}
                  <div className="mt-14 relative z-10 flex flex-col gap-4">
                    {/* Education Detail */}
                    <div className="space-y-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                        isDark ? activeTheme.labelDark : activeTheme.labelLight
                      }`}>
                        Credentials / Education
                      </span>
                      <div className="flex items-start gap-2 text-xs">
                        <GraduationCap size={14} className="mt-0.5 flex-shrink-0 opacity-70" />
                        <div>
                          <p className="font-semibold text-[11px] leading-tight">
                            {personal.education?.degree}
                          </p>
                          <p className="opacity-70 text-[10px]">
                            {personal.education?.university} • {personal.education?.year}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                        isDark ? activeTheme.labelDark : activeTheme.labelLight
                      }`}>
                        Contact Information
                      </span>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="opacity-70" />
                          <span className="text-[10.5px] font-mono">{personal.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={13} className="opacity-70" />
                          <span className="text-[10.5px]">{personal.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags / Core Skills */}
                    <div className="space-y-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                        isDark ? activeTheme.labelDark : activeTheme.labelLight
                      }`}>
                        Interests & Focus
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(personal.interests || []).slice(0, 5).map((interest) => (
                          <span
                            key={interest}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              isDark ? "bg-white/5 border border-white/10" : "bg-black/10"
                            }`}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Social Buttons & Holographic Stripe */}
                  <div className="relative z-10 flex flex-col gap-3.5 border-t border-white/10 pt-4">
                    <div className="flex justify-center gap-4">
                      {personal.social?.github && (
                        <a
                          href={personal.social.github}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-2 rounded-xl border border-white/10 hover:border-indigo-400 hover:bg-white/10 text-white transition flex items-center justify-center`}
                          aria-label="GitHub Profile"
                        >
                          <GithubIcon size={15} />
                        </a>
                      )}
                      {personal.social?.linkedin && (
                        <a
                          href={personal.social.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-2 rounded-xl border border-white/10 hover:border-indigo-400 hover:bg-white/10 text-white transition flex items-center justify-center`}
                          aria-label="LinkedIn Profile"
                        >
                          <LinkedinIcon size={15} />
                        </a>
                      )}
                      {personal.social?.twitter && (
                        <a
                          href={personal.social.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-2 rounded-xl border border-white/10 hover:border-indigo-400 hover:bg-white/10 text-white transition flex items-center justify-center`}
                          aria-label="Twitter Profile"
                        >
                          <TwitterIcon size={15} />
                        </a>
                      )}
                    </div>
                    <div className="text-center text-[8px] font-mono opacity-40 uppercase tracking-[0.2em]">
                      Shah Md Al Junaid © 2026
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Modal Close Button */}
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer shadow-lg"
              aria-label="Close modal"
            >
              <X size={18} />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
