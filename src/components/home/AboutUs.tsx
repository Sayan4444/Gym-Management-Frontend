

import { motion } from 'motion/react';
import { Target, Eye, Dumbbell, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import Counter from './ui/Counter';
import { Gym } from '@/data/types';

export default function AboutUs({ gym }: { gym: Gym }) {
  const cards = [
    {
      icon: Target,
      title: 'Our Mission',
      content: 'To inspire, empower, and support our community to unlock their absolute physical and mental peak through custom-tailored elite guidance, world-class equipment, and specialized training programs.',
      glow: 'group-hover:border-neon-green/30',
      iconBg: 'bg-neon-green/15 text-neon-green',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      content: 'To establish the absolute pinnacle of premium, motivating fitness spaces where beginners and experienced athletes alike crush limitations, redefine their personal records, and spark lifelong health.',
      glow: 'group-hover:border-electric-blue/30',
      iconBg: 'bg-electric-blue/15 text-electric-blue',
    }
  ];

  const statItems = [
    { value: 1000, suffix: '+', label: 'Happy Members' },
    { value: 5, suffix: '+', label: 'Years Experience' },
    { value: 15, suffix: '+', label: 'Certified Trainers' },
    { value: 50, suffix: '+', label: 'Modern Equipment' },
  ];

  return (
    <section id="about" className="relative py-20 bg-neutral-950 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Premium Interactive Images & Stats */}
          <div className="col-span-12 lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4 relative">

              {/* Image 1: Main action shot */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] col-span-1 group shadow-2xl border border-white/5">
                <img
                  src="https://picsum.photos/seed/elite_trainer_bicep/600/800"
                  alt="Personal Training Strength Coach"
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-green">
                    Intensity Focus
                  </span>
                </div>
              </div>

              {/* Image 2: Secondary workspace shot */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] col-span-1 mt-8 group shadow-2xl border border-white/5">
                <img
                  src="https://picsum.photos/seed/clean_dumbbells_row/600/800"
                  alt="Premium Dumbbells Area"
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-electric-blue">
                    Elite Hardware
                  </span>
                </div>
              </div>

              {/* Stat badging below images */}
              <div className="col-span-2 mt-4 sm:mt-8 w-full bg-neutral-900/50 rounded-xl p-5 border border-white/10 shadow-2xl flex items-center justify-around text-center backdrop-blur-xl">
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black text-neon-green font-display leading-none">
                    <Counter end={100} suffix="%" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                    Premium Quality
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black text-white font-display leading-none">
                    <Counter end={24} suffix="/7" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                    Club Support
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black text-electric-blue font-display leading-none">
                    <Counter end={360} suffix="°" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                    Care Matrix
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & Statements */}
          <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            {/* Super header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-6 bg-neon-green rounded-full" />
              <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
                WHO WE ARE
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display leading-none mb-6">
              Why Choose <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neon-green">
                {gym.name}
              </span>
            </h2>

            {/* Core Description Text */}
            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8">
              {gym.name} is dedicated to helping members achieve their health and fitness goals through expert guidance, modern training equipment, and a supportive environment. Whether you&apos;re a beginner or an experienced athlete, our customized fitness programs are designed to maximize results.
            </p>

            {/* Mission & Vision Bento Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {cards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={idx}
                    className={`group relative p-5 rounded-xl bg-neutral-900 border border-white/5 transition-all duration-300 hover:bg-neutral-900/80 hover:scale-[1.01] hover:-translate-y-0.5 ${card.glow}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${card.iconBg}`}>
                      <IconComponent className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2 font-display">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {card.content}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Multi counter row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-900/40 border border-white/5">
              {statItems.map((stat, idx) => (
                <div key={idx} className="text-center sm:text-left flex flex-col">
                  <span className="text-2xl font-black text-white font-display leading-none">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
