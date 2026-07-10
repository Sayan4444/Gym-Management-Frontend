import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Gym } from '@/data/types';
import { useFeaturedReviews } from '@/hooks/useApi';

interface DisplayReview {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export default function Reviews({ gym }: { gym: Gym }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredReviews = useFeaturedReviews(gym.id).data?.reviews;
  const reviews: DisplayReview[] = featuredReviews?.map((review) => ({
        id: review.id,
        name: review.userName || 'Gym Member',
        role: `Verified member of ${gym.name}`,
        avatar: review.userPhotoUrl,
        rating: review.rating,
        text: review.content,
      })) ?? [];
  const currentReview = reviews[activeIndex];

  useEffect(() => {
    if (activeIndex >= reviews.length) {
      setActiveIndex(0);
      return;
    }
    if (reviews.length <= 1) return;

    const timeout = window.setTimeout(
      () =>
        setActiveIndex((prevIndex) =>
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        ),
      6000
    );

    return () => window.clearTimeout(timeout);
  }, [activeIndex, reviews.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  if (!currentReview) return null;

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
            Read authentic feedback from regular members and certified athletes who call {gym.name} home.
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
                  {[...Array(currentReview.rating)].map((_, starIdx) => (
                    <Star key={starIdx} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-lg md:text-2xl font-light text-neutral-200 leading-relaxed max-w-3xl mb-8 italic">
                  &ldquo;{currentReview.text}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-neon-green/45 shrink-0 shadow-lg shadow-neon-green/10">
                    {currentReview.avatar ? (
                      <img
                        src={currentReview.avatar}
                        alt={currentReview.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-sm font-black text-white">
                        {currentReview.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-wider font-display leading-none">
                      {currentReview.name}
                    </h4>
                    <span className="text-xs text-neutral-400 font-medium tracking-wide mt-1 block">
                      {currentReview.role}
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
