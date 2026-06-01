import { motion } from "framer-motion";
import { GraduationCap, Target, Heart, MapPin } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import ScrollReveal from "./ui/ScrollReveal";
import { usePersonalInfo } from "../hooks/useSupabaseData";
import { SectionSkeleton } from "./ui/LoadingSkeleton";

export default function About() {
  const { data: personal, loading } = usePersonalInfo();

  if (loading) {
    return (
      <section
        id="about"
        className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionSkeleton type="default" />
        </div>
      </section>
    );
  }

  if (!personal) {
    return null;
  }
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="About Me"
          subtitle="Get to know me, my background, and what drives my passion for technology"
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Bio & Image */}
          <ScrollReveal direction="left">
            <div className="space-y-6">
              {/* Decorative image area */}
              <div className="relative group">
                <div className="w-full aspect-[4/3] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden relative bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/10 dark:to-violet-500/10">
                  {personal.location && (
                    <iframe
                      title="Google Map location about"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        personal.location
                      )}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
                      className="absolute inset-0 w-full h-full border-0 grayscale dark:invert dark:opacity-75 transition duration-500 group-hover:grayscale-0 dark:group-hover:invert-0 dark:group-hover:opacity-100"
                      allowFullScreen
                      loading="lazy"
                    />
                  )}
                  {/* Floating Identity Card */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center p-6 rounded-2xl glass border border-white/20 shadow-xl backdrop-blur-md bg-white/70 dark:bg-black/60 pointer-events-auto transition duration-300 group-hover:scale-95 group-hover:opacity-40">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold font-heading mb-3 shadow-lg shadow-indigo-500/30">
                        {personal.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-semibold text-xs flex items-center justify-center gap-1">
                        <MapPin size={12} className="text-indigo-500" />
                        {personal.location}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Decorative border */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-sm" />
              </div>

              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {personal.bio}
              </p>
            </div>
          </ScrollReveal>

          {/* Right side - Cards */}
          <div className="space-y-6">
            {/* Education */}
            <ScrollReveal direction="right" delay={0.1}>
              <div className="group p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Education
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {personal.education.degree}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {personal.education.university} • {personal.education.year}
                    </p>
                    <p className="text-indigo-500 text-sm font-medium mt-1">
                      GPA: {personal.education.gpa}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Career Goals */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="group p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-violet-200 dark:hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Career Goals
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {personal.careerGoals}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Interests */}
            <ScrollReveal direction="right" delay={0.3}>
              <div className="group p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-pink-200 dark:hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-500 group-hover:scale-110 transition-transform">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personal.interests.map((interest, i) => (
                        <motion.span
                          key={interest}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                        >
                          {interest}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
