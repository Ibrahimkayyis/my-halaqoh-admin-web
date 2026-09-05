"use client";

import { MotionConfig } from "motion/react";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingFeatures } from "@/features/landing/components/landing-features";
import { LandingPreview } from "@/features/landing/components/landing-preview";
import { LandingRoles } from "@/features/landing/components/landing-roles";
import { LandingDownload } from "@/features/landing/components/landing-download";
import { LandingAdminCta } from "@/features/landing/components/landing-admin-cta";
import { LandingFaq } from "@/features/landing/components/landing-faq";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-[#F8FAFB] dark:bg-[#0F172A] overflow-x-hidden">
        <LandingNavbar />
        <LandingHero />
        <LandingFeatures />
        <LandingPreview />
        <LandingRoles />
        <LandingDownload />
        <LandingAdminCta />
        <LandingFaq />
        <LandingFooter />
      </main>
    </MotionConfig>
  );
}
