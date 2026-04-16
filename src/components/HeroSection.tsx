import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { DecryptText } from './DecryptText';
import { IdentityPanel } from './IdentityPanel';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-white">
      {/* Subtle gradient background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 50%, #F5F7FA 100%)'
        }}
      />

      {/* Subtle grid pattern - dark dots */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0A0E27 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Grain texture for premium feel */}
      <div 
        className="absolute inset-0 z-[3] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content - positioned on the left with vertical centering and more left padding */}
      <div className="relative z-[20] w-full min-h-screen flex flex-col justify-center pl-8 md:pl-28 lg:pl-36 py-24">
        <div className="w-full lg:w-[50%] relative">
          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-syntax-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-syntax-green" />
            </span>
            <span className="font-mono text-xs text-gray-600">
              Available for new opportunities
            </span>
          </motion.div>

          {/* Main title - massive typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 relative"
          >
            <DecryptText 
              text="SRIDHAR" 
              className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-mono font-black tracking-tighter text-[#0A0E27] leading-[0.85]" 
              delay={300} 
              duration={1200} 
            />
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-black tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-syntax-cyan via-syntax-purple to-syntax-cyan" style={{ textShadow: '0 0 60px hsl(var(--syntax-cyan) / 0.4)' }}>
              <DecryptText text="MANI" delay={600} duration={1000} />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <p className="font-mono text-sm md:text-base text-[#4A5568] tracking-widest flex flex-wrap items-center gap-2">
              FULL STACK ENGINEER
              <span className="px-3 py-1 rounded-full bg-syntax-cyan text-white text-xs font-semibold shadow-sm">3D VIZ</span>
              <span className="px-3 py-1 rounded-full bg-syntax-orange text-white text-xs font-semibold shadow-sm">AI/LLM</span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-lg md:text-xl text-[#4A5568] max-w-lg mb-12 leading-relaxed"
          >
            Crafting{' '}
            <span className="text-syntax-cyan font-semibold">CFD simulations</span>,{' '}
            <span className="text-syntax-orange font-semibold">RAG systems</span>, and{' '}
            <span className="text-syntax-purple font-semibold">interactive 3D</span> experiences.
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex items-center gap-4"
          >
            {[
              { icon: Github, href: 'https://github.com/sridhar-mani', label: 'GitHub', hoverBg: 'group-hover:bg-[#24292e]' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/sridharmanimuthusamy', label: 'LinkedIn', hoverBg: 'group-hover:bg-[#0A66C2]' },
              { icon: Mail, href: 'mailto:sridharmani510@gmail.com', label: 'Email', hoverBg: 'group-hover:bg-syntax-orange' },
            ].map(({ icon: Icon, href, label, hoverBg }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative p-4 bg-gray-100 rounded-xl text-gray-600 transition-all duration-300 shadow-sm hover:shadow-md hover:text-white ${hoverBg} group-hover:text-white`}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                <Icon size={24} className="relative z-10 text-inherit transition-colors duration-300 group-hover:text-white" />
              </motion.a>
            ))}
          </motion.div>

          {/* Identity Panel - Now part of flow, below socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-12"
          >
            <Suspense fallback={null}>
              <IdentityPanel />
            </Suspense>
          </motion.div>


        </div>
      </div>


      {/* Scroll indicator - positioned at bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#expertise"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#expertise')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-2 text-gray-400 hover:text-syntax-cyan transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase">Scroll</span>
          <ArrowDown size={16} />
        </motion.a>
      </motion.div>
    </section>
  );
};
