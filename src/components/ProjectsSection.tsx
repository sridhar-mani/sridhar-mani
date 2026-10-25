import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Check, Star, X, ExternalLink, Github, Code2, Sparkles, Layers, Info } from 'lucide-react';
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

// Project Icon Component with clean fallback
const ProjectIcon = ({ project, size = 'sm' }: { project: Project; size?: 'sm' | 'lg' }) => {
  const [imageError, setImageError] = useState(false);
  const dimClass = size === 'lg' ? 'w-20 h-20 rounded-2xl' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-lg';
  const imgDim = size === 'lg' ? 'w-14 h-14' : 'w-9 h-9 sm:w-10 sm:h-10';

  return (
    <div className={`project-icon shrink-0 ${dimClass} ${project.iconBg} p-1 shadow-sm flex items-center justify-center overflow-hidden`}>
      {!imageError ? (
        <img
          src={`${import.meta.env.BASE_URL}icons/${project.iconName}.png`}
          alt={project.title}
          className={`${imgDim} object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-mono font-bold text-white text-base sm:text-lg tracking-wider">
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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9990] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl overflow-hidden relative w-full max-w-[440px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors z-10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="p-8 flex flex-col items-center text-center">
                <div className="mb-4">
                  <ProjectIcon project={project} size="lg" />
                </div>

                {/* Title & Verified Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 font-mono">{project.title}</h2>
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
                <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-[95%]">
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-mono text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      <Github size={16} />
                      Source Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-syntax-cyan text-white rounded-xl font-mono text-sm font-medium hover:bg-cyan-500 transition-colors shadow-sm"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
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

// Project Card Component
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / heightOr1(rect.height) - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const heightOr1 = (h: number) => (h > 0 ? h : 1);

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleInstall = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    }, 120);
  };

  return (
    <>
      <div style={{ perspective: 1000 }}>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          viewport={{ once: true }}
          onClick={() => setIsModalOpen(true)}
          className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.02 }}
        >
          {/* Holographic sheen effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-xl"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.8) 45%, rgba(255, 255, 255, 0.5) 50%, transparent 54%)',
            }}
          />

          {/* Details hint badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-gray-500 font-mono bg-gray-100/90 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
              <Info size={10} /> details
            </span>
          </div>

          {/* Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4" style={{ transform: 'translateZ(20px)' }}>
            <ProjectIcon project={project} size="sm" />
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
          <p className="font-mono text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3" style={{ transform: 'translateZ(10px)' }}>
            {project.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3" style={{ transform: 'translateZ(15px)' }}>
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
                <span className="flex items-center justify-center gap-1">
                  <Check size={14} /> Installed
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
                onClick={(e) => e.stopPropagation()}
                className="p-2 sm:p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors bg-white shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View ${project.title} on GitHub`}
              >
                <Code2 size={16} />
              </motion.a>
            )}

            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 sm:p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors bg-white shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View live demo of ${project.title}`}
              >
                <ExternalLink size={16} />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>

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
    <section id="work" ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12"
        >
          <div>
            <span className="section-label text-xs sm:text-sm text-gray-500 font-mono tracking-widest">// 03 SELECTED WORK</span>
            <h2 className="section-title mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-gray-900">
              projects.marketplace
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                  selectedCategory === cat
                    ? 'bg-syntax-cyan text-white shadow-sm font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
