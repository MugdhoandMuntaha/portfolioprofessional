import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, Search, ArrowRight, X, ExternalLink } from "lucide-react";
import { YoutubeIcon } from "./ui/Icons";
import SectionHeading from "./ui/SectionHeading";
import ScrollReveal from "./ui/ScrollReveal";
import Button from "./ui/Button";
import { useNotes } from "../hooks/useSupabaseData";
import { SectionSkeleton } from "./ui/LoadingSkeleton";

const noteCategories = [
  { id: "all", label: "All Notes" },
  { id: "dsa", label: "DSA" },
  { id: "oop", label: "OOP" },
  { id: "web development", label: "Web Dev" },
  { id: "android development", label: "Android" },
  { id: "ios", label: "iOS" },
  { id: "ai/ml", label: "AI/ML" },
  { id: "data science", label: "Data Science" },
  { id: "youtube tutorials", label: "YouTube Notes" },
];

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

function NoteModal({ note, onClose }) {
  const embedUrl = getYouTubeEmbedUrl(note.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/2">
          <div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 uppercase">
              {note.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 font-heading">
              {note.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* YouTube IFrame section */}
          {embedUrl && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <YoutubeIcon size={16} className="text-red-500" />
                Video Explanation
              </h4>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg">
                <iframe
                  src={embedUrl}
                  title={note.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Notes Content */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-2">
              <BookOpen size={16} className="text-indigo-500" />
              Handnotes Details
            </h4>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap font-mono bg-gray-55/30 dark:bg-white/2 p-5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-x-auto">
              {note.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            Added on {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          {note.videoUrl && (
            <a
              href={note.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-red-500 hover:text-red-600 font-bold inline-flex items-center gap-1"
            >
              Watch on YouTube <ExternalLink size={12} />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Notes() {
  const { notes, loading } = useNotes();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  if (loading) {
    return (
      <section
        id="notes"
        className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            title="Handnotes & Cheat Sheets"
            subtitle="Browse through structured notes of coding concepts and video tutorials"
          />
          <SectionSkeleton type="cards" />
        </div>
      </section>
    );
  }

  // Filter notes
  const filtered = notes.filter((n) => {
    const matchesFilter = activeFilter === "all" || n.category.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section
      id="notes"
      className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
    >
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Handnotes & Cheat Sheets"
          subtitle="My detailed summaries of programming concepts, development guides, and tutorial walk-throughs"
        />

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-12">
          {/* Category Tabs */}
          <ScrollReveal className="w-full md:w-auto">
            <div className="flex flex-wrap gap-2">
              {noteCategories.map((cat) => {
                // Only show filter if there are actually notes in that category (or it is "all")
                const hasNotes =
                  cat.id === "all" ||
                  notes.some((n) => n.category.toLowerCase() === cat.id.toLowerCase());

                if (!hasNotes) return null;

                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      activeFilter === cat.id
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                    }`}
                  >
                    {activeFilter === cat.id && (
                      <motion.span
                        layoutId="notesFilter"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Search Field */}
          <ScrollReveal direction="left" className="w-full md:w-72">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition duration-300"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Notes Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((note, index) => (
              <ScrollReveal key={note.id} direction="up" delay={index * 0.05}>
                <div className="group flex flex-col justify-between h-64 p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 uppercase">
                        {note.category}
                      </span>
                      {note.videoUrl && (
                        <div className="text-red-500" title="Includes YouTube video explanation">
                          <YoutubeIcon size={18} />
                        </div>
                      )}
                    </div>
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-500 transition-colors mb-2.5">
                      {note.title}
                    </h3>
                    {/* Preview */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                      {note.content}
                    </p>
                  </div>
                  {/* Actions */}
                  <div className="border-t border-gray-100 dark:border-white/5 pt-4 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 font-medium">
                      <Calendar size={12} />
                      {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Read Notes
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/10 max-w-md mx-auto">
            <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
            <p className="font-semibold text-gray-400">No notes found.</p>
            <p className="text-xs text-gray-500 mt-1">Try another filter or search keyword.</p>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedNote && (
          <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
