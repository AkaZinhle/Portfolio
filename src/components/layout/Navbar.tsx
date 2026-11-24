import React, { useState, useEffect } from 'react';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { SakugaButton } from '../effects/SakugaButton';
import { Sparkles, Volume2, VolumeX, FileDown, Github, Linkedin, Menu, X } from 'lucide-react';

interface NavbarProps {
  envEnabled: boolean;
  onToggleEnv: () => void;
  audioPlaying: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  envEnabled,
  onToggleEnv,
  audioPlaying,
  onToggleAudio,
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
    { name: 'Selected Work', href: '#projects' },
    { name: 'Skill Codex', href: '#capabilities' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0c0d12]/85 backdrop-blur-md border-b border-white/5 shadow-2xl py-3.5'
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
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#1e1c15] border-2 border-[#FC75B4]/50 group-hover:border-[#FC75B4] transition-all duration-300 shadow-inner">
            <ThinkingOrb state="breathing" size={26} theme="cyan" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-[#F0E5DB] group-hover:text-[#FC75B4] transition-colors duration-200 font-display">
              Wongai Rankin
            </span>
            <span className="text-xs text-[#FC75B4] -mt-1 tracking-wider uppercase font-semibold">
              AI Engineer
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-[#1e1c15]/90 border-2 border-white/10 backdrop-blur-md shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-sm font-semibold text-[#F0E5DB] hover:text-[#FC75B4] hover:bg-[#474329]/40 rounded-xl transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls & External Links */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Environment Effects Toggle */}
          <button
            onClick={onToggleEnv}
            title={envEnabled ? 'Disable Environmental Effects' : 'Enable Environmental Effects'}
            aria-label="Toggle Living Environment Effects"
            className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              envEnabled
                ? 'bg-[#FC75B4]/20 text-[#FC75B4] border-[#FC75B4]/50 hover:bg-[#FC75B4]/30 shadow-[0_0_15px_rgba(252,117,180,0.3)]'
                : 'bg-white/5 text-[#8e8472] border-white/10 hover:text-[#F0E5DB]'
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
            className={`p-2.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              audioPlaying
                ? 'bg-[#FC75B4]/20 text-[#FC75B4] border-[#FC75B4]/50 hover:bg-[#FC75B4]/30 shadow-[0_0_15px_rgba(252,117,180,0.3)]'
                : 'bg-white/5 text-[#8e8472] border-white/10 hover:text-[#F0E5DB]'
            }`}
          >
            {audioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="h-5 w-[1px] bg-white/10 mx-1" />

          {/* GitHub Link */}
          <a
            href="https://github.com/AkaZinhle"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="p-2.5 rounded-xl bg-[#1e1c15] text-[#F0E5DB] hover:text-[#FC75B4] border border-white/10 hover:border-[#FC75B4]/50 transition-all duration-200 cursor-pointer"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* LinkedIn Link */}
          <a
            href="https://linkedin.com/in/wongai-rankin"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="p-2.5 rounded-xl bg-[#1e1c15] text-[#F0E5DB] hover:text-[#FC75B4] border border-white/10 hover:border-[#FC75B4]/50 transition-all duration-200 cursor-pointer"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {/* Download CV Sakuga Button */}
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

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleEnv}
            aria-label="Toggle Environment Effects"
            className={`p-2 rounded-lg border text-xs ${
              envEnabled ? 'bg-brand-aqua/20 text-brand-aqua border-brand-aqua/30' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Open mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0d12]/95 border-b border-white/10 px-4 pt-3 pb-6 backdrop-blur-xl mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-brand-aqua hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href="https://github.com/AkaZinhle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/wongai-rankin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
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
