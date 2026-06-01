import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Eye } from "lucide-react";
import { GithubIcon } from "./ui/Icons";
import SectionHeading from "./ui/SectionHeading";
import ScrollReveal from "./ui/ScrollReveal";
import { useProjects } from "../hooks/useSupabaseData";
import { SectionSkeleton } from "./ui/LoadingSkeleton";

const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Apps" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "ai", label: "AI & ML" },
  { id: "backend", label: "Backend & Systems" },
];

const ProjectModal = lazy(() => import("./ProjectModal"));

function ProjectCard({ project, index, onViewDetails }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
    >
      {/* Project Image / Preview */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/10 dark:to-violet-500/10">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/30 mb-3 group-hover:scale-110 transition-transform duration-500">
                {project.title.charAt(0)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {project.category.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewDetails(project)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <Eye size={14} />
            View Details
          </motion.button>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold shadow-lg">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <GithubIcon size={16} />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { projects, loading } = useProjects();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  if (loading) {
    return (
      <section
        id="projects"
        className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            title="Featured Projects"
            subtitle="A showcase of my recent work and side projects"
          />
          <SectionSkeleton type="cards" />
        </div>
      </section>
    );
  }

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-500/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Featured Projects"
          subtitle="A showcase of my recent work and side projects"
        />

        {/* Filter bar */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {projectCategories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                whileTap={{ scale: 0.95 }}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat.id
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                }`}
              >
                {activeFilter === cat.id && (
                  <motion.span
                    layoutId="projectFilter"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onViewDetails={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 dark:text-gray-400 mt-12 text-lg"
          >
            No projects in this category yet.
          </motion.p>
        )}
      </div>

      {/* Project Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </section>
  );
}
