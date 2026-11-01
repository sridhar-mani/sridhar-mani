import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Check, Copy, ExternalLink, Github, Linkedin, FileText, Send, Terminal as TerminalIcon, MessageSquare } from 'lucide-react';

interface TerminalLine {
  type: 'command' | 'output' | 'input' | 'prompt' | 'link';
  content: string;
  path?: string;
  href?: string;
}

export const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const inputRef = useRef<HTMLInputElement>(null);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'terminal'>('form');

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // Terminal states
  const [command, setCommand] = useState('');
  const [terminalLines] = useState<TerminalLine[]>([
    { type: 'command', content: 'cat README.md', path: '~/contact' },
    { type: 'output', content: "# Let's build high-performance systems together" },
    { type: 'output', content: 'Available for AI/ML, 3D WebGPU, and Full-Stack Engineering roles.' },
    { type: 'output', content: 'Type "help" to see all available commands.' },
    { type: 'output', content: '' },
  ]);
  const [submittedLines, setSubmittedLines] = useState<TerminalLine[]>([]);

  const copyEmail = () => {
    navigator.clipboard.writeText('sridharmani510@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = formSubject ? `[Portfolio Contact] ${formSubject}` : `Portfolio Inquiry from ${formName || 'Recruiter'}`;
    const body = `Name: ${formName}\nEmail: ${formEmail}\n\nMessage:\n${formMessage}`;
    window.location.href = `mailto:sridharmani510@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command) {
      const newLines = [...submittedLines, { type: 'command' as const, content: command, path: '~/contact' }];
      const rawCmd = command.trim();
      const cmd = rawCmd.toLowerCase();
      const parts = cmd.split(' ');

      let outputLines: TerminalLine[] = [];

      if (parts[0] === 'pet' && parts[1]) {
        const petTarget = parts[1];
        const validPets = ['shiba', 'fox', 'crab', 'duck', 'clippy', 'totoro', 'zappy'];
        if (validPets.includes(petTarget)) {
          window.dispatchEvent(new CustomEvent('portfolio-pet-command', { detail: { petId: petTarget } }));
          outputLines = [
            { type: 'output', content: `> ✓ Switched active screen companion to: ${petTarget.toUpperCase()}` },
          ];
        } else {
          outputLines = [
            { type: 'output', content: `Unknown pet "${petTarget}". Available: ${validPets.join(', ')}` },
          ];
        }
        setSubmittedLines([...newLines, ...outputLines]);
        setCommand('');
        return;
      }

      switch (cmd) {
        case 'help':
          outputLines = [
            { type: 'output', content: 'Available terminal commands:' },
            { type: 'output', content: '  resume    - View and download latest resume (PDF)' },
            { type: 'output', content: '  email     - Open email client' },
            { type: 'output', content: '  agent     - Simulate autonomous coding agent runtime (LangGraph + Zenteiq)' },
            { type: 'output', content: '  fetch     - Throw tennis ball for screen pet to chase 🎾' },
            { type: 'output', content: '  pet <id>  - Switch companion (shiba, fox, crab, duck, clippy, totoro, zappy)' },
            { type: 'output', content: '  projects  - List active highlighted repositories' },
            { type: 'output', content: '  skills    - Print key technical proficiencies' },
            { type: 'output', content: '  socials   - Display LinkedIn, GitHub, and email' },
            { type: 'output', content: '  whoami    - Display current user context' },
            { type: 'output', content: '  clear     - Clear terminal history' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'fetch':
        case 'ball':
          window.dispatchEvent(new CustomEvent('portfolio-pet-command', { detail: { action: 'fetch' } }));
          outputLines = [
            { type: 'output', content: '> 🎾 Tennis ball thrown across the floor!' },
            { type: 'output', content: '> Watch your screen companion sprint to catch it!' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'agent':
          outputLines = [
            { type: 'output', content: '> Initializing Autonomous Agent Runtime (LangGraph + FastAPI)...' },
            { type: 'output', content: '> [Graph] Ingesting repository AST, symbol table & dependency graph...' },
            { type: 'output', content: '> [Tool] Vector DB retrieve: "WebGPU OffscreenCanvas worker architecture"' },
            { type: 'output', content: '> [Reasoning] Synthesizing zero-regression PyTorch patch...' },
            { type: 'output', content: '> [Verify] Running test suite: 42 passed, 0 failed in 0.38s' },
            { type: 'output', content: '> ✓ Agent workflow executed with 100% test coverage.' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'projects':
          outputLines = [
            { type: 'output', content: 'Featured Flagship Repositories:' },
            { type: 'output', content: '  * npc-code          - Autonomous coding agent monorepo (@npc/cli & VS Code)' },
            { type: 'output', content: '  * cadfusion         - Browser CAD & scene workspace (Three.js + OpenCascade + WebGPU)' },
            { type: 'output', content: '  * yugho             - Full-stack production e-commerce (Next.js + Postgres + PhonePe)' },
            { type: 'output', content: '  * dining-management - Multi-tenant restaurant SaaS (Next.js + Drizzle ORM + PWA)' },
            { type: 'output', content: '  * three-webgpu      - Three.js WebGPU offscreen worker renderer' },
            { type: 'output', content: '  * aidocs            - Desktop AI document retrieval & analysis app (Electron + RAG)' },
            { type: 'output', content: '  * code-dcr          - PyTorch code structure deep learning architecture' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'resume':
        case 'cv':
          if (typeof window !== 'undefined') {
            window.open(`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`, '_blank');
          }
          outputLines = [
            { type: 'output', content: '> Sridhar M - Software Engineer & AI Engineer (Oct 2026 Master Resume)' },
            { type: 'output', content: '> Direct download link: /Sridhar_M_Resume.pdf' },
            { type: 'output', content: '> Opened resume in a new browser tab! 📄' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'skills':
          outputLines = [
            { type: 'output', content: 'Technical Proficiencies:' },
            { type: 'output', content: '  Frontend:  TypeScript, React, Next.js, Three.js, WebGPU, WASM' },
            { type: 'output', content: '  Backend:   Python, PyTorch, LangGraph, FastAPI, Node.js, Docker' },
            { type: 'output', content: '  Geometry:  OpenCascade, Computational CAD, CFD Post-Processing' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'whoami':
          outputLines = [{ type: 'output', content: 'sridhar-mani@portfolio - AI Engineer @ Zenteiq' }];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'socials':
        case 'email':
          outputLines = [
            { type: 'output', content: 'Email:    sridharmani510@gmail.com' },
            { type: 'output', content: 'GitHub:   https://github.com/sridhar-mani' },
            { type: 'output', content: 'LinkedIn: https://linkedin.com/in/sridharmanimuthusamy' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'clear':
          setSubmittedLines([]);
          break;

        default:
          outputLines = [{ type: 'output', content: `Command not found: "${cmd}". Type "help" for available commands.` }];
          setSubmittedLines([...newLines, ...outputLines]);
      }
      setCommand('');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 sm:py-28 bg-white border-t border-slate-200/60 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <span className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-widest">// 05 INITIATE CONTACT</span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Let's Build Together
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Available for full-time AI/Systems engineering roles, high-performance contracts, and technical advisory.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Quick Actions */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1-Click Copy Email Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-600 mb-2">
                <Mail size={14} className="text-blue-600" />
                <span>DIRECT EMAIL</span>
              </div>
              
              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-mono text-sm sm:text-base font-semibold text-slate-900 truncate">
                  sridharmani510@gmail.com
                </span>
                <button
                  onClick={copyEmail}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors shrink-0"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>📍 Bangalore / Chennai, India</span>
                <span className="text-emerald-700 font-medium">⚡ Replies in &lt; 24h</span>
              </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://github.com/sridhar-mani"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all flex items-center gap-3 text-slate-700 hover:text-slate-900"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                  <Github size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">GitHub</div>
                  <div className="text-[11px] text-slate-600">@sridhar-mani</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/sridharmanimuthusamy/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-3 text-slate-700 hover:text-blue-600"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Linkedin size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">LinkedIn</div>
                  <div className="text-[11px] text-slate-600">Profile ↗</div>
                </div>
              </a>
            </div>

            {/* Resume Callout Card */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Oct 2026 Master Resume</div>
                  <div className="text-[11px] text-slate-600">Verified achievements & metrics</div>
                </div>
              </div>
              <a
                href={`${import.meta.env.BASE_URL}Sridhar_M_Resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                download="Sridhar_M_Resume.pdf"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors"
              >
                Download PDF
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Dual Form / Terminal */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Header Bar with View Toggle */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-100/80 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30 inline-block" />
                  <span className="ml-2 font-mono text-xs text-slate-600 font-medium">contact-hub</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg">
                  <button
                    onClick={() => setActiveTab('form')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'form'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare size={13} />
                    <span>Direct Message</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'terminal'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TerminalIcon size={13} />
                    <span>CLI Terminal</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Direct Message Form */}
              {activeTab === 'form' ? (
                <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Your Email</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="ada@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Subject / Opportunity</label>
                    <input
                      type="text"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="AI Systems Engineer Role / Collaboration"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Hi Sridhar, I came across your work on autonomous coding agents and WebGPU..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow"
                  >
                    <Send size={15} />
                    <span>Send Message Directly</span>
                  </button>
                </form>
              ) : (
                /* Tab 2: Clean Light Terminal */
                <div
                  className="p-6 font-mono text-xs sm:text-sm min-h-[320px] max-h-[380px] overflow-y-auto bg-slate-50 cursor-text"
                  onClick={() => inputRef.current?.focus()}
                >
                  {terminalLines.map((line, i) => (
                    <div key={i} className="mb-2 leading-relaxed">
                      {line.type === 'command' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <span className="text-slate-400">{line.path} $</span>
                          <span className="font-semibold text-slate-900">{line.content}</span>
                        </div>
                      )}
                      {line.type === 'output' && (
                        <div className="text-slate-600 pl-4">{line.content}</div>
                      )}
                    </div>
                  ))}

                  {submittedLines.map((line, i) => (
                    <div key={`sub-${i}`} className="mb-2 leading-relaxed">
                      {line.type === 'command' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <span className="text-slate-400">{line.path} $</span>
                          <span className="font-semibold text-slate-900">{line.content}</span>
                        </div>
                      )}
                      {line.type === 'output' && (
                        <div className="text-slate-700 pl-4">{line.content}</div>
                      )}
                    </div>
                  ))}

                  {/* Active prompt */}
                  <div className="flex items-center gap-2 mt-3 text-blue-600">
                    <span className="text-slate-400">~/contact $</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyDown={handleCommandSubmit}
                      placeholder='type "help"'
                      className="flex-1 bg-transparent border-none outline-none font-mono text-slate-900 text-xs sm:text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
