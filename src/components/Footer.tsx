import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 border-t border-slate-200/80 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-mono text-[10px] font-bold">
              SM
            </div>
            <span className="font-semibold text-xs sm:text-sm text-slate-800">
              Sridhar Mani<span className="text-blue-600 font-mono">._</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Operational & Ready</span>
            </span>
            <span>•</span>
            <span>© {currentYear}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/sridhar-mani"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/sridharmanimuthusamy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:sridharmani510@gmail.com"
              aria-label="Email"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Mail size={16} />
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-2"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
