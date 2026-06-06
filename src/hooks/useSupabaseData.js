import { useState, useEffect, useCallback } from "react";
import {
  fetchPersonalInfo,
  fetchHeroSubtitles,
  fetchSkillCategories,
  fetchProjects,
  fetchExperiences,
  fetchNotes,
  fetchActiveVirtualIdCard,
  fetchVirtualIdCards,
} from "../utils/supabaseClient";

// Generic hook factory
function useSupabaseFetch(fetchFn, defaultValue = null) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      console.error("Supabase fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ============================
// Individual Data Hooks
// ============================

export function usePersonalInfo() {
  const result = useSupabaseFetch(fetchPersonalInfo, null);
  
  const mappedData = result.data ? {
    id: result.data.id,
    name: result.data.name,
    firstName: result.data.first_name,
    role: result.data.role,
    tagline: result.data.tagline,
    bio: result.data.bio,
    email: result.data.email,
    location: result.data.location,
    resumeUrl: result.data.resume_url,
    careerGoals: result.data.career_goals,
    education: {
      degree: result.data.education_degree,
      university: result.data.education_university,
      year: result.data.education_year,
      gpa: result.data.education_gpa,
    },
    social: {
      github: result.data.github_url,
      linkedin: result.data.linkedin_url,
      twitter: result.data.twitter_url,
    },
    interests: result.data.interests || [],
  } : null;

  return {
    ...result,
    data: mappedData,
  };
}

export function useHeroSubtitles() {
  const result = useSupabaseFetch(fetchHeroSubtitles, []);
  // Return just the text strings for the typing animation
  return {
    ...result,
    subtitles: (result.data || []).map((s) => s.text),
  };
}

export function useSkills() {
  const result = useSupabaseFetch(fetchSkillCategories, []);
  // Transform to match the component's expected format
  return {
    ...result,
    categories: (result.data || []).map((cat) => ({
      id: cat.id,
      title: cat.title,
      icon: cat.icon,
      skills: (cat.skills || []).map((s) => ({
        name: s.name,
        level: s.level,
      })),
    })),
  };
}

export function useProjects() {
  const result = useSupabaseFetch(fetchProjects, []);
  // Transform snake_case to camelCase for components
  return {
    ...result,
    projects: (result.data || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      shortDescription: p.short_description,
      techStack: p.tech_stack || [],
      category: p.category,
      githubUrl: p.github_url,
      liveUrl: p.live_url,
      image: p.image_url,
      featured: p.featured,
    })),
  };
}

export function useExperiences() {
  return useSupabaseFetch(fetchExperiences, []);
}

export function useNotes() {
  const result = useSupabaseFetch(fetchNotes, []);
  return {
    ...result,
    notes: (result.data || []).map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      content: n.content,
      videoUrl: n.video_url,
      createdAt: n.created_at,
    })),
  };
}

export function useActiveVirtualIdCard() {
  const result = useSupabaseFetch(fetchActiveVirtualIdCard, null);
  
  const mappedData = result.data ? {
    id: result.data.id,
    name: result.data.name,
    firstName: result.data.first_name,
    role: result.data.role,
    photoUrl: result.data.photo_url,
    email: result.data.email,
    location: result.data.location,
    education: {
      degree: result.data.education_degree,
      university: result.data.education_university,
      year: result.data.education_year,
      gpa: result.data.education_gpa,
    },
    social: {
      github: result.data.github_url,
      linkedin: result.data.linkedin_url,
      twitter: result.data.twitter_url,
    },
    interests: result.data.interests || [],
    isActive: result.data.is_active,
  } : null;

  return {
    ...result,
    data: mappedData,
  };
}

export function useVirtualIdCards() {
  const result = useSupabaseFetch(fetchVirtualIdCards, []);
  
  const mappedList = (result.data || []).map(card => ({
    id: card.id,
    name: card.name,
    firstName: card.first_name,
    role: card.role,
    photoUrl: card.photo_url,
    email: card.email,
    location: card.location,
    education: {
      degree: card.education_degree,
      university: card.education_university,
      year: card.education_year,
      gpa: card.education_gpa,
    },
    social: {
      github: card.github_url,
      linkedin: card.linkedin_url,
      twitter: card.twitter_url,
    },
    interests: card.interests || [],
    isActive: card.is_active,
    createdAt: card.created_at,
  }));

  return {
    ...result,
    cards: mappedList,
  };
}
