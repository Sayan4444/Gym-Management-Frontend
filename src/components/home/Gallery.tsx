

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface GalleryItem {
  id: number;
  src: string;
  category: 'interior' | 'workout' | 'equipment' | 'members' | 'classes';
  title: string;
  sizeClass: string; // Tailwind grid span values for simulated masonry
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { value: 'all', label: 'All Showcase' },
    { value: 'interior', label: 'Gym Interior' },
    { value: 'workout', label: 'Workout Sessions' },
    { value: 'equipment', label: 'Premium Gear' },
    { value: 'members', label: 'Athlete Progress' },
    { value: 'classes', label: 'Group Classes' },
  ];

  const galleryItems: GalleryItem[] = [
    {
      id: 0,
      src: 'https://picsum.photos/seed/luxury_gym_weight_hall/800/800',
      category: 'interior',
      title: 'Iron Arena Heavy Zone',
      sizeClass: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 1,
      src: 'https://picsum.photos/seed/futuristic_cardioline_club/800/600',
      category: 'interior',
      title: 'Premium Cardio Lineup',
      sizeClass: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 2,
      src: 'https://picsum.photos/seed/athlete_deadlift_focus/600/800',
      category: 'workout',
      title: 'Heavy Barbell Deadlifts',
      sizeClass: 'md:col-span-1 md:row-span-2',
    },
    {
      id: 3,
      src: 'https://picsum.photos/seed/woman_stretching_yoga/800/800',
      category: 'members',
      title: 'Yoga Core Flexibility',
      sizeClass: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 4,
      src: 'https://picsum.photos/seed/barbell_plates_stack/800/600',
      category: 'equipment',
      title: 'Olympic Weight Plates',
      sizeClass: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 5,
      src: 'https://picsum.photos/seed/rowing_ergometer_tech/600/800',
      category: 'equipment',
      title: 'Rowing Machine Ergometer',
      sizeClass: 'md:col-span-1 md:row-span-2',
    },
    {
      id: 6,
      src: 'https://picsum.photos/seed/strong_partner_workout/800/800',
      category: 'members',
      title: 'Dumbbell Bench Press',
      sizeClass: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 7,
      src: 'https://picsum.photos/seed/fitness_spin_class/800/600',
      category: 'classes',
      title: 'Intense Cycling Spin Class',
      sizeClass: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 8,
      src: 'https://picsum.photos/seed/aerobic_step_jumpers/600/800',
      category: 'classes',
      title: 'High Burn Aerobic Session',
      sizeClass: 'md:col-span-1 md:row-span-2',
    },
  ];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  // Hook for closing lightbox with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="relative py-20 bg-neutral-950 overflow-hidden">
      {/* Glow asset */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Gallery Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-neon-green rounded-full" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
              VISUAL TOUR
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display">
            OUR FIELD OF ACTION
          </h2>
          <p className="mt-4 text-neutral-400 font-light text-sm sm:text-base">
            Take a look inside our high-performance facility, featuring elite machinery, motivating studios, and active athletes.
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                setLightboxIndex(null); // Reset lightbox targets
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-neon-green text-black shadow-lg shadow-neon-green/10'
                  : 'bg-neutral-900 text-neutral-400 border border-white/5 hover:text-white hover:border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry-Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                id={`gallery-item-${index}`}
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`relative overflow-hidden rounded-2xl group border border-white/5 bg-neutral-900 cursor-pointer aspect-square ${item.sizeClass}`}
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 saturate-75 brightness-90 group-hover:saturate-100 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />

                {/* Dark & Neon gradient hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 border border-neon-green/0 group-hover:border-neon-green/25 rounded-2xl" />

                {/* Hover contents */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-widest">
                    {categories.find(c => c.value === item.category)?.label}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-display mt-1">
                    {item.title}
                  </h3>
                  
                  {/* Interactive icon link */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neon-green text-black flex items-center justify-center shadow-lg">
                      <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold text-neutral-300">Fullscreen Peek</span>
                  </div>
                </div>

                {/* Small static category indicator */}
                <div className="absolute top-4 right-4 bg-black/75 border border-white/5 py-1 px-3.5 rounded-full text-[9px] font-mono uppercase tracking-widest text-neutral-300 backdrop-blur-md group-hover:hidden transition-all">
                  {item.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Lightbox Slider Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-4">
            
            {/* Top Bar controls */}
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto py-2 z-10">
              <div className="text-left">
                <span className="text-xs text-neutral-400 font-mono tracking-widest uppercase">
                  Image {lightboxIndex + 1} of {filteredItems.length}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider font-display">
                  {filteredItems[lightboxIndex]?.title}
                </h4>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-3 bg-neutral-900 border border-white/10 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Main Center Stage */}
            <div className="relative flex items-center justify-center flex-1 max-w-5xl mx-auto w-full group/stage">
              
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:-left-12 z-20 p-3 rounded-full bg-neutral-900/60 border border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer opacity-80 hover:opacity-100"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Main Active image container */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-h-[70vh] md:max-h-[75vh] w-full flex justify-center items-center rounded-2xl overflow-hidden p-1 border border-white/10 bg-neutral-950 shadow-2xl relative"
              >
                <img
                  src={filteredItems[lightboxIndex]?.src}
                  alt={filteredItems[lightboxIndex]?.title}
                  className="max-h-[68vh] md:max-h-[73vh] object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:-right-12 z-20 p-3 rounded-full bg-neutral-900/60 border border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer opacity-80 hover:opacity-100"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Bottom thumbnail indicator */}
            <div className="w-full max-w-4xl mx-auto py-2 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar z-10">
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    lightboxIndex === index
                      ? 'border-neon-green scale-110 shadow-lg shadow-neon-green/10'
                      : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`Jump to image ${index + 1}`}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
