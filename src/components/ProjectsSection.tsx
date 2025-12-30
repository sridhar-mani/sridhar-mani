import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Eye, MessageSquare, Activity, Check, Users, Star, FileText, Database, Code, Wrench, Smartphone, BookOpen } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  tech: string;
  stars: number;
  verified: boolean;
  repoUrl: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 'influencer-hub',
    title: 'InfluencerHub',
    description: 'Full-stack application built with Vue3 and Flask, featuring user authentication and CRUD operations.',
    icon: Eye,
    iconBg: 'bg-gradient-to-br from-syntax-purple to-syntax-pink',
    tech: 'Vue3 + Flask',
    stars: 4,
    verified: true,
    repoUrl: 'https://github.com/sridhar-mani/InfluencerHub',
  },
  {
    id: 'pdf-editor',
    title: 'PDF Editor',
    description: 'Modern and responsive fully frontend PDF editor with web workers and WASM libraries.',
    icon: FileText,
    iconBg: 'bg-gradient-to-br from-syntax-orange to-syntax-yellow',
    tech: 'React + WASM',
    stars: 5,
    verified: true,
    repoUrl: '',
    liveUrl: 'https://freepdf.rest/',
  },
  {
    id: 'project-forum',
    title: 'Project Forum',
    description: 'Modern, responsive forum website built with Next.js, Postgres, Prisma and Tailwind CSS.',
    icon: MessageSquare,
    iconBg: 'bg-gradient-to-br from-syntax-cyan to-syntax-purple',
    tech: 'Next.js + Prisma',
    stars: 4,
    verified: true,
    repoUrl: 'https://github.com/sridhar-mani/project-forum',
    liveUrl: 'https://moody-blues.vercel.app/landing',
  },
  {
    id: 'ai-analyzer',
    title: 'AI-Analyzer',
    description: 'Python application utilizing LLMs and Ollama for data analysis with Flask backend.',
    icon: Brain,
    iconBg: 'bg-gradient-to-br from-syntax-green to-syntax-cyan',
    tech: 'Python + LLMs',
    stars: 5,
    verified: true,
    repoUrl: 'https://github.com/sridhar-mani/ai-analyzer',
  },
  {
    id: 'chromadb-ui',
    title: 'ChromaDB-UI',
    description: 'Web-based DB manager for ChromaDB vector database. (Beta Version)',
    icon: Database,
    iconBg: 'bg-gradient-to-br from-syntax-purple to-syntax-cyan',
    tech: 'React + ChromaDB',
    stars: 3,
    verified: true,
    repoUrl: 'https://github.com/sridhar-mani/chromadb-ui',
    liveUrl: 'https://www.npmjs.com/package/@sridhar-mani/chromadb-ui',
  },
  {
    id: 'cfd-toolkit',
    title: 'CFD-Toolkit',
    description: 'CFD toolkit with helper functions to view OpenFOAM simulation output files.',
    icon: Wrench,
    iconBg: 'bg-gradient-to-br from-syntax-orange to-syntax-purple',
    tech: 'VTK.js',
    stars: 4,
    verified: true,
    repoUrl: 'https://github.com/sridhar-mani/cfd-toolkit',
    liveUrl: 'https://www.npmjs.com/package/cfd-toolkit',
  },
  {
    id: 'spend-flow',
    title: 'SpendFlow',
    description: 'Smart spending tracker with advanced visualization and mapping, React Native New Architecture.',
    icon: Smartphone,
    iconBg: 'bg-gradient-to-br from-syntax-green to-syntax-yellow',
    tech: 'React Native',
    stars: 4,
    verified: true,
    repoUrl: 'https://github.com/sridhar-mani/SpendFlow',
  },
  {
    id: 'feascript-core',
    title: 'FEAScript-Core',
    description: 'Contributor to a JavaScript based simulation library useful for education.',
    icon: BookOpen,
    iconBg: 'bg-gradient-to-br from-syntax-cyan to-syntax-green',
    tech: 'JavaScript',
    stars: 3,
    verified: true,
    repoUrl: 'https://github.com/sridhar-mani/FEAScript-Core',
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className={`project-icon shrink-0 w-12 h-12 sm:w-14 sm:h-14 ${project.iconBg} rounded-lg flex items-center justify-center text-white shadow-sm`}>
          <project.icon size={24} className="sm:w-7 sm:h-7" />
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
          >
            Live
          </motion.a>
        )}
      </div>
    </motion.div>
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
