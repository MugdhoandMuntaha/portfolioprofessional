import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Palette } from "lucide-react";
import { useScrollspy } from "../hooks/useScrollspy";
import { useTheme, themes } from "../hooks/useTheme";
import Logo from "./ui/Logo";

const navLinks = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ isDark, toggleDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const activeSection = useScrollspy();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const scrollTo = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollTo("hero")}
              className="flex items-center group w-auto cursor-pointer"
              aria-label="Scroll to top"
            >
              <Logo className="h-11 md:h-14 w-auto" />
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === link.id
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme Selector */}
              <div className="relative">
                <motion.button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Select theme"
                >
                  <Palette size={18} />
                </motion.button>

                <AnimatePresence>
                  {themeMenuOpen && (
                    <>
                      {/* Backdrop to close menu */}
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setThemeMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-xl p-2 z-40"
                      >
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-1.5 uppercase tracking-wider">
                          Themes
                        </p>
                        <div className="space-y-0.5">
                          {themes.map((t) => {
                            const isSelected = currentTheme === t.id;
                            return (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setTheme(t.id);
                                  setThemeMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${
                                  isSelected
                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full ${t.color} border border-black/10`} />
                                {t.label}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <motion.button
                onClick={toggleDark}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-white/10 p-6 pt-20"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => scrollTo(link.id)}
                    className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      activeSection === link.id
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
