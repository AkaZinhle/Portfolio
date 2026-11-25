import React, { useState } from 'react';
import { PROFILE } from '../../data/profile';
import { HoloCard } from '../effects/HoloCard';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { 
  User, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Compass, 
  Code2, 
  Zap, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const About: React.FC = () => {
  const [photoMode, setPhotoMode] = useState<'real' | 'pixel'>('pixel');

  const principles = [
    {
      title: 'Systems Over Isolated Models',
      desc: 'Machine learning algorithms only deliver value when connected to robust data stores, schema-aware protocols, and resilient reactive clients.',
      icon: <Cpu className="w-5 h-5 text-[#ff9a3c]" />
    },
    {
      title: '7 Years of Grounded Code',
      desc: 'Deep fluency across Python, TypeScript, C++, and Java cultivated through years of algorithmic exploration, live debugging, and systems engineering.',
      icon: <Code2 className="w-5 h-5 text-[#8fc3e8]" />
    },
    {
      title: 'Autonomous Multi-Tool Protocols',
      desc: 'Advancing beyond rigid chains into self-governing ReAct loops, Model Context Protocol (MCP) tool integration, and verifiable AP2 agent transactions.',
      icon: <Zap className="w-5 h-5 text-[#d8ff7a]" />
    },
    {
      title: 'Hardware-Level Symbiosis',
      desc: 'Hands-on hardware architecture experience building 5 custom AI training workstations, tuning CUDA kernels, and managing thermal envelopes.',
      icon: <Terminal className="w-5 h-5 text-[#ff6f6f]" />
    }
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl p-5 sm:p-6 bg-[#272343]/88 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/50 uppercase tracking-widest font-semibold pixel-corners-sm">
            Philosophy & Bio
          </span>
          <div className="h-[1px] w-12 bg-[#ff9a3c]/40" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#fbf1d4] font-display">
          About me
        </h2>

        <p className="text-sm sm:text-base text-[#fbf1d4] leading-relaxed font-light">
          Bridging rigorous academic research with 7 years of software development and industrial AI engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Col: Interactive Portrait Flip Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4 max-w-[400px] mx-auto w-full">
          <HoloCard intensity={1.05} className="w-full">
            <div className="editorial-card p-6 border-2 border-[#4a4378] bg-[#272343]/95 space-y-4 shadow-2xl pixel-corners-lg">
              {/* Photo Display Area with Flip Toggle */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#1b1830] border-2 border-[#4a4378] group pixel-corners flex items-center justify-center">
                {/* Pixel Mode Backing Environment / Pedestal */}
                {photoMode === 'pixel' && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-7">
                    {/* Subtle retro grid pattern */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #4a4378 1px, transparent 1px), linear-gradient(to bottom, #4a4378 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                      }}
                    />
                    {/* Soft radial glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#272343]/60 via-[#ff9a3c]/10 to-transparent" />
                    {/* Ground shadow beneath sprite */}
                    <div className="w-28 h-3.5 bg-[#0c0a2a]/80 rounded-[50%] blur-[1px] relative z-0" />
                  </div>
                )}

                <img
                  src={photoMode === 'real' ? '/assets/images/Me_real.png' : '/assets/images/Me_pixel.png'}
                  alt="Wongai Rankin"
                  className={
                    photoMode === 'real'
                      ? "w-full h-full object-cover transition-all duration-500 ease-out"
                      : "h-[78%] w-auto max-w-[85%] object-contain py-2 z-10 transition-all duration-500 ease-out pixelated filter drop-shadow-[0_10px_16px_rgba(12,10,42,0.85)]"
                  }
                />

                {/* Mode Indicator Overlay Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 bg-[#1b1830]/90 border border-[#4a4378] backdrop-blur-md pixel-corners-sm z-20">
                  <ThinkingOrb state={photoMode === 'real' ? 'working' : 'shaping'} size={18} theme="cyan" />
                  <span className="text-xs font-mono text-[#8fc3e8] font-medium">
                    {photoMode === 'real' ? 'Real-World Profile' : 'Pixel Avatar Realm'}
                  </span>
                </div>

                {/* Flip Button */}
                <button
                  onClick={() => setPhotoMode(photoMode === 'real' ? 'pixel' : 'real')}
                  className="absolute bottom-3 right-3 p-2.5 bg-[#1b1830]/90 hover:bg-[#352f5a] border border-[#4a4378] hover:border-[#ff9a3c] text-[#fbf1d4] hover:text-[#ff9a3c] shadow-2xl transition-all cursor-pointer flex items-center gap-2 text-xs font-mono pixel-corners-sm z-20"
                  title="Toggle Pixel Art / Real Photograph"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Switch to {photoMode === 'real' ? 'Pixel Art' : 'Real Photo'}</span>
                </button>
              </div>

              {/* Caption & Location Details */}
              <div className="space-y-1 text-center pt-2">
                <h3 className="text-xl font-bold text-[#fbf1d4] font-display">Wongai (Zee) Rankin</h3>
                <p className="text-xs font-mono text-[#b8b0d4]">
                  AI Engineer • Dual Award CS (Hons) • Dean's List
                </p>
              </div>
            </div>
          </HoloCard>
        </div>

        {/* Right Col: Narrative & Engineering Principles (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4 text-sm sm:text-base text-[#fbf1d4] leading-relaxed font-light p-5 sm:p-6 bg-[#272343]/92 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
            <p>
              My journey in software engineering began over <strong className="text-[#ff9a3c] font-semibold">seven years ago</strong> with algorithmic problem-solving in Python and Java. Over time, that foundation expanded into deep specialization in machine learning, computer vision, and autonomous agentic systems.
            </p>
            <p>
              During my industry placement at <strong className="text-[#ff9a3c] font-semibold">Asrix BHD</strong>, I engineered sequential computer vision detection loops and fine-tuned open-source local LLMs (Mistral 7B) on custom HuggingFace datasets, bridging the gap between raw model inference and high-availability production APIs.
            </p>
            <p>
              I believe the most impactful AI solutions are not isolated models running in Jupyter notebooks, but <strong className="text-[#ff9a3c] font-semibold">living, end-to-end architectures</strong> that orchestrate verified database tools (MCP), execute secure autonomous commerce (Google AP2), and deliver real-time insights to human users through responsive, intuitive interfaces.
            </p>
          </div>

          {/* Principles Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#b8b0d4] font-semibold">
              Core Engineering Philosophy:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map((pr, idx) => (
                <div
                  key={idx}
                  className="editorial-card p-5 border-2 border-[#4a4378] bg-[#272343]/90 space-y-2 hover:border-[#ff9a3c] hover:bg-[#352f5a]/70 transition-all pixel-corners"
                >
                  <div className="flex items-center gap-2">
                    {pr.icon}
                    <h5 className="text-sm font-bold text-[#fbf1d4] font-display">{pr.title}</h5>
                  </div>
                  <p className="text-xs text-[#b8b0d4] leading-relaxed font-light">
                    {pr.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
