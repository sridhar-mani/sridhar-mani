import { PageHero } from '@/components/PageHero';
import { ProjectsSection } from '@/components/ProjectsSection';

const Work = () => (
  <>
    <PageHero
      kicker="// 01 · WORK"
      title="Things I've built."
      sub="Coding agents, retrieval systems, full-stack platforms and native modules. The shape is an abstract syntax tree, the structure NPC Code reasons about."
    />
    <div className="sheet"><ProjectsSection /></div>
  </>
);

export default Work;
