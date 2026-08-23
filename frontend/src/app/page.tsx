import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MasonryGallery from "@/components/MasonryGallery";
import AboutSection from "@/components/AboutSection";
import CollectionsSection from "@/components/CollectionsSection";
import FeaturedPaintings from "@/components/FeaturedPaintings";
import StudentsWorkSection from "@/components/StudentsWorkSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <HeroSection />
      <MasonryGallery />
      <AboutSection />
      <CollectionsSection />
      <FeaturedPaintings />
      <StudentsWorkSection />
      <ContactSection />
      <Footer />
    </SmoothScroll>
  );
}

