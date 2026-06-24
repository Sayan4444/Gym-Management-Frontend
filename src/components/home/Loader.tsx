import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell } from 'lucide-react';

let hasAppLoaded = false;

export default function Loader({ isLoadingApi = false }: { isLoadingApi?: boolean }) {
  const [loading, setLoading] = useState(() => {
    if (isLoadingApi) return true;
    if (hasAppLoaded) return false;
    return true;
  });
  const [textIndex, setTextIndex] = useState(0);
  const texts = ['TRANSFORMATION', 'STRENGTH', 'NUTRITION', 'COMMUNITY', 'TRANSFORM 360  GYM PLUS'];

  useEffect(() => {
    // Cycle text every 500ms
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 450);

    let isMounted = true;
    let checkMediaInterval: NodeJS.Timeout;
    let fallbackTimeout: NodeJS.Timeout;

    if (!isLoadingApi && loading) {
      // Wait for DOM images to load
      checkMediaInterval = setInterval(() => {
        if (!isMounted) return;
        const images = Array.from(document.images);
        
        // Wait at least a tiny bit for React to mount the nodes
        if (images.length === 0) return;

        let allImagesLoaded = true;
        for (const img of images) {
          if (!img.complete) {
            allImagesLoaded = false;
            break;
          }
        }

        if (allImagesLoaded) {
          setTimeout(() => {
            if (isMounted) {
              setLoading(false);
              hasAppLoaded = true;
            }
          }, 300); // Small buffer for smooth transition
          clearInterval(checkMediaInterval);
        }
      }, 100);

      // Fallback to hide loader after 8 seconds max to prevent infinite hang
      fallbackTimeout = setTimeout(() => {
        if (isMounted) {
          setLoading(false);
          hasAppLoaded = true;
        }
      }, 8000);
    }

    return () => {
      isMounted = false;
      clearInterval(textInterval);
      if (checkMediaInterval) clearInterval(checkMediaInterval);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [isLoadingApi]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          id="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: 'easeInOut' }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-green/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-electric-blue/10 rounded-full blur-[100px]" />

          <div className="relative flex flex-col items-center">
            {/* Spinning Gym Icon */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 2, ease: 'linear' },
                scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
              }}
              className="relative p-5 bg-neutral-900 border border-white/10 rounded-full shadow-2xl mb-8"
            >
              <Dumbbell className="w-12 h-12 text-neon-green" />
            </motion.div>

            {/* Glowing Brand Name */}
            <h2 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase font-display bg-gradient-to-r from-white via-neutral-400 to-white bg-clip-text text-transparent mb-4">
              TRANSFORM 360
            </h2>

            {/* Loading text slider */}
            <div className="h-6 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={textIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-neon-green"
                >
                  {texts[textIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Micro-loading bar */}
            <div className="w-48 h-1 bg-neutral-950 rounded-full mt-6 overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-electric-blue to-neon-green"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
