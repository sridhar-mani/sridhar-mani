import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, CheckCircle2, Cpu, Layers, ShieldCheck, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

interface TraceStep {
  label: string;
  detail: string;
  status: 'pending' | 'running' | 'done';
}

const INITIAL_STEPS: TraceStep[] = [
  { label: 'AST-Grep Parser', detail: 'Indexed 142 source files • Symbol graph resolved', status: 'done' },
  { label: 'LangGraph Router', detail: 'Stateful agent graph selected: test-driven patch synthesis', status: 'done' },
  { label: 'Tool Calling Execution', detail: 'Grep symbol AST radius • Injected zero-regression guard', status: 'done' },
  { label: 'Sandbox Qualification', detail: '18/18 unit tests passed in 0.38s • Clean patch applied', status: 'done' },
];

const STACK_ITEMS = [
  { name: 'LangGraph & ReAct', desc: 'Stateful multi-agent orchestrations with deterministic fallbacks', tag: 'Agent Core' },
  { name: 'Python & FastAPI', desc: 'High-throughput async backends & numerical processing microservices', tag: 'Backend' },
  { name: 'Next.js & TypeScript', desc: 'Modern responsive full-stack architectures & design systems', tag: 'Full-Stack' },
  { name: 'PostgreSQL & Drizzle', desc: 'Reliable transactional persistence & server-authoritative workflows', tag: 'Database' },
  { name: 'PyTorch & CUDA', desc: 'Deep learning structural modeling & code representation research', tag: 'AI/ML' },
];

