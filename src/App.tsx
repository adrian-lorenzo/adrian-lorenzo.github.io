import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { SolarSystemBackground } from "./components/SolarSystemBackground";
import { ExternalLink } from "./components/ExternalLink";
import { BulletList } from "./components/BulletList";
import { ANIMATION_CONFIG } from "./constants/animation";
import { PERSONAL_INFO, PROFESSIONAL_FOCUS, RECENT_ACCOMPLISHMENTS, SOCIAL_LINKS } from "./constants/content";
import { InfiniteMarquee } from "./components/InfiniteMarquee";
import { PlanetOrbitIcon } from "./components/PlanetOrbitIcon";

function AccessibilitySkipLink() {
  return (
    <a 
      href="#content" 
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-stone-900 text-stone-50 rounded px-3 py-2"
    >
      Skip to content
    </a>
  );
}

function BackgroundVignette() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(255,255,255,0.05),transparent_60%)]" />
  );
}

function PersonalIntroduction() {
  return (
    <p className="text-pretty">
      I'm <strong className="font-semibold">{PERSONAL_INFO.name}</strong>, an {PERSONAL_INFO.title}, currently {PERSONAL_INFO.currentRole} at{" "}
      <ExternalLink href={PERSONAL_INFO.company.url}>
        {PERSONAL_INFO.company.name}
      </ExternalLink>.
    </p>
  );
}

function ProfessionalFocusSection() {
  return (
    <section className="mt-8 space-y-4 text-pretty leading-relaxed">
      <p>{PROFESSIONAL_FOCUS}</p>
    </section>
  );
}

function RecentAccomplishmentsSection() {
  return (
    <section className="mt-6">
      <h2 className="sr-only">Lately I've</h2>
      <BulletList items={RECENT_ACCOMPLISHMENTS} />
    </section>
  );
}

function ContactSection() {
  return (
    <section className="mt-8">
      <p>You can say hi on:</p>
      <p>
        [x: <ExternalLink href={SOCIAL_LINKS.twitter.url}>
          {SOCIAL_LINKS.twitter.handle}
        </ExternalLink>]
      </p>
    </section>
  );
}

function MainContent() {
  const contentRef = useRef<HTMLElement | null>(null);
  
  const fadeInAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: ANIMATION_CONFIG.fadeInDuration, 
      ease: ANIMATION_CONFIG.fadeInEasing 
    },
  } as const;

  return (
    <motion.main
      id="content"
      {...fadeInAnimation}
      className="relative z-[2] mx-auto max-w-3xl px-6 pt-8 pb-16 md:pt-12 md:pb-20 leading-[1.7] content-responsive-text"
      ref={contentRef as any}
    >
      <div className="mb-4 flex justify-center">
        <PlanetOrbitIcon size={140} />
      </div>
      <PersonalIntroduction />
      <ProfessionalFocusSection />
      <RecentAccomplishmentsSection />
      <ContactSection />
    </motion.main>
  );
}

export default function PersonalSite() {
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    return () => document.documentElement.classList.remove("scroll-smooth");
  }, []);

  return (
    <div className="relative min-h-screen min-h-dvh bg-night-bg text-night-text antialiased selection:bg-stone-200 selection:text-stone-900">
  <InfiniteMarquee position="top" direction="left" />
  <InfiniteMarquee position="bottom" direction="right" />
      <SolarSystemBackground enabled={true} />
      <BackgroundVignette />
      <AccessibilitySkipLink />
      <MainContent />
    </div>
  );
}
