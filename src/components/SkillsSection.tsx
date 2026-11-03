import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Cpu, Box, Server, Compass, CheckCircle2, FileCode, Check } from 'lucide-react';
import skillsData from '@/data/skills.json';
import projectsData from '@/data/projects.json';

interface Skill {
  name: string;
  version: string;
  years: number;
  projects: number;
}

const skills: Skill[] = skillsData;

const DOMAINS = [
  {
    icon: Cpu,
    title: 'AI & Autonomous Systems',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    description: 'Autonomous coding agents, LangGraph state machines, production RAG pipelines, and local inference.',
    skills: ['Python', 'FastAPI', 'LangGraph', 'PyTorch', 'Vector Search', 'WebLLM']
  },
  {
    icon: Box,
    title: 'Graphics & Scientific Visualization',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    description: 'Hardware-accelerated scientific visualization, binary dataset streaming, and interactive 3D simulations.',
    skills: ['Three.js', 'VTK.js', 'GLSL Shaders', 'Web Workers', 'Taichi.js', 'WASM']
  },
  {
    icon: Server,
    title: 'Full-Stack & Systems Architecture',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    description: 'Event-driven real-time architectures, low-latency WebSockets, Redis caching, and robust type safety.',
    skills: ['TypeScript', 'React', 'Node.js', 'Redis', 'PostgreSQL', 'TailwindCSS']
  },
  {
    icon: Compass,
    title: 'Geometry & Numerical Simulation',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    description: 'CAD boundary representations, WebAssembly C++ geometry kernels, and CFD binary post-processing.',
    skills: ['OpenCascade', 'WebAssembly', 'CFD Analytics', 'FEAScript', 'Mesh Processing']
  }
];

const CodeLine = ({ lineNumber, children }: { lineNumber: number; children: React.ReactNode }) => (
  <div className="flex items-start py-0.5 px-4 sm:px-6 hover:bg-slate-50 transition-colors font-mono text-xs sm:text-sm">
    <span className="w-8 text-right mr-4 select-none text-slate-600 font-mono text-xs">{lineNumber}</span>
    <div className="flex-1 text-slate-800">{children}</div>
  </div>
);

