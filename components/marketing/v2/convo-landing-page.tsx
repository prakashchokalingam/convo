'use client';

import { Footer } from './navigation/footer';
import { NavigationHeader } from './navigation/header';
import { CTASection } from './sections/cta-section';
import { FeaturesShowcase } from './sections/features-showcase';
import { HeroSection } from './sections/hero-section';
import { IntegrationsSection } from './sections/integrations-section';
import { PricingPreviewSection } from './sections/pricing-preview-section';
import { ROICalculatorSection } from './sections/roi-calculator-section';
import { SocialProofSection } from './sections/social-proof-section';
import { TestimonialsSection } from './sections/testimonials-section';
import { TrustIndicatorsSection } from './sections/trust-indicators-section';
import { UseCasesSection } from './sections/use-cases-section';

export function ConvoV2LandingPage() {
  return (
    <div className='min-h-screen bg-background'>
      <NavigationHeader />

      <main>
        {/* Hero Section with Interactive Demo */}
        <HeroSection />

        {/* Social Proof - Customer Logos */}
        <SocialProofSection />

        {/* AI-Powered Features Showcase */}
        <FeaturesShowcase />

        {/* Use Cases by Industry */}
        <UseCasesSection />

        {/* Interactive ROI Calculator */}
        <ROICalculatorSection />

        {/* Customer Success Stories */}
        <TestimonialsSection />

        {/* Integrations Ecosystem */}
        <IntegrationsSection />

        {/* Pricing Preview */}
        <PricingPreviewSection />

        {/* Trust & Security Indicators */}
        <TrustIndicatorsSection />

        {/* Final CTA */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
