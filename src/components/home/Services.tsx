import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Target, Users, HeartPulse, Activity, Apple, ChevronRight, CheckCircle2, X } from 'lucide-react';

interface Service {
  id: string;
  icon: any;
  title: string;
  description: string;
  colorClass: string;
  accentColor: string;
  details: {
    stat: string;
    statLabel: string;
    highlights: string[];
    extendedText: string;
  };
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const servicesData: Service[] = [
    {
      id: 'strength',
      icon: Dumbbell,
      title: 'Strength Training',
      description: 'Build muscle, improve raw strength, and increase physical endurance under expert guidance.',
      colorClass: 'group-hover:border-neon-green/40 hover:shadow-neon-green/10',
      accentColor: 'text-neon-green',
      details: {
        stat: '25% Average Gain',
        statLabel: 'Muscular strength increase inside 12 weeks',
        highlights: [
          'Targeted professional hypertrophy layouts',
          'Barbell mechanics & elite heavy compound lifting',
          'Periodic deload structures to secure joint health',
          'Progressive resistance tracking systems',
        ],
        extendedText: 'Our Strength Training programs are built on real exercise science. We coach athletes and beginners through progressive overloading patterns to safely build density, burn stored fats, and accelerate resting tissue metabolism.',
      },
    },
    {
      id: 'weight-loss',
      icon: Target,
      title: 'Weight Loss Programs',
      description: 'Personalized metabolic plans specifically designed to help achieve rapid, sustainable fat loss.',
      colorClass: 'group-hover:border-electric-blue/40 hover:shadow-electric-blue/10',
      accentColor: 'text-electric-blue',
      details: {
        stat: '0.8 kg / Week',
        statLabel: 'Average healthy fat reduction benchmark',
        highlights: [
          'High-intensity interval metabolic optimization',
          'Lean composition focus targeting critical zones',
          'Resting body metabolic rate tracking and adaptation',
          'Custom weekly calorie budget partition guides',
        ],
        extendedText: 'Weight loss at Transform 360 values body composition over general scale weight. We build personalized metabolic programs that preserve muscle mass while burning lipid stores, delivering lean and toned physiques.',
      },
    },
    {
      id: 'personal-training',
      icon: Users,
      title: 'Personal Training',
      description: 'One-on-one coaching with elite, certified fitness experts dedicated entirely to your success.',
      colorClass: 'group-hover:border-white/40 hover:shadow-white/10',
      accentColor: 'text-white',
      details: {
        stat: '1-to-1 Mastery',
        statLabel: 'Entirely customized, dedicated attention',
        highlights: [
          'Custom personal workout adjustments',
          'Continuous biometric and physical posture corrections',
          'Dedicated micro-motivation and real accountability',
          'Adaptive fitness testing frameworks',
        ],
        extendedText: 'Personal coaching provides direct, expert physical correction. Our roster consists of accredited master trainers who optimize your kinetic form, mitigate joint injury pathways, and design specific, goal-centric exercises.',
      },
    },
    {
      id: 'cardio',
      icon: HeartPulse,
      title: 'Cardio Training',
      description: 'Improve heart health, maximum stamina, and lung volume with advanced athletic cardio gears.',
      colorClass: 'group-hover:border-neon-green/40 hover:shadow-neon-green/10',
      accentColor: 'text-neon-green',
      details: {
        stat: 'VO2 Max Boost',
        statLabel: 'Cardiopulmonary capacity improvement',
        highlights: [
          'Connected elite rowers, ski-ergs, and smart runners',
          'Real-time heart rate zone coaching layouts',
          'Sport-specific systemic stamina preparations',
          'Efficient high-burn metabolic programs',
        ],
        extendedText: 'Our high-performance cardio zones are equipped with cutting-edge equipment. Under our cardio designs, you will map and train within your optimal heart-rate targets to double your endurance and enhance cardiovascular longevity.',
      },
    },
    {
      id: 'functional',
      icon: Activity,
      title: 'Functional Training',
      description: 'Enhance organic mobility, core stability, balance, and athletic agility for real life.',
      colorClass: 'group-hover:border-electric-blue/40 hover:shadow-electric-blue/10',
      accentColor: 'text-electric-blue',
      details: {
        stat: '40% Less Fatigue',
        statLabel: 'Day-to-day functional physical stress indicators',
        highlights: [
          'Multi-planar dynamic kettlebell flows',
          'Rotational core stability drill complexes',
          'Plyometrics for explosive physical reaction times',
          'Flexibility and functional body alignment systems',
        ],
        extendedText: 'Functional fitness prepares your body for real-world kinetic complexity. We build exercises focused on core integration, rotational stability, and weight balance, making raw athletic motion feel effortless.',
      },
    },
    {
      id: 'nutrition',
      icon: Apple,
      title: 'Nutrition Guidance',
      description: 'Customized dietary analysis, micro-macro ratio breakdowns, and customized dietary schedules.',
      colorClass: 'group-hover:border-white/40 hover:shadow-white/10',
      accentColor: 'text-white',
      details: {
        stat: 'Macro-Precisely',
        statLabel: '100% custom dietary and supplement balance',
        highlights: [
          'Individualized protein-to-carbohydrate ratio structures',
          'Clean anti-inflammatory food substitutions',
          'Direct athletic hydration dynamic index values',
          'Continuous supplement plans and compliance tracking',
        ],
        extendedText: 'Training represents only half the battle. Our certified dietitians formulate robust, practical nutrition blueprints tailored exactly around your schedule, metabolic profile, and precise physical goal.',
      },
    },
  ];

