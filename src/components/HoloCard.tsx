import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { ExternalLink, X, Mail, Sparkles, MapPin, Briefcase, Terminal, ArrowRight } from 'lucide-react';

export const HoloCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Tilt logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const normalizedX = (e.clientX - rect.left) / width - 0.5;
    const normalizedY = (e.clientY - rect.top) / height - 0.5;
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <div className="relative z-[30]" style={{ perspective: 1200 }}>
        {/* Placeholder to hold space/position when open, but invisible */}
        <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <motion.div
            layoutId="identity-card"
            ref={ref}
            onClick={() => setIsOpen(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-[280px] cursor-pointer"
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* IDLE STATE: Classy Glass Pill */}
            <motion.div 
              className="bg-white/70 backdrop-blur-md border border-white/60 shadow-lg rounded-2xl p-3 flex items-center gap-3 overflow-hidden relative group"
            >
              <div className="relative shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-white shadow-sm flex items-center justify-center overflow-hidden">
                 <img src="/profile.png" alt="Sridhar Mani" className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 leading-none mb-0.5">Sridhar Mani</span>
                <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                  Full-stack • 3D • AI
                </span>
              </div>
              
              <Sparkles size={14} className="ml-auto text-syntax-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
              
               {/* Hover Sheen */}
              <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.8) 45%, rgba(255, 255, 255, 0.5) 50%, transparent 54%)',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* EXPANDED MODAL (PORTAL) */}
      <AnimatePresence>
        {isOpen && (
          <Portal>
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0A0E27]/25 backdrop-blur-md z-[9990] flex items-center justify-center p-4"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-full max-w-[400px] perspective-1000" onClick={(e) => e.stopPropagation()}>
                  <motion.div
                    layoutId="identity-card"
                    className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden relative"
                    initial={{ rotateX: 10, scale: 0.9 }}
                    animate={{ rotateX: 0, scale: 1 }}
                    exit={{ rotateX: 10, scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    {/* Close Button */}
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors z-10"
                    >
                      <X size={20} />
                    </button>

                    <div className="p-8 flex flex-col items-center text-center">
                       {/* Header */}
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-50 to-gray-100 p-1 mb-4 shadow-inner">
                         <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-100">
                           <img src="/profile.png" alt="Sridhar Mani" className="w-full h-full object-cover" />
                         </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Sridhar Mani</h2>
                      <p className="text-sm text-gray-500 font-medium mb-6 flex items-center gap-1.5 justify-center">
                        <MapPin size={12} /> Coimbatore, IN (Novacast)
                      </p>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-[90%]">
                        Building high-performance <span className="text-gray-900 font-semibold">RAG systems</span> and <span className="text-gray-900 font-semibold">interactive 3D experiences</span>.
                      </p>

                      {/* Highlights */}
                      <div className="w-full grid grid-cols-1 gap-2 mb-8">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                           <div className="flex items-center gap-2.5">
                              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                <Briefcase size={14} />
                              </div>
                              <div className="text-left">
                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Current</div>
                                <div className="text-xs font-semibold text-gray-900">Novacast • Associate Engineer</div>
                              </div>
                           </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                           <div className="flex items-center gap-2.5">
                              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                                <Terminal size={14} />
                              </div>
                              <div className="text-left">
                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Stack</div>
                                <div className="text-xs font-semibold text-gray-900">React • Python • Three.js</div>
                              </div>
                           </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex w-full gap-3">
                        <button 
                          onClick={() => { setIsOpen(false); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }} 
                          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          View Work
                        </button>
                         <button 
                          onClick={() => { setIsOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} 
                          className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                          <Mail size={16} />
                          Contact
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
             </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};
