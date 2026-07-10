import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CheckCircle2, X } from 'lucide-react';
import { Gym } from '@/data/types';
import { getServicesCatalog, type Service } from '@/data/servicesCatalog';

export default function Services({ gym }: { gym: Gym }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const servicesData = useMemo(() => getServicesCatalog(gym.name), [gym.name]);

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
                    {gym.name} CORE MATRIX
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
