import React, { useState, useEffect, useRef } from 'react';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { SakugaButton } from '../effects/SakugaButton';
import { HoloCard } from '../effects/HoloCard';
import { PROFILE } from '../../data/profile';
import { ThinkingOrbState } from '../../types';
import { globalAnchorManager } from '../../environment/world/DOMAnchors';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  FileText, 
  Sparkles, 
  ExternalLink,
  Layers,
  Activity,
  Bot,
  BookOpen
} from 'lucide-react';

export const Hero: React.FC = () => {
  const [activeOrbState, setActiveOrbState] = useState<ThinkingOrbState>('working');
  const [explorerSpeech, setExplorerSpeech] = useState<string>("Welcome to the Living Engineer's Atlas!");
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (heroRef.current) {
      globalAnchorManager.registerElement('hero-ledge', heroRef.current, 'platform', 'The Highlands');
    }
    return () => {
      globalAnchorManager.unregisterElement('hero-ledge');
    };
  }, []);

  const orbStates: { state: ThinkingOrbState; label: string; desc: string }[] = [
    { state: 'working', label: 'Inference', desc: 'Parallel model execution' },
    { state: 'searching', label: 'Vector RAG', desc: 'Semantic knowledge retrieval' },
    { state: 'solving', label: 'ReAct Loop', desc: 'Multi-step autonomous reasoning' },
    { state: 'connecting', label: 'MCP Tools', desc: 'Schema-aware DB introspection' },
    { state: 'weaving', label: 'Google AP2', desc: 'Cryptographic intent mandates' },
    { state: 'shaping', label: 'YOLOv8 AOI', desc: 'Sub-millimeter defect detection' },
  ];

  const handleOrbChange = (state: ThinkingOrbState, desc: string) => {
    setActiveOrbState(state);
    setExplorerSpeech(`Switching agent mode: ${state.toUpperCase()} (${desc})`);
  };

  return (
    <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Introduction & Value Proposition (7 cols) */}
        <div className="lg:col-span-7 space-y-6 z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-aqua opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-aqua" />
            </span>
            <span className="text-sm sm:text-base text-slate-200 tracking-wide">
              AI Engineer | Machine Learning & Agentic Systems Specialist
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 font-display">
              Wongai <span className="text-slate-400 font-normal">(Zee)</span> Rankin
            </h1>
            <p className="text-2xl sm:text-3xl font-medium text-gradient-cyan">
              Engineering autonomous intelligence from model weights to full-stack production.
            </p>
          </div>

          {/* Bio paragraph */}
          <p className="text-slate-200 text-lg sm:text-xl leading-relaxed max-w-2xl font-light">
            Final-year BSc Computer Science (Hons) specialist with <strong className="font-semibold text-white">7 years of programming experience</strong> and industry Work-Based Learning at <strong className="font-semibold text-white">Asrix BHD</strong>. Architecting end-to-end intelligent systems: from low-latency industrial computer vision (YOLOv8) and local 4-bit LLM fine-tuning (Mistral 7B) to cutting-edge autonomous protocols (<strong className="text-brand-aqua font-semibold">Model Context Protocol</strong> & <strong className="text-brand-sky font-semibold">Google AP2</strong>).
          </p>

          {/* Core Highlights Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 py-2">
            {PROFILE.stats.map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-2xl sm:text-3xl font-bold font-mono text-brand-aqua">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-medium text-slate-100 mt-0.5">{stat.label}</div>
                <div className="text-xs sm:text-sm text-slate-400 truncate mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <a href="#projects">
              <SakugaButton variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                View Selected Work
              </SakugaButton>
            </a>

            <a href="#capabilities">
              <SakugaButton variant="secondary" size="lg" icon={<BookOpen className="w-4 h-4" />}>
                Explore Skill Codex
              </SakugaButton>
            </a>

            <a href="#contact">
              <SakugaButton variant="outline" size="lg">
                Get in Touch
              </SakugaButton>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Living Habitat & Agent State Console (5 cols) */}
        <div className="lg:col-span-5 z-10">
          <HoloCard intensity={1.1} className="w-full">
            <div className="editorial-card rounded-2xl p-6 relative overflow-hidden border border-white/10 bg-[#10131d]/90 shadow-2xl">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-sm text-slate-300 ml-2 font-semibold">living_habitat.atlas</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-aqua/10 text-brand-aqua text-xs font-semibold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Central Living Orb Display */}
              <div className="py-6 flex flex-col items-center justify-center relative">
                <div className="relative p-6 rounded-full bg-gradient-to-b from-brand-cyan/10 to-brand-violet/10 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
                  <ThinkingOrb state={activeOrbState} size={84} theme="cyan" />
                </div>

                <div className="mt-4 text-center space-y-1">
                  <div className="text-base uppercase tracking-wider text-brand-aqua font-bold">
                    Current Agent State: {activeOrbState}
                  </div>
                  <div className="text-sm text-slate-300 max-w-xs">
                    {orbStates.find((s) => s.state === activeOrbState)?.desc}
                  </div>
                </div>

                {/* Character Speech Bubble */}
                <div className="mt-4 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-brand-aqua/40 text-sm text-slate-100 shadow-xl max-w-sm flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-brand-aqua shrink-0" />
                  <span className="truncate">{explorerSpeech}</span>
                </div>
              </div>

              {/* Interactive State Selector Matrix */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                  Test Agentic Processing States:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {orbStates.map(({ state, label, desc }) => (
                    <button
                      key={state}
                      onClick={() => handleOrbChange(state, desc)}
                      className={`px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 cursor-pointer ${
                        activeOrbState === state
                          ? 'bg-brand-aqua/20 text-brand-aqua border border-brand-aqua/60 shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                          : 'bg-white/5 text-slate-300 hover:text-slate-100 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="font-bold truncate">{label}</div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{state}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Context */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-brand-sky" />
                  FastAPI • MCP • PyTorch
                </span>
                <span className="text-slate-400">60 FPS Living World</span>
              </div>
            </div>
          </HoloCard>
        </div>
      </div>
    </section>
  );
};
