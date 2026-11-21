import { useState } from 'react';
import { PageHero } from '@/components/PageHero';

const EMAIL = 'sridharmani510@gmail.com';
const SUBJECT = 'Hello from your portfolio';

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked: the address is visible anyway */ }
  };
  return (
    <>
      <PageHero
        kicker="// 04 · CONTACT"
        title="Let's build."
        sub="Open to AI, agent and software engineering roles. A paper plane, because every project starts with a message."
      />
      <div className="pagebody">
        <section className="contact">
          <a className="contact-mail" href={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}>{EMAIL}</a>
          <div className="contact-actions">
            <a className="scene-btn scene-btn-primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}>Write an email</a>
            <button type="button" className="scene-btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
            <a className="scene-btn" href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`} target="_blank" rel="noopener noreferrer">Résumé (PDF) ↗</a>
          </div>
          <ul className="contact-links">
            <li><span>GitHub</span><a href="https://github.com/sridhar-mani" target="_blank" rel="noopener noreferrer">github.com/sridhar-mani ↗</a></li>
            <li><span>LinkedIn</span><a href="https://www.linkedin.com/in/sridharmanimuthusamy" target="_blank" rel="noopener noreferrer">linkedin.com/in/sridharmanimuthusamy ↗</a></li>
            <li><span>Based in</span><b>Bengaluru, India</b></li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Contact;
