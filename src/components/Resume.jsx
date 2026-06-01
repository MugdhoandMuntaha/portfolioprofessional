import { Download, FileText, Briefcase, Calendar } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import ScrollReveal from "./ui/ScrollReveal";
import Button from "./ui/Button";
import { usePersonalInfo, useExperiences } from "../hooks/useSupabaseData";
import { SectionSkeleton } from "./ui/LoadingSkeleton";

export default function Resume() {
  const { data: personal, loading: pLoading } = usePersonalInfo();
  const { data: experience, loading: eLoading } = useExperiences();

  if (pLoading || eLoading) {
    return (
      <section
        id="resume"
        className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionSkeleton type="default" />
        </div>
      </section>
    );
  }

  const resumeUrl = personal?.resumeUrl || "#";

  return (
    <section
      id="resume"
      className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-indigo-500/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Resume"
          subtitle="My professional experience and qualifications"
        />

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left - Download & Preview */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              <div className="sticky top-28 space-y-6">
                {/* Download card */}
                <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/25">
                    <FileText size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                    Get My Resume
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Download my full resume to learn more about my experience and qualifications.
                  </p>
                  <Button
                    href={resumeUrl}
                    download
                    variant="primary"
                    icon={Download}
                    className="w-full"
                  >
                    Download PDF
                  </Button>
                </div>

                {/* Preview card */}
                <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-white/10">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Preview
                    </h4>
                  </div>
                  <div className="h-64 bg-gray-50 dark:bg-white/5">
                    <object
                      data={resumeUrl}
                      type="application/pdf"
                      className="w-full h-full"
                    >
                      <div className="flex items-center justify-center h-full text-center p-4">
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          PDF preview unavailable.
                          <br />
                          <a
                            href={resumeUrl}
                            className="text-indigo-500 hover:text-indigo-600 font-medium"
                            download
                          >
                            Download instead
                          </a>
                        </p>
                      </div>
                    </object>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right - Experience Timeline */}
          <div className="lg:col-span-3">
            <ScrollReveal direction="right">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2 font-heading">
                <Briefcase size={20} className="text-indigo-500" />
                Experience
              </h3>
            </ScrollReveal>

            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-indigo-500 via-violet-500 to-transparent" />

              {!experience || experience.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                  No experience details added yet.
                </p>
              ) : (
                experience.map((exp, index) => (
                  <ScrollReveal key={exp.id || index} direction="right" delay={index * 0.15}>
                    <div className="relative flex gap-6 pb-10 last:pb-0">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-2 border-indigo-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                        </div>
                      </div>

                      {/* Content card */}
                      <div className="flex-1 p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                            {exp.title}
                          </h4>
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
                            <Calendar size={12} />
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-indigo-500 text-sm font-medium mb-3">
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
