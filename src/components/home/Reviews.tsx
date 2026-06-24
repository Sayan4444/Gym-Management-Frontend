

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reviews: Review[] = [
    {
      id: 0,
      name: 'Rahul S.',
      role: 'CrossFit Athlete',
      avatar: 'https://picsum.photos/seed/young_bearded_indian_man/150/150',
      rating: 5,
      text: 'Excellent gym with modern equipment and supportive trainers. The high-performance Compound zone combined with clean, well-maintained lockers makes every session a truly luxurious and rigorous sweat out.',
    },
    {
      id: 1,
      name: 'Priya M.',
      role: 'Yoga & Pilates Regular',
      avatar: 'https://picsum.photos/seed/smiling_young_indian_woman/150/150',
      rating: 5,
      text: 'Great environment and amazing workout experience. I love how they balance top physical engineering gear with calming functional spaces. The custom nutrition matrices changed how my daily stamina tracks.',
    },
    {
      id: 2,
      name: 'Amit K.',
      role: 'Classic Physiques Lifter',
      avatar: 'https://picsum.photos/seed/muscular_bearded_athlete/150/150',
      rating: 5,
      text: 'Best fitness center in the area. Highly recommended. The master trainers actually follow up on physical form and structural adaptations rather than just letting you stand around. The elite ISO-machines are pristine.',
    },
    {
      id: 3,
      name: 'Vikram R.',
      role: 'Powerlifter Elite',
      avatar: 'https://picsum.photos/seed/bald_strong_trainer/150/150',
      rating: 5,
      text: 'I train purely compound powerlifting lifts. The plates collections here are massive, and the floor layout supports drop impacts safely without vibration. Standard of absolute steel lifters core.',
    },
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setActiveIndex((prevIndex) =>
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        ),
      6000 // Auto-slide every 6 seconds
    );

    return () => {
      resetTimeout();
    };
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  return (
    <section id="reviews" className="relative py-20 bg-neutral-900 overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-neon-green rounded-full" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
              TESTIMONIALS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display leading-none">
            WHAT OUR MEMBERS SAY
          </h2>
          <p className="mt-4 text-neutral-400 font-light text-sm sm:text-base">
            Read authentic feedback from regular members and certified athletes who calls Transform 360 Gym Plus home.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="max-w-4xl mx-auto relative px-4 md:px-12">

          {/* Big Quote mark aesthetic */}
          <div className="absolute -top-10 -left-2 md:-left-8 opacity-10 text-neon-green select-none pointer-events-none">
            <Quote className="w-32 h-32 fill-current" />
          </div>

          <div className="relative overflow-hidden min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-center md:px-8 flex flex-col items-center"
              >

                {/* Stars Rating banner */}
                <div className="flex items-center gap-1 mb-6 text-yellow-400 select-none">
                  {[...Array(reviews[activeIndex].rating)].map((_, starIdx) => (
                    <Star key={starIdx} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-lg md:text-2xl font-light text-neutral-200 leading-relaxed max-w-3xl mb-8 italic">
                  &ldquo;{reviews[activeIndex].text}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-neon-green/45 shrink-0 shadow-lg shadow-neon-green/10">
                    <img
                      src={reviews[activeIndex].avatar}
                      alt={reviews[activeIndex].name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-wider font-display leading-none">
                      {reviews[activeIndex].name}
                    </h4>
                    <span className="text-xs text-neutral-400 font-medium tracking-wide mt-1 block">
                      {reviews[activeIndex].role}
                    </span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Arrows Navigation controls */}
          <div className="flex items-center justify-center gap-6 mt-12 relative z-10">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-neutral-950 hover:bg-neutral-800 border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Pagination Indicators dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === dotIdx
                      ? 'w-6 bg-neon-green shadow-md shadow-neon-green/20'
                      : 'w-2 bg-neutral-800 hover:bg-neutral-700'
                    }`}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-neutral-950 hover:bg-neutral-800 border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
