import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Experience {
  id: string;
  hash: string;
  type: 'feat' | 'fix' | 'refactor';
  title: string;
  company: string;
  period: string;
  current: boolean;
  changes: Array<{
    type: 'add' | 'remove';
    text: string;
  }>;
}

const experiences: Experience[] = [
  {
    id: 'zenteiq-current',
    hash: '#9a4c1f',
    type: 'feat',
    title: 'AI Engineer',
    company: 'Zenteiq Aitech Innovations',
    period: 'Mar 2026 - Present',
    current: true,
    changes: [
      { type: 'add', text: 'Architecting stateful workflow orchestration and autonomous coding-agent systems' },
      { type: 'add', text: 'Building high-performance FastAPI microservices and numerical pipelines for automation workloads' },
      { type: 'add', text: 'Integrating agentic systems with domain simulation data and open-weight model pipelines' },
    ],
  },
  {
    id: 'novacast-prev',
    hash: '#24a1b0',
    type: 'feat',
    title: 'Associate Software Engineer',
    company: 'NovaCast India',
    period: 'Jun 2024 - Feb 2026',
    current: false,
    changes: [
      { type: 'add', text: 'Architected browser CFD visualization product with FastAPI + React achieving 30% latency cut' },
      { type: 'add', text: 'Reduced peak ingestion memory by 40-50% through optimized chunked binary streaming' },
      { type: 'add', text: 'Built interactive 3D rendering pipeline using VTK.js, Three.js, and WebAssembly' },
      { type: 'remove', text: 'Eliminated legacy batch processing latency and high server memory bottlenecks' },
    ],
  },
  {
    id: 'iit-madras',
    hash: '#8f3c21',
    type: 'feat',
    title: 'Diploma in Data Science',
    company: 'IIT Madras Online',
    period: '2023 - 2025',
    current: false,
    changes: [
      { type: 'add', text: 'Completed coursework in Machine Learning, Statistical Analysis & Deep Learning' },
      { type: 'add', text: 'Statistical Methods and Data Analysis certification' },
    ],
  },
  {
    id: 'btech',
    hash: '#5e2d8a',
    type: 'feat',
    title: 'B.Tech Graduate',
    company: 'Anna University',
    period: '2019 - 2023',
    current: false,
    changes: [
      { type: 'add', text: 'Bachelor of Technology with 7.78 CGPA' },
      { type: 'add', text: 'Completed IIT Madras Programming Diploma coursework (7.3 CGPA)' },
    ],
  },
];

const CommitCard = ({ experience, index }: { experience: Experience; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      className="git-commit group"
    >
      {/* Commit dot with pulse animation on hover */}
      <motion.div 
        className="git-dot transition-all duration-300 group-hover:scale-125"
        style={{ 
          backgroundColor: experience.current ? 'hsl(var(--syntax-cyan))' : 'hsl(var(--syntax-purple))',
          boxShadow: experience.current 
            ? '0 0 15px hsl(var(--syntax-cyan) / 0.5)' 
            : '0 0 10px hsl(var(--syntax-purple) / 0.3)'
        }}
        whileHover={{ 
          scale: 1.3,
          boxShadow: '0 0 25px hsl(var(--syntax-cyan) / 0.8)'
        }}
      />

      {/* Commit card with glassmorphism */}
      <motion.div 
        className="relative bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-5 sm:p-6 ml-4 overflow-hidden group-hover:border-syntax-cyan/30 transition-all duration-300"
        whileHover={{ 
          y: -4,
          boxShadow: '0 20px 40px -15px hsl(var(--syntax-cyan) / 0.15)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-syntax-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`font-mono text-xs px-2 py-0.5 rounded font-medium ${
                experience.type === 'feat' ? 'bg-syntax-green/10 text-syntax-green' :
                experience.type === 'fix' ? 'bg-syntax-orange/10 text-syntax-orange' :
                'bg-syntax-purple/10 text-syntax-purple'
              }`}>
                {experience.type}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{experience.period}</span>
              {experience.current && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-syntax-cyan/10 text-syntax-cyan font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-syntax-cyan animate-pulse" />
                  HEAD
                </span>
              )}
            </div>
            <h3 className="font-mono font-semibold text-base sm:text-lg text-foreground">{experience.title}</h3>
            <p className="font-mono text-xs sm:text-sm text-syntax-cyan font-medium">{experience.company}</p>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded">{experience.hash}</span>
        </div>

        {/* Changes (diff style) */}
        <div className="relative z-10 space-y-2 font-mono text-xs sm:text-sm border-l-2 border-border/50 pl-4 ml-1">
          {experience.changes.map((change, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + i * 0.08 + 0.3, duration: 0.4 }}
              viewport={{ once: true }}
              className={`flex items-start gap-2 py-1 ${
                change.type === 'add' 
                  ? 'text-syntax-green' 
                  : 'text-syntax-orange'
              }`}
            >
              <span className={`font-bold shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                change.type === 'add' 
                  ? 'bg-syntax-green/10' 
                  : 'bg-syntax-orange/10'
              }`}>
                {change.type === 'add' ? '+' : '−'}
              </span>
              <span className="break-words leading-relaxed">{change.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="experience" ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <span className="section-label text-xs sm:text-sm text-muted-foreground font-mono tracking-widest">// 04 HISTORY</span>
          <h2 className="section-title mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground">git log</h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl ml-2 sm:ml-4">
          {experiences.map((experience, index) => (
            <CommitCard key={experience.id} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