  const handleBookService = () => {
    setSelectedService(null);
    const element = document.getElementById('contact');
    if (element) {
      const top = element.offsetTop - 85;
      window.scrollTo({
        top: top,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="services" className="relative py-20 bg-neutral-900 overflow-hidden">
      {/* Background radial neon */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-electric-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-neon-green rounded-full" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
              PREMIUM SERVICES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display leading-tight">
            WHAT WE DO BEST
          </h2>
          <p className="mt-4 text-neutral-400 font-light text-base md:text-lg">
            Achieve custom results through our premium, science-backed workout matrices led by elite specialists.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`group relative p-8 rounded-2xl bg-neutral-950 border border-white/5 flex flex-col justify-between transition-all duration-300 ${service.colorClass}`}
              >
                {/* Background glow placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent rounded-2xl pointer-events-none" />

                <div>
                  {/* Decorative glowing backplate for icon */}
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 duration-300 transition-transform relative">
                    <div className={`absolute inset-0 rounded-xl bg-current opacity-5 blur-sm ${service.accentColor}`} />
                    <IconComponent className={`w-6 h-6 ${service.accentColor}`} />
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider mb-3 font-display">
                    {service.title}
                  </h3>

                  <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neon-green hover:text-white transition-colors cursor-pointer group/btn"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Learn More Interactive Modal Drawer */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-neutral-950 rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden z-10 shadow-2xl"
            >
              {/* Highlight accent lines */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-electric-blue to-neon-green" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-neutral-900 border border-white/10 rounded-xl text-neon-green shrink-0">
                  {(() => {
                    const ModalIcon = selectedService.icon;
                    return <ModalIcon className="w-6 h-6 text-neon-green" />;
                  })()}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                    TRANSFORM 360 CORE MATRIX
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-display">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Statistic Grid highlight */}
              <div className="mb-6 p-4 rounded-xl bg-neutral-900 border border-white/5 flex flex-col sm:flex-row items-center sm:justify-start gap-4">
                <span className="text-3xl font-extrabold text-neon-green font-display shrink-0 tracking-tight">
                  {selectedService.details.stat}
                </span>
                <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
                <p className="text-xs text-neutral-300 font-medium text-center sm:text-left">
                  {selectedService.details.statLabel}
                </p>
              </div>

              {/* Explanation text */}
              <div className="mb-6">
                <p className="text-sm text-neutral-300 leading-relaxed font-light">
                  {selectedService.details.extendedText}
                </p>
              </div>

              {/* Highlights bullets list */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  PROGRAM HIGHLIGHTS
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedService.details.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 stroke-[2]" />
                      <span className="text-xs text-neutral-400 leading-tight">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleBookService}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neon-green text-black font-extrabold text-sm tracking-wider uppercase text-center cursor-pointer hover:bg-white transition-colors duration-300"
                >
                  BOOK TRIAL CONSULTATION
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neutral-900 border border-white/10 text-white font-bold text-sm tracking-wider uppercase hover:text-red-400 transition-colors cursor-pointer text-center"
                >
                  BACK TO SERVICES
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
