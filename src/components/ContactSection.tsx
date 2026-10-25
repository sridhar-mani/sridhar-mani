import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

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

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [command, setCommand] = useState('');
  const [currentField, setCurrentField] = useState<'command' | 'email' | 'message' | 'done'>('command');
  const [terminalLines] = useState<TerminalLine[]>([
    { type: 'command', content: 'cat README.md', path: '~/contact' },
    { type: 'output', content: "# Let's build high-performance systems together" },
    { type: 'output', content: 'Available for AI/ML, 3D WebGPU, and Full-Stack Engineering roles.' },
    { type: 'output', content: 'Type "help" to see all commands or "email" to reach out directly.' },
    { type: 'output', content: '' },
  ]);
  const [submittedLines, setSubmittedLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    if (inputRef.current && currentField !== 'done') {
      inputRef.current.focus();
    }
  }, [currentField, submittedLines]);

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command) {
      const newLines = [...submittedLines, { type: 'command' as const, content: command, path: '~/contact' }];
      const cmd = command.trim().toLowerCase();

      let outputLines: TerminalLine[] = [];

      switch (cmd) {
        case 'help':
          outputLines = [
            { type: 'output', content: 'Available commands:' },
            { type: 'output', content: '  email     - Send me a direct message / inquiry' },
            { type: 'output', content: '  projects  - List active highlighted repositories' },
            { type: 'output', content: '  skills    - Print key technical proficiencies' },
            { type: 'output', content: '  socials   - Display LinkedIn, GitHub, and email' },
            { type: 'output', content: '  whoami    - Display current user context' },
            { type: 'output', content: '  clear     - Clear terminal buffer' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'projects':
          outputLines = [
            { type: 'output', content: 'Featured Repositories:' },
            { type: 'output', content: '  * npc-code        - Autonomous coding agent monorepo (CLI & VS Code)' },
            { type: 'output', content: '  * three-webgpu    - Three.js WebGPU offscreen worker renderer' },
            { type: 'output', content: '  * code-dcr        - PyTorch code structure deep learning model' },
            { type: 'output', content: '  * cfd-toolkit     - OpenFOAM simulation VTK.js viewer' },
            { type: 'output', content: '  * rn-sms-fetch    - Android New Arch TurboModule on NPM' },
            { type: 'output', content: '  * freepdf.rest    - Client-side WASM PDF editor' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'skills':
          outputLines = [
            { type: 'output', content: 'Technical Proficiencies:' },
            { type: 'output', content: '  Frontend:  TypeScript, React, Next.js, Three.js, WebGPU, WASM' },
            { type: 'output', content: '  Backend:   Python, PyTorch, FastAPI, Ollama, Node.js, Docker' },
            { type: 'output', content: '  Mobile:    React Native New Architecture, Android (Kotlin)' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'whoami':
          outputLines = [{ type: 'output', content: 'sridhar-mani@portfolio - Full Stack, AI & 3D Engineer' }];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'socials':
          outputLines = [
            { type: 'output', content: 'GitHub:   https://github.com/sridhar-mani' },
            { type: 'output', content: 'LinkedIn: https://linkedin.com/in/sridharmanimuthusamy' },
            { type: 'output', content: 'Email:    sridharmani510@gmail.com' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;

        case 'clear':
          setSubmittedLines([]);
          break;

        case 'email':
          setSubmittedLines([...newLines, { type: 'output', content: 'Please enter your email address:' }]);
          setCurrentField('email');
          break;

        default:
          outputLines = [{ type: 'output', content: `Command not found: "${cmd}". Type "help" for available commands.` }];
          setSubmittedLines([...newLines, ...outputLines]);
      }
      setCommand('');
    }
  };

  const handleEmailSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email) {
      setSubmittedLines((prev) => [
        ...prev,
        { type: 'input', content: email },
        { type: 'output', content: 'Now enter your message:' },
      ]);
      setCurrentField('message');
    }
  };

  const handleMessageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message) {
      const mailtoUrl = `mailto:sridharmani510@gmail.com?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${email}`
      )}&body=${encodeURIComponent(message)}`;

      // Automatically launch mail client
      window.location.href = mailtoUrl;

      setSubmittedLines((prev) => [
        ...prev,
        { type: 'input', content: message },
        { type: 'output', content: '' },
        { type: 'output', content: '> Launching your default email client...' },
        { type: 'output', content: `> Recipient: sridharmani510@gmail.com` },
        { type: 'output', content: `> Sender:    ${email}` },
        { type: 'output', content: '> ✓ Email client opened! Looking forward to connecting.' },
        { type: 'output', content: '' },
        { type: 'output', content: 'Type "help" for more commands.' },
      ]);
      setCurrentField('command');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="section-label text-xs sm:text-sm text-gray-500 font-mono tracking-widest">// 05 CONTACT</span>
          <h2 className="section-title mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-gray-900">terminal.sh</h2>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="terminal max-w-3xl mx-auto shadow-xl"
        >
          {/* Terminal header */}
          <div className="terminal-header">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="ide-dot ide-dot-red w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <div className="ide-dot ide-dot-yellow w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <div className="ide-dot ide-dot-green w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
            <span className="ml-3 sm:ml-4 font-mono text-xs sm:text-sm text-editor-comment truncate">
              user@portfolio:~/contact
            </span>
          </div>

          {/* Terminal body */}
          <div
            className="terminal-body min-h-[340px] max-h-[460px] overflow-y-auto font-mono text-xs sm:text-sm p-4 sm:p-6"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Initial lines */}
            {terminalLines.map((line, i) => (
              <div key={i} className="mb-2 leading-relaxed">
                {line.type === 'command' && (
                  <div className="flex items-center gap-2 text-syntax-cyan">
                    <span className="text-editor-comment">{line.path} $</span>
                    <span>{line.content}</span>
                  </div>
                )}
                {line.type === 'output' && (
                  <div className="text-editor-text pl-4 opacity-90">{line.content}</div>
                )}
              </div>
            ))}

            {/* Submitted history */}
            {submittedLines.map((line, i) => (
              <div key={`sub-${i}`} className="mb-2 leading-relaxed">
                {line.type === 'command' && (
                  <div className="flex items-center gap-2 text-syntax-cyan">
                    <span className="text-editor-comment">{line.path} $</span>
                    <span>{line.content}</span>
                  </div>
                )}
                {line.type === 'input' && (
                  <div className="text-syntax-green pl-4">▸ {line.content}</div>
                )}
                {line.type === 'output' && (
                  <div className="text-editor-text pl-4 opacity-90">{line.content}</div>
                )}
              </div>
            ))}

            {/* Active input prompt */}
            <div className="flex items-center gap-2 mt-3 text-syntax-cyan">
              <span className="text-editor-comment">
                {currentField === 'command'
                  ? '~/contact $'
                  : currentField === 'email'
                  ? 'enter email:'
                  : 'enter message:'}
              </span>
              <input
                ref={inputRef}
                type={currentField === 'email' ? 'email' : 'text'}
                value={
                  currentField === 'command'
                    ? command
                    : currentField === 'email'
                    ? email
                    : message
                }
                onChange={(e) => {
                  if (currentField === 'command') setCommand(e.target.value);
                  else if (currentField === 'email') setEmail(e.target.value);
                  else setMessage(e.target.value);
                }}
                onKeyDown={
                  currentField === 'command'
                    ? handleCommandSubmit
                    : currentField === 'email'
                    ? handleEmailSubmit
                    : handleMessageSubmit
                }
                className="flex-1 bg-transparent border-none outline-none font-mono text-editor-text text-xs sm:text-sm p-0 focus:ring-0"
                placeholder={
                  currentField === 'command'
                    ? 'type "email" or "help"...'
                    : currentField === 'email'
                    ? 'yourname@domain.com'
                    : 'your message here (press Enter to send)...'
                }
                autoFocus
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
