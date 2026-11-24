import { EducationItem, CertificationItem } from '../types';

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'taylors-uwe',
    degree: 'Bachelor of Computer Science (Hons) — AI Specialisation',
    institution: "Taylor's University & University of the West of England (Dual Award)",
    location: 'Subang Jaya, Malaysia & Bristol, UK',
    period: 'Sept 2023 – June 2026 (Awaiting Graduation)',
    cgpa: '3.49 / 4.00',
    honors: [
      "Dean's List Award (August 2025) for academic excellence in machine learning and advanced software paradigms."
    ],
    leadership: [
      'Founding Treasurer, African Society (Oct 2024 – Ongoing) — Project budgeting, financial governance, logistics allocation, and university liaison.'
    ],
    coursework: [
      'Artificial Intelligence Concepts',
      'Machine Learning & Neural Networks',
      'Computer Vision & Image Processing',
      'Data Structures & Algorithms',
      'Advanced Database Systems',
      'Object-Oriented Programming & Systems Design'
    ]
  },
  {
    id: 'iiemsa',
    degree: 'Bachelor of Computer and Information Sciences (Coursework)',
    institution: 'IIEMSA',
    location: 'Johannesburg, South Africa',
    period: 'Mar 2022 – Dec 2022',
    cgpa: 'Completed Foundation',
    honors: [],
    leadership: [],
    coursework: ['Fundamentals of Programming', 'Information Systems', 'Quantitative Techniques']
  },
  {
    id: 'kings-school',
    degree: 'National Senior Certificate (Matriculation Exemption)',
    institution: "The King's School Robin Hills",
    location: 'Johannesburg, South Africa',
    period: '2008 – 2021',
    cgpa: "Bachelor's Degree Pass",
    honors: ['Matriculation Bachelor Exemption'],
    leadership: ['Logistics Team Leader', 'SACSSA Athletics & Inter-School Competitor'],
    coursework: ['Mathematics', 'Physical Sciences', 'Information Technology']
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: "CS50's Introduction to Artificial Intelligence with Python",
    issuer: 'Harvard University / edX',
    year: '2024',
    category: 'AI & Machine Learning',
    description: 'Graph search algorithms, minimax, reinforcement learning, Markov models, constraint satisfaction, neural networks, and NLP with PyTorch.'
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    year: '2024',
    category: 'Cloud Infrastructure',
    description: 'Cloud architecture principles, security compliance, AWS core services (EC2, S3, RDS, Lambda), and cost management.'
  },
  {
    name: 'Oracle Java Foundations Certified Junior Associate',
    issuer: 'Oracle',
    year: '2023',
    category: 'Software Engineering',
    description: 'Core Java syntax, object-oriented concepts, polymorphism, memory lifecycle, and algorithmic problem-solving.'
  },
  {
    name: 'Salesforce Certified Trailblazer',
    issuer: 'Salesforce',
    year: '2023',
    category: 'Enterprise Systems',
    description: 'CRM data models, business workflow automation, object relationships, and API integrations.'
  },
  {
    name: 'International Computer Driving License (ICDL)',
    issuer: 'ICDL Foundation',
    year: '2022',
    category: 'Computing Standards',
    description: 'Standardized digital proficiency, database management, and information security.'
  },
  {
    name: 'Leadership Development Course Graduate',
    issuer: 'Leadership Institute',
    year: '2021',
    category: 'Leadership & Governance',
    description: 'Team orchestration, strategic planning, conflict resolution, and communication.'
  },
  {
    name: 'First Aid Level 2 Certified',
    issuer: 'Emergency Care Institute',
    year: '2021',
    category: 'Emergency Response',
    description: 'Emergency response, CPR, crisis management, and workplace safety compliance.'
  }
];

export const INTERESTS_DATA = [
  {
    title: 'Custom PC Hardware Engineering',
    description: 'Designed and assembled 5 high-performance workstation PC builds optimized for local deep learning model training, CUDA compute benchmarks, and thermal dynamics.',
    icon: 'Cpu'
  },
  {
    title: 'Taekwondo',
    description: 'Practicing martial arts discipline, kinetic precision, and athletic endurance (Apr 2025 – Ongoing).',
    icon: 'Activity'
  },
  {
    title: 'Competitive Chess',
    description: 'Strategic opening theory, deep tactical visualization, and clock management in SACSSA Inter-School tournaments.',
    icon: 'Award'
  },
  {
    title: 'Volleyball & Athletics',
    description: 'Competitive team volleyball (Feb 2023 – Dec 2024), track sprints, and inter-school sports leagues.',
    icon: 'Zap'
  }
];
