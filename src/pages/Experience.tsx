import { PageHero } from '@/components/PageHero';
import { ExperienceSection } from '@/components/ExperienceSection';

const Experience = () => (
  <>
    <PageHero
      kicker="// 02 · EXPERIENCE"
      title="Where the flow went."
      sub="Streaming systems for multi-gigabyte datasets, then agentic workflows and model pipelines. The shape is a neural network, drawn live from particles."
    />
    <div className="sheet"><ExperienceSection /></div>
  </>
);

export default Experience;
