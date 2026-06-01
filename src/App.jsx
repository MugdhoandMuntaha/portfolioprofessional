import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useDarkMode } from "./hooks/useDarkMode";
import { useTheme } from "./hooks/useTheme";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import PersonalInfoEditor from "./pages/admin/PersonalInfoEditor";
import ProjectsManager from "./pages/admin/ProjectsManager";
import SkillsManager from "./pages/admin/SkillsManager";
import ExperiencesManager from "./pages/admin/ExperiencesManager";
import MessagesViewer from "./pages/admin/MessagesViewer";
import Notes from "./components/Notes";
import NotesManager from "./pages/admin/NotesManager";
import AIChatbot from "./components/AIChatbot";

function Portfolio({ isDark, toggle }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-500 focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>

      <Navbar isDark={isDark} toggleDark={toggle} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Resume />
        <Notes />
        <Contact />
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}

export default function App() {
  const { isDark, toggle } = useDarkMode();
  useTheme();

  return (
    <Routes>
      {/* Portfolio Main Page */}
      <Route path="/" element={<Portfolio isDark={isDark} toggle={toggle} />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Panel (Nested & Protected) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Default route redirects to personal info */}
        <Route index element={<Navigate to="/admin/personal" replace />} />
        <Route path="personal" element={<PersonalInfoEditor />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="experiences" element={<ExperiencesManager />} />
        <Route path="messages" element={<MessagesViewer />} />
        <Route path="notes" element={<NotesManager />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
