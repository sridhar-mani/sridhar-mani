import { Link } from 'react-router-dom';
import { PageHero } from '@/components/PageHero';

const BASE = import.meta.env.BASE_URL;

const LIVE = [
  { name: 'YUGHO', line: 'Sweat-proof undershirts, sold across India', url: 'https://www.yughoclothing.com/', img: 'yugho.jpg' },
  { name: 'GourmetOS', line: 'Restaurant OS with zero commission', url: 'https://custom-diner-gamma.vercel.app/', img: 'gourmetos.jpg' },
  { name: 'CAD Fusion', line: 'CAD workspace in the browser', url: 'https://web-cad-fusion-sketch.vercel.app/', img: 'cadfusion.jpg' },
  { name: 'Ardor', line: 'Making friends in real life', url: 'https://www.ardordating.online/app/home', img: 'ardor.jpg' },
];

type Row = { name: string; line: string; tech: string; links: { label: string; href: string }[]; note?: string };
const ROWS: Row[] = [
  {
    name: 'NPC Code',
    line: 'A coding agent for the terminal and VS Code. It parses a project into a syntax tree, measures how far a change can spread, and only applies a patch once the tests qualify it. Ships as a CLI, an extension and a core runtime with tool execution and model routing.',
    tech: 'TypeScript · AST parsing · Node.js',
    links: [{ label: 'GitHub', href: 'https://github.com/sridhar-mani/npc-code' }],
  },
  {
    name: 'Code-DCR',
    line: 'PyTorch implementation accompanying a research paper on representation learning for code structure.',
    tech: 'Python · PyTorch · CUDA',
    links: [{ label: 'GitHub', href: 'https://github.com/sridhar-mani/code-dcr' }],
    note: 'Research',
  },
  {
    name: 'AiDocs',
    line: 'A desktop app for document intelligence and retrieval: local embeddings, vector search, live progress over Socket.IO, and local-LLM analysis. Everything runs on your machine.',
    tech: 'Electron · React · ChromaDB · RAG',
    links: [],
    note: 'Private repository',
  },
  {
    name: 'CFD-Toolkit',
    line: 'Helpers to parse, slice and view OpenFOAM simulation output in the browser, published on npm.',
    tech: 'JavaScript · VTK.js · WebAssembly',
    links: [{ label: 'GitHub', href: 'https://github.com/sridhar-mani/cfd-toolkit' }, { label: 'npm', href: 'https://www.npmjs.com/package/cfd-toolkit' }],
  },
  {
    name: 'RN SMS Fetch',
    line: 'A native Android module for React Native’s New Architecture (a TurboModule) for fast asynchronous SMS retrieval, published on npm.',
    tech: 'Kotlin · React Native',
    links: [{ label: 'GitHub', href: 'https://github.com/sridhar-mani/rn-sms-fetch' }, { label: 'npm', href: 'https://www.npmjs.com/package/rn-sms-fetch' }],
  },
  {
    name: 'FEAScript-core',
    line: 'Open-source contributions: Gmsh mesh import, worker-based simulation compute, and Taichi.js / WebGPU acceleration.',
    tech: 'JavaScript · WebGPU · Web Workers',
    links: [{ label: 'GitHub', href: 'https://github.com/FEAScript/FEAScript-core' }],
    note: 'Contribution',
  },
];

const Work = () => (
  <>
    <PageHero
      kicker="// 01 · WORK"
      title="Things I've built."
      sub="Coding agents, retrieval systems, full-stack products and native modules. The shape is an abstract syntax tree, the structure NPC Code reasons about."
    />
    <div className="pagebody">
      <section className="pb-sec">
        <div className="pb-head">
          <span className="scene-kicker">Live products</span>
          <Link to="/live" className="scene-link">The story behind each →</Link>
        </div>
        <div className="work-tiles">
          {LIVE.map(p => (
            <a key={p.name} className="work-tile" href={p.url} target="_blank" rel="noopener noreferrer">
              <img src={`${BASE}live/${p.img}`} alt="" loading="lazy" draggable={false} />
              <span className="work-tile-name">{p.name} <em>↗</em></span>
              <span className="work-tile-line">{p.line}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="pb-sec">
        <div className="pb-head"><span className="scene-kicker">Agents, research and open source</span></div>
        <ol className="wrows">
          {ROWS.map((r, i) => (
            <li key={r.name} className="wrow">
              <span className="wrow-n">{String(i + 1).padStart(2, '0')}</span>
              <div className="wrow-main">
                <h3>{r.name}{r.note && <small>{r.note}</small>}</h3>
                <p>{r.line}</p>
                <span className="wrow-tech">{r.tech}</span>
              </div>
              <div className="wrow-links">
                {r.links.length ? r.links.map(l => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>) : <span className="wrow-private">no public link</span>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  </>
);

export default Work;
