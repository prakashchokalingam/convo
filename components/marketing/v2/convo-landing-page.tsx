"use client";

import { HeroSection } from './sections/hero-section';
import { SocialProofSection } from './sections/social-proof-section';
import { FeaturesShowcase } from './sections/features-showcase';
import { UseCasesSection } from './sections/use-cases-section';
import { ROICalculatorSection } from './sections/roi-calculator-section';
import { IntegrationsSection } from './sections/integrations-section';
import { PricingPreviewSection } from './sections/pricing-preview-section';
import { TestimonialsSection } from './sections/testimonials-section';
import { TrustIndicatorsSection } from './sections/trust-indicators-section';
import { CTASection } from './sections/cta-section';
import { NavigationHeader } from './navigation/header';
import { Footer } from './navigation/footer';

export function ConvoV2LandingPage() {
  return (
    <div className="min-h-screen bg-background">
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
