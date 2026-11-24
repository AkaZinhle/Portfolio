import React from 'react';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#0e0d0a] pt-16 pb-12 overflow-hidden z-10 text-[#F0E5DB]">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#FC75B4]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Identity & Living Atmosphere */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1e1c15] border border-white/10 flex items-center justify-center">
                <ThinkingOrb state="breathing" size={24} theme="cyan" />
              </div>
              <div>
                <h3 className="font-bold text-[#F0E5DB] text-lg tracking-tight font-display">Wongai (Zee) Rankin</h3>
                <p className="text-sm text-[#FC75B4]">AI Engineer | Machine Learning & Agentic Systems</p>
              </div>
            </div>

            <p className="text-sm text-[#c7bcab] leading-relaxed max-w-md">
              Specialising in industrial computer vision, local parameter-efficient LLM fine-tuning, and autonomous multi-tool agentic architectures (MCP & AP2).
            </p>

            <div className="flex items-center gap-4 text-xs text-[#8e8472]">
              <span className="flex items-center gap-1.5 text-[#FC75B4]">
                <span className="w-2 h-2 rounded-full bg-[#FC75B4] animate-pulse" />
                Available for Industry Roles & Research
              </span>
              <span>•</span>
              <span>Johannesburg, SA (Remote)</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-[#F0E5DB] font-bold font-display">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#c7bcab]">
              <li><a href="#projects" className="hover:text-[#FC75B4] transition-colors">Selected Work</a></li>
              <li><a href="#capabilities" className="hover:text-[#FC75B4] transition-colors">Technical Capabilities</a></li>
              <li><a href="#experience" className="hover:text-[#FC75B4] transition-colors">Professional Timeline</a></li>
              <li><a href="#education" className="hover:text-[#FC75B4] transition-colors">Education & Honours</a></li>
              <li><a href="#about" className="hover:text-[#FC75B4] transition-colors">About & Engineering Bio</a></li>
              <li><a href="#contact" className="hover:text-[#FC75B4] transition-colors">Get in Touch</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Connect & Links */}
          <div className="space-y-3">
            <h4 className="text-sm uppercase tracking-wider text-[#F0E5DB] font-bold font-display">Connect</h4>
            <ul className="space-y-2 text-sm text-[#c7bcab]">
              <li>
                <a
                  href="mailto:Wongairank@gmail.com"
                  className="flex items-center gap-2 hover:text-[#FC75B4] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#FC75B4]" />
                  Wongairank@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AkaZinhle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#FC75B4] transition-colors"
                >
                  <Github className="w-4 h-4 text-[#FC75B4]" />
                  github.com/AkaZinhle
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/wongai-rankin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#FC75B4] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#FC75B4]" />
                  linkedin.com/in/wongai-rankin
                </a>
              </li>
              <li>
                <a
                  href="/assets/docs/CV_W.Rankin.pdf"
                  download="CV_Wongai_Rankin.pdf"
                  className="inline-flex items-center gap-1.5 text-[#FC75B4] hover:underline pt-1"
                >
                  Download Master Curriculum Vitae (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8472]">
          <p>
            © {new Date().getFullYear()} Wongai Rankin. All rights reserved. Built with React, TypeScript, Tailwind CSS & Canvas.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#c7bcab] hover:text-[#FC75B4] transition-colors cursor-pointer"
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
