import { PageHero } from '@/components/PageHero';
import { ContactSection } from '@/components/ContactSection';

const Contact = () => (
  <>
    <PageHero
      kicker="// 04 · CONTACT"
      title="Let's build."
      sub="Open to AI, agent and software engineering roles. A paper plane, because every project starts with a message."
    />
    <div className="sheet"><ContactSection /></div>
  </>
);

export default Contact;
