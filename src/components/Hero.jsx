import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ExternalLink, Sparkles } from "lucide-react";
import Button from "./ui/Button";
import { SectionSkeleton } from "./ui/LoadingSkeleton";
import { usePersonalInfo, useHeroSubtitles } from "../hooks/useSupabaseData";

function useTypingAnimation(words, typingSpeed = 100, deletingSpeed = 60, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    if (!words || words.length === 0) return;
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      setDisplayText(currentWord.substring(0, displayText.length + 1));
      if (displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
    } else {
      setDisplayText(currentWord.substring(0, displayText.length - 1));
      if (displayText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [displayText, isDeleting, wordIndex, words, pauseTime]);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed, words]);

  return displayText;
}

function FloatingShapes() {
  const shapes = [
    { size: 300, x: "10%", y: "20%", delay: 0, color: "from-indigo-500/20 to-violet-500/20" },
    { size: 200, x: "70%", y: "60%", delay: 2, color: "from-violet-500/15 to-pink-500/15" },
    { size: 150, x: "80%", y: "10%", delay: 4, color: "from-cyan-500/15 to-indigo-500/15" },
    { size: 100, x: "20%", y: "70%", delay: 1, color: "from-pink-500/10 to-orange-500/10" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${shape.color} blur-3xl`}
          style={{ width: shape.size, height: shape.size, left: shape.x, top: shape.y }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, delay: shape.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-900 dark:text-white" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const { data: personal, loading: pLoading } = usePersonalInfo();
  const { subtitles, loading: sLoading } = useHeroSubtitles();

  const fallbackSubtitles = subtitles.length > 0 ? subtitles : ["Developer"];
  const typedText = useTypingAnimation(fallbackSubtitles);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950"
    >
      <FloatingShapes />
      <GridPattern />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-gray-950" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {pLoading || sLoading ? (
          <SectionSkeleton type="hero" />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8"
            >
              <Sparkles size={14} />
              Available for opportunities
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 dark:text-white mb-6 tracking-tight"
            >
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                {personal?.name || "Developer"}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-4 h-10 flex items-center justify-center font-heading"
            >
              <span>{typedText}</span>
              <span className="ml-0.5 w-[3px] h-8 bg-indigo-500 animate-[blink_1s_infinite]" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10"
            >
              {personal?.tagline || ""}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button onClick={() => scrollTo("projects")} variant="primary" size="lg" icon={ExternalLink} iconPosition="right">
                View Projects
              </Button>
              <Button onClick={() => scrollTo("contact")} variant="outline" size="lg">
                Contact Me
              </Button>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.button
            onClick={() => scrollTo("about")}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 rounded-full text-gray-400 hover:text-indigo-500 transition-colors"
            aria-label="Scroll to about section"
          >
            <ArrowDown size={24} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
