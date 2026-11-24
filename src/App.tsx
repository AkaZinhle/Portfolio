import React, { useState, useEffect, useRef } from 'react';
import { UnifiedWorldCanvas } from './environment/UnifiedWorldCanvas';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { SelectedWork } from './components/sections/SelectedWork';
import { SkillBook } from './components/sections/SkillBook';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { ProjectModal } from './components/sections/ProjectModal';
import { Project } from './types';
import { ThinkingOrb } from './components/effects/ThinkingOrb';
import { Github, Sparkles, X } from 'lucide-react';

export const App: React.FC = () => {
  const [envEnabled, setEnvEnabled] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [koiModalOpen, setKoiModalOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio('/assets/audio/ambient.mp3');
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
      }).catch(() => {
        // Autoplay policy fallback
        setAudioPlaying(false);
      });
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Audio with 'm' or 'M'
      if (e.key === 'm' || e.key === 'M') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        toggleAudio();
      }
      // Toggle FX with 'e' or 'E'
      if (e.key === 'e' || e.key === 'E') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        setEnvEnabled((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioPlaying]);

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-brand-aqua/30 selection:text-brand-aqua">
      {/* Layer 0-3: Unified Living Environmental Canvas with DOM-anchored Scenery */}
      <UnifiedWorldCanvas
        enabled={envEnabled}
        intensity={0.9}
        onKoiClick={() => setKoiModalOpen(true)}
      />

      {/* Layer 4: High-End Editorial Website Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          envEnabled={envEnabled}
          onToggleEnv={() => setEnvEnabled(!envEnabled)}
          audioPlaying={audioPlaying}
          onToggleAudio={toggleAudio}
        />

        <main className="flex-1 space-y-12">
          <Hero />
          <SelectedWork onSelectProject={(p) => setSelectedProject(p)} />
          <SkillBook />
          <About />
          <Contact />
        </main>

        <Footer />
      </div>

      {/* Project Case Study Deep-Dive Modal Overlay */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* GitHub Koi Telemetry Modal */}
      {koiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setKoiModalOpen(false)}
        >
          <div
            className="editorial-card rounded-3xl p-6 border-2 border-[#474329] bg-[#1e1c15] max-w-md w-full space-y-4 text-[#F0E5DB]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#474329]">
              <div className="flex items-center gap-2">
                <ThinkingOrb state="weaving" size={22} theme="cyan" />
                <h3 className="font-bold text-base text-[#F0E5DB] font-display">Git Koi • Live Developer Activity</h3>
              </div>
              <button
                onClick={() => setKoiModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-[#F0E5DB] hover:text-[#FC75B4] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#c7bcab] leading-relaxed font-light">
              This living pixel koi is influenced by real development activity on GitHub (<strong>@AkaZinhle</strong>). Swimming velocity, ripples, and scale patterns reflect recent commits across VoltStock, PCB Defect Detector, and Risses.ai.
            </p>

            <div className="p-3.5 rounded-xl bg-[#181611] border border-[#474329] space-y-1.5 text-xs text-[#F0E5DB]">
              <div className="flex justify-between">
                <span className="text-[#8e8472]">Account:</span>
                <span className="text-[#FC75B4] font-bold">github.com/AkaZinhle</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8472]">Active Repositories:</span>
                <span className="text-[#c9be83] font-bold">7 Systems</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8472]">Telemetry Status:</span>
                <span className="text-[#FC75B4] font-bold">Synchronized</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href="https://github.com/AkaZinhle"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#FC75B4]/20 hover:bg-[#FC75B4]/30 border border-[#FC75B4]/50 text-sm font-bold text-[#FC75B4] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
                Open GitHub Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
