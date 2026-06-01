import { useState, useEffect } from "react";
import {
  fetchSkillCategories,
  addSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../../utils/supabaseClient";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Code2,
  Layout,
  Server,
  Wrench,
  Loader2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

const iconOptions = ["Code2", "Layout", "Server", "Wrench"];

const iconMap = {
  Code2,
  Layout,
  Server,
  Wrench,
};

export default function SkillsManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Category Form State
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Code2");
  const [addingCat, setAddingCat] = useState(false);

  // Editing Category
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatTitle, setEditCatTitle] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("Code2");

  // Skill Form State per category
  const [newSkillNames, setNewSkillNames] = useState({}); // catId -> string
  const [newSkillLevels, setNewSkillLevels] = useState({}); // catId -> number

  // Load categories + skills
  const loadCategories = async () => {
    try {
      const data = await fetchSkillCategories();
      setCategories(data);
    } catch (err) {
      setToast({ message: "Failed to load skills: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Category Actions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;

    setAddingCat(true);
    try {
      const nextOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.sort_order || 0)) + 1 : 0;
      await addSkillCategory(newCatTitle.trim(), newCatIcon, nextOrder);
      setNewCatTitle("");
      setNewCatIcon("Code2");
      setToast({ message: "Category added successfully", type: "success" });
      loadCategories();
    } catch (err) {
      setToast({ message: "Failed to add category: " + err.message, type: "error" });
    } finally {
      setAddingCat(false);
    }
  };

  const handleStartEditCat = (cat) => {
    setEditingCatId(cat.id);
    setEditCatTitle(cat.title);
    setEditCatIcon(cat.icon || "Code2");
  };

  const handleSaveCat = async (id) => {
    if (!editCatTitle.trim()) return;
    try {
      await updateSkillCategory(id, { title: editCatTitle.trim(), icon: editCatIcon });
      setEditingCatId(null);
      setToast({ message: "Category updated successfully", type: "success" });
      loadCategories();
    } catch (err) {
      setToast({ message: "Failed to update category: " + err.message, type: "error" });
    }
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm("Delete this category and all its skills?")) return;
    try {
      await deleteSkillCategory(id);
      setToast({ message: "Category deleted", type: "success" });
      loadCategories();
    } catch (err) {
      setToast({ message: "Delete failed: " + err.message, type: "error" });
    }
  };

  // Skill Actions
  const handleAddSkill = async (catId) => {
    const name = newSkillNames[catId] || "";
    const level = newSkillLevels[catId] || 80;
    if (!name.trim()) return;

    try {
      const cat = categories.find((c) => c.id === catId);
      const skillsInCat = cat?.skills || [];
      const nextOrder = skillsInCat.length > 0 ? Math.max(...skillsInCat.map((s) => s.sort_order || 0)) + 1 : 0;

      await addSkill(catId, name.trim(), level, nextOrder);

      // Clear input
      setNewSkillNames((prev) => ({ ...prev, [catId]: "" }));
      setNewSkillLevels((prev) => ({ ...prev, [catId]: 80 }));
      setToast({ message: "Skill added successfully", type: "success" });
      loadCategories();
    } catch (err) {
      setToast({ message: "Failed to add skill: " + err.message, type: "error" });
    }
  };

  const handleSkillLevelChange = async (id, level) => {
    try {
      await updateSkill(id, { level });
      // Update local state to avoid full reload and flicker
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          skills: cat.skills.map((s) => (s.id === id ? { ...s, level } : s)),
        }))
      );
    } catch (err) {
      setToast({ message: "Failed to update skill level: " + err.message, type: "error" });
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setToast({ message: "Skill removed", type: "success" });
      loadCategories();
    } catch (err) {
      setToast({ message: "Delete failed: " + err.message, type: "error" });
    }
  };

  const inputClasses =
    "px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading skills categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Category Creation Form */}
      <div className="bg-gray-900 border border-white/5 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white">Create New Category</h3>
        <form onSubmit={handleAddCategory} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Category Title</label>
            <input
              type="text"
              value={newCatTitle}
              onChange={(e) => setNewCatTitle(e.target.value)}
              placeholder="e.g. Frontend, Databases, Languages"
              className={`${inputClasses} w-full`}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Icon Type</label>
            <select
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className={`${inputClasses} w-full`}
            >
              {iconOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            variant="primary"
            icon={addingCat ? Loader2 : Plus}
            disabled={addingCat}
          >
            Create Category
          </Button>
        </form>
      </div>

      {/* Grid of Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const CatIcon = iconMap[cat.icon] || Code2;
          const isEditing = editingCatId === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-gray-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between"
            >
              {/* Category Header */}
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full mr-4">
                      <input
                        type="text"
                        value={editCatTitle}
                        onChange={(e) => setEditCatTitle(e.target.value)}
                        className={`${inputClasses} flex-1 py-1 px-2.5 text-sm`}
                      />
                      <select
                        value={editCatIcon}
                        onChange={(e) => setEditCatIcon(e.target.value)}
                        className={`${inputClasses} py-1 px-2 text-sm`}
                      >
                        {iconOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSaveCat(cat.id)}
                        className="p-1 rounded bg-green-500/10 text-green-400 border border-green-500/20"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingCatId(null)}
                        className="p-1 rounded bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <CatIcon size={18} />
                      </div>
                      <h4 className="font-bold text-white">{cat.title}</h4>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleStartEditCat(cat)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCat(cat.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Skills List in Category */}
                <div className="space-y-3.5 mb-6">
                  {(cat.skills || []).map((skill) => (
                    <div key={skill.id} className="space-y-1 bg-white/2 p-2.5 rounded-xl border border-white/5 relative group">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-gray-200">{skill.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-indigo-400 font-bold">{skill.level}%</span>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                            aria-label="Remove skill"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => handleSkillLevelChange(skill.id, parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  ))}
                  {(cat.skills || []).length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-4">No skills in this category yet.</p>
                  )}
                </div>
              </div>

              {/* Add Skill Form */}
              <div className="pt-4 border-t border-white/5 bg-gray-950/20 p-3 rounded-xl">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Quick Add Skill</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillNames[cat.id] || ""}
                    onChange={(e) =>
                      setNewSkillNames((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                    placeholder="Skill name (e.g. React)"
                    className={`${inputClasses} flex-grow text-xs py-1.5 px-2.5`}
                  />
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 text-xs text-gray-400 font-bold">
                    <span>Lvl:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newSkillLevels[cat.id] === undefined ? 80 : newSkillLevels[cat.id]}
                      onChange={(e) =>
                        setNewSkillLevels((prev) => ({
                          ...prev,
                          [cat.id]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                        }))
                      }
                      className="w-8 bg-transparent text-white focus:outline-none text-center"
                    />
                  </div>
                  <button
                    onClick={() => handleAddSkill(cat.id)}
                    className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {categories.length === 0 && (
        <p className="text-gray-500 text-center py-8">No categories added yet. Add a category above to start inserting skills.</p>
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
