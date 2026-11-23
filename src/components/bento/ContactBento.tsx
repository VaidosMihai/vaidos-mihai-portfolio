import React from "react";
import TiltCard from "@/components/motion/TiltCard";
import { SectionBadge } from "@/components/ui/SectionHeader";
import ContactActionTiles from "./ContactActionTiles";
import ContactForm from "./ContactForm";
import { Sparkles } from "lucide-react";

export default function ContactBento() {
  return (
    <section id="contact" className="relative py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TiltCard variant="elevated" className="p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <SectionBadge
              icon={<Sparkles className="w-3.5 h-3.5" />}
              label="COMMUNICATION & COLLABORATION"
              className="mb-4"
            />

            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight mb-3">
              Let&apos;s Build Mission-Critical Software
            </h2>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mb-8">
              Open to high-impact test automation, embedded software
              engineering, and protocol validation opportunities. Feel free to
              reach out directly via email, phone, or connect on LinkedIn and
              GitHub.
            </p>

            <ContactActionTiles />
            <ContactForm />
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
