import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Dumbbell, Calendar, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gym } from '@/data/types';
import { useFeaturedReviews } from '@/hooks/useApi';

interface NavLink {
  label: string;
  href: string;
}

export default function Header({ gym }: { gym: Gym }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const hasReviews = (useFeaturedReviews(gym.id).data?.count ?? 0) > 0;

  const navLinks: NavLink[] = useMemo(() => [
      { label: 'Home', href: '#home' },
      { label: 'About Us', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Results', href: '#transformations' },
      ...(hasReviews ? [{ label: 'Reviews', href: '#reviews' }] : []),
      { label: 'Location', href: '#location' },
      { label: 'Contact', href: '#contact' },
    ], [hasReviews]);

  useEffect(() => {
    const handleScroll = () => {
      // Check scrolled class
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section on scroll
      const scrollPosition = window.scrollY + 120; // offset of some header size
      for (const link of navLinks) {
        const id = link.href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run immediately to set initial active section
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navLinks]);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 85; // offset for sticky menu height
      window.scrollTo({
        top: top,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled
            ? 'glass-nav py-3'
            : 'bg-transparent py-5 border-b border-white/0'
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#home');
              }}
              className="group flex shrink-0 cursor-pointer items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-electric-blue to-neon-green text-black transition-transform duration-300 group-hover:scale-105">
                {gym.gymIcon ? (
                  <img src={gym.gymIcon} alt={gym.name} className="h-full w-full object-cover" />
                ) : (
                  <Dumbbell className="w-5 h-5 text-black font-extrabold" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="whitespace-nowrap text-lg font-black leading-none tracking-tight text-white md:text-xl">
                  {gym.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 -mt-0.5">
                  Fitness Club
                </span>
              </div>
            </a>

            {/* Centered desktop navigation */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 px-2 lg:flex xl:gap-6 xl:px-8">
              <nav className="flex items-center gap-2 xl:gap-6">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.replace('#', '');
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      className={`relative whitespace-nowrap py-1.5 text-sm font-semibold tracking-wide transition-colors ${isActive ? 'text-neon-green' : 'text-neutral-400 hover:text-white'
                        }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-green"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  );
                })}
              </nav>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#contact');
                }}
                className="flex items-center gap-1 whitespace-nowrap px-2 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:text-neon-green xl:px-4"
              >
                <Calendar className="w-4 h-4" />
                Book Trial
              </a>
            </div>

            {/* Dashboard CTA */}
            <Link
              to="/login"
              className="group relative hidden shrink-0 transform cursor-pointer overflow-hidden whitespace-nowrap rounded-lg bg-neon-green px-4 py-2.5 text-sm font-extrabold tracking-wide text-black shadow-lg shadow-neon-green/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-neon-green/40 lg:block xl:px-5"
            >
              <span className="relative z-10">GO TO DASHBOARD</span>
              <div className="absolute inset-0 z-0 translate-y-full bg-white opacity-20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 lg:hidden">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#contact');
                }}
                className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neon-green"
                aria-label="Direct consultation"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 rounded-lg focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-30 lg:hidden flex flex-col justify-center px-6"
          >
            {/* Grid background on mobile menu */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(57,255,20,0.04),rgba(255,255,255,0))]" />

            <nav className="relative z-10 flex flex-col gap-12 sm:gap-16 text-center py-16 overflow-y-auto max-h-[90vh]">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className={`text-2xl font-black uppercase tracking-widest block transition-colors ${activeSection === link.href.replace('#', '')
                        ? 'text-neon-green font-bold'
                        : 'text-neutral-400 hover:text-white'
                      }`}
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                className="mt-8 flex flex-col gap-4 max-w-xs mx-auto w-full"
              >
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-6 rounded-lg bg-neon-green text-black font-extrabold text-center tracking-wider shadow-lg shadow-neon-green/30 cursor-pointer"
                >
                  GO TO DASHBOARD
                </Link>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('#contact');
                  }}
                  className="py-3 px-6 rounded-lg bg-neutral-900 border border-white/10 text-white font-bold text-center tracking-wider cursor-pointer"
                >
                  BOOK FREE PRO TRIAL
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
