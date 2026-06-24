import { MapPin, Phone, Mail, Clock, ShieldAlert, Navigation, Compass } from 'lucide-react';
import { Gym } from '@/data/types';

export default function MapSection({ gym }: { gym: Gym }) {
  const directionsUrl = gym.googleMapsLink;

  return (
    <section id="location" className="relative py-20 bg-neutral-950 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-electric-blue/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-neon-green rounded-full" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-[0.3em] text-neon-green">
              FIND US LOCAL
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-display leading-none">
            VISIT OUR FACILITY
          </h2>
          <p className="mt-4 text-neutral-400 font-light text-sm sm:text-base">
            Drop by for a premium physical walk-through or schedule a personal session. We provide dedicated lockers and certified assistance.
          </p>
        </div>

        {/* Map Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">

          {/* Left: Beautiful Embedded IFrame Map */}
          <div className="col-span-12 lg:col-span-7 rounded-3xl overflow-hidden min-h-[350px] lg:min-h-[480px] border border-white/10 shadow-2xl relative group">
            {/* Standard embedded Google Map pointer pointing to a high premium sports block */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.133742456012!2d77.3789069150824!3d28.625754582420485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceff135555555%3A0x6bbaec43b1f3c306!2sTransform360Gym!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(10%) contrast(110%)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Transform 360 Gym Plus Location Map"
              className="absolute inset-0 w-full h-full"
            />

            {/* Small floating action sticker on top-right map */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex items-center gap-2 max-w-[240px]">
              <Compass className="w-5 h-5 text-neon-green animate-spin-slow" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-white uppercase font-display leading-none mb-1">
                  SECURE VALET
                </span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase leading-none">
                  FREE FOR MEMBERS
                </span>
              </div>
            </div>
          </div>

          {/* Right: Rich visual Contact detail and operational matrix cards */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-between gap-6">

            {/* Contact details container */}
            <div className="rounded-3xl p-6 md:p-8 bg-neutral-900/60 border border-white/5 flex-1 select-none flex flex-col justify-between">

              <div>
                <span className="text-[10px] font-mono font-bold text-neon-green uppercase tracking-widest">
                  LOCATION & CARD DETAILS
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-display mt-1">
                  {gym.name}
                </h3>

                {/* Info row bullets */}
                <div className="mt-8 space-y-6">

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-neon-green/10 text-neon-green shrink-0">
                      <MapPin className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-wider">HEADQUARTERS ADDRESS</span>
                      <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
                        {gym.address || 'Address not available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-electric-blue/10 text-electric-blue shrink-0">
                      <Clock className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-wider">CLUB SESSIONS CALENDAR</span>
                      <p className="text-xs text-neutral-400 font-light mt-1">
                        Mon - Sat: 5:00 AM &ndash; 10:00 PM (Active)
                      </p>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Sunday: 6:00 AM &ndash; 2:00 PM (Recharge)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/5 text-white shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-wider">DIRECT VOICE TELEPHONY</span>
                      <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
                        {gym.phone || 'Phone not available'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action buttons directions link */}
                <div className="mt-8">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-green to-electric-blue hover:from-white hover:to-white text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg shadow-neon-green/10 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-black fill-black animate-pulse" />
                    Get Live Directions on Map
                  </a>
                </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
