import { useRef } from 'react';
import { PageHero } from '@/components/PageHero';

/**
 * Four products you can open right now. Facts here come from the résumé, each project's README and
 * what is visible on the live pages; nothing is estimated.
 */
const PRODUCTS = [
  {
    n: '01', name: 'YUGHO', url: 'https://www.yughoclothing.com/', host: 'yughoclothing.com', img: 'yugho.jpg',
    line: 'Sweat-proof undershirts, sold online across India.',
    points: [
      'A full store: catalog, cart, checkout, orders, reviews, coupons, preorders, inventory and variants, plus an admin side.',
      'PhonePe for payments. NimbusPost for shipping, with warehouse-aware serviceability, courier selection, tracking and webhook-driven status.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'PhonePe', 'NimbusPost'],
  },
  {
    n: '02', name: 'GourmetOS', url: 'https://custom-diner-gamma.vercel.app/', host: 'custom-diner-gamma.vercel.app', img: 'gourmetos.jpg',
    line: 'A restaurant operating system with zero commission.',
    points: [
      'Guests order from a QR code on the table. Orders reach a live kitchen display. Payments settle by UPI straight to the restaurant.',
      'Multi-tenant, with server-authoritative pricing, idempotent mutations, a transactional outbox and an offline-safe PWA.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'PWA'],
  },
  {
    n: '03', name: 'CAD Fusion', url: 'https://web-cad-fusion-sketch.vercel.app/', host: 'web-cad-fusion-sketch.vercel.app', img: 'cadfusion.jpg',
    line: 'A CAD workspace that runs entirely in the browser.',
    points: [
      'Sketching and solid modelling (extrude, revolve, booleans, fillet, shell), a scene tree, measurement tools, persistence and cloud sync.',
      'Geometry runs on OpenCascade compiled to WebAssembly. A LangChain agent drives deterministic CAD tools rather than guessing shapes.',
    ],
    stack: ['React', 'TypeScript', 'Three.js', 'OpenCascade (WASM)', 'LangChain', 'WebGPU'],
  },
  {
    n: '04', name: 'Ardor', url: 'https://www.ardordating.online/app/home', host: 'ardordating.online', img: 'ardor.jpg',
    line: 'A PWA for making friends in real life.',
    points: [
      'Circles around an interest or a neighbourhood, hangouts with RSVP, group chat, party games and synced video. English and Hindi.',
      'Built for free tiers: no socket server and no polling. Web Push carries events, WebRTC carries live play, and a spatial privacy grid protects location.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Turso (libSQL)', 'Web Push', 'WebRTC'],
  },
];

const Frame = ({ src, host, alt }: { src: string; host: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div className="live-frame" ref={ref} onPointerMove={move} onPointerLeave={leave}>
      <div className="live-bar"><i /><i /><i /><span>{host}</span></div>
      <img src={`${import.meta.env.BASE_URL}live/${src}`} alt={alt} loading="lazy" draggable={false} />
    </div>
  );
};

const Live = () => (
  <>
    <PageHero
      kicker="// 05 · LIVE"
      title="Shipped, and live."
      sub="Four products you can open right now. Real stores, real apps, real constraints: payments, offline, free-tier budgets and a CAD kernel in WebAssembly."
    />
    <div className="live">
      {PRODUCTS.map((p, i) => (
        <section key={p.name} className={`live-item ${i % 2 ? 'flip' : ''}`}>
          <div className="live-copy">
            <span className="scene-kicker">{p.n} — {p.name}</span>
            <h2 className="live-title">{p.line}</h2>
            {p.points.map(t => <p key={t} className="scene-body">{t}</p>)}
            <ul className="live-stack">{p.stack.map(s => <li key={s}>{s}</li>)}</ul>
            <a className="scene-btn scene-btn-primary live-open" href={p.url} target="_blank" rel="noopener noreferrer">Open {p.name} ↗</a>
          </div>
          <a className="live-shot" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name}`}>
            <Frame src={p.img} host={p.host} alt={`${p.name} screenshot`} />
          </a>
        </section>
      ))}
    </div>
  </>
);

export default Live;
