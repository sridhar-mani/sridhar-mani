import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowUpRight, Menu, X } from 'lucide-react';

const navItems = [
  { id: '01', label: 'Index', href: '#home' },
  { id: '02', label: 'Works', href: '#works' },
  { id: '03', label: 'Architecture', href: '#architecture' },
  { id: '04', label: 'Timeline', href: '#timeline' },
  { id: '05', label: 'Contact', href: '#contact' },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [time, setTime] = useState('');

  // Live Bengaluru Clock (Awwwards staple)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const ist = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
        setTime(`${ist} IST`);
      } catch {
        setTime('BLR, IN');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      const sections = ['contact', 'timeline', 'architecture', 'works', 'home'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
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
    const el = document.getElementById(sectionId);
    if (!el) return;
    const headerOffset = 90;
    const top = Math.max(el.getBoundingClientRect().top + window.scrollY - headerOffset, 0);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Brand Monogram */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="group flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono text-xs font-semibold flex items-center justify-center tracking-tight transition-transform duration-300 group-hover:scale-95">
              SM
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-tight text-slate-900 uppercase">
                Sridhar Mani
              </span>
              <span className="text-[10px] font-mono text-slate-400 -mt-0.5">
                AI & Systems
              </span>
            </div>
          </a>

          {/* Center Navigation Capsule */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/80 backdrop-blur-md">
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
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right Meta Capsule: Live Clock + Resume + Contact */}
          <div className="hidden sm:flex items-center gap-3 font-mono text-xs">
            {/* Live Time */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{time || 'BLR, IN'}</span>
            </div>

            {/* Resume Button */}
            <a
              href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download="Sridhar_M_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-all hover:border-slate-300 shadow-sm"
            >
              <FileText size={13} className="text-slate-400" />
              <span>Resume</span>
            </a>

            {/* Contact Action */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-sm"
            >
              <span>Connect</span>
              <ArrowUpRight size={13} className="text-slate-400" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pt-4 pb-2 border-t border-slate-200/80 mt-3"
            >
              <div className="flex flex-col gap-1.5">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      activeSection === item.href.slice(1)
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] opacity-60">{item.id}</span>
                  </a>
                ))}

                <div className="pt-2 mt-2 border-t border-slate-100 flex gap-2">
                  <a
                    href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Sridhar_M_Resume.pdf"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <FileText size={14} />
                    <span>Resume (PDF)</span>
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#contact');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium"
                  >
                    <span>Connect</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
