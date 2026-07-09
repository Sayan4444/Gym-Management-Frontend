import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export function AnimatedTabPanel({ children, panelKey }: { children: ReactNode; panelKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={panelKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
