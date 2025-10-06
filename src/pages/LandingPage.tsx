import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { TargetAudience } from '../components/TargetAudience';
import { CoreFeatures } from '../components/CoreFeatures';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <TargetAudience />
        <CoreFeatures />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
