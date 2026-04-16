import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Magnetic } from './Magnetic';

const navItems = [
  { id: '01', label: 'HOME', href: '#home' },
  { id: '02', label: 'EXPERTISE', href: '#expertise' },
  { id: '03', label: 'WORK', href: '#work' },
  { id: '04', label: 'EXPERIENCE', href: '#experience' },
  { id: '05', label: 'CONTACT', href: '#contact' },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

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
          if (rect.top <= 100) {
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
      requestAnimationFrame(() => {
        const element = document.getElementById(sectionId);
        if (!element) {
          return;
        }

        const headerOffset = 96;
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        const offsetTop = Math.max(elementTop - headerOffset, 0);

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      });
    });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-white/60 lg:bg-transparent lg:backdrop-blur-none lg:shadow-none lg:border-b-0'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-syntax-cyan/50 to-transparent" />

      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Magnetic strength={0.2}>
            <motion.a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-syntax-cyan group-hover:shadow-md transition-all duration-300">
                <span className="text-syntax-cyan font-mono text-sm font-bold">SM</span>
              </div>
              <span className="font-mono text-lg font-semibold tracking-tight hidden sm:block text-gray-800">
                SridharMani<span className="text-syntax-cyan">._</span>
              </span>
            </motion.a>
          </Magnetic>

          <div className="hidden lg:flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-full px-3 py-2 border border-gray-200 shadow-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <Magnetic key={item.id}  strength={0.15}>
                  <motion.a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="relative px-4 py-2 font-mono text-sm tracking-wide transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-syntax-cyan rounded-full"
                        layoutId="navIndicator"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <span className={`relative z-10 transition-all duration-300 ${
                      isActive 
                        ? 'text-syntax-cyan font-semibold' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                  </motion.a>
                </Magnetic>
              );
            })}
          </div>

          <Magnetic strength={0.2}>
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-syntax-cyan text-editor-bg rounded-full font-mono text-sm font-medium overflow-hidden relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative">Let's Talk</span>
              <motion.span 
                className="relative"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </motion.a>
          </Magnetic>

          <motion.button
            className="lg:hidden p-2.5 hover:bg-editor-surface rounded-xl border border-transparent hover:border-editor-border transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 border-t border-border/50 pt-4 overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`relative flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-syntax-cyan/10 text-syntax-cyan' 
                          : 'hover:bg-editor-surface'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {isActive && (
                        <motion.span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-syntax-cyan"
                          layoutId="mobileNavIndicator"
                        />
                      )}
                      <span className="text-muted-foreground text-xs font-mono">{item.id}</span>
                      <span className="text-xs font-mono opacity-40">//</span>
                      <span className="font-mono text-sm font-medium">{item.label}</span>
                    </motion.a>
                  );
                })}
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact');
                  }}
                  className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-syntax-cyan text-editor-bg rounded-full font-mono text-sm font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Let's Talk
                  <span>→</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};
