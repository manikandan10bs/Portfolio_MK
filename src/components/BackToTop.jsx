import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#171717] hover:bg-[#B99378] text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        >
          <ChevronUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
