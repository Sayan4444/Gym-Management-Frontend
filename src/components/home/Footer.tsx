import { Dumbbell, Globe, Video, MapPin, Phone, Mail, Camera, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Gym } from '@/data/types';

export default function Footer({ gym }: { gym: Gym }) {
  const currentYear = new Date().getFullYear();

  const handleSmoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 85;
      window.scrollTo({
        top: top,
        behavior: 'smooth',
      });
    }
  };

  const quickLinks = [
    { label: 'Home', target: 'home' },
    { label: 'About Us', target: 'about' },
    { label: 'Our Services', target: 'services' },
    { label: 'Gallery', target: 'gallery' },
    { label: 'Pricing Plans', target: 'pricing' },
    { label: 'Transformations', target: 'transformations' },
    { label: 'Testimonials', target: 'reviews' },
    { label: 'Visit Location', target: 'location' },
    { label: 'Contact', target: 'contact' },
  ];

  const servicesLinks = [
    { label: 'Strength Training', target: 'services' },
    { label: 'Weight Loss Programs', target: 'services' },
    { label: 'Personal Training', target: 'services' },
    { label: 'Cardio Training', target: 'services' },
    { label: 'Functional Training', target: 'services' },
    { label: 'Nutrition Guidance', target: 'services' },
  ];

  const socialMedia = [];
  if (gym.facebook) {
    socialMedia.push({
      name: 'Facebook Fanbase',
      url: gym.facebook,
      icon: Globe,
      colorClass: 'hover:text-sky-500 hover:border-sky-500/30 hover:bg-sky-500/5',
      accentColor: 'text-sky-500',
    });
  }
  if (gym.instagram) {
    socialMedia.push({
      name: 'Instagram Profile',
      url: gym.instagram,
      icon: Camera,
      colorClass: 'hover:text-pink-500 hover:border-pink-500/30 hover:bg-pink-500/5',
      accentColor: 'text-pink-500',
    });
  }
  if (gym.youtube) {
    socialMedia.push({
      name: 'YouTube Channel',
      url: gym.youtube,
      icon: Video,
      colorClass: 'hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5',
      accentColor: 'text-red-500',
    });
  }

  return (
    <footer className="relative bg-neutral-950 border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Visual Ambient glow at the footer core */}
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Social Media Section Embedded Banner */}
        {socialMedia.length > 0 && (
          <div className="bg-neutral-900 border border-white/5 rounded-3xl p-8 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-bl-full blur-xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-widest block">
                  COMMUNITY NETWORK
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-display mt-1">
                  FOLLOW THE MOVEMENT
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-light max-w-md">
                  Join our supportive online social circles. We upload daily workout tips, client lifts, recipes, and home exercise routines.
                </p>
              </div>

              {/* Social Cards Grid */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 md:mt-0">
                {socialMedia.map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 py-3.5 px-6 rounded-2xl bg-neutral-950 border border-white/5 text-xs font-black uppercase tracking-widest text-neutral-300 transition-all duration-300 ${social.colorClass} cursor-pointer group`}
                    >
                      <SocialIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span>{social.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer directories links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/5">

          {/* Col 1: Brand details info */}
          <div className="lg:col-span-4 max-w-sm flex flex-col justify-start">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll('home');
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-electric-blue to-neon-green text-black group-hover:scale-105 transition-transform duration-300">
                <Dumbbell className="w-5 h-5 text-black font-extrabold" />
              </div>
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-black tracking-tight text-white leading-none">
                  TRANSFORM <span className="text-neon-green">360</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-neutral-400 -mt-0.5">
                  {gym.name}
                </span>
              </div>
            </a>

            <p className="mt-5 text-xs text-neutral-400 leading-relaxed font-light">
              {gym.name} represents the absolute pinnacle of premium gym setups. We help communities unlock authentic health physical limits through scientific compounds programs, individualized diet templates, and expert guidance.
            </p>

            {/* Minor accolades */}
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
              <ShieldCheck className="w-4.5 h-4.5 text-neon-green" />
              <span>ISO 9001-2015 certified club</span>
            </div>
          </div>

          {/* Col 2: Navigation primary */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-xs font-black text-white uppercase tracking-widest font-display mb-4">
              QUICK SECTIONS
            </h4>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleSmoothScroll(link.target)}
                  className="text-xs text-neutral-400 hover:text-neon-green transition-colors font-light text-left select-none cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Services secondary */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-xs font-black text-white uppercase tracking-widest font-display mb-4">
              CORE DIRECTORIES
            </h4>
            <div className="space-y-2.5 flex flex-col">
              {servicesLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleSmoothScroll(link.target)}
                  className="text-xs text-neutral-400 hover:text-electric-blue transition-colors font-light text-left select-none cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Contact card specifics */}
          {(gym.address || gym.phone || gym.email) && (
            <div className="lg:col-span-4 flex flex-col justify-start">
              <h4 className="text-xs font-black text-white uppercase tracking-widest font-display mb-4">
                DIRECT DESK INFO
              </h4>

              <div className="space-y-5">
                {gym.address && (
                  <div className="flex items-start gap-3 text-neutral-400 text-xs font-light">
                    <MapPin className="w-4 h-4 text-neon-green shrink-0 mt-0.5" />
                    <span>{gym.address}</span>
                  </div>
                )}

                {gym.phone && (
                  <div className="flex items-center gap-3 text-neutral-400 text-xs font-light">
                    <Phone className="w-4 h-4 text-electric-blue shrink-0" />
                    <span>{gym.phone}</span>
                  </div>
                )}

                {gym.email && (
                  <div className="flex items-center gap-3 text-neutral-400 text-xs font-light">
                    <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{gym.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Bottom credits */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          <span>
            © {currentYear} {gym.name}. {gym.address ? gym.address.split(',').pop()?.trim() : ''}
          </span>
          <div className="flex items-center gap-4">
            <a href="#about" onClick={(e) => { e.preventDefault(); handleSmoothScroll('about'); }} className="hover:text-white transition-colors">Safety Matrix</a>
            <span>•</span>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); handleSmoothScroll('pricing'); }} className="hover:text-white transition-colors">Membership Terms</a>
            <span>•</span>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleSmoothScroll('contact'); }} className="hover:text-white transition-colors">Privacy Shield</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
