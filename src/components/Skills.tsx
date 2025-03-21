import { motion } from "framer-motion";
import {DndContext} from '@dnd-kit/core';

const skills = [
  {
    category: "Frontend",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Vue3",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "VTK.js",
    ],
  },
  {
    category: "Backend",
    items: ["Python", "Flask", "Django", "C#", ".NET Core", "Postgres", "SQLite", "Prisma"],
  },
  {
    category: "Tools & Others",
    items: [
      "Git",
      "Figma",
      "SSMS",
      "Power BI",
      "Redis",
      "Postman",
      "Web Workers",
      "WASM",
      "Ollama",
      "ChromaDB",
    ],
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function Skills() {
  return (
    <section id="skills" className="min-h-screen flex items-center justify-center bg-gray-800/45 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          {...fadeInUp}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          Technical Skills
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skillGroup, groupIndex) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.2 }}
              className="bg-gray-900 rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl text-center font-bold text-white mb-6">
                {skillGroup.category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {skillGroup.items.map((skill, index) => (
    <motion.div
      key={skill}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-300">{skill}</span>
        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
      </div>
    </motion.div>
  ))}
</div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
