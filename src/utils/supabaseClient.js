import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================
// Auth Helpers
// ============================

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ============================
// Personal Info
// ============================

export async function fetchPersonalInfo() {
  const { data, error } = await supabase
    .from("personal_info")
    .select("*")
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data;
}

export async function upsertPersonalInfo(info) {
  // Check if row exists
  const existing = await fetchPersonalInfo();
  if (existing) {
    const { data, error } = await supabase
      .from("personal_info")
      .update({ ...info, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("personal_info")
      .insert([info])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ============================
// Hero Subtitles
// ============================

export async function fetchHeroSubtitles() {
  const { data, error } = await supabase
    .from("hero_subtitles")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addHeroSubtitle(text, sortOrder) {
  const { data, error } = await supabase
    .from("hero_subtitles")
    .insert([{ text, sort_order: sortOrder }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteHeroSubtitle(id) {
  const { error } = await supabase.from("hero_subtitles").delete().eq("id", id);
  if (error) throw error;
}

// ============================
// Skill Categories & Skills
// ============================

export async function fetchSkillCategories() {
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*, skills(*)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  // Sort skills within each category
  return (data || []).map((cat) => ({
    ...cat,
    skills: (cat.skills || []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export async function addSkillCategory(title, icon, sortOrder) {
  const { data, error } = await supabase
    .from("skill_categories")
    .insert([{ title, icon, sort_order: sortOrder }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSkillCategory(id, updates) {
  const { data, error } = await supabase
    .from("skill_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSkillCategory(id) {
  const { error } = await supabase.from("skill_categories").delete().eq("id", id);
  if (error) throw error;
}

export async function addSkill(categoryId, name, level, sortOrder) {
  const { data, error } = await supabase
    .from("skills")
    .insert([{ category_id: categoryId, name, level, sort_order: sortOrder }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSkill(id, updates) {
  const { data, error } = await supabase
    .from("skills")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSkill(id) {
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw error;
}

// ============================
// Projects
// ============================

export async function fetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addProject(project) {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ============================
// Experiences
// ============================

export async function fetchExperiences() {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addExperience(exp) {
  const { data, error } = await supabase
    .from("experiences")
    .insert([exp])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateExperience(id, updates) {
  const { data, error } = await supabase
    .from("experiences")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExperience(id) {
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
}

// ============================
// Contact Messages
// ============================

export async function submitContactMessage({ name, email, message }) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, message }]);
  if (error) throw new Error(error.message);
  return { success: true, data };
}

export async function fetchContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteContactMessage(id) {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}

// ============================
// Notes CRUD
// ============================

export async function fetchNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addNote(note) {
  const { data, error } = await supabase
    .from("notes")
    .insert([note])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(id, updates) {
  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(id) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}

// ============================
// File Upload Helper
// ============================

export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

// ============================
// Virtual ID Cards CRUD
// ============================

export async function fetchVirtualIdCards() {
  const { data, error } = await supabase
    .from("virtual_id_cards")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchActiveVirtualIdCard() {
  const { data, error } = await supabase
    .from("virtual_id_cards")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found
  
  // If no active row is set, fallback to returning the first card found
  if (!data) {
    const { data: firstCard, error: firstError } = await supabase
      .from("virtual_id_cards")
      .select("*")
      .limit(1)
      .single();
    if (firstError && firstError.code !== "PGRST116") throw firstError;
    return firstCard;
  }
  return data;
}

export async function addVirtualIdCard(card) {
  // If the new card is set as active, deactivate all others first
  if (card.is_active) {
    await supabase
      .from("virtual_id_cards")
      .update({ is_active: false })
      .neq("id", "00000000-0000-0000-0000-000000000000"); // select all
  }
  const { data, error } = await supabase
    .from("virtual_id_cards")
    .insert([card])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateVirtualIdCard(id, updates) {
  // If this card is updated to be active, deactivate all other cards
  if (updates.is_active) {
    await supabase
      .from("virtual_id_cards")
      .update({ is_active: false })
      .neq("id", id);
  }
  const { data, error } = await supabase
    .from("virtual_id_cards")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVirtualIdCard(id) {
  const { error } = await supabase
    .from("virtual_id_cards")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function setActiveVirtualIdCard(id) {
  // Deactivate all cards first
  const { error: deactivateError } = await supabase
    .from("virtual_id_cards")
    .update({ is_active: false })
    .neq("id", id);
  if (deactivateError) throw deactivateError;

  // Set the target card as active
  const { data, error } = await supabase
    .from("virtual_id_cards")
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
