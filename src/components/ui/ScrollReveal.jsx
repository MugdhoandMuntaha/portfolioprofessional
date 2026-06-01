import { motion } from "framer-motion";

const directionVariants = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}) {
  const variant = directionVariants[direction] || directionVariants.up;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      variants={variant}
      className={className}
    >
      {children}
    </motion.div>
  );
}
