import React from "react";
import FluidMeshBackground from "@/components/canvas/FluidMeshBackground";
import MuscleCarTransition from "@/components/canvas/MuscleCarTransition";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroBento from "@/components/bento/HeroBento";
import InteractiveSchematicsSection from "@/components/schematics/InteractiveSchematicsSection";
import TelemetrySimulator from "@/components/bento/TelemetrySimulator";
import ExperienceBento from "@/components/bento/ExperienceBento";
import TechStackBento from "@/components/bento/TechStackBento";
import EducationBento from "@/components/bento/EducationBento";
import ContactBento from "@/components/bento/ContactBento";
import CommandMenu from "@/components/command-menu/CommandMenu";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-canvas flex flex-col">
      {/* 2D Fluid Mesh Background Canvas */}
      <FluidMeshBackground />

      <Header />

      <main className="relative z-10 flex-1 overflow-x-clip">
        {/* Hero Bento */}
        <HeroBento />

        {/* Signature Automotive Racecar Scroll Transition */}
        <MuscleCarTransition />

        {/* Interactive Architecture Schematics */}
        <InteractiveSchematicsSection />

        {/* Live Diagnostic & DLT Telemetry Simulator */}
        <TelemetrySimulator />

        {/* Experience Timeline & Project Deep-Dives */}
        <ExperienceBento />

        {/* Technical Skills Matrix */}
        <TechStackBento />

        {/* Academic Foundation & Certifications */}
        <EducationBento />

        {/* Minimalist Contact & Collaboration Module */}
        <ContactBento />
      </main>

      <Footer />

      {/* Command Palette Modal */}
      <CommandMenu />
    </div>
  );
}
