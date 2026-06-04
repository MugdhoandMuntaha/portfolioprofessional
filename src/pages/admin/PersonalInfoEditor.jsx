/* eslint-disable no-undef, no-unused-vars */
import { useState, useEffect } from "react";
import {
  fetchPersonalInfo,
  upsertPersonalInfo,
  fetchHeroSubtitles,
  addHeroSubtitle,
  deleteHeroSubtitle,
  uploadFile,
} from "../../utils/supabaseClient";
import { Save, Plus, Trash2, Loader2, Info, Upload } from "lucide-react";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

export default function PersonalInfoEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    first_name: "",
    role: "",
    tagline: "",
    bio: "",
    email: "",
    location: "",
    resume_url: "",
    career_goals: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    education_degree: "",
    education_university: "",
    education_year: "",
    education_gpa: "",
    interests: [],
  });

  const [interestInput, setInterestInput] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [newSubtitle, setNewSubtitle] = useState("");
  const [addingSubtitle, setAddingSubtitle] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const publicUrl = await uploadFile("portfolio", filePath, file);
      
      setPersonalInfo((prev) => ({
        ...prev,
        resume_url: publicUrl,
      }));
      setToast({ message: "Resume uploaded successfully!", type: "success" });
    } catch (err) {
      console.error("Resume upload failed:", err);
      setToast({ message: "Upload failed: " + err.message, type: "error" });
    } finally {
      setUploadingResume(false);
    }
  };

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const info = await fetchPersonalInfo();
        if (info) {
          setPersonalInfo({
            name: info.name || "",
            first_name: info.first_name || "",
            role: info.role || "",
            tagline: info.tagline || "",
            bio: info.bio || "",
            email: info.email || "",
            location: info.location || "",
            resume_url: info.resume_url || "",
            career_goals: info.career_goals || "",
            github_url: info.github_url || "",
            linkedin_url: info.linkedin_url || "",
            twitter_url: info.twitter_url || "",
            education_degree: info.education_degree || "",
            education_university: info.education_university || "",
            education_year: info.education_year || "",
            education_gpa: info.education_gpa || "",
            interests: info.interests || [],
          });
        }

        const subs = await fetchHeroSubtitles();
        setSubtitles(subs);
      } catch (err) {
        console.error("Error loading personal info:", err);
        setToast({ message: "Failed to load data: " + err.message, type: "error" });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertPersonalInfo(personalInfo);
      setToast({ message: "Personal information saved successfully!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to save: " + err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Interests management
  const handleAddInterest = (e) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    if (personalInfo.interests.includes(interestInput.trim())) {
      setInterestInput("");
      return;
    }
    setPersonalInfo((prev) => ({
      ...prev,
      interests: [...prev.interests, interestInput.trim()],
    }));
    setInterestInput("");
  };

  const handleRemoveInterest = (interestToRemove) => {
    setPersonalInfo((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interestToRemove),
    }));
  };

  // Subtitles typing words management
  const handleAddSubtitle = async (e) => {
    e.preventDefault();
    if (!newSubtitle.trim()) return;

    setAddingSubtitle(true);
    try {
      const nextOrder = subtitles.length > 0 ? Math.max(...subtitles.map((s) => s.sort_order || 0)) + 1 : 0;
      const created = await addHeroSubtitle(newSubtitle.trim(), nextOrder);
      setSubtitles((prev) => [...prev, created]);
      setNewSubtitle("");
      setToast({ message: "Subtitle added successfully!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to add subtitle: " + err.message, type: "error" });
    } finally {
      setAddingSubtitle(false);
    }
  };

  const handleDeleteSubtitle = async (id) => {
    try {
      await deleteHeroSubtitle(id);
      setSubtitles((prev) => prev.filter((s) => s.id !== id));
      setToast({ message: "Subtitle deleted!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to delete subtitle: " + err.message, type: "error" });
    }
  };

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-500 outline-none transition duration-200";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Informative Banner if DB is empty */}
      {personalInfo.name === "" && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3 text-indigo-400 text-sm">
          <Info size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Welcome to your new portfolio database!</p>
            <p className="opacity-90">Please fill out your personal information below. This single-row database row will be automatically created when you hit Save.</p>
          </div>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSaveInfo} className="space-y-8">
        {/* Core Info */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Core Profile Info</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Full Name</label>
              <input
                type="text"
                name="name"
                value={personalInfo.name}
                onChange={handleInfoChange}
                placeholder="John Doe"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>First Name (for navbar/logo)</label>
              <input
                type="text"
                name="first_name"
                value={personalInfo.first_name}
                onChange={handleInfoChange}
                placeholder="John"
                className={inputClasses}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Role / Title</label>
              <input
                type="text"
                name="role"
                value={personalInfo.role}
                onChange={handleInfoChange}
                placeholder="Full Stack Software Engineer"
                className={inputClasses}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Tagline / Hero Description</label>
              <input
                type="text"
                name="tagline"
                value={personalInfo.tagline}
                onChange={handleInfoChange}
                placeholder="I build high-performance web applications and scalable system architectures."
                className={inputClasses}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>About Bio</label>
              <textarea
                name="bio"
                value={personalInfo.bio}
                onChange={handleInfoChange}
                placeholder="Write a brief background about your tech journey and expertise..."
                rows={5}
                className={`${inputClasses} resize-none`}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Email Address</label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handleInfoChange}
                placeholder="john@example.com"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Location</label>
              <input
                type="text"
                name="location"
                value={personalInfo.location}
                onChange={handleInfoChange}
                placeholder="San Francisco, CA"
                className={inputClasses}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Resume PDF / Document</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Direct PDF / File URL</label>
                  <input
                    type="text"
                    name="resume_url"
                    value={personalInfo.resume_url}
                    onChange={handleInfoChange}
                    placeholder="/resume.pdf"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Or Upload Document</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer transition duration-200">
                      <Upload size={18} className={uploadingResume ? "animate-spin" : ""} />
                      <span className="text-sm font-medium">
                        {uploadingResume ? "Uploading..." : "Choose Document"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={handleResumeUpload}
                        className="hidden"
                        disabled={uploadingResume}
                      />
                    </label>
                    {personalInfo.resume_url && (
                      <a
                        href={personalInfo.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-sm font-medium transition duration-200 flex-shrink-0"
                      >
                        View File
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                <span className="font-semibold text-indigo-400">Setup Tip:</span> To upload files successfully, ensure you have created a <strong>public</strong> storage bucket named <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">portfolio</code> in your Supabase dashboard. Alternatively, you can copy your resume PDF directly to the project's <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">public/</code> directory (e.g. as <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">public/resume.pdf</code>) and enter <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">/resume.pdf</code> as the Direct PDF URL.
              </p>
            </div>
          </div>
        </div>

        {/* Education & Bio Goals */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Education & Career Goals</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Degree</label>
              <input
                type="text"
                name="education_degree"
                value={personalInfo.education_degree}
                onChange={handleInfoChange}
                placeholder="B.S. in Computer Science"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>University</label>
              <input
                type="text"
                name="education_university"
                value={personalInfo.education_university}
                onChange={handleInfoChange}
                placeholder="Stanford University"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Graduation Year / Period</label>
              <input
                type="text"
                name="education_year"
                value={personalInfo.education_year}
                onChange={handleInfoChange}
                placeholder="2020 — 2024"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>GPA</label>
              <input
                type="text"
                name="education_gpa"
                value={personalInfo.education_gpa}
                onChange={handleInfoChange}
                placeholder="3.9 / 4.0"
                className={inputClasses}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Career Goals</label>
              <textarea
                name="career_goals"
                value={personalInfo.career_goals}
                onChange={handleInfoChange}
                placeholder="My objective is to lead engineering projects in AI and distributed systems..."
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Socials & Interests */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Social Connections & Interests</h3>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={labelClasses}>GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={personalInfo.github_url}
                onChange={handleInfoChange}
                placeholder="https://github.com/..."
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={personalInfo.linkedin_url}
                onChange={handleInfoChange}
                placeholder="https://linkedin.com/in/..."
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Twitter/X URL</label>
              <input
                type="url"
                name="twitter_url"
                value={personalInfo.twitter_url}
                onChange={handleInfoChange}
                placeholder="https://twitter.com/..."
                className={inputClasses}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className={labelClasses}>Personal Interests (Tags)</label>
            <div className="flex gap-2 max-w-md mb-4">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="e.g. Open Source, Machine Learning"
                className={inputClasses}
              />
              <Button type="button" onClick={handleAddInterest} variant="outline" icon={Plus}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalInfo.interests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-gray-300"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-gray-500 hover:text-red-400 font-bold ml-1 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
              {personalInfo.interests.length === 0 && (
                <p className="text-sm text-gray-500">No interests added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={saving ? Loader2 : Save}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>
      </form>

      {/* Hero Typing words */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 lg:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
          Hero Typing Subtitles
        </h3>
        <p className="text-sm text-gray-400">
          These are the words that appear in the typing animation on your portfolio homepage.
        </p>

        <form onSubmit={handleAddSubtitle} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newSubtitle}
            onChange={(e) => setNewSubtitle(e.target.value)}
            placeholder="e.g. Full Stack Developer"
            className={inputClasses}
          />
          <Button
            type="submit"
            variant="outline"
            icon={addingSubtitle ? Loader2 : Plus}
            disabled={addingSubtitle}
          >
            Add
          </Button>
        </form>

        <div className="border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
          {subtitles.map((sub, index) => (
            <div key={sub.id} className="flex items-center justify-between px-4 py-3.5 bg-white/2">
              <span className="text-sm text-gray-300 font-medium">
                {index + 1}. {sub.text}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteSubtitle(sub.id)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {subtitles.length === 0 && (
            <p className="text-sm text-gray-500 p-4 text-center">No typing words added yet.</p>
          )}
        </div>
      </div>

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
