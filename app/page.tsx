import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/landing/Hero';
import { Introduction } from '../components/landing/Introduction';
import { Journey } from '../components/landing/Journey';
import { ResetDeepDive } from '../components/landing/ResetDeepDive';
import { ResourcesSection } from '../components/landing/ResourcesSection';
import { CommunitySection } from '../components/landing/CommunitySection';
import { AccountabilitySection } from '../components/landing/AccountabilitySection';
import { WeeklyRhythmSection } from '../components/landing/WeeklyRhythmSection';
import { ExperienceFlowSection } from '../components/landing/ExperienceFlowSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCta } from '../components/landing/FinalCta';
import { Footer } from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <Introduction />
        <Journey />
        <ResetDeepDive />
        <ResourcesSection />
        <CommunitySection />
        <AccountabilitySection />
        <WeeklyRhythmSection />
        <ExperienceFlowSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCta />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
