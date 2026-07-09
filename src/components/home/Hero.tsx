

import { motion } from 'motion/react';
import { Dumbbell, Trophy, Users, ShieldAlert, Award, ChevronRight, Play } from 'lucide-react';
import Counter from './ui/Counter';
import { Gym } from '@/data/types';

export default function Hero({ gym }: { gym: Gym }) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 85;
      window.scrollTo({
        top: top,
        behavior: 'smooth',
      });
    }
  };

  const features = [
    { icon: Trophy, label: 'Certified Trainers' },
    { icon: Dumbbell, label: 'Modern Equipment' },
    { icon: Users, label: 'Personal Training' },
    { icon: Award, label: 'Nutrition Guidance' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28"
    >
      {/* Background Image with Dark & Neon Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/aggressive_gym_workout/1920/1080?blur=1"
          alt={`${gym.name} gym interior`}
          className="w-full h-full object-cover object-center saturate-50 opacity-45 brightness-50 scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Layer 1: Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,210,255,0.15),transparent_40%)] z-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,255,20,0.15),transparent_40%)] z-1" />
      </div>

      {/* Grid Pattern overlay for tech-vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] z-1" />

      {/* Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center lg:text-left">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-bold tracking-[0.2em] uppercase text-neon-green self-center lg:self-start mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
              {gym.name}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-white font-display leading-[1.05]"
            >
              {gym.name}<br />
              <span className="bg-gradient-to-r from-neon-green via-electric-blue to-white bg-clip-text text-transparent">
                Transform Your Life.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"
            >
              Achieve your fitness goals with world-class equipment, expert trainers, and a motivating fitness community.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => scrollToSection('pricing')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neon-green text-black font-extrabold tracking-wider uppercase shadow-xl shadow-neon-green/10 hover:shadow-neon-green/30 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Join Now <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent border border-white/20 hover:border-neon-green text-white font-extrabold tracking-wider uppercase hover:bg-white/5 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Book Free Trial <Play className="w-3.5 h-3.5 text-neon-green fill-neon-green" />
              </button>
            </motion.div>

            {/* Horizontal Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10"
            >
              {features.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center mb-3">
                      <IconComponent className="w-5 h-5 text-neon-green" />
                    </div>
                    <span className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            {/* Decorative Ambient Plate behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-electric-blue/20 blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neon-green/20 blur-[80px]" />

            {/* floating key info card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="relative w-full max-w-sm glass-card rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/10 rounded-bl-full blur-xl" />

              <h3 className="text-lg font-black tracking-wide text-white font-display mb-6 uppercase border-b border-white/5 pb-3">
                GYM INTENSITY DATA
              </h3>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div id="counter-members" className="flex flex-col">
                  <span className="text-3xl font-black text-neon-green font-display">
                    <Counter end={1000} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                    Happy Members
                  </span>
                </div>

                <div id="counter-trainers" className="flex flex-col">
                  <span className="text-3xl font-black text-electric-blue font-display">
                    <Counter end={15} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                    Certified Expert Coach
                  </span>
                </div>

                <div id="counter-experience" className="flex flex-col">
                  <span className="text-3xl font-black text-white font-display">
                    <Counter end={5} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                    Years of Growth
                  </span>
                </div>

                <div id="counter-hardware" className="flex flex-col">
                  <span className="text-3xl font-black text-neutral-200 font-display">
                    <Counter end={50} suffix="+" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                    Elite Workstations
                  </span>
                </div>
              </div>

              {/* Action Call for urgent register */}
              <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold tracking-widest text-neon-green uppercase leading-none mb-1">
                    FREE TRIAL PASS
                  </span>
                  <span className="text-xs font-medium text-neutral-300">
                    Only 12 passes left today!
                  </span>
                </div>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-black font-extrabold text-xs tracking-wider uppercase hover:bg-neon-green transition-colors duration-300 ease-out cursor-pointer"
                >
                  CLAIM
                </button>
              </div>
            </motion.div>

            {/* Miniature floating aesthetic widget 1 */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -left-4 hidden sm:flex items-center gap-3 p-3 rounded-xl bg-neutral-900/90 border border-white/10 shadow-lg text-left"
            >
              <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase tracking-wider">LIVE ATHLETES</span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">36 TRAINING NOW</span>
              </div>
            </motion.div>

            {/* Miniature floating aesthetic widget 2 */}
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-3 p-3 rounded-xl bg-neutral-900/90 border border-white/10 shadow-lg text-left"
            >
              <div className="p-2 rounded-lg bg-electric-blue/10 text-electric-blue">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase tracking-wider">CERTIFIED ISO-9001</span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase">100% PREMIUM TECH</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
