import { useState, useEffect } from "react";
import {
  fetchVirtualIdCards,
  addVirtualIdCard,
  updateVirtualIdCard,
  deleteVirtualIdCard,
  setActiveVirtualIdCard,
  uploadFile
} from "../../utils/supabaseClient";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Upload,
  X,
  CreditCard,
  Sparkles
} from "lucide-react";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

export default function VIDManager() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    first_name: "",
    role: "",
    photo_url: "",
    email: "",
    location: "",
    education_degree: "",
    education_university: "",
    education_year: "",
    education_gpa: "",
    interests: [],
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    is_active: false,
  });

  const [interestInput, setInterestInput] = useState("");

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await fetchVirtualIdCards();
      setCards(data);
    } catch (err) {
      console.error("Failed to load ID cards:", err);
      setToast({ message: "Failed to load ID Cards: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    if (form.interests.includes(interestInput.trim())) {
      setInterestInput("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      interests: [...prev.interests, interestInput.trim()],
    }));
    setInterestInput("");
  };

  const handleRemoveInterest = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.filter((t) => t !== tagToRemove),
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const publicUrl = await uploadFile("portfolio", filePath, file);
      setForm((prev) => ({
        ...prev,
        photo_url: publicUrl,
      }));
      setToast({ message: "Photo uploaded successfully!", type: "success" });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setToast({ message: "Photo upload failed: " + err.message, type: "error" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    if (currentActive) return; // Already active, cannot deactivate without setting another active
    try {
      await setActiveVirtualIdCard(id);
      setToast({ message: "Virtual ID Card activated!", type: "success" });
      loadCards();
    } catch (err) {
      setToast({ message: "Failed to activate card: " + err.message, type: "error" });
    }
  };

  const handleEditClick = (card) => {
    setForm({
      name: card.name || "",
      first_name: card.first_name || "",
      role: card.role || "",
      photo_url: card.photo_url || "",
      email: card.email || "",
      location: card.location || "",
      education_degree: card.education_degree || "",
      education_university: card.education_university || "",
      education_year: card.education_year || "",
      education_gpa: card.education_gpa || "",
      interests: card.interests || [],
      github_url: card.github_url || "",
      linkedin_url: card.linkedin_url || "",
      twitter_url: card.twitter_url || "",
      is_active: card.is_active || false,
    });
    setEditingId(card.id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      first_name: "",
      role: "",
      photo_url: "",
      email: "",
      location: "",
      education_degree: "",
      education_university: "",
      education_year: "",
      education_gpa: "",
      interests: [],
      github_url: "",
      linkedin_url: "",
      twitter_url: "",
      is_active: false,
    });
    setInterestInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateVirtualIdCard(editingId, form);
        setToast({ message: "Virtual ID Card updated successfully!", type: "success" });
      } else {
        await addVirtualIdCard(form);
        setToast({ message: "Virtual ID Card created successfully!", type: "success" });
      }
      setIsEditing(false);
      setEditingId(null);
      resetForm();
      loadCards();
    } catch (err) {
      setToast({ message: "Failed to save: " + err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (id, isActive) => {
    if (isActive) {
      setToast({ message: "Cannot delete the active Virtual ID Card. Please set another card active first.", type: "error" });
      return;
    }
    if (!window.confirm("Are you sure you want to delete this Virtual ID Card?")) return;
    try {
      await deleteVirtualIdCard(id);
      setToast({ message: "Virtual ID Card deleted successfully!", type: "success" });
      loadCards();
    } catch (err) {
      setToast({ message: "Failed to delete: " + err.message, type: "error" });
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-500 outline-none transition duration-200";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5";

  if (loading && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading ID cards...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <p className="text-sm text-gray-400">
                Manage and create glowing Virtual ID Cards (VID) for your portfolio site.
              </p>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="primary" icon={Plus}>
              Create New Card
            </Button>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-white/5 rounded-2xl">
              <CreditCard size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No Virtual ID Cards configured yet.</p>
              <p className="text-gray-500 text-sm mt-1">Create one to enable the VID button in the navbar.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`bg-gray-900 border rounded-2xl p-6 flex flex-col justify-between gap-4 transition-all duration-300 ${
                    card.is_active ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]" : "border-white/5"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                          {card.photo_url ? (
                            <img src={card.photo_url} alt={card.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-white uppercase">{card.first_name?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-snug">{card.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{card.role}</p>
                        </div>
                      </div>

                      {/* Active Status Badge */}
                      <span
                        onClick={() => handleToggleActive(card.id, card.is_active)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border select-none transition ${
                          card.is_active
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-gray-800 border-white/5 text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {card.is_active ? "Active" : "Set Active"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-400 border-t border-white/5 pt-3">
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="text-white font-mono">{card.email || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-white">{card.location || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Education:</span>
                        <span className="text-white truncate max-w-[150px]">{card.education_degree || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                    <button
                      onClick={() => handleEditClick(card)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(card.id, card.is_active)}
                      className="p-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold text-white font-heading">
              {editingId ? "Edit Virtual ID Card" : "Create Virtual ID Card"}
            </h3>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-sm font-semibold transition"
            >
              Cancel
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Column left/center */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile details */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-5">
                <h4 className="font-bold text-white border-b border-white/5 pb-2 text-sm uppercase tracking-wider">
                  Front Info (Minimal)
                </h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Shah Md Al Junaid"
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>First Name (for logo/initials)</label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleInputChange}
                      placeholder="Junaid"
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Job Title / Role</label>
                    <input
                      type="text"
                      name="role"
                      value={form.role}
                      onChange={handleInputChange}
                      placeholder="Machine Learning Engineer / Full Stack Developer"
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Back Info */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-5">
                <h4 className="font-bold text-white border-b border-white/5 pb-2 text-sm uppercase tracking-wider">
                  Back Info (Credentials & Connections)
                </h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="junaid@example.com"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleInputChange}
                      placeholder="Rangpur, Bangladesh"
                      className={inputClasses}
                    />
                  </div>

                  <div className="border-t border-white/5 pt-4 md:col-span-2 grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClasses}>Degree / Credential</label>
                      <input
                        type="text"
                        name="education_degree"
                        value={form.education_degree}
                        onChange={handleInputChange}
                        placeholder="B.Sc. in CSE"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>University / Institution</label>
                      <input
                        type="text"
                        name="education_university"
                        value={form.education_university}
                        onChange={handleInputChange}
                        placeholder="BAUST"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Year / Period</label>
                      <input
                        type="text"
                        name="education_year"
                        value={form.education_year}
                        onChange={handleInputChange}
                        placeholder="2020 — 2024"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>GPA</label>
                      <input
                        type="text"
                        name="education_gpa"
                        value={form.education_gpa}
                        onChange={handleInputChange}
                        placeholder="3.85 / 4.00"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media / Actions Column right */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white border-b border-white/5 pb-2 text-sm uppercase tracking-wider">
                  Profile Photo (Front Face)
                </h4>
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center relative group">
                    {form.photo_url ? (
                      <img src={form.photo_url} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <CreditCard size={32} className="text-gray-500 animate-pulse" />
                    )}
                  </div>
                  <div className="w-full">
                    <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer transition duration-200 text-sm font-semibold">
                      <Upload size={16} className={uploadingPhoto ? "animate-spin" : ""} />
                      <span>{uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                    </label>
                  </div>
                  <div className="w-full">
                    <label className="block text-xs text-gray-500 mb-1">Direct Image URL (Alternative)</label>
                    <input
                      type="text"
                      name="photo_url"
                      value={form.photo_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white border-b border-white/5 pb-2 text-sm uppercase tracking-wider">
                  Social Connections
                </h4>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">GitHub Profile URL</label>
                    <input
                      type="url"
                      name="github_url"
                      value={form.github_url}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={form.linkedin_url}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Twitter Profile URL</label>
                    <input
                      type="url"
                      name="twitter_url"
                      value={form.twitter_url}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Interests & Tags */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white border-b border-white/5 pb-2 text-sm uppercase tracking-wider">
                  Interests / Tags
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="e.g. AI, Cyber Security"
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                  {form.interests.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 text-[10px] text-gray-300 font-semibold border border-white/5"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(tag)}
                        className="text-gray-500 hover:text-red-400 font-bold text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Publish Setting */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleInputChange}
                    className="w-4.5 h-4.5 text-indigo-600 bg-white/5 rounded border-white/10 focus:ring-indigo-500 focus:ring-offset-gray-900"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Set as Active ID Card</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      This card will be displayed when visitors click the VID button.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-5">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-sm font-semibold transition"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" icon={submitting ? Loader2 : Save} disabled={submitting}>
              {submitting ? "Saving Card..." : "Save ID Card"}
            </Button>
          </div>
        </form>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
