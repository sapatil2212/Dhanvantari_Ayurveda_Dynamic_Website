import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesPreview from '@/components/home/ServicesPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import InteractiveGallery from '@/components/ui/InteractiveGallery';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutPreview />
      <ServicesPreview />
      <InteractiveGallery />
      <TestimonialsSection />
    </div>
  );
}