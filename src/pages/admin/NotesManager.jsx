import { useState, useEffect } from "react";
import { fetchNotes, addNote, updateNote, deleteNote } from "../../utils/supabaseClient";
import { Plus, Edit2, Trash2, Search, Loader2, BookOpen, Calendar } from "lucide-react";
import { YoutubeIcon } from "../../components/ui/Icons";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

const categories = [
  "DSA",
  "OOP",
  "Android development",
  "Web development",
  "iOS",
  "AI/ML",
  "Data science",
  "YouTube Tutorials",
];

export default function NotesManager() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    category: "DSA",
    content: "",
    video_url: "",
  });

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setToast({ message: "Failed to load notes: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleOpenAdd = () => {
    setForm({
      title: "",
      category: "DSA",
      content: "",
      video_url: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setForm({
      title: note.title || "",
      category: note.category || "DSA",
      content: note.content || "",
      video_url: note.video_url || "",
    });
    setCurrentId(note.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
      setToast({ message: "Note deleted successfully", type: "success" });
      loadNotes();
    } catch (err) {
      setToast({ message: "Failed to delete: " + err.message, type: "error" });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateNote(currentId, form);
        setToast({ message: "Note updated successfully", type: "success" });
      } else {
        await addNote(form);
        setToast({ message: "Note created successfully", type: "success" });
      }
      setIsModalOpen(false);
      loadNotes();
    } catch (err) {
      setToast({ message: "Operation failed: " + err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-500 outline-none transition duration-200";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      {/* Action panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900 border border-white/5 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes by title or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition"
          />
        </div>
        <Button onClick={handleOpenAdd} variant="primary" icon={Plus} className="w-full sm:w-auto">
          Add Note
        </Button>
      </div>

      {/* List / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Loading notes...</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 border-b border-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">YouTube Video</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-white/2 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <BookOpen size={16} />
                        </div>
                        <p className="font-semibold text-white">{note.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-gray-300">
                        {note.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {note.video_url ? (
                        <a
                          href={note.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-400 hover:text-red-300 inline-flex items-center gap-1"
                        >
                          <YoutubeIcon size={18} />
                          Video Link
                        </a>
                      ) : (
                        <span className="text-gray-500 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar size={12} className="text-indigo-400" />
                        {formatDate(note.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(note)}
                          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
                          aria-label="Edit note"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          aria-label="Delete note"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredNotes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No notes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 z-10 max-h-[90vh] flex flex-col">
            <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-4">
              {isEditMode ? "Edit Handnote" : "Create New Handnote"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className={labelClasses}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Dynamic Programming: 0/1 Knapsack Problem"
                  className={inputClasses}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className={inputClasses}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>YouTube Tutorial Link (Optional)</label>
                  <input
                    type="url"
                    name="video_url"
                    value={form.video_url}
                    onChange={handleFormChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Note Content (Supports text paragraphs & lists)</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleFormChange}
                  placeholder="Enter details of your notes here... You can describe definitions, write pseudo-code or outline key algorithms."
                  rows={10}
                  className={`${inputClasses} resize-none font-mono text-sm`}
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="border-t border-white/5 pt-4 mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={submitting ? Loader2 : Plus}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Note"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
