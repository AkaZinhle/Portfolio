import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { SakugaButton } from '../effects/SakugaButton';
import { 
  X, 
  Github, 
  ExternalLink, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Maximize2,
  Workflow,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'agent' | 'implementation' | 'gallery'>('architecture');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedImage]);

  if (!project) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-5xl bg-[#1b1830] border-2 border-[#4a4378] shadow-[0_0_50px_#0c0a2a] overflow-hidden flex flex-col max-h-[92vh] text-[#fbf1d4] pixel-corners-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#272343] border-b-2 border-[#4a4378] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm px-3 py-1 bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/50 font-bold pixel-corners-sm">
              CASE STUDY {project.number}
            </span>
            <span className="text-sm text-[#b8b0d4] hidden sm:inline">
              {project.category} • {project.timeline}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#1b1830] hover:bg-[#352f5a] border border-[#4a4378] text-[#fbf1d4] hover:text-[#ff9a3c] transition-colors pixel-corners-sm"
                title="View GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2.5 bg-[#1b1830] hover:bg-[#352f5a] border border-[#4a4378] text-[#fbf1d4] hover:text-[#ff9a3c] transition-colors cursor-pointer pixel-corners-sm"
              aria-label="Close Case Study"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1 bg-[#1b1830]">
          {/* Hero Banner & Project Identity */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fbf1d4] font-display">
                {project.title}
              </h2>
              <span className="text-lg sm:text-xl text-[#ff9a3c] font-medium">
                {project.subtitle}
              </span>
            </div>

            <p className="text-base sm:text-lg text-[#b8b0d4] leading-relaxed font-light">
              {project.tagline}
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-[#272343] border border-[#4a4378] text-xs sm:text-sm text-[#fbf1d4] pixel-corners-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b-2 border-[#4a4378] pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer pixel-corners-sm ${
                activeTab === 'architecture'
                  ? 'bg-[#ff9a3c] text-[#0c0a2a] shadow-md font-bold'
                  : 'text-[#b8b0d4] hover:text-[#fbf1d4] hover:bg-[#272343]'
              }`}
            >
              <Layers className="w-4 h-4" />
              Architecture & System Flow
            </button>

            {project.agentWorkflow && (
              <button
                onClick={() => setActiveTab('agent')}
                className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer pixel-corners-sm ${
                  activeTab === 'agent'
                    ? 'bg-[#ff9a3c] text-[#0c0a2a] shadow-md font-bold'
                    : 'text-[#b8b0d4] hover:text-[#fbf1d4] hover:bg-[#272343]'
                }`}
              >
                <Workflow className="w-4 h-4" />
                Agent Reasoning Pipeline
              </button>
            )}

            <button
              onClick={() => setActiveTab('implementation')}
              className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer pixel-corners-sm ${
                activeTab === 'implementation'
                  ? 'bg-[#ff9a3c] text-[#0c0a2a] shadow-md font-bold'
                  : 'text-[#b8b0d4] hover:text-[#fbf1d4] hover:bg-[#272343]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Challenges & Results
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer pixel-corners-sm ${
                activeTab === 'gallery'
                  ? 'bg-[#ff9a3c] text-[#0c0a2a] shadow-md font-bold'
                  : 'text-[#b8b0d4] hover:text-[#fbf1d4] hover:bg-[#272343]'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              Screenshots ({project.screenshots.length})
            </button>
          </div>

          {/* TAB 1: Architecture & System Flow */}
          {activeTab === 'architecture' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Problem Statement Box */}
              <div className="p-5 bg-[#272343] border-2 border-[#4a4378] space-y-2 pixel-corners">
                <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#ff9a3c] font-bold font-display">
                  <AlertCircle className="w-4 h-4 text-[#ff9a3c]" />
                  Industrial Problem Statement
                </div>
                <p className="text-base text-[#fbf1d4] leading-relaxed">
                  {project.problemStatement}
                </p>
              </div>

              {/* Architecture Blueprint */}
              <div className="space-y-4">
                <h3 className="text-lg uppercase tracking-wider text-[#fbf1d4] font-bold font-display">
                  System Architecture & Data Pipeline
                </h3>
                <p className="text-base text-[#b8b0d4] leading-relaxed font-light">
                  {project.architecture.summary}
                </p>

                {/* Pipeline Steps Sequence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {project.architecture.flow.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#272343] border border-[#4a4378] space-y-1 relative pixel-corners-sm"
                    >
                      <div className="text-xs text-[#ff9a3c] font-bold">
                        STAGE 0{idx + 1}
                      </div>
                      <div className="text-sm font-bold text-[#fbf1d4]">{step}</div>
                    </div>
                  ))}
                </div>

                {/* Architecture Nodes Grid */}
                {project.architecture.diagramNodes && (
                  <div className="space-y-3 pt-4">
                    <h4 className="text-sm uppercase tracking-wider text-[#b8b0d4] font-bold font-display">
                      Decoupled Component Nodes:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.architecture.diagramNodes.map((node, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-[#272343] border border-[#4a4378] flex items-start gap-3 pixel-corners"
                        >
                          <div className="p-2.5 bg-[#1b1830] text-[#ff9a3c] shrink-0 mt-0.5 pixel-corners-sm">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-base font-bold text-[#fbf1d4] flex items-center gap-2">
                              {node.name}
                              <span className="text-xs px-2 py-0.5 bg-[#352f5a] text-[#fbf1d4] uppercase border border-[#4a4378] pixel-corners-sm">
                                {node.type}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-[#b8b0d4] mt-1 leading-relaxed">
                              {node.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Agent Reasoning Pipeline */}
          {activeTab === 'agent' && project.agentWorkflow && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 bg-[#ff9a3c]/15 border border-[#ff9a3c]/40 text-sm text-[#fbf1d4] leading-relaxed flex items-start gap-3 pixel-corners-sm">
                <Sparkles className="w-5 h-5 text-[#ff9a3c] shrink-0 mt-0.5" />
                <span>
                  <strong>Autonomous Multi-Step Reasoning Lifecycle:</strong> Each step dynamically activates specialized tools and adjusts internal agent thought loops.
                </span>
              </div>

              <div className="space-y-4">
                {project.agentWorkflow.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 bg-[#272343] border-2 border-[#4a4378] flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#ff9a3c] transition-all pixel-corners"
                  >
                    {/* Thinking Orb Indicator */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="p-2.5 bg-[#1b1830] border border-[#4a4378] flex items-center justify-center pixel-corners-sm">
                        <ThinkingOrb state={step.orbState} size={42} theme="amber" />
                      </div>
                      <div className="sm:hidden text-sm text-[#ff9a3c] font-bold">
                        Step 0{step.step}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-block text-sm text-[#ff9a3c] font-bold">
                          Step 0{step.step}:
                        </span>
                        <h4 className="text-base font-bold text-[#fbf1d4]">{step.title}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[#b8b0d4] leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>

                    {/* Tool Badge */}
                    <div className="shrink-0 text-right">
                      <span className="inline-block px-3 py-1 bg-[#352f5a] border border-[#4a4378] text-xs text-[#d8ff7a] font-mono pixel-corners-sm">
                        {step.tool}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Implementation, Challenges & Results */}
          {activeTab === 'implementation' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Engineering Challenges */}
              <div className="space-y-4">
                <h3 className="text-lg uppercase tracking-wider text-[#fbf1d4] font-bold font-display">
                  Key Engineering Challenges & Solutions
                </h3>
                <div className="space-y-3">
                  {project.engineeringChallenges.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#272343] border-2 border-[#4a4378] space-y-2 pixel-corners"
                    >
                      <div className="text-sm font-bold text-[#ff6f6f] flex items-start gap-2">
                        <span className="shrink-0">CHALLENGE:</span>
                        <span>{item.challenge}</span>
                      </div>
                      <div className="text-sm text-[#fbf1d4] flex items-start gap-2 pl-4 border-l-2 border-[#4a4378]">
                        <span className="text-[#d8ff7a] font-bold shrink-0">SOLUTION:</span>
                        <span className="text-[#b8b0d4]">{item.solution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementation Highlights */}
              <div className="space-y-3">
                <h3 className="text-lg uppercase tracking-wider text-[#fbf1d4] font-bold font-display">
                  Technical Implementation Details
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#fbf1d4]">
                  {project.implementation.keyHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-3 bg-[#272343] border border-[#4a4378] pixel-corners-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#d8ff7a] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documented Results */}
              <div className="space-y-3 pt-2">
                <h3 className="text-lg uppercase tracking-wider text-[#fbf1d4] font-bold font-display">
                  Verified Engineering Outcomes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.results.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#272343] border-2 border-[#4a4378] text-center space-y-1 pixel-corners-sm"
                    >
                      <div className="text-2xl font-bold font-mono text-[#ff9a3c]">
                        {res.metric}
                      </div>
                      <div className="text-sm font-bold text-[#fbf1d4]">{res.label}</div>
                      <div className="text-xs text-[#b8b0d4] leading-snug">{res.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Screenshot Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.screenshots.map((shot, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(shot.url)}
                    className="group relative overflow-hidden border-2 border-[#4a4378] bg-[#0c0a2a] cursor-pointer hover:border-[#ff9a3c] transition-all shadow-md pixel-corners"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-black/80">
                      <img
                        src={shot.url}
                        alt={shot.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-1 bg-[#272343]">
                      <div className="text-sm font-bold text-[#fbf1d4] flex items-center justify-between">
                        <span>{shot.title}</span>
                        <Maximize2 className="w-4 h-4 text-[#ff9a3c] group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-xs text-[#b8b0d4] leading-relaxed font-light">
                        {shot.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#272343] border-t-2 border-[#4a4378] flex items-center justify-between">
          <div className="text-xs text-[#b8b0d4]">
            Press <kbd className="px-2 py-0.5 bg-[#1b1830] text-[#ff9a3c] border border-[#4a4378] pixel-corners-sm font-mono">ESC</kbd> to exit case study
          </div>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <SakugaButton variant="primary" size="sm" icon={<Github className="w-4 h-4" />}>
                View Source Repository
              </SakugaButton>
            </a>
          )}
        </div>
      </div>

      {/* Fullscreen Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Fullscreen Preview"
            className="max-w-full max-h-[90vh] object-contain border-2 border-[#ff9a3c] shadow-2xl pixel-corners-lg"
          />
        </div>
      )}
    </div>
  );
};
