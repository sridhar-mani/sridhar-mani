import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface TerminalLine {
  type: 'command' | 'output' | 'input' | 'prompt';
  content: string;
  path?: string;
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
    { type: 'output', content: "# Let's build something amazing together" },
    { type: 'output', content: 'Available for AI/ML roles & select freelance projects.' },
    { type: 'output', content: 'Type "help" to see available commands or "email" to contact me.' },
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
            { type: 'output', content: '  email    - Send me a message' },
            { type: 'output', content: '  socials  - List social media links' },
            { type: 'output', content: '  whoami   - Display current user' },
            { type: 'output', content: '  clear    - Clear terminal history' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;
        case 'whoami':
          outputLines = [{ type: 'output', content: 'guest@portfolio' }];
          setSubmittedLines([...newLines, ...outputLines]);
          break;
        case 'socials':
          outputLines = [
            { type: 'output', content: 'GitHub: github.com/sridhar-mani' },
            { type: 'output', content: 'LinkedIn: linkedin.com/in/sridhar-m-b4557b286' },
            { type: 'output', content: 'Email: sridharmani510@gmail.com' },
          ];
          setSubmittedLines([...newLines, ...outputLines]);
          break;
        case 'clear':
          setSubmittedLines([]);
          break;
        case 'email':
          setSubmittedLines([...newLines]);
          setCurrentField('email');
          break;
        default:
          outputLines = [{ type: 'output', content: `Command not found: ${cmd}. Type "help" for a list of commands.` }];
          setSubmittedLines([...newLines, ...outputLines]);
      }
      setCommand('');
    }
  };

  const handleEmailSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email) {
      setSubmittedLines(prev => [...prev, { type: 'input', content: email }]);
      setCurrentField('message');
    }
  };

  const handleMessageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message) {
      setSubmittedLines(prev => [
        ...prev,
        { type: 'input', content: message },
        { type: 'output', content: '' },
        { type: 'output', content: '> Message queued for delivery...' },
        { type: 'output', content: '> ✓ Connection established' },
        { type: 'output', content: '> ✓ Message sent successfully!' },
        { type: 'output', content: '' },
        { type: 'output', content: "Thanks for reaching out! I'll get back to you soon." },
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
          className="terminal max-w-3xl mx-auto"
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
          <div className="terminal-body space-y-2 sm:space-y-3 text-xs sm:text-sm p-4 sm:p-6">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 }}
              >
                {line.type === 'command' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="terminal-prompt">→</span>
                    <span className="terminal-path">{line.path}</span>
                    <span className="terminal-command">{line.content}</span>
                  </div>
                )}
                {line.type === 'output' && (
                  <div className="text-terminal-text pl-4 sm:pl-6">{line.content}</div>
                )}
              </motion.div>
            ))}

            {/* Submitted lines */}
            {submittedLines.map((line, index) => (
              <div key={`submitted-${index}`}>
                {line.type === 'command' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="terminal-prompt">→</span>
                    <span className="terminal-path">{line.path}</span>
                    <span className="terminal-command">{line.content}</span>
                  </div>
                )}
                {line.type === 'input' && (
                  <div className="text-syntax-cyan pl-4 sm:pl-6">{line.content}</div>
                )}
                {line.type === 'output' && (
                  <div className="text-terminal-text pl-4 sm:pl-6">{line.content}</div>
                )}
              </div>
            ))}

            {/* Input prompts */}
            {currentField === 'command' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="terminal-prompt">→</span>
                <span className="terminal-path">~/contact</span>
                <div className="flex-1 flex items-center gap-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleCommandSubmit}
                    placeholder="type a command..."
                    className="flex-1 bg-transparent font-mono text-xs sm:text-sm outline-none border-none p-0 focus:ring-0 min-w-0 placeholder:text-gray-400 caret-cyan-500"
                    style={{ color: '#1e293b', caretColor: '#06b6d4' }}
                    autoFocus
                  />
                  <span className="animate-blink text-cyan-500 shrink-0">▋</span>
                </div>
              </motion.div>
            )}

            {currentField === 'email' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="text-editor-comment">Enter your email:</div>
                <div className="flex items-center gap-2 bg-editor-line/50 rounded px-2 sm:px-3 py-2">
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleEmailSubmit}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent text-syntax-cyan font-mono text-xs sm:text-sm outline-none placeholder:text-editor-comment min-w-0"
                  />
                  <span className="animate-blink text-syntax-cyan shrink-0">▋</span>
                </div>
              </motion.div>
            )}

            {currentField === 'message' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="text-editor-comment">Enter your message:</div>
                <div className="flex items-center gap-2 bg-editor-line/50 rounded px-2 sm:px-3 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleMessageSubmit}
                    placeholder="Hello, I'd like to discuss..."
                    className="flex-1 bg-transparent text-syntax-cyan font-mono text-xs sm:text-sm outline-none placeholder:text-editor-comment min-w-0"
                  />
                  <span className="animate-blink text-syntax-cyan shrink-0">▋</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Alternative contact methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-8 sm:mt-12"
        >
          <a
            href="mailto:sridharmani510@gmail.com"
            className="font-mono text-xs sm:text-sm text-muted-foreground hover:text-syntax-cyan transition-colors"
          >
            sridharmani510@gmail.com
          </a>
          <span className="text-border hidden sm:inline">|</span>
          <a
            href="https://www.linkedin.com/in/sridhar-m-b4557b286/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs sm:text-sm text-muted-foreground hover:text-syntax-cyan transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-border hidden sm:inline">|</span>
          <a
            href="https://github.com/sridhar-mani"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs sm:text-sm text-muted-foreground hover:text-syntax-cyan transition-colors"
          >
            GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
};
