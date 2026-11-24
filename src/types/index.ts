export type ThinkingOrbState =
  | 'working'
  | 'searching'
  | 'solving'
  | 'listening'
  | 'connecting'
  | 'weaving'
  | 'composing'
  | 'breathing'
  | 'shaping';

export interface ProjectScreenshot {
  url: string;
  title: string;
  caption: string;
}

export interface AgentWorkflowStep {
  step: number;
  title: string;
  description: string;
  orbState: ThinkingOrbState;
  tool: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  featured: boolean;
  tagline: string;
  timeline: string;
  heroImage: string;
  screenshots: ProjectScreenshot[];
  technologies: string[];
  keyConcepts: string[];
  architecture: {
    summary: string;
    flow: string[];
    diagramNodes?: {
      name: string;
      type: 'client' | 'service' | 'agent' | 'db' | 'model';
      description: string;
    }[];
  };
  problemStatement: string;
  engineeringChallenges: {
    challenge: string;
    solution: string;
  }[];
  implementation: {
    keyHighlights: string[];
    details: string[];
  };
  results: {
    metric: string;
    label: string;
    description: string;
  }[];
  repoUrl: string;
  liveUrl?: string;
  agentWorkflow?: AgentWorkflowStep[];
}

export interface SkillItem {
  name: string;
  level: 'Expert' | 'Advanced' | 'Proficient';
  description: string;
  projectsUsed: string[];
  orbState: ThinkingOrbState;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: SkillItem[];
}

export interface ConstellationNode {
  id: string;
  name: string;
  category: 'ai' | 'agentic' | 'software' | 'data';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  description: string;
  connectedTo: string[];
  projects: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
  honors: string[];
  leadership: string[];
  coursework: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  category: string;
  description: string;
}
