import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]",
  secondary:
    "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 hover:scale-[1.02]",
  outline:
    "border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white hover:scale-[1.02]",
  ghost:
    "text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed`;

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon size={18} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={18} />}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}
