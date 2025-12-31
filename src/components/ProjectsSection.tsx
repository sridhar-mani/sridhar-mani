import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, Star, X, ExternalLink, Github, Code2, Sparkles } from 'lucide-react';
import projectsData from '@/data/projects.json';

interface Project {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconBg: string;
  tech: string;
  stars: number;
  verified: boolean;
  repoUrl: string;
  liveUrl?: string;
}

const projects: Project[] = projectsData;

// Portal component
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
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
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9990] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden relative w-full max-w-[420px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 flex flex-col items-center text-center">
                {/* Project Icon */}
                <div className={`w-20 h-20 rounded-2xl ${project.iconBg} p-1 mb-5 shadow-lg flex items-center justify-center overflow-hidden`}>
                  <img 
                    src={`/icons/${project.iconName}.png`} 
                    alt={project.title}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                
                {/* Title & Verified Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                  {project.verified && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-syntax-green text-white">
                      <Check size={12} />
                    </span>
                  )}
                </div>

                {/* Tech & Stars */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-mono text-gray-600">
                    {project.tech}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} className="text-yellow-500" />
                    {project.stars}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-[90%]">
                  {project.description}
                </p>

                {/* Features/Highlights */}
                <div className="w-full grid grid-cols-1 gap-2 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-md">
                      <Code2 size={14} />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tech Stack</div>
                      <div className="text-xs font-semibold text-gray-900">{project.tech}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                      <Sparkles size={14} />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</div>
                      <div className="text-xs font-semibold text-gray-900">{project.verified ? 'Verified & Active' : 'In Development'}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full gap-3">
                  {project.repoUrl && (
                    <a 
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Github size={16} />
                      View Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {!project.repoUrl && !project.liveUrl && (
                    <button 
                      onClick={onClose}
                      className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInstall = () => {
    if (isInstalled || isInstalling) return;
    
    setIsInstalling(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          setIsInstalled(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDoubleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group relative p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        whileHover={{ y: -4 }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Double-click hint */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">double-click</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className={`project-icon shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center overflow-hidden shadow-sm ${project.iconBg}`}>
            <img 
              src={`/icons/${project.iconName}.png`} 
              alt={project.title}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-mono font-semibold text-base sm:text-lg text-gray-900">{project.title}</h3>
              {project.verified && (
                <span className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-syntax-green text-white">
                  <Check size={10} />
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500 font-mono">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
                {project.tech}
              </span>
              <span className="flex items-center gap-1">
                <Star size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-500" />
                {project.stars}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="font-mono text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={handleInstall}
            disabled={isInstalled}
            className={`flex-1 text-xs sm:text-sm py-2 sm:py-2.5 relative rounded-lg font-mono font-medium transition-colors ${
              isInstalled 
                ? 'bg-gray-100 text-syntax-green' 
                : 'bg-syntax-cyan text-white hover:bg-cyan-500 shadow-sm hover:shadow'
            }`}
            whileHover={{ scale: isInstalled ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isInstalling ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 bg-white/20 rounded-lg"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                />
                <span className="relative z-10">{progress}%</span>
              </div>
            ) : isInstalled ? (
              <span className="flex items-center justify-center gap-2">
                <Check size={14} />
                Installed
              </span>
            ) : (
              'Install'
            )}
          </motion.button>
          {project.repoUrl && (
            <motion.a 
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5 flex items-center justify-center text-center cursor-pointer rounded-lg border border-gray-200 text-gray-600 hover:border-syntax-cyan hover:text-syntax-cyan transition-colors bg-white font-mono font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              Code
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5 flex items-center justify-center text-center cursor-pointer rounded-lg border border-syntax-green text-syntax-green hover:bg-syntax-green hover:text-white transition-colors bg-white font-mono font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              Live
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Project Modal */}
      <ProjectModal project={project} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="work" ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <span className="section-label text-xs sm:text-sm text-gray-500 font-mono tracking-widest">// 03 WORK</span>
          <h2 className="section-title mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-gray-900">extensions.json</h2>
        </motion.div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
