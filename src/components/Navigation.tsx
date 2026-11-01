import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, ArrowRight } from 'lucide-react';

const navItems = [
  { id: '01', label: 'Home', href: '#home' },
  { id: '02', label: 'Work', href: '#work' },
  { id: '03', label: 'Expertise', href: '#expertise' },
  { id: '04', label: 'Experience', href: '#experience' },
  { id: '05', label: 'Contact', href: '#contact' },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      const sections = navItems.map(item => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const sectionId = href.startsWith('#') ? href.slice(1) : href;

    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const headerOffset = 80;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const offsetTop = Math.max(elementTop - headerOffset, 0);

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/80' 
          : 'bg-white/60 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
              SM
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              Sridhar Mani<span className="text-blue-600 font-mono text-sm">._</span>
            </span>
          </a>

          {/* Center Navigation Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 backdrop-blur-md rounded-full px-2 py-1 border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-slate-900 shadow-sm font-semibold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download="Sridhar_M_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 shadow-sm transition-all"
            >
              <FileText size={14} className="text-slate-500" />
              <span>Resume</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <span>Get in Touch</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-3 pb-3 border-t border-slate-100 pt-3"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-xs text-slate-400">{item.id}</span>
                    </a>
                  );
                })}

                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
                  <a
                    href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Sridhar_M_Resume.pdf"
                    className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-800 rounded-lg text-sm font-medium border border-slate-200"
                  >
                    <FileText size={15} />
                    <span>Download Resume (PDF)</span>
                  </a>

                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#contact');
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};
