import { PageHero } from '@/components/PageHero';
import { SkillsSection } from '@/components/SkillsSection';

const Skills = () => (
  <>
    <PageHero
      kicker="// 03 · SKILLS"
      title="The toolkit, in orbit."
      sub="Move through the cloud, click for a shockwave. Everything I reach for, from Python and LangGraph to TypeScript, PostgreSQL and WebGPU."
    />
    <div className="sheet"><SkillsSection /></div>
  </>
);

export default Skills;
