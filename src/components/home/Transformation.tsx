

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronRight, Award, Trophy, Scale, ShieldCheck } from 'lucide-react';
import Counter from './ui/Counter';

interface SuccessStory {
  id: number;
  name: string;
  age: number;
  category: string;
  beforeImg: string;
  afterImg: string;
  timeframe: string;
  bio: string;
  stats: {
    weightChange: string;
    fatReduction: string;
    muscleGain: string;
  };
  metrics: {
    beforeWeight: number;
    afterWeight: number;
    beforeFat: number;
    afterFat: number;
  };
}

export default function Transformation() {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);

  const stories: SuccessStory[] = [
    {
      id: 0,
      name: 'Karan V.',
      age: 28,
      category: 'Fat Loss & Strength conditioning',
      beforeImg: 'https://picsum.photos/seed/slim_guy_before/500/500',
      afterImg: 'https://picsum.photos/seed/shredded_back_lats/500/500',
      timeframe: '16 Weeks of Commitment',
      bio: "Joining Transform 360 Gym Plus entirely flipped my biology. The combination of intense compounds lifting and custom nutrition guidance helped me slice excess fats while building massive core and shoulder support. It's safe to say I feel 10 years younger.",
      stats: {
        weightChange: '-14 kg',
        fatReduction: '-12.5%',
        muscleGain: '+5.2 kg',
      },
      metrics: {
        beforeWeight: 92,
        afterWeight: 78,
        beforeFat: 24,
        afterFat: 12,
      },
    },
    {
      id: 1,
      name: 'Rohan S.',
      age: 24,
      category: 'Lean Muscle Hypertrophy transformation',
      beforeImg: 'https://picsum.photos/seed/before_overweight_athlete/500/500',
      afterImg: 'https://picsum.photos/seed/after_ripped_abs_fitness/500/500',
      timeframe: '12 Weeks of Hypertrophy',
      bio: "My primary desire was athletic muscle mass. My personal coach set up rigorous deadlifts, specialized tracking matrices, and timed supplementation plans. Redefining my personal bench record from 60kg to 120kg speaks for itself.",
      stats: {
        weightChange: '+8 kg',
        fatReduction: '-4.0%',
        muscleGain: '+8.6 kg',
      },
      metrics: {
        beforeWeight: 68,
        afterWeight: 76,
        beforeFat: 15,
        afterFat: 11,
      },
    },
    {
      id: 2,
      name: 'Sneha M.',
      age: 32,
      category: 'Athletic Toning & Core Stamina',
      beforeImg: 'https://picsum.photos/seed/out_of_shape_girl/500/500',
      afterImg: 'https://picsum.photos/seed/active_yoga_woman_glow/500/500',
      timeframe: '20 Weeks Mobility Blueprint',
      bio: "I battled continuous desk job fatigue and posture pain. The functional flows, mobility matrices, and supportive groups at Transform 360 Gym Plus built athletic toning while restoring lower back coordination entirely. Recommended for anyone who wants authentic health.",
      stats: {
        weightChange: '-9 kg',
        fatReduction: '-11.0%',
        muscleGain: '+3.5 kg',
      },
      metrics: {
        beforeWeight: 71,
        afterWeight: 62,
        beforeFat: 28,
        afterFat: 17,
      },
    },
  ];

  const currentStory = stories[activeStoryIdx];

  return (
    <section id="transformations" className="relative py-20 bg-neutral-950 overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-neon-green rounded-full" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
              TRANSFORMATION RESULTS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display leading-none">
            REAL MEMBERS. REAL RESULTS.
          </h2>
          <p className="mt-4 text-neutral-400 font-light text-sm sm:text-base">
            Witness the physical proof of science-based training and consistent coaching strategies. No gimmicks, just work.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">

          {/* Left: Interactive client selectors */}
          <div className="col-span-12 lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0">
            {stories.map((story, idx) => (
              <button
                key={story.id}
                onClick={() => setActiveStoryIdx(idx)}
                className={`relative flex items-center gap-4 p-5 rounded-2xl w-80 sm:w-80 lg:w-full shrink-0 border text-left transition-all duration-300 pointer-events-auto cursor-pointer ${activeStoryIdx === idx
                    ? 'bg-neutral-900 border-neon-green shadow-xl shadow-neon-green/5'
                    : 'bg-neutral-950/40 border-white/5 hover:border-white/10'
                  }`}
              >
                {/* Micro active indicator */}
                {activeStoryIdx === idx && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[50%] bg-neon-green rounded-r-full" />
                )}

                {/* Circular image indicator */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                  <img
                    src={story.afterImg}
                    alt={story.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-display">
                      {story.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-neon-green uppercase bg-neon-green/10 px-2 py-0.5 rounded">
                      {story.timeframe.split(' ')[0]} {story.timeframe.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light truncate mt-1">
                    {story.category}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Comparative Slider & Detailed Bio */}
          <div className="col-span-12 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid md:grid-cols-12 gap-8 items-start bg-neutral-900/60 p-6 md:p-8 rounded-3xl border border-white/5"
              >
                {/* Split comparison photos */}
                <div className="col-span-12 md:col-span-6">
                  <div className="grid grid-cols-2 gap-3 relative rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                    {/* Before frame */}
                    <div className="relative aspect-[3/4]">
                      <img
                        src={currentStory.beforeImg}
                        alt="Before condition"
                        className="w-full h-full object-cover saturate-50 brightness-75 border-r border-black/50"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-red-600/90 text-white font-black text-[9px] uppercase tracking-widest py-1 px-3 rounded-full backdrop-blur-md">
                        BEFORE
                      </div>
                    </div>

                    {/* After frame */}
                    <div className="relative aspect-[3/4]">
                      <img
                        src={currentStory.afterImg}
                        alt="After condition"
                        className="w-full h-full object-cover shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-neon-green/90 text-black font-black text-[9px] uppercase tracking-widest py-1 px-3 rounded-full backdrop-blur-md">
                        AFTER RIPPED
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-center font-mono font-bold text-neutral-500 uppercase tracking-widest mt-3">
                    ⏰ Timeframe: {currentStory.timeframe}
                  </p>
                </div>

                {/* Written Bio & statistics meters */}
                <div className="col-span-12 md:col-span-6 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-widest">
                      CASE HISTORY STUDY
                    </span>
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider font-display mt-1">
                      {currentStory.name} <span className="text-neutral-500 font-light font-sans text-sm">Age: {currentStory.age}</span>
                    </h3>

                    <p className="mt-3.5 text-xs text-neutral-400 font-semibold tracking-wider uppercase border-b border-white/5 pb-2">
                      🎖️ Category: {currentStory.category}
                    </p>

                    <p className="mt-4 text-sm text-neutral-300 font-light leading-relaxed italic">
                      &ldquo;{currentStory.bio}&rdquo;
                    </p>
                  </div>

                  {/* Progressive Counters display matrix */}
                  <div className="mt-8">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-display flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-neon-green" />
                      PHYSICAL TRANSITION STATS
                    </h4>

                    <div className="grid grid-cols-3 gap-3">

                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-center">
                        <span className="text-lg md:text-xl font-extrabold text-neon-green font-display block leading-none">
                          {currentStory.stats.weightChange}
                        </span>
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mt-1">
                          Weight Body
                        </span>
                      </div>

                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-center">
                        <span className="text-lg md:text-xl font-extrabold text-electric-blue font-display block leading-none">
                          {currentStory.stats.fatReduction}
                        </span>
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mt-1">
                          Fat Mass
                        </span>
                      </div>

                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-center">
                        <span className="text-lg md:text-xl font-extrabold text-white font-display block leading-none">
                          {currentStory.stats.muscleGain}
                        </span>
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mt-1">
                          Lean Tissue
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Simple dynamic physical metrics bars */}
                  <div className="mt-6 space-y-3 p-4 bg-neutral-950/50 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                      <span>Total Fat Ratio</span>
                      <span className="text-white">{currentStory.metrics.beforeFat}% &rarr; <span className="text-neon-green">{currentStory.metrics.afterFat}%</span></span>
                    </div>
                    {/* Visual Bar progress */}
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-neon-green transition-all duration-700"
                        style={{ width: `${(currentStory.metrics.afterFat / currentStory.metrics.beforeFat) * 100}%` }}
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
