import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { GithubIcon } from "./ui/Icons";
import Button from "./ui/Button";

export default function ProjectModal({ project, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header / Image area */}
        <div className="h-56 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/20 dark:to-violet-500/20 flex items-center justify-center relative overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-500/30">
              {project.title.charAt(0)}
            </div>
          )}

          {project.featured && (
            <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold shadow-lg z-10">
              ⭐ Featured Project
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-1 text-xs font-semibold text-indigo-500 uppercase tracking-wider">
            {project.category}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
            {project.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <Button
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                icon={GithubIcon}
              >
                View Code
              </Button>
            )}
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                icon={ExternalLink}
              >
                Live Demo
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
