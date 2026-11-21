import { PageHero } from '@/components/PageHero';

const JOBS = [
  {
    role: 'AI Engineer', org: 'Zenteiq Aitech Innovations', where: 'Bengaluru', when: 'Mar 2026 — present',
    points: [
      'Build AI-enabled engineering applications that combine agentic workflows, deep-learning and physics models, and specialised engineering data.',
      'Develop coding-agent and workflow orchestration systems for long-horizon automation: stateful execution, tool integration and evaluation workflows.',
      'Build FastAPI services and numerical processing pipelines for document intelligence, workflow automation and engineering workloads.',
      'Fine-tune and integrate open-weight models on specialised datasets.',
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'SQL', 'Docker', 'Git'],
    stats: undefined as { v: string; l: string }[] | undefined,
  },
  {
    role: 'Associate Software Engineer', org: 'NovaCast India', where: 'Coimbatore', when: 'Jun 2024 — Feb 2026',
    points: [
      'Built a browser-based visualisation product for multi-gigabyte simulation datasets with React, TypeScript, Python and WebSockets.',
      'Designed progressive binary streaming over Socket.IO, cutting initial render latency by about 30% while keeping interaction real-time.',
      'Reworked chunked file parsing, cutting peak server memory by about 40% during heavy ingestion.',
      'Designed relational schemas, indexing, asynchronous pipelines, automated tests and technical specifications.',
    ],
    stack: ['Python', 'React', 'TypeScript', 'Three.js', 'Socket.IO', 'SQL', 'Docker', 'Azure'],
    stats: [{ v: '~30%', l: 'lower initial latency' }, { v: '~40%', l: 'lower peak memory' }],
  },
];

const Experience = () => (
  <>
    <PageHero
      kicker="// 02 · EXPERIENCE"
      title="Where the flow went."
      sub="Streaming systems for multi-gigabyte datasets, then agentic workflows and model pipelines. The shape is a neural network, drawn live from particles."
    />
    <div className="pagebody">
      <ol className="exp">
        {JOBS.map(j => (
          <li key={j.org} className="exp-item">
            <div className="exp-meta">
              <span className="exp-when">{j.when}</span>
              <span className="exp-where">{j.where}</span>
            </div>
            <div className="exp-body">
              <h2 className="exp-role">{j.role}</h2>
              <p className="exp-org">{j.org}</p>
              <ul className="exp-points">{j.points.map(p => <li key={p}>{p}</li>)}</ul>
              {j.stats && <div className="exp-stats">{j.stats.map(s => <div key={s.l}><b>{s.v}</b><span>{s.l}</span></div>)}</div>}
              <ul className="live-stack">{j.stack.map(s => <li key={s}>{s}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>

      <section className="pb-sec">
        <div className="pb-head"><span className="scene-kicker">Education, credentials and open source</span></div>
        <div className="edu-grid">
          <div className="dcard"><span className="dcard-k">2019 — 2023</span><h3>B.Tech</h3><p>Anna University, Chennai</p></div>
          <div className="dcard"><span className="dcard-k">Jan 2022 — Oct 2024</span><h3>Diploma in Programming</h3><p>IIT Madras</p></div>
          <div className="dcard"><span className="dcard-k">Jan 2022 — Sep 2025</span><h3>Diploma in Data Science</h3><p>IIT Madras</p></div>
          <div className="dcard"><span className="dcard-k">Certification</span><h3>Building RAG Agents with LLMs</h3><p>NVIDIA</p></div>
          <div className="dcard"><span className="dcard-k">Open source</span><h3>FEAScript-core</h3><p>Gmsh mesh import, worker-based compute, Taichi.js and WebGPU acceleration</p></div>
        </div>
      </section>
    </div>
  </>
);

export default Experience;
