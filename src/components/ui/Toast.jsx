import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700",
      icon: <CheckCircle className="text-emerald-500" size={20} />,
      text: "text-emerald-800 dark:text-emerald-200",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700",
      icon: <XCircle className="text-red-500" size={20} />,
      text: "text-red-800 dark:text-red-200",
    },
  };

  const s = styles[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-sm max-w-sm ${s.bg}`}
        >
          {s.icon}
          <p className={`text-sm font-medium flex-1 ${s.text}`}>{message}</p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
