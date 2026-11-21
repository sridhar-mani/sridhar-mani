import { PageHero } from '@/components/PageHero';

const GROUPS = [
  { title: 'Languages and frameworks', items: ['Python', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'Vue.js', 'Node.js', 'FastAPI', 'Flask'] },
  { title: 'AI and LLM', items: ['LangGraph', 'LangChain', 'RAG', 'Agents and tool calling', 'PyTorch', 'Hugging Face', 'Ollama', 'vLLM', 'Embeddings and vector search'] },
  { title: 'Data', items: ['PostgreSQL', 'SQLite', 'Redis', 'SQL', 'Pandas', 'NumPy', 'SQLAlchemy', 'Drizzle ORM'] },
  { title: 'Systems and infrastructure', items: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'Azure', 'CI/CD', 'WebSockets', 'Socket.IO', 'Asynchronous systems'] },
  { title: 'Graphics and the web platform', items: ['Three.js', 'WebGPU', 'WebAssembly', 'Web Workers', 'VTK.js', 'OpenCascade', 'PWA'] },
  { title: 'Testing', items: ['Jest', 'Vitest', 'Playwright', 'Unit and integration testing'] },
];

const Skills = () => (
  <>
    <PageHero
      kicker="// 03 · SKILLS"
      title="The toolkit, in orbit."
      sub="Move through the cloud, click for a shockwave. Everything I reach for, from Python and LangGraph to TypeScript, PostgreSQL and WebGPU."
    />
    <div className="pagebody">
      <div className="skill-grid">
        {GROUPS.map(g => (
          <section key={g.title} className="dcard">
            <h3>{g.title}</h3>
            <ul className="live-stack">{g.items.map(i => <li key={i}>{i}</li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  </>
);

export default Skills;
