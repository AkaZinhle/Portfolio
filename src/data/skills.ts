import { SkillCategory, ConstellationNode } from '../types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & ML',
    description: 'Deep learning models, computer vision pipelines, local LLM fine-tuning, and multimodal reasoning architectures.',
    skills: [
      {
        name: 'Computer Vision & Object Detection',
        level: 'Expert',
        description: 'Trained YOLOv8 and YOLOv3 architectures for sub-millimeter industrial defect detection, pedestrian tracking, and OpenCV edge preprocessing.',
        projectsUsed: ['PCB Defect Detector', 'YOLOv3 Edge Vision', 'CV Traffic Sign Identifier', 'Asrix BHD WBL'],
        orbState: 'shaping'
      },
      {
        name: 'LLM Fine-Tuning & Quantization',
        level: 'Advanced',
        description: 'Fine-tuning open models (Mistral 7B) using Unsloth AI, HuggingFace TRL, BitsAndBytes 4-bit QLoRA, and GGUF exports for local Ollama inference.',
        projectsUsed: ['Mistral-7B News Summarizer', 'Asrix BHD WBL'],
        orbState: 'solving'
      },
      {
        name: 'Multimodal AI Reasoning',
        level: 'Advanced',
        description: 'Asynchronous vision-language reasoning using Ollama (Llava, Moondream) and GPT-4o for automated physical diagnostics and repair guidance.',
        projectsUsed: ['PCB Defect Detector', 'VoltStock'],
        orbState: 'searching'
      },
      {
        name: 'Retrieval-Augmented Generation (RAG)',
        level: 'Expert',
        description: 'Decoupled agentic RAG architectures separating vector knowledge retrieval from document synthesis to eliminate hallucinations.',
        projectsUsed: ['UnderWrite.AI (Risses.ai)', 'VoltStock'],
        orbState: 'connecting'
      },
      {
        name: 'Deep Learning Frameworks',
        level: 'Advanced',
        description: 'PyTorch, TensorFlow 2.x, Keras Sequential API, Scikit-learn, and Ultralytics ecosystems.',
        projectsUsed: ['CV Traffic Sign Identifier', 'Salary Prediction Pipeline'],
        orbState: 'working'
      }
    ]
  },
  {
    id: 'agentic',
    name: 'Agentic Systems & Protocols',
    description: 'Autonomous multi-tool orchestration, standard agent protocols (MCP, AP2), and streaming telemetry architectures.',
    skills: [
      {
        name: 'Model Context Protocol (MCP)',
        level: 'Expert',
        description: 'Engineered custom schema-aware MCP servers exposing typed, validated database tools directly to autonomous agents.',
        projectsUsed: ['VoltStock'],
        orbState: 'connecting'
      },
      {
        name: 'Agent Payments Protocol (AP2)',
        level: 'Advanced',
        description: 'Implemented Google AP2 verifiable intent mandates for cryptographically signed autonomous procurement under strict budget ceilings.',
        projectsUsed: ['VoltStock'],
        orbState: 'weaving'
      },
      {
        name: 'ReAct Multi-Tool Orchestration',
        level: 'Expert',
        description: 'Autonomous Think-Act-Observe reasoning loops with up to 5 iterations for dynamic tool selection without hardcoded logic.',
        projectsUsed: ['VoltStock', 'UnderWrite.AI (Risses.ai)'],
        orbState: 'solving'
      },
      {
        name: 'Real-Time SSE Streaming',
        level: 'Expert',
        description: 'Engineered typed Server-Sent Events (SSE) streaming clients with exponential backoff on rate limits and live thought-chain visualization.',
        projectsUsed: ['UnderWrite.AI (Risses.ai)', 'VoltStock', 'PCB Defect Detector'],
        orbState: 'composing'
      },
      {
        name: 'Dify.ai Workflows & Agents',
        level: 'Advanced',
        description: 'Production orchestrations connecting vector databases, search tools, and LLM nodes with session state memory.',
        projectsUsed: ['VoltStock', 'UnderWrite.AI (Risses.ai)'],
        orbState: 'breathing'
      }
    ]
  },
  {
    id: 'software',
    name: 'Software Engineering & Full-Stack',
    description: 'High-performance API backends, reactive user interfaces, and robust systems programming.',
    skills: [
      {
        name: 'Python (FastAPI & Flask)',
        level: 'Expert',
        description: '7 years of Python experience building asynchronous REST APIs, background worker queues, and connection-pooled data services.',
        projectsUsed: ['VoltStock', 'PCB Defect Detector', 'UnderWrite.AI', 'Asrix BHD WBL'],
        orbState: 'working'
      },
      {
        name: 'TypeScript & JavaScript',
        level: 'Expert',
        description: 'Type-safe frontends and asynchronous client architectures with modern build tooling and strict linting.',
        projectsUsed: ['VoltStock', 'PCB Defect Detector', 'Portfolio Website'],
        orbState: 'connecting'
      },
      {
        name: 'Next.js 16 & React 19',
        level: 'Advanced',
        description: 'Modern component architectures, server components, optimistic UI state updates, and Tailwind CSS design systems.',
        projectsUsed: ['PCB Defect Detector', 'VoltStock', 'Portfolio Website'],
        orbState: 'composing'
      },
      {
        name: 'C++, Java, C# & Systems',
        level: 'Proficient',
        description: 'Strong foundation in object-oriented systems programming, memory structures, algorithms, and technical debugging.',
        projectsUsed: ['Taylor & UWE Coursework', 'GotGame Instruction'],
        orbState: 'working'
      }
    ]
  },
  {
    id: 'data-infra',
    name: 'Data & Infrastructure',
    description: 'Database design, cloud architectures, automated reporting engines, and custom hardware engineering.',
    skills: [
      {
        name: 'MongoDB Atlas & SQLite',
        level: 'Advanced',
        description: 'JSON schema validation, index optimization, thread-safe connection pooling, and append-only audit trail logging.',
        projectsUsed: ['VoltStock', 'PCB Defect Detector'],
        orbState: 'working'
      },
      {
        name: 'AWS Cloud & Deployment',
        level: 'Advanced',
        description: 'AWS Certified Cloud Practitioner with experience in cloud hosting, S3 storage, containerized workloads, and API gateways.',
        projectsUsed: ['Cloud Certifications', 'VoltStock Deployment'],
        orbState: 'connecting'
      },
      {
        name: 'Automated Report Engines',
        level: 'Expert',
        description: 'OpenPyXL 4-sheet formatted Excel workbook generation, ReportLab executive PDF synthesis, and Matplotlib trend visualization.',
        projectsUsed: ['PCB Defect Detector'],
        orbState: 'composing'
      },
      {
        name: 'Custom AI Hardware Engineering',
        level: 'Expert',
        description: 'Designed and built 5 high-performance workstation PC rigs customized for AI model training, thermal dissipation, and CUDA acceleration.',
        projectsUsed: ['Workstation Lab', 'Local Fine-Tuning'],
        orbState: 'shaping'
      }
    ]
  }
];

