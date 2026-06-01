import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, align = "center" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2 justify-center">
        <span className="h-1 w-8 rounded-full bg-indigo-500/40" />
        <span className="h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
        <span className="h-1 w-8 rounded-full bg-violet-500/40" />
      </div>
    </motion.div>
  );
}
