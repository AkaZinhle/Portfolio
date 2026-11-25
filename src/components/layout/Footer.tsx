import React from 'react';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t-2 border-[#4a4378] bg-[#1b1830] pt-16 pb-12 overflow-hidden z-10 text-[#fbf1d4]">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#ff9a3c]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b-2 border-[#4a4378]">
          {/* Col 1: Identity & Living Atmosphere */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#272343] border border-[#4a4378] flex items-center justify-center pixel-corners-sm">
                <ThinkingOrb state="breathing" size={24} theme="amber" />
              </div>
              <div>
                <h3 className="font-bold text-[#fbf1d4] text-lg tracking-tight font-display">Wongai (Zee) Rankin</h3>
                <p className="text-sm text-[#ff9a3c]">AI Engineer | Machine Learning & Agentic Systems</p>
              </div>
            </div>

            <p className="text-sm text-[#b8b0d4] leading-relaxed max-w-md">
              Specialising in industrial computer vision, local parameter-efficient LLM fine-tuning, and autonomous multi-tool agentic architectures (MCP & AP2).
            </p>

            <div className="flex items-center gap-4 text-xs text-[#b8b0d4]">
              <span className="flex items-center gap-1.5 text-[#d8ff7a]">
                <span className="w-2 h-2 rounded-full bg-[#d8ff7a] animate-pulse" />
                Available for Industry Roles & Research
              </span>
              <span>•</span>
              <span>Johannesburg, SA (Remote)</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-[#fbf1d4] font-bold font-display">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#b8b0d4]">
              <li><a href="#projects" className="hover:text-[#ff9a3c] transition-colors">Selected Work</a></li>
              <li><a href="#capabilities" className="hover:text-[#ff9a3c] transition-colors">Technical Capabilities</a></li>
              <li><a href="#about" className="hover:text-[#ff9a3c] transition-colors">About & Engineering Bio</a></li>
              <li><a href="#contact" className="hover:text-[#ff9a3c] transition-colors">Get in Touch</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Connect & Links */}
          <div className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-[#fbf1d4] font-bold font-display">Connect</h4>
            <ul className="space-y-2 text-sm text-[#b8b0d4]">
              <li>
                <a
                  href="mailto:Wongairank@gmail.com"
                  className="flex items-center gap-2 hover:text-[#ff9a3c] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#ff9a3c]" />
                  Wongairank@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AkaZinhle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#ff9a3c] transition-colors"
                >
                  <Github className="w-4 h-4 text-[#8fc3e8]" />
                  github.com/AkaZinhle
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/wongai-rankin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#ff9a3c] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#8fc3e8]" />
                  linkedin.com/in/wongai-rankin
                </a>
              </li>
              <li>
                <a
                  href="/assets/docs/CV_W.Rankin.pdf"
                  download="CV_Wongai_Rankin.pdf"
                  className="inline-flex items-center gap-1.5 text-[#ff9a3c] hover:underline pt-1"
                >
                  Download Master Curriculum Vitae (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b8b0d4]">
          <p>
            © {new Date().getFullYear()} Wongai Rankin. All rights reserved. Built with React, TypeScript, Tailwind CSS & Canvas.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#b8b0d4] hover:text-[#ff9a3c] transition-colors cursor-pointer"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
