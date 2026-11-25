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
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#272343]/90 border border-[#4a4378] backdrop-blur-md pixel-corners-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d8ff7a] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d8ff7a]" />
            </span>
            <span className="text-sm sm:text-base text-[#fbf1d4] tracking-wide font-mono">
              AI Engineer | Machine Learning & Agentic Systems Specialist
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#fbf1d4] font-display">
              Wongai <span className="text-[#b8b0d4] font-normal">(Zee)</span> Rankin
            </h1>
            <p className="text-2xl sm:text-3xl font-medium text-gradient-ember">
              Engineering autonomous intelligence from model weights to full-stack production.
            </p>
          </div>

          {/* Bio paragraph */}
          <p className="text-[#fbf1d4] text-lg sm:text-xl leading-relaxed max-w-2xl font-light p-4 sm:p-5 bg-[#272343]/92 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
            Final-year BSc Computer Science (Hons) specialist with <strong className="font-semibold text-[#fbf1d4]">7 years of programming experience</strong> and industry Work-Based Learning at <strong className="font-semibold text-[#fbf1d4]">Asrix BHD</strong>. Architecting end-to-end intelligent systems: from low-latency industrial computer vision (YOLOv8) and local 4-bit LLM fine-tuning (Mistral 7B) to cutting-edge autonomous protocols (<strong className="text-[#ff9a3c] font-semibold">Model Context Protocol</strong> & <strong className="text-[#8fc3e8] font-semibold">Google AP2</strong>).
          </p>

          {/* Core Highlights Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 py-2">
            {PROFILE.stats.map((stat, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#272343]/90 border border-[#4a4378] backdrop-blur-md hover:border-[#ff9a3c]/60 pixel-corners transition-all"
              >
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#ff9a3c]">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-medium text-[#fbf1d4] mt-0.5">{stat.label}</div>
                <div className="text-xs sm:text-sm text-[#b8b0d4] truncate mt-0.5">{stat.desc}</div>
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
            <div className="editorial-card p-6 relative overflow-hidden border-2 border-[#4a4378] bg-[#272343]/95 shadow-2xl pixel-corners-lg">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#4a4378]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 bg-[#ff6f6f] pixel-corners-sm" />
                  <div className="w-3 h-3 bg-[#ff9a3c] pixel-corners-sm" />
                  <div className="w-3 h-3 bg-[#d8ff7a] pixel-corners-sm" />
                  <span className="text-sm text-[#fbf1d4] ml-2 font-semibold font-mono">living_habitat.atlas</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#d8ff7a]/20 text-[#d8ff7a] border border-[#d8ff7a]/50 text-xs font-semibold pixel-corners-sm font-mono">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Central Living Orb Display */}
              <div className="py-6 flex flex-col items-center justify-center relative">
                <div className="relative p-6 bg-gradient-to-b from-[#ff9a3c]/15 to-[#352f5a]/30 border border-[#4a4378] shadow-[0_0_50px_rgba(255,154,60,0.2)] pixel-corners-lg">
                  <ThinkingOrb state={activeOrbState} size={84} theme="amber" />
                </div>

                <div className="mt-4 text-center space-y-1">
                  <div className="text-base uppercase tracking-wider text-[#ff9a3c] font-bold font-display">
                    Current Agent State: {activeOrbState}
                  </div>
                  <div className="text-sm text-[#b8b0d4] max-w-xs font-mono">
                    {orbStates.find((s) => s.state === activeOrbState)?.desc}
                  </div>
                </div>

                {/* Character Speech Bubble */}
                <div className="mt-4 px-4 py-2.5 bg-[#1b1830]/90 border border-[#4a4378] text-sm text-[#fbf1d4] shadow-xl max-w-sm flex items-center gap-2.5 pixel-corners">
                  <Bot className="w-4 h-4 text-[#ff9a3c] shrink-0" />
                  <span className="truncate font-mono">{explorerSpeech}</span>
                </div>
              </div>

              {/* Interactive State Selector Matrix */}
              <div className="space-y-2 pt-2 border-t border-[#4a4378]">
                <div className="text-xs text-[#b8b0d4] uppercase tracking-wider font-semibold font-mono">
                  Test Agentic Processing States:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {orbStates.map(({ state, label, desc }) => (
                    <button
                      key={state}
                      onClick={() => handleOrbChange(state, desc)}
                      className={`px-3 py-2.5 text-left text-sm transition-all duration-150 cursor-pointer pixel-corners-sm ${
                        activeOrbState === state
                          ? 'bg-[#ff9a3c]/20 text-[#ff9a3c] border-2 border-[#ff9a3c] shadow-[0_0_12px_rgba(255,154,60,0.35)]'
                          : 'bg-[#1b1830] text-[#b8b0d4] hover:text-[#fbf1d4] hover:bg-[#352f5a] border border-[#4a4378]'
                      }`}
                    >
                      <div className="font-bold truncate font-display">{label}</div>
                      <div className="text-xs text-[#b8b0d4]/80 truncate mt-0.5 font-mono">{state}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Context */}
              <div className="mt-4 pt-3 border-t border-[#4a4378] flex items-center justify-between text-xs text-[#b8b0d4] font-mono">
                <span className="flex items-center gap-1.5 text-[#fbf1d4]">
                  <Cpu className="w-3.5 h-3.5 text-[#8fc3e8]" />
                  FastAPI • MCP • PyTorch
                </span>
                <span>60 FPS Living World</span>
              </div>
            </div>
          </HoloCard>
        </div>
      </div>
    </section>
  );
};
