import { motion } from 'framer-motion';
import { IdentityPanel } from './IdentityPanel';
import { ArrowDown, Github, Linkedin, Mail, FileText, ArrowUpRight } from 'lucide-react';

const METRICS = [
  { value: '09', label: 'Flagship Repositories', sub: 'Open-Source & Enterprise' },
  { value: '30%', label: 'Latency Cut', sub: 'CFD Stream Rendering' },
  { value: '45%', label: 'Memory Ingestion Drop', sub: 'Chunked Binary Shaders' },
  { value: 'NVIDIA', label: 'Deep Learning Certified', sub: 'Production RAG Architect' },
];

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[96vh] flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 bg-white overflow-hidden">
      {/* Precision architectural grid lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E2E8F0 1px, transparent 1px),
            linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Subtle organic light gradient wash */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 600px at 50% 0%, rgba(241, 245, 249, 0.9), transparent 80%)'
        }}
      />

      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10 flex-1 flex flex-col justify-center">
        {/* Top Header Editorial Coordinate Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 pb-4 mb-8 sm:mb-12 font-mono text-[11px] text-slate-600 uppercase tracking-widest"
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span className="text-slate-800 font-semibold">AI Engineer @ Zenteiq</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">Available Q4–Q1</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-600 font-medium">
            <span>INDEX 2026</span>
            <span>•</span>
            <span>12.9716° N, 77.5946° E</span>
          </div>
        </motion.div>

        {/* Master Display Typography (Awwwards Style) */}
        <div className="max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-slate-900 leading-[1.02] mb-6 sm:mb-8"
          >
            Autonomous coding agents. <br className="hidden sm:inline" />
            <span className="text-slate-400 font-normal">Off-thread</span> WebGPU systems.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal mb-8 sm:mb-10"
          >
            I architect stateful multi-agent orchestrations, compute shaders in offscreen workers, and distributed full-stack systems bridging low-level geometry kernels with modern web runtimes.
          </motion.p>

          {/* Minimalist Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-14"
          >
            <a
              href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download="Sridhar_M_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <FileText size={15} />
              <span>Download Master Resume (PDF)</span>
            </a>

            <a
              href="#works"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-medium text-xs sm:text-sm shadow-sm transition-all hover:border-slate-300"
            >
              <span>Explore Selected Works</span>
              <ArrowDown size={14} className="text-slate-400" />
            </a>

            {/* Micro Social icons */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-slate-200">
              <a
                href="https://github.com/sridhar-mani"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Github size={17} />
              </a>
              <a
                href="https://www.linkedin.com/in/sridharmanimuthusamy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                <Linkedin size={17} />
              </a>
              <a
                href="mailto:sridharmani510@gmail.com"
                aria-label="Email"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
              >
                <Mail size={17} />
              </a>

              <div className="ml-1">
                <IdentityPanel />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Minimalist Architectural KPI Metric Grid (Signature Awwwards Element) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-200/90 pt-8"
        >
          {METRICS.map((metric, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {metric.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                {metric.label}
              </span>
              <span className="text-[11px] font-mono text-slate-600 mt-0.5">
                {metric.sub}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
