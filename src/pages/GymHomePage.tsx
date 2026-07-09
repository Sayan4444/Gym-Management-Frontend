import { useGymIDFromDomain, useGym } from "@/hooks/useApi";
import Loader from "@/components/home/Loader";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import AboutUs from "@/components/home/AboutUs";
import Services from "@/components/home/Services";
import Gallery from "@/components/home/Gallery";
import Pricing from "@/components/home/Pricing";
import Transformation from "@/components/home/Transformation";
import Reviews from "@/components/home/Reviews";
import MapSection from "@/components/home/MapSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";
import BackToTop from "@/components/home/BackToTop";

export default function GymHomePage({ domain }: { domain: string }) {
  const { data: gymIdObj, isLoading: isIdLoading } = useGymIDFromDomain(domain);
  const { data: gym, isLoading: isGymLoading } = useGym(gymIdObj?.id);

  if (isIdLoading || isGymLoading) {
    return (
      <div className="bg-black text-white min-h-screen font-sans selection:bg-neon-green/30">
        <Loader isLoadingApi={true} />
      </div>
    );
  }

  if (!gym) return null;

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-neon-green/30">
      {/* Full-screen Loading Animation */}
      <Loader isLoadingApi={false} gym={gym} />

      {/* Sticky Header Navigation */}
      <Header gym={gym} />

      <main className="overflow-x-hidden">
        {/* Hero Banner Section */}
        <Hero gym={gym} />

        {/* About Brand / Stats Section */}
        <AboutUs gym={gym} />

        {/* Premium Services Carousel Section */}
        <Services gym={gym} />

        {/* Lightbox Filterable Gallery Section */}
        <Gallery />

        {/* Glassmorphic Membership Pricing Section */}
        <Pricing gymId={gym.id} />

        {/* Before / After Success Stories Section */}
        <Transformation gym={gym} />

        {/* Testimonial Auto Slider Section */}
        <Reviews gym={gym} />

        {/* IFrame Google Maps / Contact Sidecard Section */}
        <MapSection gym={gym} />

        {/* Lead capture & free consultation booking Section */}
        <ContactSection gym={gym} />
      </main>

      {/* Footer Details & Social Media Block */}
      <Footer gym={gym} />

      {/* Viewport tracking scroll indicator back-to-top */}
      <BackToTop />
    </div>
  );
}
