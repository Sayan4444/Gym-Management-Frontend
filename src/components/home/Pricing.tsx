

import { motion } from 'motion/react';
import { Check, Info, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { useMembershipPlansByGym } from '@/hooks/apis/useMembership';

export default function Pricing({ gymId }: { gymId?: number }) {
  const { data: membershipData, isLoading } = useMembershipPlansByGym(gymId);
  const plans = membershipData?.memberships?.filter(p => p.isActive) || [];

  const handlePlanSelection = (planName: string) => {
    // Scroll to the contact element and auto fill goal or display notification
    const element = document.getElementById('contact');
    if (element) {
      const top = element.offsetTop - 85;
      window.scrollTo({
        top: top,
        behavior: 'smooth',
      });

      // We can enrich input boxes or notify the window
      const messageTextarea = document.getElementById('contact-message') as HTMLTextAreaElement;
      if (messageTextarea) {
        messageTextarea.value = `I'm highly interested in joining the ${planName} plan. Please register me for a walkthrough tour.`;
      }
    }
  };

  if (!gymId) return null;

  return (
    <section id="pricing" className="relative py-20 bg-neutral-900 overflow-hidden">
      {/* Background glowing particles */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-electric-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-neon-green/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-neon-green rounded-full" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
              MEMBERSHIP PLANS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display leading-[1.1]">
            INVEST IN YOUR HEALTH
          </h2>
          <p className="mt-4 text-neutral-400 font-light text-sm sm:text-base">
            Transparent pricing structures with no hidden maintenance fees. Select your tier and launch your transformation.
          </p>

        </div>

        {/* Pricing Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center my-12 relative z-10">
            <div className="w-8 h-8 rounded-full border-4 border-white/10 border-t-neon-green animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto relative z-10">
            {plans.map((plan, idx) => {
              const isPopular = idx === 1; // highlight second plan usually
              const badgeText = isPopular ? 'RECOMMENDED' : idx === 2 ? 'ELITE VIP' : undefined;
              const accentClass = isPopular 
                ? 'border-neon-green/45 shadow-lg shadow-neon-green/5 hover:border-neon-green/80 hover:shadow-neon-green/10'
                : idx === 2
                  ? 'border-electric-blue/45 shadow-lg shadow-electric-blue/5 hover:border-electric-blue/80 hover:shadow-electric-blue/10'
                  : 'border-white/5 hover:border-white/20 hover:shadow-white/5';
              const ctaText = isPopular ? 'Most Popular' : idx === 2 ? 'Join Premium' : 'Get Started';
              
              const features = plan.planAddons && plan.planAddons.length > 0 
                ? plan.planAddons.map((pa: any) => pa.addon?.name || '') 
                : ['Gym Access', 'Cardio Area', 'Locker Facility'];

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative group rounded-3xl p-8 bg-neutral-950/80 backdrop-blur-2xl border flex flex-col justify-between transition-all duration-300 glass-card-hover ${accentClass}`}
                >
                  {/* Visual Popular border overlay */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-neon-green to-electric-blue text-black text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-black stroke-[3]" />
                      {badgeText}
                    </div>
                  )}

                  {/* Visual VIP border overlay */}
                  {!isPopular && badgeText && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-neutral-900 border border-electric-blue/30 text-electric-blue text-[9px] font-extrabold uppercase tracking-widest shadow-md">
                      {badgeText}
                    </div>
                  )}

                  <div>
                    {/* Plan Name */}
                    <h3 className="text-xl font-black text-white uppercase tracking-wider font-display mb-1">
                      {plan.name}
                    </h3>

                    {/* Price Banner */}
                    <div className="flex items-baseline gap-1 mt-4 mb-2">
                      <span className="text-sm font-semibold text-neutral-400">₹</span>
                      <span className="text-4xl font-extrabold text-white font-display tracking-tight transition-all">
                        {plan.price}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">/ {plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}</span>
                    </div>

                    <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-neutral-500 mb-6">
                      Valid for {plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}
                    </div>

                    <hr className="border-white/5 my-6" />

                    {/* Bullet points features list */}
                    <ul className="space-y-4 mb-8">
                      {features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-3">
                          <div className={`p-0.5 rounded-full shrink-0 ${isPopular
                              ? 'bg-neon-green/10 text-neon-green'
                              : idx === 2
                                ? 'bg-electric-blue/10 text-electric-blue'
                                : 'bg-white/10 text-neutral-400'
                            }`}>
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                          <span className="text-sm text-neutral-300 font-light leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing CTA */}
                  <button
                    onClick={() => handlePlanSelection(plan.name)}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer ${isPopular
                        ? 'bg-neon-green text-black hover:bg-neutral-100 shadow-neon-green/10 hover:shadow-neon-green/20'
                        : idx === 2
                          ? 'bg-electric-blue text-black hover:bg-white shadow-electric-blue/10 hover:shadow-electric-blue/20'
                          : 'bg-neutral-900 text-white border border-white/10 hover:text-black hover:bg-white'
                      }`}
                  >
                    {ctaText}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Small Trust footer */}
        <div className="mt-12 text-center max-w-sm mx-auto flex items-center justify-center gap-2 text-[11px] font-medium text-neutral-500">
          <Info className="w-4 h-4 text-neutral-500" />
          <span>All pricing tiers subject to full gym terms and conditions.</span>
        </div>

      </div>
    </section>
  );
}
