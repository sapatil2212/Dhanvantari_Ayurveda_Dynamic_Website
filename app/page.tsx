import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import TreatmentsPreview from '@/components/home/TreatmentsPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import InteractiveGallery from '@/components/ui/InteractiveGallery';
import VirtualTourPreview from '@/components/home/VirtualTourPreview';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutPreview />
      <TreatmentsPreview />
      <VirtualTourPreview />
      <InteractiveGallery />
      <TestimonialsSection />
    </div>
  );
}