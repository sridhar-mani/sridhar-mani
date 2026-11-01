import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Award, GraduationCap, CheckCircle2 } from 'lucide-react';

interface Experience {
  id: string;
  category: 'work' | 'cert' | 'education';
  title: string;
  organization: string;
  period: string;
  current: boolean;
  highlights: string[];
}

const experiences: Experience[] = [
  {
    id: 'zenteiq-current',
    category: 'work',
    title: 'AI Engineer',
    organization: 'Zenteiq Aitech Innovations',
    period: 'Mar 2026 - Present',
    current: true,
    highlights: [
      'Architecting stateful workflow orchestration and autonomous coding-agent runtime systems.',
      'Building high-performance FastAPI microservices and numerical pipelines for automation workloads.',
      'Integrating agentic systems with domain simulation data and open-weight model pipelines.'
    ],
  },
  {
    id: 'novacast-prev',
    category: 'work',
    title: 'Associate Software Engineer',
    organization: 'NovaCast India',
    period: 'Jun 2024 - Feb 2026',
    current: false,
    highlights: [
      'Architected browser CFD visualization product with FastAPI + React achieving 30% latency cut.',
      'Reduced peak ingestion memory by 40-50% through optimized chunked binary streaming.',
      'Built interactive 3D rendering pipeline using VTK.js, Three.js, and WebAssembly geometry kernels.'
    ],
  },
  {
    id: 'nvidia-cert',
    category: 'cert',
    title: 'Certified: Building RAG Agents with LLMs',
    organization: 'NVIDIA Deep Learning Institute',
    period: '2025',
    current: false,
    highlights: [
      'Architected production-grade RAG systems with LangChain, vector databases & LLMs.',
      'Implemented advanced evaluation, guardrails, and agentic tool invocation.'
    ],
  },
  {
    id: 'iit-madras',
    category: 'education',
    title: 'Diploma in Programming & Data Science',
    organization: 'IIT Madras',
    period: '2022 - 2025',
    current: false,
    highlights: [
      'Completed dual diplomas in Programming (Oct 2024) and Data Science (Sep 2025).',
      'Advanced coursework in Machine Learning, Statistical Analysis, Algorithms & Deep Learning.'
    ],
  },
  {
    id: 'btech',
    category: 'education',
    title: 'Bachelor of Technology',
    organization: 'Anna University',
    period: '2019 - 2023',
    current: false,
    highlights: [
      'Graduated with 7.78 CGPA.',
      'Strong foundations in computational physics, engineering mathematics, and numerical algorithms.'
    ],
  },
];

const TimelineCard = ({ exp, index }: { exp: Experience; index: number }) => {
  const Icon = exp.category === 'work' ? Briefcase : exp.category === 'cert' ? Award : GraduationCap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="relative pl-8 sm:pl-10 pb-10 last:pb-2 group"
    >
      {/* Vertical line connecting cards */}
      <div className="absolute left-[11px] sm:left-[15px] top-4 bottom-0 w-0.5 bg-slate-200 group-last:hidden" />

      {/* Node Dot */}
      <div className={`absolute left-0 sm:left-1 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
        exp.current 
          ? 'bg-blue-600 border-white shadow-md ring-4 ring-blue-100 text-white' 
          : 'bg-white border-slate-300 text-slate-500 group-hover:border-blue-500 group-hover:text-blue-600'
      }`}>
        <Icon size={12} />
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              {exp.title}
            </h3>
            {exp.current && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Current Role
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-600 font-medium">
            {exp.period}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-blue-600 mb-4">
          {exp.organization}
        </p>

        <ul className="space-y-2">
          {exp.highlights.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <CheckCircle2 size={15} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="experience" ref={sectionRef} className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/60 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <span className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-widest">// 04 CAREER & CREDENTIALS</span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Professional Experience & Milestones
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Proven track record across autonomous agent infrastructure, real-time CFD visualization, and accredited deep learning systems.
          </p>
        </motion.div>

        <div className="max-w-3xl">
          {experiences.map((exp, index) => (
            <TimelineCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
