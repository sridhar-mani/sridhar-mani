import { motion} from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { useState } from "react";

const projects = [
  {
    title: "Influencer App",
    description:
      "Full-stack application built with Vue3 and Flask, featuring user authentication and CRUD operations.",
    image:
      "https://images.unsplash.com/photo-1579869847557-1f67382cc158?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tech: ["Vue3", "SQLite", "TailwindCSS", "Flask"],
    github: "https://github.com/sridhar-mani/InfluencerHub",
    live: "",
  },
  
  {
    title: "Library Management System",
    description:
      "Flask and SQLite based site featuring user authentication and book management.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
    tech: ["Flask", "SQLite", "Bootstrap", "JavaScript"],
    github: "https://github.com/sridhar-mani/library",
    live: "",
  },
  {
    title: "PDF Editor",
    description:
      "An modern and responsive fully frontend based PDF editor made with web workers, wasm libraries.",
    image:
      "https://api.screenshotone.com/take?access_key=MGzKtcw0x6WRdQ&url=https://freepdf.rest/about",
    tech: ["React",  "Tailwind CSS","Web Workers","WASM"],
    github: "",
    live: "https://freepdf.rest/",
  },
  {
    title: "Project Forum",
    description: "A modern, responsive forum website built with Next.js, Postgres, Prisma and Tailwind CSS.",
    image:
      "https://api.screenshotone.com/take?access_key=MGzKtcw0x6WRdQ&url=https://moody-blues.vercel.app/landing",
    tech: ["Next.js", "Tailwind CSS", "Prisma","Postgres"],
    github: "https://github.com/sridhar-mani/project-forum",
    live: "https://moody-blues.vercel.app/landing",
  },
  {
    title: "AI-Analyzer",
    description:
      "A Python application utilizing LLMs and Ollama for data analysis, featuring a Flask backend and TypeScript frontend.",
    image:
      "https://images.unsplash.com/photo-1577401159468-3bbc7ee440b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tech: ["Python", "Flask", "TypeScript","TailwindCSS","React.js","Ollama"],
    github: "https://github.com/sridhar-mani/ai-analyzer",
    live: "",
  },
  {
    title: "ChromaDB-UI",
    description: "A web based DB manager for the vector DB chroma DB.(Beta Version)",
    image:
      "https://plus.unsplash.com/premium_photo-1681487942927-e1a2786e6036?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tech: ["React.js", "Tailwind CSS"],
    github: "https://github.com/sridhar-mani/chromadb-ui",
    live: "https://www.npmjs.com/package/@sridhar-mani/chromadb-ui",
  },
  {
    title: "CFD-Toolkit",
    description: "A cfd toolkit with helper functions to view simulation output files openfoam.",
    image:
      "https://images.unsplash.com/photo-1642191911856-eff75c138ead?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tech: ["VTK.js", "Javascript"],
    github: "https://github.com/sridhar-mani/cfd-toolkit",
    live: "https://www.npmjs.com/package/cfd-toolkit",
  },
  {
    title: "Js-DSA",
    description: "A dsa helper library in javascript to be used in other projects.(Beta Version)",
    image:
      "https://plus.unsplash.com/premium_photo-1667232504929-f94b7002079d?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tech: ["Javascript"],
    github: "https://github.com/sridhar-mani/js-dsa",
    live: "https://www.npmjs.com/package/@sridhar-mani/dsa-js",
  },
];

export function Projects() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  const nextProjects = () => {
    if (startIndex + itemsPerPage < projects.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prevProjects = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <section id="projects" className="min-h-screen bg-gray-900/45 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          Featured Projects
        </motion.h2>

        <div className="relative flex items-center justify-center">
          {/* Left Button */}
          <button
            onClick={prevProjects}
            disabled={startIndex === 0}
            className={`absolute left-0 z-10 bg-gray-800 p-3 rounded-full text-white transition-transform hover:scale-110 ${
              startIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            <ChevronLeft size={30} />
          </button>

          {/* Projects Grid */}
          <div className="w-full overflow-hidden">
            <motion.div
              key={startIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-8 justify-center"
            >
              {projects.slice(startIndex, startIndex + itemsPerPage).map((project) => (
                <motion.div
                  key={project.title}
                  className="w-[350px] bg-gray-800 rounded-lg overflow-hidden transform hover:shadow-white transition-transform"
                >
                  <div className="relative h-48">
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
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
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
            </motion.div>
          </div>

          {/* Right Button */}
          <button
            onClick={nextProjects}
            disabled={startIndex + itemsPerPage >= projects.length}
            className={`absolute right-0 z-10 bg-gray-800 p-3 rounded-full text-white transition-transform hover:scale-110 ${
              startIndex + itemsPerPage >= projects.length ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
    </section>
  );
}
