import React, { useState, useEffect } from 'react';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { SakugaButton } from '../effects/SakugaButton';
import { Sparkles, Volume2, VolumeX, FileDown, Github, Linkedin, Menu, X, EyeOff } from 'lucide-react';

interface NavbarProps {
  envEnabled: boolean;
  onToggleEnv: () => void;
  audioPlaying: boolean;
  onToggleAudio: () => void;
  onToggleForeground: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  envEnabled,
  onToggleEnv,
  audioPlaying,
  onToggleAudio,
  onToggleForeground,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Skills & Codex', href: '#capabilities' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1b1830]/90 backdrop-blur-md border-b-2 border-[#4a4378] shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          className="group flex items-center gap-3 focus:outline-none"
          aria-label="Wongai Rankin Portfolio Home"
        >
          <div className="relative flex items-center justify-center w-10 h-10 bg-[#272343] border-2 border-[#4a4378] group-hover:border-[#ff9a3c] transition-all duration-300 shadow-inner pixel-corners-sm">
            <ThinkingOrb state="breathing" size={26} theme="cyan" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-[#fbf1d4] group-hover:text-[#ff9a3c] transition-colors duration-200 font-display">
              Wongai Rankin
            </span>
            <span className="text-xs text-[#ff9a3c] -mt-1 tracking-wider uppercase font-semibold">
              AI Engineer
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 bg-[#272343]/90 border-2 border-[#4a4378] backdrop-blur-md shadow-lg pixel-corners">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-sm font-semibold text-[#fbf1d4] hover:text-[#ff9a3c] hover:bg-[#352f5a] transition-all duration-200 pixel-corners-sm"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls & External Links */}
        <div className="hidden md:flex items-center gap-2">
          {/* Environment Effects Toggle */}
          <button
            onClick={onToggleEnv}
            title={envEnabled ? 'Disable Environmental Effects' : 'Enable Environmental Effects'}
            aria-label="Toggle Living Environment Effects"
            className={`px-3 py-2 border text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer pixel-corners-sm ${
              envEnabled
                ? 'bg-[#ff9a3c]/20 text-[#ff9a3c] border-[#ff9a3c]/60 hover:bg-[#ff9a3c]/30 shadow-[0_0_15px_rgba(255,154,60,0.35)]'
                : 'bg-[#272343] text-[#b8b0d4] border-[#4a4378] hover:text-[#fbf1d4]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">FX {envEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Ambient Music Toggle */}
          <button
            onClick={onToggleAudio}
            title={audioPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Soundscape'}
            aria-label="Toggle Ambient Audio"
            className={`p-2.5 border text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer pixel-corners-sm ${
              audioPlaying
                ? 'bg-[#ff9a3c]/20 text-[#ff9a3c] border-[#ff9a3c]/60 hover:bg-[#ff9a3c]/30 shadow-[0_0_15px_rgba(255,154,60,0.35)]'
                : 'bg-[#272343] text-[#b8b0d4] border-[#4a4378] hover:text-[#fbf1d4]'
            }`}
          >
            {audioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Hide Foreground / View World Toggle */}
          <button
            onClick={onToggleForeground}
            title="Hide foreground to view living pixel world (Hotkey: H)"
            aria-label="Hide foreground to view living pixel world"
            className="px-3 py-2 bg-[#272343] hover:bg-[#352f5a] text-[#b8b0d4] hover:text-[#fbf1d4] border border-[#4a4378] hover:border-[#ff9a3c]/60 text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer pixel-corners-sm"
          >
            <EyeOff className="w-3.5 h-3.5 text-[#ff9a3c]" />
            <span className="text-xs font-bold font-mono">HIDE UI</span>
          </button>

          {/* Social Links & CV (Desktop/Large Screens) */}
          <div className="hidden xl:flex items-center gap-2 pl-1 border-l border-[#4a4378]">
            <a
              href="https://github.com/AkaZinhle"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              className="p-2.5 bg-[#272343] text-[#fbf1d4] hover:text-[#ff9a3c] border border-[#4a4378] hover:border-[#ff9a3c]/60 hover:bg-[#352f5a] transition-all duration-200 cursor-pointer pixel-corners-sm"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="https://linkedin.com/in/wongai-rankin"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="p-2.5 bg-[#272343] text-[#fbf1d4] hover:text-[#ff9a3c] border border-[#4a4378] hover:border-[#ff9a3c]/60 hover:bg-[#352f5a] transition-all duration-200 cursor-pointer pixel-corners-sm"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a href="/assets/docs/CV_W.Rankin.pdf" download="CV_Wongai_Rankin.pdf">
              <SakugaButton
                variant="primary"
                size="sm"
                icon={<FileDown className="w-4 h-4" />}
              >
                Download CV
              </SakugaButton>
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleForeground}
            title="Hide foreground to view living pixel world"
            aria-label="Hide foreground to view living pixel world"
            className="p-2 bg-[#272343] hover:bg-[#352f5a] text-[#b8b0d4] hover:text-[#fbf1d4] border border-[#4a4378] pixel-corners-sm"
          >
            <EyeOff className="w-4 h-4 text-[#ff9a3c]" />
          </button>

          <button
            onClick={onToggleEnv}
            aria-label="Toggle Environment Effects"
            className={`p-2 border text-xs pixel-corners-sm ${
              envEnabled ? 'bg-[#ff9a3c]/20 text-[#ff9a3c] border-[#ff9a3c]/60' : 'bg-[#272343] text-[#b8b0d4] border-[#4a4378]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-[#272343] border border-[#4a4378] text-[#fbf1d4] hover:text-[#ff9a3c] pixel-corners-sm"
            aria-label="Open mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1b1830]/95 border-b-2 border-[#4a4378] px-4 pt-3 pb-6 backdrop-blur-xl mt-3 animate-in fade-in slide-in-from-top-2 duration-200 pixel-corners">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-[#fbf1d4] hover:text-[#ff9a3c] hover:bg-[#352f5a] pixel-corners-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-[#4a4378] flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href="https://github.com/AkaZinhle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#272343] border border-[#4a4378] text-[#fbf1d4] hover:text-[#ff9a3c] pixel-corners-sm"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/wongai-rankin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#272343] border border-[#4a4378] text-[#fbf1d4] hover:text-[#ff9a3c] pixel-corners-sm"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <a href="/assets/docs/CV_W.Rankin.pdf" download="CV_Wongai_Rankin.pdf">
                <SakugaButton variant="primary" size="sm" icon={<FileDown className="w-3.5 h-3.5" />}>
                  Download CV
                </SakugaButton>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
