import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import skillsData from '@/data/skills.json';

interface Skill {
  name: string;
  version: string;
  years: number;
  projects: number;
}

const skills: Skill[] = skillsData;

const CodeLine = ({ lineNumber, children }: { lineNumber: number; children: React.ReactNode }) => (
  <div className="code-line group">
    <span className="line-number text-xs sm:text-sm">{lineNumber}</span>
    <div className="flex-1 text-xs sm:text-sm">{children}</div>
  </div>
);

const SkillLine = ({ skill, index }: { skill: Skill; index: number }) => {
  const isLast = index === skills.length - 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            viewport={{ once: true }}
            className="cursor-pointer"
          >
            <CodeLine lineNumber={index + 5}>
              <span className="text-editor-text">
                {'    '}
                <span className="syntax-key">"{skill.name}"</span>
                <span className="text-editor-comment">:</span>
                {' '}
                <span className="syntax-string">"{skill.version}"</span>
                {!isLast && <span className="text-editor-comment">,</span>}
              </span>
            </CodeLine>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-editor-surface border-editor-border text-editor-text font-mono text-xs sm:text-sm p-3 sm:p-4 max-w-xs z-50"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-syntax-green">✓</span>
              <span className="font-semibold">Verified Skill</span>
            </div>
            <div className="text-editor-comment text-xs space-y-1">
              <div>Usage: <span className="text-syntax-cyan">{skill.years} Years</span></div>
              <div>Projects: <span className="text-syntax-orange">{skill.projects}</span></div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<'package.json' | 'projects.json'>('package.json');

  return (
    <section id="expertise" ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <span className="section-label text-xs sm:text-sm text-gray-500 font-mono tracking-widest">// 02 EXPERTISE</span>
          <h2 className="section-title mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-gray-900">package.json</h2>
        </motion.div>

        {/* Code editor window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="code-editor max-w-4xl overflow-hidden"
        >
          {/* Editor tabs */}
          <div className="flex items-center border-b border-editor-border bg-editor-surface overflow-x-auto">
            <button
              onClick={() => setActiveTab('package.json')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-mono text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'package.json'
                  ? 'bg-editor-bg text-editor-text border-t-2 border-syntax-cyan'
                  : 'text-editor-comment hover:text-editor-text'
              }`}
            >
              <span className="w-4 h-4 bg-syntax-orange/20 rounded flex items-center justify-center text-[10px]">
                📦
              </span>
              package.json
            </button>
            <button
              onClick={() => setActiveTab('projects.json')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-mono text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'projects.json'
                  ? 'bg-editor-bg text-editor-text border-t-2 border-syntax-cyan'
                  : 'text-editor-comment hover:text-editor-text'
              }`}
            >
              <span className="w-4 h-4 bg-syntax-purple/20 rounded flex items-center justify-center text-[10px]">
                🚀
              </span>
              projects.json
            </button>
          </div>

          {/* Editor content */}
          <div className="py-3 sm:py-4 overflow-x-auto">
            {activeTab === 'package.json' ? (
              <>
                <CodeLine lineNumber={1}>
                  <span className="syntax-bracket">{'{'}</span>
                </CodeLine>
                <CodeLine lineNumber={2}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"name"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}<span className="syntax-string">"sridhar-mani-portfolio"</span>
                    <span className="text-editor-comment">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={3}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"version"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}<span className="syntax-string">"2.0.0"</span>
                    <span className="text-editor-comment">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={4}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"dependencies"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}<span className="syntax-bracket">{'{'}</span>
                  </span>
                </CodeLine>

                {skills.map((skill, index) => (
                  <SkillLine key={skill.name} skill={skill} index={index} />
                ))}

                <CodeLine lineNumber={skills.length + 5}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-bracket">{'}'}</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={skills.length + 6}>
                  <span className="syntax-bracket">{'}'}</span>
                </CodeLine>
              </>
            ) : (
              <>
                {/* projects.json style content */}
                <CodeLine lineNumber={1}>
                  <span className="syntax-bracket">{'{'}</span>
                </CodeLine>
                <CodeLine lineNumber={2}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"author"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}<span className="syntax-string">"Sridhar Mani"</span>
                    <span className="text-editor-comment">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={3}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"github"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}
                    <a 
                      href="https://github.com/sridhar-mani" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="syntax-string hover:text-syntax-cyan underline decoration-dotted transition-colors"
                    >
                      "github.com/sridhar-mani"
                    </a>
                    <span className="text-editor-comment">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={4}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"projects"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}<span className="syntax-bracket">{'['}</span>
                  </span>
                </CodeLine>
                
                {/* Project 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <CodeLine lineNumber={5}>
                    <span className="text-editor-text">
                      {'    '}<span className="syntax-bracket">{'{'}</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={6}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"name"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}<span className="syntax-string">"AI-Powered Portfolio"</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={7}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"tech"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}<span className="syntax-bracket">[</span>
                      <span className="syntax-string">"React"</span>
                      <span className="text-editor-comment">,</span>
                      {' '}<span className="syntax-string">"Three.js"</span>
                      <span className="text-editor-comment">,</span>
                      {' '}<span className="syntax-string">"GSAP"</span>
                      <span className="syntax-bracket">]</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={8}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"repo"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}
                      <a 
                        href="https://github.com/sridhar-mani/sridhar-os" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="syntax-cyan hover:underline transition-colors"
                      >
                        "→ View on GitHub"
                      </a>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={9}>
                    <span className="text-editor-text">
                      {'    '}<span className="syntax-bracket">{'}'}</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                </motion.div>

                {/* Project 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <CodeLine lineNumber={10}>
                    <span className="text-editor-text">
                      {'    '}<span className="syntax-bracket">{'{'}</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={11}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"name"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}<span className="syntax-string">"LLM Chat Interface"</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={12}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"tech"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}<span className="syntax-bracket">[</span>
                      <span className="syntax-string">"Python"</span>
                      <span className="text-editor-comment">,</span>
                      {' '}<span className="syntax-string">"LangChain"</span>
                      <span className="text-editor-comment">,</span>
                      {' '}<span className="syntax-string">"FastAPI"</span>
                      <span className="syntax-bracket">]</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={13}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"repo"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}
                      <a 
                        href="https://github.com/sridhar-mani" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="syntax-cyan hover:underline transition-colors"
                      >
                        "→ View on GitHub"
                      </a>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={14}>
                    <span className="text-editor-text">
                      {'    '}<span className="syntax-bracket">{'}'}</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                </motion.div>

                {/* Project 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <CodeLine lineNumber={15}>
                    <span className="text-editor-text">
                      {'    '}<span className="syntax-bracket">{'{'}</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={16}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"name"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}<span className="syntax-string">"3D Medical Viewer"</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={17}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"tech"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}<span className="syntax-bracket">[</span>
                      <span className="syntax-string">"VTK.js"</span>
                      <span className="text-editor-comment">,</span>
                      {' '}<span className="syntax-string">"React"</span>
                      <span className="text-editor-comment">,</span>
                      {' '}<span className="syntax-string">"Python"</span>
                      <span className="syntax-bracket">]</span>
                      <span className="text-editor-comment">,</span>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={18}>
                    <span className="text-editor-text">
                      {'      '}<span className="syntax-key">"repo"</span>
                      <span className="text-editor-comment">:</span>
                      {' '}
                      <a 
                        href="https://github.com/sridhar-mani" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="syntax-cyan hover:underline transition-colors"
                      >
                        "→ View on GitHub"
                      </a>
                    </span>
                  </CodeLine>
                  <CodeLine lineNumber={19}>
                    <span className="text-editor-text">
                      {'    '}<span className="syntax-bracket">{'}'}</span>
                    </span>
                  </CodeLine>
                </motion.div>

                <CodeLine lineNumber={20}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-bracket">{']'}</span>
                    <span className="text-editor-comment">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={21}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"openSource"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}<span className="syntax-number">true</span>
                    <span className="text-editor-comment">,</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={22}>
                  <span className="text-editor-text">
                    {'  '}<span className="syntax-key">"hireable"</span>
                    <span className="text-editor-comment">:</span>
                    {' '}<span className="syntax-number">true</span>
                  </span>
                </CodeLine>
                <CodeLine lineNumber={23}>
                  <span className="syntax-bracket">{'}'}</span>
                </CodeLine>
              </>
            )}
          </div>

          {/* Editor footer */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-editor-surface border-t border-editor-border text-[10px] sm:text-xs font-mono text-editor-comment overflow-x-auto">
            <div className="flex items-center gap-2 sm:gap-4 whitespace-nowrap">
              <span className="flex items-center gap-1">
                <span className="text-syntax-cyan">↙</span> main*
              </span>
              <span className="flex items-center gap-1">
                <span className="text-syntax-green">⊘</span> 0 errors
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="text-syntax-orange">△</span> 0 warnings
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 sm:gap-4 whitespace-nowrap">
              <span>Ln 1, Col 1</span>
              <span>UTF-8</span>
              <span className="text-syntax-purple">TypeScript React</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
