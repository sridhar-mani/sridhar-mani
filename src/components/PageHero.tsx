import type { ReactNode } from 'react';

/** The opening screen of an inner page: a big title on the left, the 3D model on the right (drawn by FlowField). */
export const PageHero = ({ kicker, title, sub, children }: { kicker: string; title: string; sub: string; children?: ReactNode }) => (
  <header className="pagehero">
    <div className="pagehero-inner">
      <span className="pagehero-kicker">{kicker}</span>
      <h1 className="pagehero-title">{title}</h1>
      <p className="pagehero-sub">{sub}</p>
      {children}
    </div>
  </header>
);

export default PageHero;
