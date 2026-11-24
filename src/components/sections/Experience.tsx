import React from 'react';
import { EXPERIENCES } from '../../data/experience';
import { EDUCATION_DATA, CERTIFICATIONS, INTERESTS_DATA } from '../../data/education';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Cpu, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-brand-aqua/10 text-brand-aqua border border-brand-aqua/30 uppercase tracking-widest font-semibold">
            Career & Academic Trajectory
          </span>
          <div className="h-[1px] w-12 bg-brand-aqua/30" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Professional Experience & Academic Background
        </h2>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          Industry work-based learning, dual-award computer science honours degree, and enterprise certifications in AI, cloud computing, and software engineering.
        </p>
      </div>

      {/* 1. PROFESSIONAL EXPERIENCE TIMELINE */}
      <div className="space-y-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <Briefcase className="w-5 h-5 text-brand-aqua" />
          Industry Work Experience
        </h3>

        <div className="relative border-l border-white/10 ml-4 pl-6 sm:pl-8 space-y-12">
          {EXPERIENCES.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-brand-aqua flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-aqua animate-ping" />
              </div>

              <div className="editorial-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#121520]/80 space-y-5">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">
                      {exp.role}
                    </h4>
                    <div className="text-sm font-semibold text-brand-aqua">
                      {exp.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5">
                      <Calendar className="w-3.5 h-3.5 text-brand-sky" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5">
                      <MapPin className="w-3.5 h-3.5 text-brand-violet" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {exp.summary}
                </p>

                {/* Key Accomplishments */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Core Engineering Highlights:
                  </div>
                  <ul className="space-y-2">
                    {exp.highlights.map((hl, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-aqua shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies Used */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. EDUCATION & ACADEMIC HONOURS */}
      <div id="education" className="space-y-8 pt-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <GraduationCap className="w-5 h-5 text-brand-sky" />
          Education & Academic Honours
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main University Card (8 cols) */}
          <div className="lg:col-span-8 editorial-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#121520]/80 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  DUAL AWARD PROGRAMME
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {EDUCATION_DATA[0].period}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {EDUCATION_DATA[0].degree}
              </h4>
              <p className="text-sm font-medium text-brand-sky">
                {EDUCATION_DATA[0].institution} • {EDUCATION_DATA[0].location}
              </p>
            </div>

            {/* GPA & Honors Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-[11px] font-mono uppercase text-slate-400">Current CGPA</div>
                <div className="text-2xl font-bold font-mono text-brand-aqua">
                  {EDUCATION_DATA[0].cgpa}
                </div>
                <div className="text-xs text-slate-400">Academic Standing</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-[11px] font-mono uppercase text-slate-400">Dean's List Award</div>
                <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-1">
                  <Award className="w-4 h-4 shrink-0" />
                  August 2025 Recipient
                </div>
                <div className="text-[11px] text-slate-400">Machine learning excellence</div>
              </div>
            </div>

            {/* Leadership & Governance */}
            <div className="p-4 rounded-2xl bg-brand-violet/10 border border-brand-violet/20 space-y-1">
              <div className="text-xs font-mono font-semibold text-brand-violet uppercase">
                Student Leadership:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {EDUCATION_DATA[0].leadership[0]}
              </p>
            </div>

            {/* Key Coursework */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Specialized AI Coursework:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EDUCATION_DATA[0].coursework.map((course) => (
                  <span
                    key={course}
                    className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Education / Foundation (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {EDUCATION_DATA.slice(1).map((edu) => (
              <div
                key={edu.id}
                className="editorial-card rounded-2xl p-5 border border-white/10 bg-[#121520]/60 space-y-2"
              >
                <div className="text-[10px] font-mono text-slate-400">{edu.period}</div>
                <h5 className="text-sm font-bold text-white">{edu.degree}</h5>
                <p className="text-xs text-slate-400">{edu.institution} • {edu.location}</p>
                {edu.honors.length > 0 && (
                  <div className="text-[11px] font-mono text-brand-aqua pt-1">
                    ✓ {edu.honors[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. INDUSTRY CERTIFICATIONS GRID */}
      <div className="space-y-6 pt-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Industry Certifications & Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTIFICATIONS.map((cert, idx) => (
            <div
              key={idx}
              className="editorial-card rounded-2xl p-5 border border-white/10 bg-[#121520]/60 hover:bg-[#141826] transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  {cert.category}
                </span>
                <span className="text-slate-400">{cert.year}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {cert.name}
                </h4>
                <div className="text-xs text-brand-sky font-medium mt-0.5">{cert.issuer}</div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CUSTOM HARDWARE & EXTRACURRICULAR INTERESTS */}
      <div className="space-y-6 pt-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-amber-400" />
          Custom Hardware Engineering & Athletics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERESTS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="editorial-card rounded-2xl p-5 border border-white/10 bg-[#121520]/60 space-y-2.5"
            >
              <div className="p-2.5 rounded-xl bg-white/5 text-amber-400 w-fit">
                {idx === 0 && <Cpu className="w-4 h-4" />}
                {idx === 1 && <Activity className="w-4 h-4" />}
                {idx === 2 && <Award className="w-4 h-4" />}
                {idx === 3 && <Zap className="w-4 h-4" />}
              </div>

              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
