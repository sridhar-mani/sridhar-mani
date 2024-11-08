import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, BookOpen } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative z-10 h-screen flex items-center justify-center">
      <div className="text-center text-white p-8 backdrop-blur-sm bg-gray-900/30 rounded-lg">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
        >
          Sridhar Mani
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl mb-8 text-gray-300"
        >
          Associate Software Developer @ Novacast India
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg mb-8 text-gray-400 max-w-2xl mx-auto"
        >
          Full Stack Developer with expertise in React, Vue, and .NET Core. Editorial Head at Astro Club and passionate about creating impactful solutions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center space-x-6"
        >
          <a
            href="https://github.com/sridhar-mani"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-indigo-400 transition-colors transform hover:scale-110"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/sridhar-m-b4557b286/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-indigo-400 transition-colors transform hover:scale-110"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:mailtosridhar01@gmail.com"
            className="text-white hover:text-indigo-400 transition-colors transform hover:scale-110"
          >
            <Mail size={24} />
          </a>
          <a
            href="https://drive.google.com/uc?export=download&id=1k6OSGz3YiPHrDHTlcNizxt6DFLUjLL-h"
            className="text-white hover:text-indigo-400 transition-colors transform hover:scale-110"
            title="Resume"
            download='Sridhar-Resume.pdf'
          >
            <BookOpen size={24} />
          </a>
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all hover:scale-105 transform"
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
        >
          View My Work
        </motion.button>
      </div>
    </div>
  );
}