import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Layout, Server, Wrench } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import ScrollReveal from "./ui/ScrollReveal";
import { useSkills } from "../hooks/useSupabaseData";
import { SectionSkeleton } from "./ui/LoadingSkeleton";

const iconMap = {
  Code2: Code2,
  Layout: Layout,
  Server: Server,
  Wrench: Wrench,
};

function SkillCard({ skill, index }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (skill.level / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:scale-[1.03]"
    >
      {/* Circular progress */}
      <div className="relative w-20 h-20 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-100 dark:text-white/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="url(#skillGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage */}
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
          {skill.level}%
        </span>
      </div>

      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
        {skill.name}
      </h4>
    </motion.div>
  );
}

export default function Skills() {
  const { categories: skillCategories, loading } = useSkills();
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (skillCategories && skillCategories.length > 0 && !activeCategory) {
      setActiveCategory(skillCategories[0].id);
    }
  }, [skillCategories, activeCategory]);

  if (loading) {
    return (
      <section
        id="skills"
        className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionSkeleton type="skills" />
        </div>
      </section>
    );
  }

  if (!skillCategories || skillCategories.length === 0) {
    return null;
  }

  const currentCategory = skillCategories.find((c) => c.id === activeCategory) || skillCategories[0];

  return (
    <section
      id="skills"
      className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Technologies and tools I use to bring ideas to life"
        />

        {/* Category Tabs */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {skillCategories.map((category) => {
              const Icon = iconMap[category.icon];
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                  }`}
                >
                  {activeCategory === category.id && (
                    <motion.span
                      layoutId="skillTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {Icon && <Icon size={16} />}
                    {category.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {currentCategory?.skills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