export const HeroAgentSandbox = () => {
  const [activeTab, setActiveTab] = useState<'trace' | 'stack' | 'terminal'>('trace');
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<TraceStep[]>(INITIAL_STEPS);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npc status --agent=zenteiq-core',
    '✓ Agent Runtime: Online (v0.4.2)',
    '✓ AST Blast-Radius Engine: Armed',
    '✓ Memory Store: Vector + LangGraph State',
    'Click a command chip below to execute.',
  ]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);

    const simulationSequence = [
      { label: 'Workspace Ingestion', detail: 'Scanning AST symbol table across active repos...', status: 'running' as const },
      { label: 'Agent Policy Graph', detail: 'LangGraph evaluating fail-closed qualification constraints...', status: 'pending' as const },
      { label: 'Deterministic Tooling', detail: 'Generating type-safe patch with zero hallucination...', status: 'pending' as const },
      { label: 'Automated Test Suite', detail: 'Running isolated test runner in worker sandbox...', status: 'pending' as const },
    ];

    setSteps(simulationSequence);

    // Step 1
    setTimeout(() => {
      setSteps((prev) => [
        { ...prev[0], status: 'done', detail: 'Indexed 186 symbols • AST dependency tree mapped' },
        { ...prev[1], status: 'running' },
        prev[2],
        prev[3],
      ]);
    }, 600);

    // Step 2
    setTimeout(() => {
      setSteps((prev) => [
        prev[0],
        { ...prev[1], status: 'done', detail: 'Multi-turn ReAct path verified • Prompt constraints qualified' },
        { ...prev[2], status: 'running' },
        prev[3],
      ]);
    }, 1300);

    // Step 3
    setTimeout(() => {
      setSteps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'done', detail: 'AST diff synthesized cleanly • 0 syntactic regressions' },
        { ...prev[3], status: 'running' },
      ]);
    }, 2000);

    // Step 4
    setTimeout(() => {
      setSteps([
        { label: 'Workspace Ingestion', detail: 'Indexed 186 symbols • AST dependency tree mapped', status: 'done' },
        { label: 'Agent Policy Graph', detail: 'Multi-turn ReAct path verified • Prompt constraints qualified', status: 'done' },
        { label: 'Deterministic Tooling', detail: 'AST diff synthesized cleanly • 0 syntactic regressions', status: 'done' },
        { label: 'Automated Test Suite', detail: '24/24 unit tests passed in 0.29s • Ready for production deployment', status: 'done' },
      ]);
      setIsRunning(false);
    }, 2700);
  };

  const handleCommand = (cmd: string) => {
    let response: string[] = [];
    switch (cmd) {
      case 'bio':
        response = [
          '$ cat bio.md',
          'Sridhar Mani — AI Engineer at Zenteiq Aitech Innovations.',
          'Specialist in autonomous coding agents, stateful multi-agent graphs, and scalable full-stack applications.',
          'Education: IIT Madras (Data Science & Programming) & Anna University (B.Tech).',
        ];
        break;
      case 'flagship':
        response = [
          '$ npc list --flagship',
          '1. NPC Code — Autonomous coding agent monorepo (CLI & VS Code extension)',
          '2. CADFusion — AI-assisted CAD & simulation workspace with OCCT WASM kernel',
          '3. YUGHO — Full-stack production e-commerce platform with PhonePe & NimbusPost',
        ];
        break;
      case 'stack':
        response = [
          '$ stack --inspect',
          'AI/ML: LangGraph, Python, FastAPI, PyTorch, Vector Search, Local LLMs',
          'Full-Stack: TypeScript, Next.js, React, Node.js, PostgreSQL, Drizzle ORM',
          'Performance: WebAssembly, Docker, Linux, CI/CD',
        ];
        break;
      case 'contact':
        response = [
          '$ echo $CONTACT',
          'Email: sridharmani510@gmail.com',
          'LinkedIn: linkedin.com/in/sridharmanimuthusamy',
          'GitHub: github.com/sridhar-mani',
        ];
        break;
      default:
        response = [`$ ${cmd}`, 'Command executed successfully.'];
    }
    setTerminalOutput(response);
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all">
      {/* Sleek Command Deck Top Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <div className="ml-2 flex items-center gap-2 font-mono text-[11px] text-slate-300 font-semibold tracking-wide">
            <Terminal size={13} className="text-emerald-400" />
            <span>npc-agent-core</span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              LIVE
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('trace')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-medium transition-all ${
              activeTab === 'trace'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Agent Trace
          </button>
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-medium transition-all ${
              activeTab === 'stack'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stack Matrix
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-medium transition-all ${
              activeTab === 'terminal'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CLI Shell
          </button>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="p-5 sm:p-6 min-h-[310px] flex flex-col justify-between font-mono text-xs">
        {/* Tab 1: Agent Trace Live Simulation */}
        {activeTab === 'trace' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-slate-300 font-sans font-semibold text-sm">
                <Sparkles size={15} className="text-blue-400" />
                <span>Autonomous Agent Execution Pipeline</span>
              </div>
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-mono text-[11px] font-semibold transition-all shadow-sm active:scale-95"
              >
                {isRunning ? (
                  <>
                    <RefreshCw size={12} className="animate-spin text-blue-300" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60"
                >
                  <div className="mt-0.5">
                    {step.status === 'done' && (
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    )}
                    {step.status === 'running' && (
                      <RefreshCw size={15} className="text-amber-400 animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 block mt-0.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-200 text-xs">{step.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono">0{i + 1}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5 truncate">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Stack Matrix */}
        {activeTab === 'stack' && (
          <div className="space-y-2.5">
            <div className="text-slate-400 text-xs pb-1 border-b border-slate-800/80 font-sans font-medium">
              Core Engineering Architecture & Production Tooling:
            </div>
            <div className="space-y-2 pt-1">
              {STACK_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div>
                    <span className="text-slate-200 font-semibold block text-xs">{item.name}</span>
                    <span className="text-slate-400 text-[11px] font-sans">{item.desc}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-blue-400 text-[10px] font-semibold border border-slate-700 whitespace-nowrap">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Interactive CLI Shell */}
        {activeTab === 'terminal' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 min-h-[170px]">
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('$')
                      ? 'text-emerald-400 font-semibold'
                      : line.startsWith('✓')
                      ? 'text-blue-400'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Quick Command Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-slate-500 text-[11px] mr-1">Quick Run:</span>
              {[
                { label: 'bio.md', cmd: 'bio' },
                { label: 'flagship repos', cmd: 'flagship' },
                { label: 'full stack', cmd: 'stack' },
                { label: 'contact info', cmd: 'contact' },
              ].map((chip) => (
                <button
                  key={chip.cmd}
                  onClick={() => handleCommand(chip.cmd)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors border border-slate-700/80 flex items-center gap-1"
                >
                  <span>{chip.label}</span>
                  <ArrowRight size={10} className="text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Agent Telemetry: Synchronized</span>
          </div>
          <div className="flex items-center gap-3">
            <span>LangGraph • Fast-Path AST</span>
            <span>0ms main-thread lag</span>
          </div>
        </div>
      </div>
    </div>
  );
};
