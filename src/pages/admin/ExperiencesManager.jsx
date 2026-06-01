import { useState, useEffect } from "react";
import {
  fetchExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} from "../../utils/supabaseClient";
import { Plus, Edit2, Trash2, Loader2, Calendar, Briefcase } from "lucide-react";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    company: "",
    period: "",
    description: "",
    sort_order: 0,
  });

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const data = await fetchExperiences();
      setExperiences(data);
    } catch (err) {
      setToast({ message: "Failed to load experiences: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleOpenAdd = () => {
    setForm({
      title: "",
      company: "",
      period: "",
      description: "",
      sort_order:
        experiences.length > 0 ? Math.max(...experiences.map((e) => e.sort_order || 0)) + 1 : 0,
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setForm({
      title: exp.title || "",
      company: exp.company || "",
      period: exp.period || "",
      description: exp.description || "",
      sort_order: exp.sort_order || 0,
    });
    setCurrentId(exp.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience entry?")) return;
    try {
      await deleteExperience(id);
      setToast({ message: "Experience entry deleted", type: "success" });
      loadExperiences();
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
        await updateExperience(currentId, form);
        setToast({ message: "Experience updated successfully", type: "success" });
      } else {
        await addExperience(form);
        setToast({ message: "Experience created successfully", type: "success" });
      }
      setIsModalOpen(false);
      loadExperiences();
    } catch (err) {
      setToast({ message: "Operation failed: " + err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-500 outline-none transition duration-200";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      {/* Search & Action Bar */}
      <div className="flex justify-between items-center bg-gray-900 border border-white/5 p-4 rounded-2xl">
        <p className="text-sm text-gray-400">Manage your employment history and qualifications shown on timeline.</p>
        <Button onClick={handleOpenAdd} variant="primary" icon={Plus}>
          Add Experience
        </Button>
      </div>

      {/* Experiences Table List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Loading timeline...</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 border-b border-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/2 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <Briefcase size={16} />
                        </div>
                        <p className="font-semibold text-white">{exp.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">{exp.company}</td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar size={12} className="text-indigo-400" />
                        {exp.period}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{exp.sort_order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
                          aria-label="Edit experience"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          aria-label="Delete experience"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {experiences.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No experience timeline entries added yet.
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          {/* Box */}
          <div className="relative w-full max-w-xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 z-10">
            <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-4">
              {isEditMode ? "Edit Experience Entry" : "Add Experience Entry"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClasses}>Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Senior Software Engineer"
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleFormChange}
                    placeholder="e.g. Google"
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Period</label>
                  <input
                    type="text"
                    name="period"
                    value={form.period}
                    onChange={handleFormChange}
                    placeholder="e.g. 2024 — Present, or Jan - Dec 2023"
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={handleFormChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Role Description / Achievements</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Developed responsive interfaces and APIs, improved rendering speed by 35%..."
                  rows={5}
                  className={`${inputClasses} resize-none`}
                  required
                />
              </div>

              {/* Submit / Cancel Actions */}
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
                  {submitting ? "Saving..." : isEditMode ? "Save Entry" : "Create Entry"}
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
