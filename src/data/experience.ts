import { ExperienceItem } from '../types';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'asrix-bhd',
    role: 'AI Engineering Work-Based Learning (WBL)',
    company: 'Asrix BHD',
    location: 'Industry Placement / Hybrid',
    period: 'Sept 2025 – June 2026',
    type: 'Industry WBL Placement',
    summary: 'Developing sequential computer vision pipelines, fine-tuning local open-source LLMs, and bridging model inference with production API systems.',
    highlights: [
      'Developed and optimized a sequential computer vision pipeline for pedestrian and transport detection using YOLO architectures, tuning inference workflows for real-time webcam and video feeds.',
      'Fine-tuned a local open-source LLM (Mistral 7B) on custom HuggingFace datasets (`argilla/news-summary`) to compress, classify, and extract structured telemetry data from unstructured logs.',
      'Partnered directly with engineering teams to bridge model-inference loops with production APIs, mapping system dependencies and reducing operational pipeline failure modes.',
      'Containerized inference routines and benchmarked latency trade-offs between quantized 4-bit edge weights and full-precision GPU execution.'
    ],
    technologies: [
      'YOLOv8 / YOLOv3',
      'Mistral 7B & QLoRA',
      'Unsloth AI',
      'HuggingFace TRL',
      'OpenCV',
      'FastAPI',
      'Python',
      'Docker'
    ]
  },
  {
    id: 'gotgame',
    role: 'Assistant Coding Teacher',
    company: 'GotGame / WeCode Academy (Client: Nokia)',
    location: 'Johannesburg, South Africa',
    period: '2019',
    type: 'Teaching & Mentorship',
    summary: 'Instructed student developers in core programming paradigms, object-oriented systems, data structures, and real-time live debugging.',
    highlights: [
      'Translated complex software engineering logic, data structures, and algorithmic paradigms into accessible curriculum modules for community workshop attendees.',
      'Diagnosed, debugged, and refactored diverse program implementations in real time across Java and Python, rapidly isolating logic flaws for student developers.',
      'Facilitated hands-on coding labs emphasizing clean code architecture, modular design, and test-driven development methodologies.'
    ],
    technologies: [
      'Python',
      'Java',
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Technical Communication'
    ]
  }
];
