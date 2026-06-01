import { motion } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./ui/Icons";
import { usePersonalInfo } from "../hooks/useSupabaseData";
import Logo from "./ui/Logo";

const footerLinks = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Resume", id: "resume" },
  { label: "Notes", id: "notes" },
  { label: "Contact", id: "contact" },
];

export default function Footer() {
  const { data: personal, loading } = usePersonalInfo();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return null;

  const name = personal?.name || "Developer";
  const firstName = personal?.firstName || "Developer";
  const tagline = personal?.tagline || "";
  const socialIcons = [
    { icon: GithubIcon, url: personal?.social?.github || "#", label: "GitHub" },
    { icon: LinkedinIcon, url: personal?.social?.linkedin || "#", label: "LinkedIn" },
    { icon: TwitterIcon, url: personal?.social?.twitter || "#", label: "Twitter" },
  ];

  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900/80 border-t border-gray-200 dark:border-white/5">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div>
            <button
              onClick={() => scrollTo("hero")}
              className="flex items-center group w-auto mb-4 cursor-pointer"
              aria-label="Scroll to top"
            >
              <Logo className="h-10 md:h-11 w-auto" />
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Connect
            </h4>
            <div className="flex md:justify-end gap-3">
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-indigo-500 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
            © {new Date().getFullYear()} {name}. Built with{" "}
            <Heart size={14} className="text-red-400 fill-red-400 inline" /> and React.
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-500 transition-colors"
          >
            Back to top
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
