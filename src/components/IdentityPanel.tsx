import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { X, Mail, Github, Linkedin, Briefcase, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export const IdentityPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const miniCardRef = useRef<HTMLDivElement>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Store initial rect for FLIP animation
  const initialRect = useRef<DOMRect | null>(null);

  // GSAP quick setters for smooth animations
  const miniTiltX = useRef<gsap.QuickToFunc>();
  const miniTiltY = useRef<gsap.QuickToFunc>();
  
  const cardTiltX = useRef<gsap.QuickToFunc>();
  const cardTiltY = useRef<gsap.QuickToFunc>();
  const imageOffsetX = useRef<gsap.QuickToFunc>();
  const imageOffsetY = useRef<gsap.QuickToFunc>();

  // Setup GSAP quickTo functions
  useLayoutEffect(() => {
    if (miniCardRef.current) {
      miniTiltX.current = gsap.quickTo(miniCardRef.current, "rotationX", { duration: 0.4, ease: "power3.out" });
      miniTiltY.current = gsap.quickTo(miniCardRef.current, "rotationY", { duration: 0.4, ease: "power3.out" });
      gsap.set(miniCardRef.current, { transformPerspective: 800, transformStyle: "preserve-3d" });
    }
  }, []);

  useEffect(() => {
    if (isExpanded && expandedCardRef.current && imageRef.current) {
      // Setup expanded card 3D
      gsap.set(expandedCardRef.current, { transformPerspective: 1000, transformStyle: "preserve-3d" });
      
      cardTiltX.current = gsap.quickTo(expandedCardRef.current, "rotationX", { duration: 0.5, ease: "power2.out" });
      cardTiltY.current = gsap.quickTo(expandedCardRef.current, "rotationY", { duration: 0.5, ease: "power2.out" });
      
      // Image moves with mouse - creating depth inside the card (Lando Norris style)
      imageOffsetX.current = gsap.quickTo(imageRef.current, "x", { duration: 0.3, ease: "power2.out" });
      imageOffsetY.current = gsap.quickTo(imageRef.current, "y", { duration: 0.3, ease: "power2.out" });
      
      // Set perspective layer for image (bring it forward in Z)
      gsap.set(imageRef.current, { z: 30 });
    }
  }, [isExpanded]);

  // Handle mini card tilt
  const handleMiniMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!miniCardRef.current) return;
    const rect = miniCardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 12;
    miniTiltX.current?.(rotateX);
    miniTiltY.current?.(rotateY);
  };

  const handleMiniMouseLeave = () => {
    miniTiltX.current?.(0);
    miniTiltY.current?.(0);
  };

  // Handle expanded card 3D effect (window-level mouse)
  useEffect(() => {
    if (!isExpanded) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!expandedCardRef.current) return;
      
      const rect = expandedCardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Card tilt (subtle: max 8 degrees)
      const tiltY = ((e.clientX - centerX) / (window.innerWidth / 2)) * 8;
      const tiltX = -((e.clientY - centerY) / (window.innerHeight / 2)) * 8;
      cardTiltX.current?.(tiltX);
      cardTiltY.current?.(tiltY);
      
      // Image parallax (more pronounced: moves up to 15px)
      // This creates the "depth" effect where the image seems to float above the card
      const imgOffsetX = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 15;
      const imgOffsetY = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 15;
      imageOffsetX.current?.(imgOffsetX);
      imageOffsetY.current?.(imgOffsetY);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [isExpanded]);

  const toggleExpand = () => {
    if (!isExpanded) {
      // Save position before expanding
      if (miniCardRef.current) {
        initialRect.current = miniCardRef.current.getBoundingClientRect();
      }
      setIsExpanded(true);
      
      // Animate in after render
      requestAnimationFrame(() => {
        if (!expandedCardRef.current || !initialRect.current) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const startX = initialRect.current.left + initialRect.current.width / 2;
        const startY = initialRect.current.top + initialRect.current.height / 2;
        const deltaX = startX - centerX;
        const deltaY = startY - centerY;

        const tl = gsap.timeline();
        
        // Overlay
        tl.to(".identity-overlay", { opacity: 1, pointerEvents: "auto", duration: 0.4 }, 0);
        
        // Card FLIP animation
        tl.fromTo(expandedCardRef.current,
          { x: deltaX, y: deltaY, scale: 0.3, opacity: 0, rotationY: -15 },
          { x: 0, y: 0, scale: 1, opacity: 1, rotationY: 0, duration: 0.6, ease: "back.out(1.4)" },
          0
        );
        
        // Stagger content
        tl.fromTo(".expanded-item",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          0.3
        );
      });
    } else {
      // COLLAPSE
      const tl = gsap.timeline({ onComplete: () => setIsExpanded(false) });
      
      tl.to(".identity-overlay", { opacity: 0, pointerEvents: "none", duration: 0.3 }, 0);
      
      if (expandedCardRef.current) {
        tl.to(expandedCardRef.current, {
          scale: 0.8,
          opacity: 0,
          rotationY: 10,
          duration: 0.4,
          ease: "power3.inOut"
        }, 0);
      }
    }
  };

  return (
    <>
      {/* Fixed Overlay & Expanded Card */}
      <div className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none",
        isExpanded ? "pointer-events-auto" : ""
      )}>
        <div 
          className="identity-overlay absolute inset-0 bg-black/50 backdrop-blur-lg opacity-0"
          onClick={toggleExpand}
        />
        
        {isExpanded && (
          <div
            ref={expandedCardRef}
            className="relative w-[420px] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl overflow-visible"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            {/* EXPANDED CONTENT */}
            <div className="p-8 flex flex-col relative text-left">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
                data-cursor="close"
                className="expanded-item absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100/50 text-slate-500 transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div className="expanded-item flex items-start gap-6 mb-8">
                {/* 3D Profile Image Container */}
                <div 
                  ref={imageRef}
                  className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl shrink-0 bg-gradient-to-br from-cyan-400 to-purple-500"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)'
                  }}
                >
                  <img 
                    src="/sridhar-mani/profile.png" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="pt-2">
                  <h2 className="text-2xl font-bold text-slate-900 font-mono tracking-tighter">SRIDHAR MANI</h2>
                  <p className="text-slate-500 text-sm mt-1">Thinker • Builder • Dreamer</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/20 text-cyan-700 text-xs font-semibold border border-cyan-200">Python</span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 text-purple-700 text-xs font-semibold border border-purple-200">AI/ML</span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-700 text-xs font-semibold border border-amber-200">React</span>
                  </div>
                </div>
              </div>

              <p className="expanded-item text-slate-600 text-sm leading-relaxed mb-6">
                I believe technology should feel like magic. I spend my days thinking about how AI can make life simpler, 
                building interfaces that spark joy, and exploring the edge of what's possible. 
                Currently obsessed with LLMs, creative coding, and the art of making complex things feel effortless.
              </p>

              <div className="expanded-item grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white/60 to-white/30 border border-white/50 backdrop-blur-sm shadow-inner">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Briefcase size={12} /> Currently
                  </div>
                  <div className="font-bold text-slate-800">Building with AI</div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white/60 to-white/30 border border-white/50 backdrop-blur-sm shadow-inner">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Code size={12} /> Thinking About
                  </div>
                  <div className="font-bold text-slate-800 text-sm">LLMs, Creative UX</div>
                </div>
              </div>

              <div className="expanded-item flex gap-3 mt-auto pt-2">
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); toggleExpand(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-900/20"
                >
                  <Mail size={16} /> Contact Me
                </a>
                <a href="https://github.com/sridhar-mani" target="_blank" rel="noopener noreferrer" className="w-14 flex items-center justify-center rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-600"><Github size={22} /></a>
                <a href="https://www.linkedin.com/in/sridhar-m-b4557b286/" target="_blank" rel="noopener noreferrer" className="w-14 flex items-center justify-center rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-600"><Linkedin size={22} /></a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mini Card */}
      <div 
        ref={containerRef}
        className={cn("relative z-[50] inline-block", isExpanded ? "opacity-0 pointer-events-none" : "opacity-100")}
        style={{ perspective: '800px' }}
      >
        <div
          ref={miniCardRef}
          onClick={toggleExpand}
          onMouseMove={handleMiniMouseMove}
          onMouseLeave={handleMiniMouseLeave}
          className={cn(
            "relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden cursor-pointer",
            "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
            "hover:shadow-2xl hover:shadow-cyan-500/20 hover:w-[180px] w-[130px]"
          )}
          style={{ height: 50, borderRadius: 9999, transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 flex items-center px-1.5 gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
              <img src="/sridhar-mani/profile.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center min-w-0 pr-2">
              <span className="text-[10px] font-bold text-slate-800 leading-tight truncate">SRIDHAR MANI</span>
              <span className="text-[8px] font-medium text-slate-500 truncate">Engineer</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

