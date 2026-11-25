import React, { useEffect, useRef } from 'react';
import { SakugaButton } from '../effects/SakugaButton';
import { PROFILE } from '../../data/profile';
import { globalAnchorManager } from '../../environment/world/DOMAnchors';
import { 
  ArrowRight, 
  BookOpen
} from 'lucide-react';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (heroRef.current) {
      globalAnchorManager.registerElement('hero-ledge', heroRef.current, 'platform', 'The Highlands');
    }
    return () => {
      globalAnchorManager.unregisterElement('hero-ledge');
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-6 z-10">
        {/* Status Badge (Job Role) */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#272343]/90 border border-[#4a4378] backdrop-blur-md pixel-corners-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d8ff7a] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d8ff7a]" />
          </span>
          <span className="text-sm sm:text-base text-[#fbf1d4] tracking-wide font-mono">
            AI Engineer | Machine Learning & Agentic Systems Specialist
          </span>
        </div>

        {/* Heading & Tagline */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#fbf1d4] font-display">
            Wongai <span className="text-[#b8b0d4] font-normal">(Zee)</span> Rankin
          </h1>
          <p className="text-2xl sm:text-3xl font-medium text-gradient-ember max-w-2xl mx-auto">
            Engineering autonomous intelligence from model weights to full-stack production.
          </p>
        </div>

        {/* Short description paragraph (up to Asrix BHD) */}
        <p className="text-[#fbf1d4] text-lg sm:text-xl leading-relaxed max-w-2xl font-light p-4 sm:p-5 bg-[#272343]/92 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl text-center mx-auto">
          Final-year BSc Computer Science (Hons) specialist with <strong className="font-semibold text-[#fbf1d4]">7 years of programming experience</strong> and industry Work-Based Learning at <strong className="font-semibold text-[#fbf1d4]">Asrix BHD</strong>.
        </p>

        {/* Core Highlights Row (4 tag numbers) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 py-2 w-full max-w-3xl mx-auto">
          {PROFILE.stats.map((stat, i) => (
            <div
              key={i}
              className="p-3.5 bg-[#272343]/90 border border-[#4a4378] backdrop-blur-md hover:border-[#ff9a3c]/60 pixel-corners transition-all text-center flex flex-col items-center justify-center"
            >
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#ff9a3c]">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-medium text-[#fbf1d4] mt-0.5">{stat.label}</div>
              <div className="text-xs sm:text-sm text-[#b8b0d4] truncate mt-0.5">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons (3 navigation buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <a href="#capabilities">
            <SakugaButton variant="primary" size="lg" icon={<BookOpen className="w-4 h-4" />}>
              Explore Skills & Experience
            </SakugaButton>
          </a>

          <a href="#projects">
            <SakugaButton variant="secondary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              View Projects
            </SakugaButton>
          </a>

          <a href="#contact">
            <SakugaButton variant="outline" size="lg">
              Get in Touch
            </SakugaButton>
          </a>
        </div>
      </div>
    </section>
  );
};
