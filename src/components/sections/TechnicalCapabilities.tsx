import React, { useState } from 'react';
import { SKILL_CATEGORIES, CONSTELLATION_NODES } from '../../data/skills';
import { ConstellationNode, SkillCategory } from '../../types';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { 
  Network, 
  ListFilter, 
  Layers, 
  Cpu, 
  Workflow, 
  Database, 
  Code2, 
  Sparkles, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const TechnicalCapabilities: React.FC = () => {
  const [viewMode, setViewMode] = useState<'constellation' | 'guide'>('constellation');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('mcp');
  const [pulseTarget, setPulseTarget] = useState<string | null>(null);

  const selectedNode = CONSTELLATION_NODES.find((n) => n.id === selectedNodeId) || CONSTELLATION_NODES[0];

  const handleNodeClick = (node: ConstellationNode) => {
    setSelectedNodeId(node.id);
    setPulseTarget(node.connectedTo[0] || null);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'agentic': return '#FC75B4'; // Accent Pink (#FC75B4)
      case 'ai': return '#ffa3d1'; // Light Pink
      case 'software': return '#c9be83'; // Cream Gold
      case 'data': return '#756f45'; // Warm Olive (#474329)
      default: return '#F0E5DB';
    }
  };

  return (
    <section id="capabilities" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Section Header with View Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-brand-aqua/10 text-brand-aqua border border-brand-aqua/30 uppercase tracking-widest font-semibold">
              Technical Field Guide
            </span>
            <div className="h-[1px] w-12 bg-brand-aqua/30" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Technical Capabilities & Architecture Graph
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
            Core proficiencies across autonomous agentic frameworks, deep learning models, full-stack backends, and high-performance compute architectures.
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/10 shrink-0">
          <button
            onClick={() => setViewMode('constellation')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'constellation'
                ? 'bg-brand-aqua/20 text-brand-aqua border border-brand-aqua/40 shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            Constellation Graph
          </button>

          <button
            onClick={() => setViewMode('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'guide'
                ? 'bg-brand-sky/20 text-brand-sky border border-brand-sky/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            Category Reference
          </button>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE CONSTELLATION GRAPH */}
      {viewMode === 'constellation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          {/* Interactive Graph Canvas Area (8 cols) */}
          <div className="lg:col-span-8 editorial-card rounded-3xl p-6 relative overflow-hidden border border-white/10 bg-[#10131d]/90 shadow-2xl min-h-[460px] flex flex-col justify-between">
            {/* Top Graph Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 z-10">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-brand-aqua" />
                <span>Interactive Tech Graph (Click nodes to inspect relationships)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-brand-aqua"><span className="w-2 h-2 rounded-full bg-brand-aqua" />Agentic</span>
                <span className="flex items-center gap-1.5 text-brand-sky"><span className="w-2 h-2 rounded-full bg-brand-sky" />AI / CV</span>
                <span className="flex items-center gap-1.5 text-brand-violet"><span className="w-2 h-2 rounded-full bg-brand-violet" />Software</span>
                <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" />Data</span>
              </div>
            </div>

            {/* SVG Graph Layer */}
            <div className="relative w-full h-[360px] sm:h-[400px] my-auto">
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                {/* Draw connection lines between nodes */}
                {CONSTELLATION_NODES.map((node) => {
                  return node.connectedTo.map((targetId) => {
                    const targetNode = CONSTELLATION_NODES.find((n) => n.id === targetId);
                    if (!targetNode) return null;

                    const isSelectedEdge =
                      node.id === selectedNodeId || targetNode.id === selectedNodeId;

                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        stroke={
                          isSelectedEdge
                            ? 'rgba(45, 212, 191, 0.7)'
                            : 'rgba(255, 255, 255, 0.08)'
                        }
                        strokeWidth={isSelectedEdge ? 2 : 1}
                        strokeDasharray={isSelectedEdge ? '4,4' : 'none'}
                        className={isSelectedEdge ? 'animate-pulse' : ''}
                      />
                    );
                  });
                })}
              </svg>

              {/* Draw interactive Node buttons */}
              {CONSTELLATION_NODES.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isConnected = selectedNode.connectedTo.includes(node.id);
                const color = getCategoryColor(node.category);

                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`
                      absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer
                      flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono
                      transition-all duration-200 select-none z-10
                      ${
                        isSelected
                          ? 'bg-brand-aqua/20 border-brand-aqua text-white shadow-[0_0_25px_rgba(45,212,191,0.4)] scale-110'
                          : isConnected
                          ? 'bg-white/10 border-brand-sky/50 text-slate-200 scale-105'
                          : 'bg-[#151824]/90 border-white/10 text-slate-400 hover:text-white hover:border-white/30 hover:scale-105'
                      }
                    `}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold">{node.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Graph Status */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Selected Node: <strong className="text-white">{selectedNode.name}</strong></span>
              <span>{selectedNode.connectedTo.length} Connected Technologies</span>
            </div>
          </div>

          {/* Node Details Inspection Panel (4 cols) */}
          <div className="lg:col-span-4 editorial-card rounded-3xl p-6 border border-white/10 bg-[#121520]/90 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {selectedNode.category} module
              </span>
              <ThinkingOrb state="connecting" size={24} theme="cyan" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {selectedNode.description}
              </p>
            </div>

            {/* Connected Dependencies */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Direct System Links:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.connectedTo.map((targetId) => {
                  const target = CONSTELLATION_NODES.find((n) => n.id === targetId);
                  return (
                    <button
                      key={targetId}
                      onClick={() => target && handleNodeClick(target)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-brand-aqua/20 border border-white/10 hover:border-brand-aqua/40 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
                    >
                      → {target?.name || targetId}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real Projects Application */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Utilized In Flagship Work:
              </h4>
              <div className="space-y-1.5">
                {selectedNode.projects.map((proj) => (
                  <div
                    key={proj}
                    className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-xs text-slate-300 flex items-center justify-between"
                  >
                    <span>{proj}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-aqua shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CATEGORIZED FIELD GUIDE */}
      {viewMode === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="editorial-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#121520]/80 space-y-6"
            >
              {/* Category Header */}
              <div className="space-y-1 pb-4 border-b border-white/5">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  {category.description}
                </p>
              </div>

              {/* Skills List in Category */}
              <div className="space-y-4">
                {category.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2 hover:border-brand-aqua/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThinkingOrb state={skill.orbState} size={18} theme="cyan" />
                        <h4 className="text-sm font-semibold text-white">{skill.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-brand-aqua/10 text-brand-aqua border border-brand-aqua/30">
                        {skill.level}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {skill.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {skill.projectsUsed.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
