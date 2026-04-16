import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 sm:py-8 border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-editor-bg flex items-center justify-center border border-editor-border">
              <span className="text-syntax-cyan font-mono text-[10px] sm:text-xs font-bold">SM</span>
            </div>
            <span className="font-mono text-xs sm:text-sm">
              SridharMani<span className="text-syntax-cyan">._</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-syntax-green" />
              <span className="hidden xs:inline">All systems</span> operational
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">v2.0.0</span>
          </div>

          <div className="font-mono text-[10px] sm:text-xs text-muted-foreground">
            © {currentYear} Sridhar Mani
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
