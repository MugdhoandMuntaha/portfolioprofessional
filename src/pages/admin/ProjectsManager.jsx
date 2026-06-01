import { useState, useEffect } from "react";
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
  uploadFile,
} from "../../utils/supabaseClient";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  ExternalLink,
  Code2,
  AlertTriangle,
  Upload,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
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
    short_description: "",
    description: "",
    tech_stack: [],
    category: "web",
    github_url: "",
    live_url: "",
    image_url: "",
    featured: false,
    sort_order: 0,
  });

  const [techInput, setTechInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const publicUrl = await uploadFile("portfolio", filePath, file);
      
      setForm((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));
      setToast({ message: "Image uploaded successfully!", type: "success" });
    } catch (err) {
      console.error("Image upload failed:", err);
      setToast({ message: "Upload failed: " + err.message, type: "error" });
    } finally {
      setUploadingImage(false);
    }
  };

  // Load Projects
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setToast({ message: "Failed to load projects: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setForm({
      title: "",
      short_description: "",
      description: "",
      tech_stack: [],
      category: "web",
      github_url: "",
      live_url: "",
      image_url: "",
      featured: false,
      sort_order: projects.length > 0 ? Math.max(...projects.map((p) => p.sort_order || 0)) + 1 : 0,
    });
    setTechInput("");
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setForm({
      title: project.title || "",
      short_description: project.short_description || "",
      description: project.description || "",
      tech_stack: project.tech_stack || [],
      category: project.category || "web",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
      featured: project.featured || false,
      sort_order: project.sort_order || 0,
    });
    setTechInput("");
    setCurrentId(project.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setToast({ message: "Project deleted successfully", type: "success" });
      loadProjects();
    } catch (err) {
      setToast({ message: "Delete failed: " + err.message, type: "error" });
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Tech stack handling
  const handleAddTech = (e) => {
    e.preventDefault();
    if (!techInput.trim()) return;
    if (form.tech_stack.includes(techInput.trim())) {
      setTechInput("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      tech_stack: [...prev.tech_stack, techInput.trim()],
    }));
    setTechInput("");
  };

  const handleRemoveTech = (techToRemove) => {
    setForm((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== techToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateProject(currentId, form);
        setToast({ message: "Project updated successfully", type: "success" });
      } else {
        await addProject(form);
        setToast({ message: "Project created successfully", type: "success" });
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      setToast({ message: "Operation failed: " + err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-500 outline-none transition duration-200";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5";

  return (
    <div className="space-y-6">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900 border border-white/5 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition"
          />
        </div>
        <Button onClick={handleOpenAdd} variant="primary" icon={Plus} className="w-full sm:w-auto">
          Add Project
        </Button>
      </div>

      {/* Projects Table List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Loading projects list...</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 border-b border-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Tech Stack</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/2 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                          {project.title.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{project.title}</p>
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-gray-500 hover:text-indigo-400 inline-flex items-center gap-1 mt-0.5"
                            >
                              Code <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-gray-300">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(project.tech_stack || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 rounded"
                          >
                            {t}
                          </span>
                        ))}
                        {(project.tech_stack || []).length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded">
                            +{(project.tech_stack || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          Featured
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-500/10 border border-gray-500/15 text-gray-400">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{project.sort_order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
                          aria-label="Edit project"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          aria-label="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No projects found.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          {/* Box */}
          <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 max-h-[90vh] flex flex-col z-10">
            <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-4">
              {isEditMode ? "Edit Project" : "Add New Project"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClasses}>Project Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Finance Tracker Dashboard"
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className={inputClasses}
                  >
                    <option value="web">Web App</option>
                    <option value="mobile">Mobile App</option>
                    <option value="ai">AI & ML</option>
                    <option value="backend">Backend & Systems</option>
                  </select>
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

                <div className="md:col-span-2">
                  <label className={labelClasses}>Short Description (shows on listing card)</label>
                  <input
                    type="text"
                    name="short_description"
                    value={form.short_description}
                    onChange={handleFormChange}
                    placeholder="A beautiful analytics platform built for tracking monthly expenditures."
                    className={inputClasses}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>Full Description (shows in details modal)</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Provide a detailed breakdown of the features, system design, architectural flow..."
                    rows={4}
                    className={`${inputClasses} resize-none`}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>GitHub Repository URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={form.github_url}
                    onChange={handleFormChange}
                    placeholder="https://github.com/..."
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Live Demo URL</label>
                  <input
                    type="url"
                    name="live_url"
                    value={form.live_url}
                    onChange={handleFormChange}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClasses}>Project Image</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Direct Image URL</label>
                      <input
                        type="text"
                        name="image_url"
                        value={form.image_url}
                        onChange={handleFormChange}
                        placeholder="https://images.unsplash.com/..."
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Or Upload File</label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer transition duration-200">
                          <Upload size={18} className={uploadingImage ? "animate-spin" : ""} />
                          <span className="text-sm font-medium">
                            {uploadingImage ? "Uploading..." : "Choose Image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                        {form.image_url && (
                          <div className="w-11 h-11 rounded-lg border border-white/10 overflow-hidden bg-gray-800 flex-shrink-0">
                            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-white select-none">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleFormChange}
                      className="w-5 h-5 rounded bg-white/5 border border-white/10 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    <div>
                      <span className="font-semibold text-sm">Featured Project</span>
                      <p className="text-xs text-gray-500">Show with a featured badge in the project showcase.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tech Stack Dynamic Tag List */}
              <div className="border-t border-white/5 pt-4 mt-2">
                <label className={labelClasses}>Technologies Used</label>
                <div className="flex gap-2 max-w-md mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. TailwindCSS, TypeScript"
                    className={inputClasses}
                  />
                  <Button type="button" onClick={handleAddTech} variant="outline" icon={Plus}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="text-indigo-400 hover:text-red-400 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {form.tech_stack.length === 0 && (
                    <p className="text-xs text-gray-500">No technology tags added yet.</p>
                  )}
                </div>
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
                  {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Project"}
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
