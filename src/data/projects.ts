import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'voltstock',
    number: '01',
    title: 'VoltStock',
    subtitle: 'AI-Powered Autonomous Inventory & Agentic Commerce',
    category: 'Agentic AI & Full-Stack Systems',
    featured: true,
    tagline: 'Bridging industrial inventory management with autonomous ReAct procurement and cryptographic Google AP2 payment mandates.',
    timeline: 'Jan 2026 – Present',
    heroImage: '/assets/projects/Voltstock 1.jpg',
    screenshots: [
      {
        url: '/assets/projects/Voltstock 1.jpg',
        title: 'Executive Telemetry & Inventory KPI Dashboard',
        caption: 'High-performance analytics tracking Monthly Turnover Rate, Value Shipped, and Stock Level trends with real-time alerts.'
      },
      {
        url: '/assets/projects/Voltstock 2.jpg',
        title: 'Live Inventory Ledger & Reorder Points',
        caption: 'Automated safety stock thresholds and schema-aware status monitoring preventing stockouts and excess holding costs.'
      },
      {
        url: '/assets/projects/Voltstock 3.jpg',
        title: 'Conversational AI Co-Pilot Interface',
        caption: 'Natural language chat interface enabling warehouse personnel to query stock, resolve discrepancies, and trigger operations.'
      },
      {
        url: '/assets/projects/Voltstock 4.jpg',
        title: 'Autonomous Google AP2 Procurement Flow',
        caption: 'Agentic commerce flow executing autonomous supplier research and cryptographically signed purchase mandates.'
      },
      {
        url: '/assets/projects/Voltstock 5.jpg',
        title: 'Immutable In-Out Audit Log & Source of Truth',
        caption: 'Append-only audit trail logging every inventory movement with timestamps, actor metadata, and cryptographic verification.'
      }
    ],
    technologies: [
      'Model Context Protocol (MCP)',
      'Agent Payments Protocol (AP2)',
      'FastAPI (Python 3.11)',
      'React 19 & TypeScript',
      'MongoDB Atlas',
      'Dify ReAct Orchestrator',
      'OpenAI GPT-4o / Claude',
      'Tailwind CSS'
    ],
    keyConcepts: [
      'Model Context Protocol (MCP)',
      'Google AP2 Agentic Commerce',
      'ReAct Multi-Tool Orchestration',
      'Schema-Aware MongoDB Tools',
      'Real-Time Telemetry Streaming',
      'Immutable Audit Logging'
    ],
    architecture: {
      summary: 'VoltStock utilizes a decoupled Data-to-Agent pipeline. The React 19 UI communicates with a high-throughput Python FastAPI backend. A custom Model Context Protocol (MCP) server provides the LLM orchestrator (Dify ReAct) with structured, schema-validated database tools, while the Google AP2 integration manages autonomous procurement through cryptographically signed mandates.',
      flow: [
        'User / Warehouse Telemetry Trigger',
        'FastAPI Gateway & Auth Verification',
        'Schema-Aware MCP Server Protocol Layer',
        'Dify ReAct AI Agent Multi-Step Reasoning',
        'MongoDB Atlas JSON Schema Validated Storage',
        'Google AP2 Cryptographic Procurement Engine'
      ],
      diagramNodes: [
        { name: 'React 19 UI', type: 'client', description: 'Real-time telemetry dashboards & conversational co-pilot interface' },
        { name: 'FastAPI Backend', type: 'service', description: 'High-speed asynchronous Python REST & SSE streaming server' },
        { name: 'Custom MCP Server', type: 'service', description: 'Standardized tool discovery & schema-aware MongoDB layer' },
        { name: 'Dify ReAct Agent', type: 'agent', description: 'Autonomous multi-step Think-Act-Observe reasoning orchestrator' },
        { name: 'MongoDB Atlas', type: 'db', description: 'Cluster database with strict JSON schema validation' },
        { name: 'Google AP2 Module', type: 'model', description: 'Cryptographically signed intent mandates for autonomous buying' }
      ]
    },
    problemStatement: 'Modern warehouse and electronic component inventory management suffers from fragmented data silos, delayed human-in-the-loop purchase approvals, and stockout blindspots. Traditional enterprise ERPs lack active intelligence to predict shortages and independently resolve procurement bottlenecks.',
    engineeringChallenges: [
      {
        challenge: 'Providing LLMs with reliable database mutation capabilities without risking arbitrary query injection or data corruption.',
        solution: 'Implemented a dedicated Model Context Protocol (MCP) server that strictly exposes typed, schema-validated tool definitions with granular role validation before executing any MongoDB update.'
      },
      {
        challenge: 'Enabling autonomous AI purchasing while retaining full cryptographic accountability and compliance oversight.',
        solution: 'Integrated the Google Agent Payments Protocol (AP2) to generate signed, verifiable intent mandates bounded by strict budget ceilings and automated anomaly detection.'
      },
      {
        challenge: 'Handling real-time warehouse telemetry updates alongside conversational co-pilot streaming.',
        solution: 'Built an asynchronous Server-Sent Events (SSE) pipeline in FastAPI combined with React optimistic UI state updates for sub-second visual responsiveness.'
      }
    ],
    implementation: {
      keyHighlights: [
        'Custom MCP server exposing standardized database tools directly to LLMs',
        'Autonomous procurement through Google AP2 verifiable intent mandates',
        'Real-time KPI calculations for Monthly Turnover Rate and Value Shipped',
        'Immutable In-Out Log system acting as an auditable Single Source of Truth'
      ],
      details: [
        'Built full asynchronous Python backend using FastAPI, Pydantic v2, and PyMongo with connection pooling.',
        'Designed React 19 frontend utilizing Tailwind CSS, Lucide icons, and custom responsive data grids.',
        'Configured multi-tier AI model fallback handling across Claude 3.5 Sonnet and OpenAI GPT-4o.',
        'Engineered dynamic safety stock computation based on lead time variability and historical depletion rates.'
      ]
    },
    results: [
      { metric: '100%', label: 'Audit Trail Integrity', description: 'Immutable cryptographic logging across all stock mutations.' },
      { metric: '< 250ms', label: 'MCP Tool Resolution', description: 'Sub-second tool selection and parameter validation latency.' },
      { metric: 'Autonomous', label: 'Procurement Engine', description: 'Full AP2 mandate lifecycle from stockout alert to signed purchase order.' }
    ],
    repoUrl: 'https://github.com/AkaZinhle/VoltStock',
    agentWorkflow: [
      {
        step: 1,
        title: 'Telemetry Event & Natural Language Query',
        description: 'Warehouse manager asks "Check safety stock levels for STM32 microcontrollers and replenish if below 15% threshold".',
        orbState: 'searching',
        tool: 'FastAPI Input Gateway'
      },
      {
        step: 2,
        title: 'MCP Schema & Tool Discovery',
        description: 'Agent queries the VoltStock MCP server to inspect current SKU quantities, supplier lead times, and active purchase orders.',
        orbState: 'connecting',
        tool: 'VoltStock MCP Server'
      },
      {
        step: 3,
        title: 'Algorithmic Safety Stock Assessment',
        description: 'Agent identifies STM32F401 stock at 8% threshold. Calculates optimal reorder quantity based on 14-day supplier lead time.',
        orbState: 'solving',
        tool: 'Dify ReAct Engine'
      },
      {
        step: 4,
        title: 'Google AP2 Mandate Generation',
        description: 'Generates a cryptographically signed purchase mandate under pre-approved commercial spending limits.',
        orbState: 'weaving',
        tool: 'Google AP2 Module'
      },
      {
        step: 5,
        title: 'Immutable In-Out Log Serialization',
        description: 'Writes purchase allocation to MongoDB Atlas and streams updated inventory ledger state to the React dashboard.',
        orbState: 'working',
        tool: 'MongoDB Atlas Driver'
      }
    ]
  },
  {
    id: 'pcb-detector',
    number: '02',
    title: 'PCB Defect Detector & Explainer',
    subtitle: 'Industrial Computer Vision with Multimodal AI Reasoning',
    category: 'Computer Vision & Multimodal AI',
    featured: true,
    tagline: 'High-speed YOLOv8 object detection paired with local Ollama vision models for real-time sub-millimeter PCB manufacturing diagnostics.',
    timeline: 'Jan 2026 – Jul 2026',
    heroImage: '/assets/projects/PCB Detection 1.jpg',
    screenshots: [
      {
        url: '/assets/projects/PCB Detection 1.jpg',
        title: 'Live AOI Camera Feed & Sub-Millimeter Bounding Boxes',
        caption: 'Real-time YOLOv8 object detection localizing defects across 6 critical PCB categories with confidence scores.'
      },
      {
        url: '/assets/projects/PCB Detection 2.jpg',
        title: 'Ollama Multimodal Visual Reasoning & Remediation',
        caption: 'Llava/Moondream vision reasoning analyzing defect crops, explaining root causes, and providing technician repair guidance.'
      },
      {
        url: '/assets/projects/PCB Detection 3.jpg',
        title: 'Historical Defect Catalog & Analytics Panel',
        caption: 'Defect distribution analytics, frequency charts, and inspection session history.'
      },
      {
        url: '/assets/projects/PCB Detection 4.jpg',
        title: 'Asynchronous Video Scan Queue Manager',
        caption: 'Batch video inspection engine processing recorded assembly lines with progress tracking and high-res defect extraction.'
      },
      {
        url: '/assets/projects/PCB Detection 5.jpg',
        title: 'Automated 4-Sheet Microsoft Excel Workbook Export',
        caption: 'Automated OpenPyXL reporting engine generating formatted inspection workbooks for quality assurance audits.'
      },
      {
        url: '/assets/projects/PCB Detection 6.jpg',
        title: 'Executive PDF Inspection Report with Matplotlib Trends',
        caption: 'Production-ready PDF summary with defect severity classifications and trend analysis.'
      }
    ],
    technologies: [
      'Ultralytics YOLOv8',
      'Ollama Vision LLMs (Llava / Moondream)',
      'Next.js 16 & React',
      'Flask API (Python 3.10)',
      'OpenCV',
      'Thread-Safe SQLite',
      'OpenPyXL & ReportLab',
      'Matplotlib'
    ],
    keyConcepts: [
      'Sub-Millimeter Defect Localization',
      '6 PCB Defect Classes',
      'Asynchronous Multimodal Reasoning',
      'Batch Video Frame Queue',
      'Automated Quality Reporting',
      'Real-Time RTSP/Webcam Processing'
    ],
    architecture: {
      summary: 'An Automated Optical Inspection (AOI) pipeline built for electronics manufacturing. Video streams (webcam or uploaded recordings) are processed frame-by-frame by a custom-trained YOLOv8 model. When defects are localized, cropped bounding boxes are queued asynchronously to Ollama multimodal vision models for plain-English root-cause explanations and repair instructions, while SQLite records historical metrics for Excel and PDF reporting.',
      flow: [
        'AOI High-Resolution Camera Feed / Video Stream',
        'OpenCV Frame Preprocessing & Normalization',
        'YOLOv8 Real-Time Sub-Millimeter Object Detection',
        'Thread-Safe Defect Crop Queueing',
        'Ollama Multimodal Vision Reasoning (Llava / Moondream)',
        'Next.js 16 Command Center + Multi-Sheet Report Generation'
      ],
      diagramNodes: [
        { name: 'Optical Camera / Video', type: 'client', description: 'High-resolution industrial AOI lens or batch video uploads' },
        { name: 'OpenCV Preprocessor', type: 'service', description: 'Color correction, edge sharpening, and frame normalization' },
        { name: 'Custom YOLOv8 Model', type: 'model', description: 'Trained weights identifying 6 PCB defect classes with precise coords' },
        { name: 'Async Worker Queue', type: 'service', description: 'Thread-safe non-blocking dispatcher for multimodal inference' },
        { name: 'Ollama Vision LLM', type: 'model', description: 'Llava / Moondream producing plain-English repair guidance' },
        { name: 'Next.js 16 Command Center', type: 'client', description: 'Interactive stream player, defect catalog, and Excel/PDF exporter' }
      ]
    },
    problemStatement: 'Printed Circuit Board (PCB) quality assurance in surface-mount technology (SMT) lines relies on manual microscopy or rigid computer vision that flags anomalies without contextual understanding. Technicians waste hours diagnosing false positives and writing defect compliance memos by hand.',
    engineeringChallenges: [
      {
        challenge: 'Detecting 6 sub-millimeter defect types (Open Circuits, Shorts, Mouse Bites, Spurs, Spurious Copper, Missing Holes) under varying lighting.',
        solution: 'Trained YOLOv8 with custom data augmentation (contrast, rotation, Gaussian blur) and fine-tuned anchor priors for micro-scale geometric features.'
      },
      {
        challenge: 'Multimodal LLM inference is computationally heavy and cannot run synchronously inside a 30 FPS camera loop.',
        solution: 'Engineered an asynchronous worker queue that decouples high-speed YOLO detection from Ollama visual reasoning, saving cropped regions and streaming explanations as they resolve.'
      },
      {
        challenge: 'Generating audit-compliant reports for electronics manufacturing stakeholders.',
        solution: 'Built an automated reporting engine using OpenPyXL to produce formatted 4-sheet workbooks and ReportLab for executive PDFs with embedded Matplotlib trend charts.'
      }
    ],
    implementation: {
      keyHighlights: [
        'Sub-millimeter localization across 6 critical PCB manufacturing defect classes',
        'Asynchronous multimodal vision reasoning generating actionable repair instructions',
        'Batch video scan queue processing recorded inspections with live progress updates',
        'Automated 4-sheet Microsoft Excel workbooks and executive PDF reports'
      ],
      details: [
        'Trained and evaluated custom YOLOv8 model weights using mAP@0.5 and precision-recall curves.',
        'Engineered thread-safe SQLite logging layer with connection pooling to prevent race conditions during concurrent video scans.',
        'Developed Next.js 16 frontend with Tailwind CSS, Chart.js, and Radix UI components.',
        'Integrated Ollama REST API with prompt optimization for structured JSON severity extraction.'
      ]
    },
    results: [
      { metric: '6 Classes', label: 'Defect Recognition', description: 'Open Circuits, Shorts, Mouse Bites, Spurs, Spurious Copper, Missing Holes.' },
      { metric: '30+ FPS', label: 'Real-Time Inference', description: 'Continuous video feed processing with zero frame drop.' },
      { metric: 'Automated', label: 'Multi-Sheet Export', description: '4-sheet Excel workbooks + executive PDF documentation.' }
    ],
    repoUrl: 'https://github.com/AkaZinhle/PCB-Defect-Detector',
    agentWorkflow: [
      {
        step: 1,
        title: 'Video Stream Capture & Normalization',
        description: 'Camera engine captures high-resolution PCB surface frames and normalizes lighting levels.',
        orbState: 'searching',
        tool: 'OpenCV Core Engine'
      },
      {
        step: 2,
        title: 'YOLOv8 Sub-Millimeter Localization',
        description: 'YOLOv8 detects a Spurious Copper defect with 94.2% confidence and extracts bounding box coordinates.',
        orbState: 'shaping',
        tool: 'Ultralytics YOLOv8'
      },
      {
        step: 3,
        title: 'Asynchronous Defect Crop Queueing',
        description: 'Defect patch is cropped at native resolution and dispatched to the background reasoning queue.',
        orbState: 'working',
        tool: 'Async Worker Queue'
      },
      {
        step: 4,
        title: 'Ollama Multimodal Visual Reasoning',
        description: 'Llava-13B analyzes trace proximity, flags Critical severity, and prescribes micro-milling remediation.',
        orbState: 'solving',
        tool: 'Ollama Vision LLM'
      },
      {
        step: 5,
        title: 'Audit Logging & Report Compilation',
        description: 'Records detection in SQLite database and compiles multi-sheet Excel summary and PDF charts.',
        orbState: 'composing',
        tool: 'OpenPyXL / ReportLab'
      }
    ]
  },
  {
    id: 'underwrite-ai',
    number: '03',
    title: 'UnderWrite.AI (Risses.ai)',
    subtitle: 'Autonomous AI Underwriting & Document Intelligence Assistant',
    category: 'Agentic AI & FinTech RAG',
    featured: true,
    tagline: 'Autonomous commercial underwriting assistant utilizing ReAct reasoning, multi-tool orchestration, and resilient Server-Sent Events streaming.',
    timeline: 'Nov 2025',
    heroImage: '/assets/projects/RissesAI 1.jpg',
    screenshots: [
      {
        url: '/assets/projects/RissesAI 1.jpg',
        title: 'PDF Upload & Commercial Loan Risk Dashboard',
        caption: 'Commercial loan and business insurance application ingestion interface with document preview.'
      },
      {
        url: '/assets/projects/RissesAI 2.jpg',
        title: 'Real-Time ReAct Thought-Chain Stream',
        caption: 'Live streaming thought accordion showing autonomous tool invocation, search queries, and reasoning steps.'
      },
      {
        url: '/assets/projects/RissesAI 3.jpg',
        title: 'Multi-Tool RAG Policy Verification',
        caption: 'Autonomous cross-referencing between applicant data and internal insurance policy knowledge bases.'
      },
      {
        url: '/assets/projects/RissesAI 4.jpg',
        title: 'Synthesized 5-Section Risk Memo',
        caption: 'Structured underwriting analysis with color-coded severity tags (🔴/🟡/🟢) and executive synthesis.'
      },
      {
        url: '/assets/projects/RissesAI 5.jpg',
        title: 'Executive Approval & Compliance Checklist',
        caption: 'Compliance verification and downloadable markdown underwriting risk memorandum.'
      }
    ],
    technologies: [
      'Dify.ai Workflow Engine',
      'OpenAI GPT-4o',
      'Agentic RAG',
      'Server-Sent Events (SSE)',
      'pdfplumber & PyPDF2',
      'Tenacity Retry Engine',
      'Streamlit',
      'Google Search API Tool'
    ],
    keyConcepts: [
      'Autonomous ReAct Agent Loop',
      'Decoupled Agentic RAG',
      'Typed SSE Streaming Client',
      'Multi-Tool Orchestration',
      'Multi-Turn Session Memory',
      'Document Intelligence'
    ],
    architecture: {
      summary: 'UnderWrite.AI decouples retrieval planning from document synthesis using the Agentic RAG pattern. Uploaded PDFs are parsed locally with table-aware extractors and sent to a Dify ReAct agent node that autonomously executes up to 5 reasoning iterations across Google Search and Vector Knowledge Bases before synthesizing a structured Risk Memo via Server-Sent Events.',
      flow: [
        'Commercial Loan / Insurance Application PDF Ingestion',
        'Local Table-Aware Extraction via pdfplumber',
        'Dify ReAct Agent Autonomous Reasoning Loop',
        'Dynamic Multi-Tool Selection: Web Reputation & Knowledge Base RAG',
        'Dedicated LLM Synthesis Node (Anti-Hallucination Barrier)',
        'Typed SSE Streaming Client (`dify_client.py`) to Streamlit UI'
      ],
      diagramNodes: [
        { name: 'Streamlit UI', type: 'client', description: 'Reactive dashboard with live accordion thought-chain streaming' },
        { name: 'Local PDF Extractor', type: 'service', description: 'Dual-engine pdfplumber + PyPDF2 parser for tabular financial data' },
        { name: 'Typed SSE Client', type: 'service', description: 'Custom dify_client.py with Tenacity exponential retry backoff' },
        { name: 'Dify ReAct Agent', type: 'agent', description: 'Autonomous agent executing up to 5 iterations of dynamic tool use' },
        { name: 'Policy Knowledge Base', type: 'db', description: 'Vector DB containing underwriting compliance manuals and guidelines' },
        { name: 'Synthesis LLM Node', type: 'model', description: 'Decoupled GPT-4o node outputting 5-section risk memoranda' }
      ]
    },
    problemStatement: 'Underwriting commercial loan and business insurance applications requires hours of manual cross-referencing across corporate registries, public news, financial tables, and dense internal compliance rulebooks, creating immense administrative overhead.',
    engineeringChallenges: [
      {
        challenge: 'Preventing LLM hallucination bleed-through between exploratory web searching and formal policy synthesis.',
        solution: 'Implemented the Decoupled Agentic RAG architecture: the ReAct agent handles tool exploration and evidence collection, while a dedicated synthesis node formats the final structured memo.'
      },
      {
        challenge: 'Maintaining real-time visibility into the agent\'s multi-step thought process over long-running evaluations.',
        solution: 'Architected a typed Server-Sent Events (SSE) streaming client routing distinct events (`agent_thought`, `agent_message`, `message_end`, `error`) to live UI accordions.'
      },
      {
        challenge: 'Handling API rate limits during intensive multi-tool reasoning sequences.',
        solution: 'Integrated the Tenacity retry framework with exponential backoff specifically tuned for 429 status codes (2s → 8s).'
      }
    ],
    implementation: {
      keyHighlights: [
        'ReAct agent node executing up to 5 autonomous reasoning iterations without hardcoded rules',
        'Decoupled Agentic RAG architecture isolating retrieval strategy from memo synthesis',
        'Robust SSE streaming client with typed exception hierarchy (DifyAuthError, DifyRateLimitError)',
        'Local dual-engine PDF extraction preserving tables and multi-column document layouts'
      ],
      details: [
        'Created custom `dify_client.py` library providing enterprise-grade streaming consumption.',
        'Configured session management with persistent `conversation_id` across multi-turn interactions.',
        'Designed custom Streamlit theme featuring real-time Thought Chain accordions and downloadable memos.'
      ]
    },
    results: [
      { metric: '5 Iterations', label: 'Autonomous Reasoning', description: 'Dynamic tool selection for web reputation and policy RAG checks.' },
      { metric: '100% Local', label: 'PDF Parsing', description: 'Zero third-party document persistence for financial confidentiality.' },
      { metric: 'Real-Time', label: 'SSE Thought Stream', description: 'Instant visibility into intermediate tool execution and reasoning.' }
    ],
    repoUrl: 'https://github.com/AkaZinhle/Rissess.ai',
    agentWorkflow: [
      {
        step: 1,
        title: 'Local Financial PDF Extraction',
        description: 'pdfplumber extracts balance sheets, applicant details, and collateral declarations locally.',
        orbState: 'listening',
        tool: 'pdfplumber Dual Engine'
      },
      {
        step: 2,
        title: 'Knowledge Base Policy Retrieval',
        description: 'Agent queries the internal underwriting knowledge base for commercial debt-to-income limits.',
        orbState: 'searching',
        tool: 'Dify Vector Knowledge Base'
      },
      {
        step: 3,
        title: 'Autonomous Web Reputation Search',
        description: 'Agent detects active litigation risks in the news and executes Google searches on the applicant company.',
        orbState: 'connecting',
        tool: 'Google Search API Tool'
      },
      {
        step: 4,
        title: 'Multi-Tool Cross-Verification',
        description: 'Synthesizes financial ratios against underwriting guidelines and assigns color-coded severity tags.',
        orbState: 'solving',
        tool: 'ReAct Reasoning Loop'
      },
      {
        step: 5,
        title: 'Structured Risk Memo Stream',
        description: 'Streams the complete 5-section Risk Memorandum via SSE directly to the client interface.',
        orbState: 'composing',
        tool: 'Decoupled GPT-4o Node'
      }
    ]
  },
  {
    id: 'traffic-sign-detector',
    number: '04',
    title: 'CV Traffic Sign Identifier',
    subtitle: '43-Class Traffic Sign Recognition via Sequential CNN',
    category: 'Computer Vision & Deep Learning',
    featured: false,
    tagline: 'Convolutional neural network pipeline trained on the German Traffic Sign Recognition Benchmark (GTSRB) for autonomous navigation.',
    timeline: '2024',
    heroImage: '/assets/projects/Street Sign Detection 1.png',
    screenshots: [
      {
        url: '/assets/projects/Street Sign Detection 1.png',
        title: 'CNN Training Curves & Multi-Class Confusion Matrix',
        caption: 'Evaluation metrics across 43 GTSRB traffic sign categories with precision-recall benchmarks.'
      }
    ],
    technologies: [
      'TensorFlow 2.x & Keras',
      'OpenCV',
      'German Traffic Sign Benchmark (GTSRB)',
      'Scikit-learn',
      'Matplotlib & Seaborn'
    ],
    keyConcepts: [
      'Sequential Convolutional Architecture',
      'Data Augmentation Pipelines',
      'Class Weight Balancing',
      'Real-Time OpenCV Inference'
    ],
    architecture: {
      summary: 'A sequential CNN architecture with stacked Conv2D, MaxPool2D, and Dropout regularization layers, trained on 43 distinct traffic sign classes from the GTSRB dataset with custom augmentation pipelines.',
      flow: [
        'GTSRB Dataset Preprocessing & Class Balancing',
        'ImageDataGenerator Rotation & Contrast Augmentation',
        'Deep Sequential Convolutional Feature Extraction',
        'Dense Classification with Softmax Output',
        'OpenCV Real-Time Video Frame Predictor'
      ]
    },
    problemStatement: 'Autonomous vehicles and driver-assistance systems require fast, robust visual recognition of traffic signage under adverse lighting, motion blur, and varied camera angles.',
    engineeringChallenges: [
      {
        challenge: 'Severe class imbalance across the 43 GTSRB sign classes.',
        solution: 'Calculated balanced class weights and applied dynamic augmentation (rotation, zoom, contrast adjustments).'
      }
    ],
    implementation: {
      keyHighlights: [
        'Sequential Convolutional Neural Network trained on 43 sign categories',
        'Custom augmentation pipeline using ImageDataGenerator',
        'Real-time OpenCV webcam testing loop with confidence thresholding'
      ],
      details: [
        'Trained using Adam optimizer with EarlyStopping callback on validation loss.',
        'Visualized model performance with confusion matrices, precision, and F1-score evaluation.'
      ]
    },
    results: [
      { metric: '43 Classes', label: 'GTSRB Recognition', description: 'Covers speed limits, warnings, yield, and directional signage.' },
      { metric: 'High Accuracy', label: 'Validation Score', description: 'Robust recognition across varying illumination levels.' }
    ],
    repoUrl: 'https://github.com/AkaZinhle/CV-Traffic-Sign-Identifier'
  },
  {
    id: 'yolov3-edge-vision',
    number: '05',
    title: 'YOLOv3 Pedestrian & Transport Detector',
    subtitle: 'Real-Time Edge Computer Vision Pipeline',
    category: 'Computer Vision & Edge AI',
    featured: false,
    tagline: 'High-speed object detection pipeline tuned for webcam video feeds and edge deployments.',
    timeline: '2024',
    heroImage: '/assets/projects/PCB Detection 1.jpg',
    screenshots: [
      {
        url: '/assets/projects/PCB Detection 1.jpg',
        title: 'Edge Object Detection Preview',
        caption: 'Bounding box localization and class score filtering for real-time video streams.'
      }
    ],
    technologies: [
      'YOLOv3 Darknet',
      'OpenCV DNN Module',
      'Python',
      'NumPy'
    ],
    keyConcepts: [
      'Non-Maximum Suppression (NMS)',
      'Confidence Filtering',
      'Edge Video Feed Optimization',
      'Asrix BHD Pipeline Research'
    ],
    architecture: {
      summary: 'Tuned YOLOv3 Darknet weights integrated with the OpenCV DNN module to achieve low-latency pedestrian and vehicle detection, serving as foundational research for industrial vision pipelines at Asrix BHD.',
      flow: [
        'Video Feed Capture via OpenCV',
        'Blob Normalization (1/255 scale factor)',
        'Darknet Forward Pass via OpenCV DNN',
        'Non-Maximum Suppression (NMS) Filtering',
        'Real-Time Bounding Box Annotation'
      ]
    },
    problemStatement: 'Industrial surveillance and edge IoT devices require reliable object detection pipelines capable of running on modest hardware without dedicated cloud GPU latency.',
    engineeringChallenges: [
      {
        challenge: 'Maintaining real-time framerates on standard CPU/edge hardware.',
        solution: 'Fine-tuned confidence thresholds and optimized NMS parameters to discard redundant candidate boxes early in the forward pass.'
      }
    ],
    implementation: {
      keyHighlights: [
        'Integrated Darknet weights into OpenCV DNN backend for maximum portability',
        'Optimized bounding box suppression for high-density pedestrian scenes',
        'Formed core foundation for subsequent WBL vision systems at Asrix BHD'
      ],
      details: [
        'Benchmarked latency across varied input blob resolutions (320x320, 416x416).',
        'Implemented tracking IDs across consecutive video frames.'
      ]
    },
    results: [
      { metric: 'Real-Time', label: 'Edge Latency', description: 'Smooth multi-object detection on live webcam streams.' },
      { metric: 'WBL Foundational', label: 'Industry Research', description: 'Transferred directly to Asrix BHD production pipelines.' }
    ],
    repoUrl: 'https://github.com/AkaZinhle'
  },
  {
    id: 'mistral-telemetry-extractor',
    number: '06',
    title: 'Mistral-7B News & Telemetry Extractor',
    subtitle: 'Parameter-Efficient Fine-Tuning (PEFT/LoRA) on Local LLMs',
    category: 'Natural Language Processing & LLMs',
    featured: false,
    tagline: 'Fine-tuning open-source Mistral-7B with Unsloth AI and 4-bit QLoRA for structured text compression and telemetry extraction.',
    timeline: '2025',
    heroImage: '/assets/projects/RissesAI 1.jpg',
    screenshots: [
      {
        url: '/assets/projects/RissesAI 1.jpg',
        title: 'Telemetry Extraction Architecture',
        caption: 'Structured key-value extraction from unstructured narrative text feeds.'
      }
    ],
    technologies: [
      'Mistral-7B-v0.1',
      'Unsloth AI',
      'HuggingFace TRL & Transformers',
      'BitsAndBytes 4-bit QLoRA',
      'Google Colab Pro'
    ],
    keyConcepts: [
      'Parameter-Efficient Fine-Tuning (PEFT)',
      '4-bit Quantization (QLoRA)',
      'Structured Telemetry Extraction',
      'HuggingFace Dataset Pipeline'
    ],
    architecture: {
      summary: 'Fine-tuned Mistral-7B on the argilla/news-summary dataset utilizing Unsloth AI and 4-bit QLoRA to compress narrative streams into clean structured telemetry for automated downstream processing.',
      flow: [
        'HuggingFace Dataset Tokenization & Formatting',
        'Unsloth FastLanguageModel 4-bit Quantization',
        'LoRA Adapter Configuration (r=16, lora_alpha=16)',
        'SFTTrainer Optimization & Gradient Checkpointing',
        'GGUF Export for Ollama Local Inference'
      ]
    },
    problemStatement: 'Industrial and news logging systems produce massive streams of unstructured text that overwhelm traditional parsers and incur high cloud API token costs.',
    engineeringChallenges: [
      {
        challenge: 'Training a 7-billion parameter language model under restricted VRAM constraints.',
        solution: 'Utilized Unsloth AI with BitsAndBytes 4-bit QLoRA, reducing memory footprint by over 60% and speeding up training epochs by 3x.'
      }
    ],
    implementation: {
      keyHighlights: [
        'Fine-tuned Mistral 7B on custom HuggingFace datasets',
        'Achieved 2-5x training speedups with Unsloth optimization kernels',
        'Exported quantized GGUF weights for local, private edge inference via Ollama'
      ],
      details: [
        'Applied ChatML instruction formatting for zero-shot structured extraction.',
        'Evaluated semantic consistency and compression ratios against baseline models.'
      ]
    },
    results: [
      { metric: '3x Faster', label: 'Training Epochs', description: 'Unsloth optimized attention kernels.' },
      { metric: '4-bit', label: 'Quantization Footprint', description: 'Enables high-speed private local inference on modest GPUs.' }
    ],
    repoUrl: 'https://github.com/AkaZinhle'
  },
  {
    id: 'salary-prediction-pipeline',
    number: '07',
    title: 'Supervised Salary Prediction Pipeline',
    subtitle: 'End-to-End Regression & Comparative Modeling',
    category: 'Supervised Machine Learning',
    featured: false,
    tagline: 'Comprehensive data engineering and statistical regression pipeline benchmarking OLS, Ridge, and Lasso models.',
    timeline: '2023',
    heroImage: '/assets/projects/Street Sign Detection 1.png',
    screenshots: [
      {
        url: '/assets/projects/Street Sign Detection 1.png',
        title: 'Statistical Regression Analysis',
        caption: 'Comparative residual plots and feature importance rankings.'
      }
    ],
    technologies: [
      'Scikit-learn',
      'Pandas & NumPy',
      'Matplotlib & Seaborn',
      'Statistical Benchmarking'
    ],
    keyConcepts: [
      'Exploratory Data Analysis (EDA)',
      'Outlier Imputation',
      'L1 / L2 Regularization (Lasso / Ridge)',
      'R² / MAE / RMSE Benchmarking'
    ],
    architecture: {
      summary: 'Complete machine learning data pipeline featuring exploratory analysis, outlier handling, categorical encoding, and comparative evaluation of multiple linear and regularized regression algorithms.',
      flow: [
        'Raw Dataset Ingestion & Missing Value Imputation',
        'Outlier Trimming using Interquartile Range (IQR)',
        'One-Hot Encoding & Feature Scaling',
        'Cross-Validated Model Fitting (OLS, Ridge, Lasso)',
        'Residual & Variance Metric Benchmarking'
      ]
    },
    problemStatement: 'Accurately predicting compensation tiers requires isolating predictive variables from collinear demographic and regional attributes without overfitting.',
    engineeringChallenges: [
      {
        challenge: 'Multi-collinearity among experience and education metrics.',
        solution: 'Benchmarked L1 (Lasso) and L2 (Ridge) regularized estimators to penalize redundant coefficient weights.'
      }
    ],
    implementation: {
      keyHighlights: [
        'Rigorous EDA and distribution analysis across categorical features',
        'Comparative evaluation using R², MAE, and RMSE metrics',
        'Residual diagnostic plots verifying homoscedasticity assumptions'
      ],
      details: [
        'Built full scikit-learn Pipeline with custom Transformers.',
        'Documented statistical trade-offs between interpretability and predictive variance.'
      ]
    },
    results: [
      { metric: 'R² / MAE', label: 'Comparative Evaluation', description: 'Rigorous validation comparing OLS, Ridge, and Lasso.' },
      { metric: 'End-to-End', label: 'Pipeline Architecture', description: 'Modular data transformation from ingestion to inference.' }
    ],
    repoUrl: 'https://github.com/AkaZinhle'
  }
];
