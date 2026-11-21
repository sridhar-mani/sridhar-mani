import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * The home page is a scroll story. Each <section data-scene="..."> tells the 3D layer (FlowField)
 * which shape to build while it is on screen: the name, an agent, a syntax tree, a neural network,
 * the stack, a paper plane. The words here are the only content; the picture is the particles.
 */
const STEPS = ['01', '02', '03', '04', '05', '06'];

const Home = () => {
  const [active, setActive] = useState(0);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.scene'));
    const onScroll = () => {
      const mid = innerHeight * 0.5; let idx = 0;
      els.forEach((el, i) => { if (el.getBoundingClientRect().top <= mid) idx = i; });
      setActive(idx);
    };
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
    const tick = () => {
      try { setClock(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())); } catch { setClock(''); }
    };
    tick(); const t = setInterval(tick, 1000);
    return () => { removeEventListener('scroll', onScroll); clearInterval(t); };
  }, []);

  return (
    <div className="story">
      {/* HUD: always on, quiet, in the spirit of an instrument panel */}
      <div className="hud" aria-hidden="true">
        <div className="hud-steps">{STEPS.map((s, i) => <span key={s} className={i === active ? 'on' : ''}>{s}</span>)}</div>
        <div className="hud-side">SRIDHAR MANI · PORTFOLIO 2026</div>
        <div className="hud-clock">BLR {clock || '--:--:--'}</div>
      </div>

      <section className="scene" data-scene="name">
        <div className="scene-copy scene-copy-name">
          <p className="scene-lead">AI engineer. I build agents that plan, act and <mark>check their own work</mark>.</p>
          <p className="scene-meta">Python · TypeScript · LangGraph · FastAPI · Bengaluru</p>
          <p className="scene-cue">Scroll</p>
        </div>
      </section>

      <section className="scene" data-scene="xbot">
        <div className="scene-copy">
          <span className="scene-kicker">01 — Agents</span>
          <h2 className="scene-title">Software that <mark>plans</mark>, acts and checks itself.</h2>
          <p className="scene-body">I build stateful multi-agent systems with LangGraph and FastAPI: tool use, long-horizon workflows and the evaluation that tells you whether they worked.</p>
        </div>
      </section>

      <section className="scene" data-scene="ast">
        <div className="scene-copy">
          <span className="scene-kicker">02 — Code</span>
          <h2 className="scene-title">Agents that read code like a <mark>compiler</mark>.</h2>
          <p className="scene-body">NPC Code is a coding agent for the terminal and VS Code. It parses a project into a syntax tree, measures how far a change can spread, and only applies a patch once the tests qualify it.</p>
          <Link to="/work" className="scene-link">See the work →</Link>
        </div>
      </section>

      <section className="scene" data-scene="nn">
        <div className="scene-copy">
          <span className="scene-kicker">03 — Models</span>
          <h2 className="scene-title">Retrieval, fine-tuning, <mark>local</mark> inference.</h2>
          <p className="scene-body">RAG with embeddings and vector search, open-weight models fine-tuned on specialised data, and language models that run entirely in the browser. The assistant on this site does.</p>
          <p className="scene-chip">NVIDIA certified · Building RAG Agents with LLMs</p>
        </div>
      </section>

      <section className="scene" data-scene="globe">
        <div className="scene-copy">
          <span className="scene-kicker">04 — Stack</span>
          <h2 className="scene-title">Python and TypeScript, <mark>end to end</mark>.</h2>
          <p className="scene-body">FastAPI, PostgreSQL, Redis, Docker, React and Next.js. Idempotent APIs, a transactional outbox, streaming that cut peak memory by about 40% on multi-gigabyte data. The unglamorous parts that make it dependable.</p>
          <Link to="/skills" className="scene-link">The whole toolkit →</Link>
        </div>
      </section>

      <section className="scene scene-last" data-scene="plane">
        <div className="scene-copy">
          <span className="scene-kicker">05 — Next</span>
          <h2 className="scene-title">Open to AI and <mark>agent</mark> engineering roles.</h2>
          <p className="scene-body">If you are building agentic systems and want someone who ships them, I would like to hear about it.</p>
          <div className="scene-actions">
            <Link to="/contact" className="scene-btn scene-btn-primary">Get in touch</Link>
            <Link to="/work" className="scene-btn">Selected work</Link>
            <Link to="/live" className="scene-btn">Live products →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
