import React, { useState, useEffect, useRef } from 'react';
import { PixelValleyCanvas } from './environment/PixelValleyCanvas';
import { Robotman } from './components/effects/Robotman';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { SelectedWork } from './components/sections/SelectedWork';
import { SkillBook } from './components/sections/SkillBook';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { ProjectModal } from './components/sections/ProjectModal';
import { Project } from './types';
import { Eye } from 'lucide-react';

export const App: React.FC = () => {
  const [envEnabled, setEnvEnabled] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [foregroundVisible, setForegroundVisible] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
      // Toggle Foreground with 'h' or 'H'
      if (e.key === 'h' || e.key === 'H') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        setForegroundVisible((prev) => !prev);
      }
      // Escape to restore foreground if hidden
      if (e.key === 'Escape' && !foregroundVisible) {
        setForegroundVisible(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioPlaying, foregroundVisible]);

  return (
    <div className="relative min-h-screen text-[#fbf1d4] selection:bg-[#ff9a3c]/30 selection:text-[#ff9a3c]">
      {/* Pixel Valley Living Environment Background Canvas */}
      <PixelValleyCanvas enabled={envEnabled} />

      {/* Floating Robotman Physics Companion & Terminal (Hidden in Zen View) */}
      <div className={`transition-opacity duration-300 ${foregroundVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Robotman />
      </div>

      {/* Floating Restore Button (Visible only when foreground is hidden) */}
      {!foregroundVisible && (
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={() => setForegroundVisible(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#272343]/95 hover:bg-[#352f5a] border-2 border-[#ff9a3c] text-[#fbf1d4] hover:text-[#ff9a3c] backdrop-blur-md shadow-[0_0_24px_rgba(255,154,60,0.45)] pixel-corners transition-all duration-200 cursor-pointer group"
            title="Restore Foreground Portfolio (Hotkey: H or Esc)"
            aria-label="Restore Foreground Portfolio"
          >
            <Eye className="w-4 h-4 text-[#ff9a3c] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono font-bold tracking-wider">SHOW FOREGROUND</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1b1830] text-[#b8b0d4] border border-[#4a4378] pixel-corners-sm">
              H
            </span>
          </button>
        </div>
      )}

      {/* High-End Editorial Website Content */}
      <div
        className={`relative z-10 flex flex-col min-h-screen transition-opacity duration-300 ${
          foregroundVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Navbar
          envEnabled={envEnabled}
          onToggleEnv={() => setEnvEnabled(!envEnabled)}
          audioPlaying={audioPlaying}
          onToggleAudio={toggleAudio}
          onToggleForeground={() => setForegroundVisible(!foregroundVisible)}
        />

        <main className="flex-1 space-y-12">
          <Hero />
          <SkillBook />
          <SelectedWork onSelectProject={setSelectedProject} />
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
    </div>
  );
};