const SkillLine = ({ skill, index }: { skill: Skill; index: number }) => {
  const isLast = index === skills.length - 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <CodeLine lineNumber={index + 5}>
              <span>
                {'    '}
                <span className="text-blue-600 font-medium">"{skill.name}"</span>
                <span className="text-slate-600">:</span>
                {' '}
                <span className="text-emerald-600">"{skill.version}"</span>
                {!isLast && <span className="text-slate-600">,</span>}
              </span>
            </CodeLine>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-white border-slate-200 text-slate-800 font-mono text-xs p-3 shadow-lg rounded-xl max-w-xs z-50"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Verified Proficiency</span>
            </div>
            <div className="text-slate-500 text-xs">
              <div>Experience: <span className="text-blue-600 font-medium">{skill.years} Years</span></div>
              <div>Projects: <span className="text-amber-600 font-medium">{skill.projects}</span></div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<'package.json' | 'projects.json'>('package.json');

  return (
    <section id="architecture" ref={sectionRef} className="py-20 sm:py-28 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <span className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-widest">// 03 TECHNICAL EXPERTISE</span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Core Architecture & Capabilities
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Specialized in low-overhead execution, mathematical geometry, and stateful agentic workflows.
          </p>
        </motion.div>

        {/* 4 Architectural Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {DOMAINS.map((domain, i) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${domain.color}`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">{domain.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {domain.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/60">
                  {domain.skills.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mac-style Code Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-w-4xl mx-auto"
        >
          {/* Mac Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30 inline-block" />
              <span className="ml-3 font-mono text-xs text-slate-600 font-medium">stack.manifest</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg">
              <button
                onClick={() => setActiveTab('package.json')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  activeTab === 'package.json'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                package.json
              </button>
              <button
                onClick={() => setActiveTab('projects.json')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  activeTab === 'projects.json'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                manifest.json
              </button>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="py-4 overflow-x-auto bg-white max-h-[380px] overflow-y-auto">
            {activeTab === 'package.json' ? (
              <>
                <CodeLine lineNumber={1}>
                  <span className="text-slate-400">{'{'}</span>
                </CodeLine>
                <CodeLine lineNumber={2}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"author"</span>
                    <span className="text-slate-400">:</span>
                    {' '}<span className="text-emerald-600">"Sridhar Mani"</span>
                    <span className="text-slate-400">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={3}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"role"</span>
                    <span className="text-slate-400">:</span>
                    {' '}<span className="text-emerald-600">"AI & Systems Engineer"</span>
                    <span className="text-slate-400">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={4}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"dependencies"</span>
                    <span className="text-slate-400">:</span>
                    {' '}<span className="text-slate-400">{'{'}</span>
                  </span>
                </CodeLine>

                {skills.map((skill, index) => (
                  <SkillLine key={skill.name} skill={skill} index={index} />
                ))}

                <CodeLine lineNumber={skills.length + 5}>
                  <span>
                    {'  '}<span className="text-slate-400">{'}'}</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={skills.length + 6}>
                  <span className="text-slate-400">{'}'}</span>
                </CodeLine>
              </>
            ) : (
              <>
                <CodeLine lineNumber={1}>
                  <span className="text-slate-400">{'{'}</span>
                </CodeLine>
                <CodeLine lineNumber={2}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"author"</span>
                    <span className="text-slate-400">:</span>
                    {' '}<span className="text-emerald-600">"Sridhar Mani"</span>
                    <span className="text-slate-400">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={3}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"github"</span>
                    <span className="text-slate-400">:</span>
                    {' '}
                    <a 
                      href="https://github.com/sridhar-mani" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                    >
                      "github.com/sridhar-mani"
                    </a>
                    <span className="text-slate-400">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={4}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"flagshipProjects"</span>
                    <span className="text-slate-400">:</span>
                    {' '}<span className="text-slate-400">{'['}</span>
                  </span>
                </CodeLine>
                {projectsData.slice(0, 6).map((proj, idx) => {
                  const isLast = idx === 5;
                  const lineBase = 5 + idx * 5;
                  return (
                    <div key={proj.id}>
                      <CodeLine lineNumber={lineBase}>
                        <span>{'    '}<span className="text-slate-400">{'{'}</span></span>
                      </CodeLine>
                      <CodeLine lineNumber={lineBase + 1}>
                        <span>
                          {'      '}<span className="text-blue-600 font-medium">"title"</span>
                          <span className="text-slate-400">:</span>
                          {' '}<span className="text-emerald-600">"{proj.title}"</span>
                          <span className="text-slate-400">,</span>
                        </span>
                      </CodeLine>
                      <CodeLine lineNumber={lineBase + 2}>
                        <span>
                          {'      '}<span className="text-blue-600 font-medium">"tech"</span>
                          <span className="text-slate-400">:</span>
                          {' '}<span className="text-amber-600">"{proj.tech}"</span>
                          <span className="text-slate-400">,</span>
                        </span>
                      </CodeLine>
                      <CodeLine lineNumber={lineBase + 3}>
                        <span>
                          {'      '}<span className="text-blue-600 font-medium">"repo"</span>
                          <span className="text-slate-400">:</span>
                          {' '}
                          {proj.repoUrl ? (
                            <a
                              href={proj.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                            >
                              "→ View on GitHub"
                            </a>
                          ) : (
                            <span className="text-slate-400 font-italic">"Proprietary"</span>
                          )}
                        </span>
                      </CodeLine>
                      <CodeLine lineNumber={lineBase + 4}>
                        <span>
                          {'    '}<span className="text-slate-400">{'}'}</span>
                          {!isLast && <span className="text-slate-400">,</span>}
                        </span>
                      </CodeLine>
                    </div>
                  );
                })}
                <CodeLine lineNumber={35}>
                  <span>
                    {'  '}<span className="text-slate-400">{']'}</span>
                    <span className="text-slate-400">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={36}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"openSource"</span>
                    <span className="text-slate-400">:</span>
                    {' '}<span className="text-purple-600 font-medium">true</span>
                    <span className="text-slate-400">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={37}>
                  <span>
                    {'  '}<span className="text-blue-600 font-medium">"hireable"</span>
                    <span className="text-slate-400">:</span>
                    {' '}<span className="text-purple-600 font-medium">true</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={38}>
                  <span className="text-slate-400">{'}'}</span>
                </CodeLine>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
