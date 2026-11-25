import React, { useState, useEffect, useRef } from 'react';
import { PixelValleyCanvas } from './environment/PixelValleyCanvas';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { SelectedWork } from './components/sections/SelectedWork';
import { SkillBook } from './components/sections/SkillBook';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { ProjectModal } from './components/sections/ProjectModal';
import { Project } from './types';

export const App: React.FC = () => {
  const [envEnabled, setEnvEnabled] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioPlaying]);

  return (
    <div className="relative min-h-screen text-[#F0E5DB] selection:bg-[#FC75B4]/30 selection:text-[#FC75B4]">
      {/* Pixel Valley Living Environment Background Canvas */}
      <PixelValleyCanvas enabled={envEnabled} />

      {/* High-End Editorial Website Content */}
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
    </div>
  );
};
