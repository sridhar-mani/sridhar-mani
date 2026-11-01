import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Layers, Info, X, Lock } from 'lucide-react';
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

const projects: Project[] = projectsData;
const CATEGORIES = ['All', 'AI & Agents', '3D & WebGPU', 'Full-Stack', 'Mobile'];

// Portal component
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

const KNOWN_ICONS = new Set([
  'ai_analyzer',
  'cfd_toolkit',
  'chromadb_ui',
  'feascript_core',
  'influencer_hub',
  'pdf_editor',
  'project_forum',
  'spend_flow'
]);

// Project Icon Component with clean fallback
const ProjectIcon = ({ project, size = 'sm' }: { project: Project; size?: 'sm' | 'lg' }) => {
  const [imageError, setImageError] = useState(false);
  const dimClass = size === 'lg' ? 'w-16 h-16 rounded-2xl' : 'w-11 h-11 rounded-xl';
  const imgDim = size === 'lg' ? 'w-11 h-11' : 'w-7 h-7';
  const hasKnownAsset = KNOWN_ICONS.has(project.iconName);

  return (
    <div className={`shrink-0 ${dimClass} ${project.iconBg} p-1 shadow-sm flex items-center justify-center overflow-hidden border border-black/5`}>
      {hasKnownAsset && !imageError ? (
        <img
          src={`${import.meta.env.BASE_URL}icons/${project.iconName}.png`}
          alt={project.title}
          className={`${imgDim} object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-mono font-bold text-white text-sm tracking-wider">
          {project.title.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
};

// Project Detail Modal
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
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden relative w-full max-w-lg p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors z-10"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4 mb-5">
                <ProjectIcon project={project} size="lg" />
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200/60 mb-1.5">
                    {project.category || 'Engineering'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{project.title}</h2>
                </div>
              </div>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tech.split(',').map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-medium border border-slate-200/80">
                    {t.trim()}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-600 mb-2 font-medium">Architecture & Implementation</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  {project.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    <Github size={16} />
                    <span>View GitHub Repo</span>
                  </a>
                ) : (
                  <div className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium border border-slate-200">
                    <Lock size={15} />
                    <span>Proprietary / Enterprise System</span>
                  </div>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    <ExternalLink size={16} />
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

// Bento Project Card Component
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        viewport={{ once: true }}
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <ProjectIcon project={project} size="sm" />
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                  {project.title}
                </h3>
                <span className="text-xs font-mono text-slate-600 font-medium">
                  {project.category || 'Systems'}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="View project details"
            >
              <Info size={16} />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.split(',').slice(0, 3).map((t, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-mono font-medium border border-slate-200/60">
                {t.trim()}
              </span>
            ))}
            {project.tech.split(',').length > 3 && (
              <span className="px-1.5 py-0.5 text-slate-600 text-[11px] font-mono font-medium">
                +{project.tech.split(',').length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
              >
                <Github size={13} />
                <span>Code</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600">
                <Lock size={12} />
                <span>Proprietary</span>
              </span>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200/60 transition-colors"
              >
                <ExternalLink size={12} />
                <span>Demo</span>
              </a>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Details →
          </button>
        </div>
      </motion.div>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="work" ref={sectionRef} className="py-20 sm:py-28 bg-slate-50/70 border-y border-slate-200/60 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <span className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-widest">// 02 FLAGSHIP WORK</span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Featured Engineering Systems
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Autonomous coding agents, GPU compute shaders, enterprise backends, and geometric modeling engines.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
