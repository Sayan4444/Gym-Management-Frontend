import { useState, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle2, MessageCircle, Send, Calendar, Sparkles } from 'lucide-react';
import { Gym } from '@/data/types';
import { useBookDemo } from '@/hooks/apis/useBookDemo';

interface FormData {
  name: string;
  phone: string;
  email: string;
  fitnessGoal: string;
  message: string;
}

interface ContactSectionProps {
  gym: Gym;
}

export default function ContactSection({ gym }: ContactSectionProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    fitnessGoal: 'Lose Weight',
    message: '',
  });

  const bookDemoMutation = useBookDemo();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const fitnessGoals = [
    'Lose Weight',
    'Gain Muscle',
    'Build Strength',
    'Cardiovascular Stamina',
    'Functional Mobility',
    'General Physical Fitness',
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: Partial<FormData> = {};
    if (!formData.name.trim()) tempErrors.name = 'FullName is required';
    
    // Simple Indian phone standard check
    const phoneRegex = /^[0-9+() -]{10,14}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = 'Please provide a valid contact number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    bookDemoMutation.mutate(
      {
        fullName: formData.name,
        mobile: formData.phone,
        email: formData.email,
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: '10:00',
        notes: `Fitness Goal: ${formData.fitnessGoal}. ${formData.message}`
      },
      {
        onSuccess: () => {
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 5500);
        }
      }
    );
  };

  const whatsAppNumber = gym.whatsapp || 'NA';
  const preFilledText = encodeURIComponent(
    `Hi ${gym.name || 'NA'}! I am highly interested in booking a free physical consultation and exploring your premium facility packages.`
  );
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${preFilledText}`;
  const phoneCallLink = `tel:${gym.phone || 'NA'}`;

  return (
    <section id="contact" className="relative py-20 bg-neutral-900 overflow-hidden">
      {/* Background ambient highlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-neon-green/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-electric-blue/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-neon-green rounded-full" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
              INITIAL CONVERSATION
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display leading-none">
            START YOUR JOURNEY TODAY
          </h2>
          <p className="mt-4 text-neutral-400 font-light text-sm sm:text-base">
            Book your free trial pass, secure an expert biochemical posture consultation, or chat directly via cellular streams.
          </p>
        </div>

        {/* Form Grid */}
        <div className="mx-auto grid min-w-0 max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Direct WhatsApp / Call Buttons and consult perks */}
          <div className="flex min-w-0 flex-col justify-between lg:col-span-5">
            <div className="rounded-3xl p-6 md:p-8 bg-neutral-950 border border-white/5 h-full flex flex-col justify-between">
              
              <div>
                <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-widest block">
                  ACCELERATED RESPONSE DIRECTORY
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-display mt-1">
                  IMMEDIATE TELEPHONE PERKS
                </h3>
                
                <p className="mt-4 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Want to skip forms? Trigger direct cryptographic streams on WhatsApp or reach our reception instantly via phone lines.
                </p>

                {/* Direct Action triggers (WhatsApp & Call) */}
                <div className="mt-8 space-y-4">
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg shadow-emerald-600/10 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-white fill-white" />
                    Chat on WhatsApp Now
                  </a>

                  <a
                    href={phoneCallLink}
                    className="w-full py-4 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/30 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-neon-green" />
                    Call Reception Desk Directly
                  </a>
                </div>

                <hr className="border-white/5 my-8" />

                {/* Consultation checks */}
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-display">
                  FREE CONSULTATION PASS INCLUDES
                </h4>

                <div className="space-y-3.5">
                  {[
                    '25-minute body weight matrix and body mass index index analysis',
                    'Direct postural alignment and flexibility testing by master trainer',
                    'One day free access pass to elite machine zones (lockers inclusive)',
                    'Specialized hydration schedule formulated for individual schedules',
                  ].map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 stroke-[2.5]" />
                      <p className="text-xs text-neutral-400 leading-tight">
                        {perk}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badge footer */}
              <div className="mt-8 p-3.5 rounded-xl bg-neutral-900 border border-white/5 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-neon-green shrink-0" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-tight">
                  No-credit cards needed to book a general tour!
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-3xl p-6 md:p-8 bg-neutral-950 border border-white/5 relative">
              
              <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider font-display border-b border-white/5 pb-4 mb-6">
                SCHEDULE VISIT PROFILE
              </h3>

              <form className="space-y-5">
                
                {/* Full name input */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`px-4 py-3.5 rounded-xl bg-neutral-900 border text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-green transition-all ${
                      errors.name ? 'border-red-500' : 'border-white/5'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-[10px] font-mono mt-1 uppercase">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email and Phone Grid */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Phone input */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className={`px-4 py-3.5 rounded-xl bg-neutral-900 border text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-green transition-all ${
                        errors.phone ? 'border-red-500' : 'border-white/5'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-[10px] font-mono mt-1 uppercase">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Email input */}
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. name@domain.com"
                      className={`px-4 py-3.5 rounded-xl bg-neutral-900 border text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-green transition-all ${
                        errors.email ? 'border-red-500' : 'border-white/5'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-[10px] font-mono mt-1 uppercase">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Fitness Goal Select Dropdown */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                    Primary Fitness Goal
                  </label>
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleInputChange}
                    className="px-4 py-3.5 rounded-xl bg-neutral-900 border border-white/5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-green transition-all appearance-none relative select-none"
                  >
                    {fitnessGoals.map((goal, idx) => (
                      <option key={idx} value={goal} className="bg-neutral-950 text-white py-1">
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message notes input */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                    Your Message / Special Requests
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your fitness history, specific physical pains if any, or general constraints..."
                    className="px-4 py-3.5 rounded-xl bg-neutral-900 border border-white/5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-green transition-all resize-none"
                  />
                </div>

                {/* Submit button trigger */}
                <div className="pt-4">
                  <button
                    type="submit"
                    onClick={handleFormSubmission}
                    disabled={bookDemoMutation.isPending}
                    className="w-full py-4 rounded-xl bg-neon-green text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg shadow-neon-green/15 cursor-pointer hover:bg-white disabled:opacity-50"
                  >
                    <Calendar className="w-4 h-4 text-black shrink-0" />
                    {bookDemoMutation.isPending ? 'Scheduling...' : 'Book Consultation'}
                  </button>
                </div>

              </form>

              {/* Form Success Overlay Notification */}
              <AnimatePresence>
                {showSuccessToast && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-neutral-950 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center z-20 border border-neon-green/30"
                  >
                    <div className="p-4 bg-neon-green/10 rounded-full text-neon-green mb-6 animate-bounce">
                      <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                    </div>

                    <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-widest mb-1">
                      VERIFICATION SUCCESSFUL
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-display">
                      THANK YOU, {formData.name.toUpperCase()}!
                    </h3>

                    <p className="mt-4 text-sm text-neutral-300 leading-relaxed max-w-sm">
                      Your booking request regarding <strong>{formData.fitnessGoal}</strong> has been secured. A certified fitness counselor will reach out on <strong>{formData.phone}</strong> and your email address within 2 hours.
                    </p>

                    <button
                      onClick={() => {
                        setShowSuccessToast(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          fitnessGoal: 'Lose Weight',
                          message: '',
                        });
                      }}
                      className="mt-8 px-6 py-2.5 rounded-lg bg-neutral-900 border border-white/10 hover:border-white/30 text-white font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Dismiss View
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