export const CONSTELLATION_NODES: ConstellationNode[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'software',
    x: 20,
    y: 35,
    description: '7 years core programming language for AI pipelines, FastAPI backends, and ML inference.',
    connectedTo: ['fastapi', 'yolo', 'pytorch', 'mcp'],
    projects: ['VoltStock', 'PCB Defect Detector', 'Risses.ai', 'Asrix BHD WBL']
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'software',
    x: 35,
    y: 22,
    description: 'Asynchronous REST gateway, SSE streaming, and high-throughput microservices.',
    connectedTo: ['python', 'mcp', 'react', 'mongodb'],
    projects: ['VoltStock']
  },
  {
    id: 'mcp',
    name: 'MCP (Model Context)',
    category: 'agentic',
    x: 50,
    y: 20,
    description: 'Standardized tool discovery & schema-aware database inspection protocol for LLMs.',
    connectedTo: ['fastapi', 'react_agent', 'mongodb', 'ap2'],
    projects: ['VoltStock']
  },
  {
    id: 'react_agent',
    name: 'ReAct Orchestration',
    category: 'agentic',
    x: 65,
    y: 28,
    description: 'Autonomous multi-step Think-Act-Observe reasoning loops with up to 5 tool iterations.',
    connectedTo: ['mcp', 'rag', 'ap2', 'llm'],
    projects: ['VoltStock', 'Risses.ai']
  },
  {
    id: 'ap2',
    name: 'Google AP2',
    category: 'agentic',
    x: 80,
    y: 22,
    description: 'Agent Payments Protocol for cryptographically signed autonomous procurement mandates.',
    connectedTo: ['react_agent', 'mcp'],
    projects: ['VoltStock']
  },
  {
    id: 'rag',
    name: 'Agentic RAG',
    category: 'ai',
    x: 75,
    y: 48,
    description: 'Decoupled retrieval and policy synthesis preventing hallucination bleed-through.',
    connectedTo: ['react_agent', 'llm', 'mongodb'],
    projects: ['Risses.ai']
  },
  {
    id: 'llm',
    name: 'Local LLMs & Mistral',
    category: 'ai',
    x: 60,
    y: 65,
    description: 'Mistral 7B fine-tuning via Unsloth AI & 4-bit QLoRA for structured telemetry extraction.',
    connectedTo: ['rag', 'ollama', 'python'],
    projects: ['Mistral-7B', 'Asrix BHD WBL']
  },
  {
    id: 'ollama',
    name: 'Ollama Multimodal',
    category: 'ai',
    x: 45,
    y: 80,
    description: 'Llava & Moondream vision-language reasoning for industrial defect explanation.',
    connectedTo: ['yolo', 'llm', 'sqlite'],
    projects: ['PCB Defect Detector']
  },
  {
    id: 'yolo',
    name: 'YOLOv8 / YOLOv3',
    category: 'ai',
    x: 25,
    y: 65,
    description: 'Sub-millimeter real-time object detection with custom anchor priors & OpenCV.',
    connectedTo: ['python', 'ollama', 'opencv'],
    projects: ['PCB Defect Detector', 'YOLOv3 Edge Vision', 'Asrix BHD WBL']
  },
  {
    id: 'opencv',
    name: 'OpenCV',
    category: 'ai',
    x: 12,
    y: 52,
    description: 'Real-time frame normalization, RTSP camera processing, and video stream queues.',
    connectedTo: ['yolo', 'python'],
    projects: ['PCB Defect Detector', 'CV Traffic Sign Identifier']
  },
  {
    id: 'pytorch',
    name: 'PyTorch / TF',
    category: 'ai',
    x: 15,
    y: 18,
    description: 'Deep neural networks, convolutional architectures, and backpropagation optimization.',
    connectedTo: ['python', 'yolo'],
    projects: ['CV Traffic Sign Identifier', 'Salary Prediction']
  },
  {
    id: 'react',
    name: 'React 19 & Next.js',
    category: 'software',
    x: 52,
    y: 42,
    description: 'Modern reactive dashboards, interactive visualizers, and command center interfaces.',
    connectedTo: ['fastapi', 'typescript', 'tailwind'],
    projects: ['VoltStock', 'PCB Defect Detector', 'Portfolio']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'software',
    x: 38,
    y: 48,
    description: 'Type-safe client architectures, API models, and robust UI state managers.',
    connectedTo: ['react', 'tailwind'],
    projects: ['VoltStock', 'PCB Defect Detector', 'Portfolio']
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'software',
    x: 48,
    y: 60,
    description: 'Editorial design systems, dark-theme styling, and responsive layout primitives.',
    connectedTo: ['react', 'typescript'],
    projects: ['VoltStock', 'PCB Defect Detector', 'Portfolio']
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    category: 'data',
    x: 70,
    y: 12,
    description: 'JSON schema-validated document store with append-only immutable audit logging.',
    connectedTo: ['mcp', 'fastapi'],
    projects: ['VoltStock']
  },
  {
    id: 'sqlite',
    name: 'Thread-Safe SQLite',
    category: 'data',
    x: 30,
    y: 88,
    description: 'Concurrent inspection session logging and batch video scan queue persistence.',
    connectedTo: ['ollama', 'yolo'],
    projects: ['PCB Defect Detector']
  }
];
