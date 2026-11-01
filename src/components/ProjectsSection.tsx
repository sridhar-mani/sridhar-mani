import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Terminal, Layers, Lock, X, Cpu, Box, Sparkles } from 'lucide-react';
import projectsData from '@/data/projects.json';

interface Project {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconBg: string;
  tech: string;
  category?: string;
  stars: number;
  verified: boolean;
  repoUrl?: string;
  liveUrl?: string;
}

const allProjects: Project[] = projectsData;

// Top 3 Flagship Projects for the Asymmetric Bento Showcase
const FLAGSHIP_IDS = ['npc-code', 'cadfusion', 'three-webgpu'];
const flagshipProjects = allProjects.filter((p) => FLAGSHIP_IDS.includes(p.id));
const directoryProjects = allProjects.filter((p) => !FLAGSHIP_IDS.includes(p.id));

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

// Detail Modal
const ProjectModal = ({ project, isOpen, onClose }: { project: Project; isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9990] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden relative w-full max-w-xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 font-mono text-[11px] text-blue-600 uppercase tracking-widest font-semibold mb-2">
                <span>{project.category || 'Architecture'}</span>
                <span>•</span>
                <span>Production Spec</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                {project.title}
              </h2>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tech.split(',').map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-xs font-medium border border-slate-200/80"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>

              {/* Engineering Summary */}
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-600 mb-2 font-semibold">
                  System Architecture & Impact
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70 font-normal">
                  {project.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm"
                  >
                    <Github size={15} />
                    <span>View GitHub Repository</span>
                    <ArrowUpRight size={14} className="text-slate-400" />
                  </a>
                ) : (
                  <div className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs sm:text-sm font-medium border border-slate-200">
                    <Lock size={14} />
                    <span>Proprietary / In Production</span>
                  </div>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm"
                  >
                    <ExternalLink size={15} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);

  // Find specific flagship objects
  const npcCode = flagshipProjects.find((p) => p.id === 'npc-code') || allProjects[0];
  const cadFusion = flagshipProjects.find((p) => p.id === 'cadfusion') || allProjects[1];
  const threeWebGPU = flagshipProjects.find((p) => p.id === 'three-webgpu') || allProjects[4];

  return (
    <section id="works" ref={sectionRef} className="py-24 sm:py-36 bg-slate-50/60 border-y border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-slate-200 pb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 uppercase tracking-widest mb-3">
              <span>// 01 SELECTED WORKS</span>
              <span>•</span>
              <span className="text-slate-400">ENGINEERING INDEX</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Flagship Systems.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-md font-normal">
            Autonomous agent frameworks, offscreen compute shaders, and geometric kernels built for scale and low-latency execution.
          </p>
        </motion.div>

        {/* 1. Asymmetric Flagship Showcase Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          {/* Card 1: NPC Code (Hero Double-Width Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onClick={() => setSelectedModalProject(npcCode)}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-sm font-bold shadow-sm">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-blue-600 font-semibold block">
                      Autonomous Agent Monorepo
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {npcCode.title}
                    </h3>
                  </div>
                </div>

                <span className="font-mono text-xs text-slate-600 font-semibold px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                  v0.4.2 CLI
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                {npcCode.description}
              </p>

              {/* Terminal Code Mockup for NPC Code */}
              <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 sm:p-5 font-mono text-xs leading-relaxed mb-6 border border-slate-800 shadow-inner">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2.5 mb-3 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-slate-400">npc-code-agent ~ runtime</span>
                </div>
                <div className="text-emerald-400 font-semibold">$ npc run --task="refactor AST symbol table"</div>
                <div className="text-slate-400 mt-1">▸ Ingesting workspace: 142 files indexed (AST-grep parser)</div>
                <div className="text-blue-400 mt-0.5">▸ [LangGraph] Synthesizing patch with zero regressions...</div>
                <div className="text-slate-300 mt-0.5">✓ 14 unit tests passed • Applied patch cleanly in 0.42s</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-wrap gap-1.5">
                {npcCode.tech.split(',').slice(0, 4).map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-[11px] font-medium border border-slate-200/70">
                    {t.trim()}
                  </span>
                ))}
              </div>

              {npcCode.repoUrl && (
                <a
                  href={npcCode.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>Repository</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column Stack: CADFusion + Three WebGPU */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Card 2: CADFusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedModalProject(cadFusion)}
              className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                      <Box size={18} />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-amber-700 font-semibold block">
                        CAD & Computational Geometry
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {cadFusion.title}
                      </h3>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-600 font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    WASM Kernel
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3 font-normal">
                  {cadFusion.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <span className="font-mono text-xs text-slate-600 font-medium">OpenCascade • Three.js</span>
                {cadFusion.repoUrl && (
                  <a
                    href={cadFusion.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600"
                  >
                    <span>Code</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Card 3: Three WebGPU Worker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={() => setSelectedModalProject(threeWebGPU)}
              className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-blue-700 font-semibold block">
                        GPU Shaders & Web Workers
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {threeWebGPU.title}
                      </h3>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-600 font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    60 FPS
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3 font-normal">
                  {threeWebGPU.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <span className="font-mono text-xs text-slate-600 font-medium">OffscreenCanvas • Comlink</span>
                {threeWebGPU.repoUrl && (
                  <a
                    href={threeWebGPU.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600"
                  >
                    <span>Code</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* 2. Editorial Architecture Directory (Interactive Project Table) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-slate-600 font-semibold">
              // COMPLETE ENGINEERING DIRECTORY
            </h3>
            <span className="text-xs font-mono text-slate-600 font-medium">
              {directoryProjects.length + flagshipProjects.length} Verified Architectures
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {directoryProjects.map((project, idx) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedModalProject(project)}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <span className="font-mono text-xs text-slate-600 font-semibold w-6 pt-0.5 md:pt-0">
                      0{idx + 4}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                          {project.title}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-medium border border-slate-200">
                          {project.category || 'Systems'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 line-clamp-1 max-w-xl">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 pl-10 md:pl-0" onClick={(e) => e.stopPropagation()}>
                    <span className="hidden lg:inline-block font-mono text-xs text-slate-600 truncate max-w-[200px] font-medium">
                      {project.tech}
                    </span>

                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-mono font-medium transition-colors"
                      >
                        <Github size={13} />
                        <span>Code</span>
                        <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-mono font-medium border border-slate-200">
                        <Lock size={12} />
                        <span>Proprietary</span>
                      </span>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-mono font-medium transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedModalProject && (
        <ProjectModal
          project={selectedModalProject}
          isOpen={!!selectedModalProject}
          onClose={() => setSelectedModalProject(null)}
        />
      )}
    </section>
  );
};
