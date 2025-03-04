import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Influencer App",
    description:
      "Full-stack application built with Vue3 and Flask, featuring user authentication and crud operations ",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
    tech: ["Flask", "SQLite", "Bootstrap", "JavaScript"],
    github: "https://github.com/sridhar-mani/InfluencerHub",
    live: "",
  },

  {
    title: "Business Data Analysis",
    description:
      "Comprehensive data analysis project using Python Pandas and Power BI for business insights",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tech: ["Python", "Pandas", "Power BI"],
    github: "https://github.com",
    live: "",
  },
  {
    title: "Library Management System",
    description:
      "Full-stack application built with Flask and SQLite, featuring user authentication and book management",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
    tech: ["Flask", "SQLite", "Bootstrap", "JavaScript"],
    github: "https://github.com/sridhar-mani/library",
    live: "",
  },
];

export function Projects() {
  return (
    <section id="projects" className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          Featured Projects
        </motion.h2>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex `}>
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform `}
            >
              <div className={`relative h-48 `}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-900 rounded-full text-white hover:text-indigo-400 transform hover:scale-110 transition-transform"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-900 rounded-full text-white hover:text-indigo-400 transform hover:scale-110 transition-transform"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-700 text-sm text-gray-300 rounded-full hover:bg-indigo-600 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
