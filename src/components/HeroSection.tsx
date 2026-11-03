import { motion } from 'framer-motion';
import { IdentityPanel } from './IdentityPanel';
import { HeroAgentSandbox } from './HeroAgentSandbox';
import { DecryptText } from './DecryptText';
import { ArrowDown, Github, Linkedin, Mail, FileText, Sparkles } from 'lucide-react';

const METRICS = [
  { value: '09', label: 'Flagship Repositories', sub: 'Open-Source & Production Systems' },
  { value: '30%', label: 'Latency Reduction', sub: 'Progressive Binary Streaming' },
  { value: '45%', label: 'Memory Drop', sub: 'Optimized Chunk Ingestion' },
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
          className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 pb-4 mb-8 sm:mb-10 font-mono text-[11px] text-slate-600 uppercase tracking-widest"
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span className="text-slate-800 font-semibold">AI Engineer @ Zenteiq</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">Bengaluru • Available for High-Impact Roles</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-600 font-medium">
            <span>INDEX 2026</span>
            <span>•</span>
            <span>IIT MADRAS ALUMNI</span>
            <span>•</span>
            <span>12.9716° N, 77.5946° E</span>
          </div>
        </motion.div>

        {/* Hero Interactive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          {/* Left Column: Author Identity & Display Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Monogram & Name Decrypt Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800 font-mono text-xs font-semibold w-fit mb-4 sm:mb-6 shadow-sm"
            >
              <Sparkles size={13} className="text-blue-600" />
              <DecryptText text="SRIDHAR MANI" delay={200} duration={900} />
              <span className="text-slate-400">/</span>
              <span className="text-slate-600 font-sans font-medium text-[11px]">AI & Systems Engineer</span>
            </motion.div>

            {/* Master Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold tracking-[-0.04em] text-slate-900 leading-[1.08] mb-5 sm:mb-6"
            >
              Engineering Autonomous Agents. <br className="hidden sm:inline" />
              <span className="text-slate-400 font-normal">Architecting Resilient</span> Systems.
            </motion.h1>

            {/* Narrative Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal mb-8"
            >
              I architect stateful multi-agent workflows, autonomous coding runtimes with AST blast-radius qualification, and scalable full-stack applications bridging complex numerical pipelines with production environments.
            </motion.p>

            {/* Minimalist Action Controls */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
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

              {/* Micro Social icons & Holographic Identity Card */}
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

          {/* Right Column: Out-of-the-Box Interactive Autonomous Agent & Systems Sandbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <HeroAgentSandbox />
          </motion.div>
        </div>

        {/* Minimalist Architectural KPI Metric Grid (Signature Awwwards Element) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36 }}
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
