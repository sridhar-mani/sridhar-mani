import { motion } from 'framer-motion';
import { IdentityPanel } from './IdentityPanel';
import { ArrowDown, Github, Linkedin, Mail, FileText, Sparkles, Terminal } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden bg-white pt-24 pb-16">
      {/* Subtle modern dot-grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Subtle gradient wash */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(219, 234, 254, 0.5), transparent)'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full shadow-sm mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-medium text-slate-700">
              AI Engineer @ Zenteiq • Open for select engineering roles
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[0.98] mb-4">
              Sridhar Mani
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-blue-600 mb-6">
              AI Systems & High-Performance Graphics Engineer
            </p>
          </motion.div>

          {/* Bio Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8 font-normal"
          >
            Architecting <span className="text-slate-900 font-semibold">autonomous coding agents</span>, off-thread <span className="text-slate-900 font-semibold">WebGPU compute pipelines</span>, and scalable full-stack platforms bridging low-level geometry kernels with modern web runtimes.
          </motion.p>

          {/* Action CTAs & Resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3.5 mb-10"
          >
            <a
              href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download="Sridhar_M_Resume.pdf"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText size={16} />
              <span>Download Resume (PDF)</span>
            </a>

            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200/90 shadow-sm transition-all hover:border-slate-300"
            >
              <Sparkles size={16} className="text-blue-600" />
              <span>Explore Flagship Work</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm border border-blue-200/60 transition-colors"
            >
              <Terminal size={16} />
              <span>Get in Touch</span>
            </a>
          </motion.div>

          {/* Socials & Interactive Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3 pt-2 border-t border-slate-100"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-slate-600 mr-2 font-medium">Connect:</span>
            
            <a
              href="https://github.com/sridhar-mani"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:shadow-sm transition-all"
            >
              <Github size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/sridharmanimuthusamy/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="mailto:sridharmani510@gmail.com"
              aria-label="Email"
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-300 hover:shadow-sm transition-all"
            >
              <Mail size={18} />
            </a>

            <div className="ml-3 pl-3 border-l border-slate-200">
              <IdentityPanel />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 right-8 hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 pointer-events-none"
      >
        <span>SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-blue-600" />
        </motion.div>
      </motion.div>
    </section>
  );
};
