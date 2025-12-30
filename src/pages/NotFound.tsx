import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="font-mono text-8xl font-bold mb-4">
          <span className="text-syntax-cyan">4</span>
          <span className="text-syntax-orange">0</span>
          <span className="text-syntax-purple">4</span>
        </h1>
        <p className="font-mono text-xl text-muted-foreground mb-8">
          Oops! Page not found
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-mono text-sm font-medium hover:shadow-glow-cyan transition-all duration-300"
        >
          <span className="text-syntax-cyan">←</span>
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
