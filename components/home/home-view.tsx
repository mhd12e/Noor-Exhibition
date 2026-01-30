"use client";

import { HeroSection } from "@/components/home/hero-section";
import { StorySection } from "@/components/home/story-section";
import { ScheduleSection } from "@/components/home/schedule-section";

export function HomeView() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <ScheduleSection />
    </>
  );
}