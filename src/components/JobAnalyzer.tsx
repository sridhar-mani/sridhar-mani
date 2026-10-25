import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Search, CheckCircle2, XCircle, Sparkles, Loader2, ArrowLeft, FileUp } from 'lucide-react';
import { extractTextFromPDF, parseJobDescription, matchSkills } from '@/utils/pdfExtractor';
import { analyzeJobFit, indexDocument, getIndexedSources, JobAnalysisResult } from '@/utils/aiWorker';

interface JobAnalyzerProps {
  onBack: () => void;
  isAIReady: boolean;
}

// Comprehensive Profile skills for local matching (synchronized with Sridhar's latest profile)
const PROFILE_SKILLS = [
  'python', 'typescript', 'javascript', 'react', 'next.js', 'vue',
  'fastapi', 'flask', 'django', 'node', 'langchain', 'langgraph',
  'agents', 'agentic', 'agentic workflows', 'workflow orchestration',
  'pytorch', 'deep learning', 'machine learning', 'ai', 'ml', 'llm', 'rag',
  'three.js', 'webgpu', 'webgl', 'vtk.js', 'vtk', 'cfd', 'simulation', 'openfoam',
  'docker', 'sql', 'postgresql', 'sqlite', 'redis', 'chromadb', 'tailwind',
  'ollama', 'socket.io', 'rest', 'api', 'graphql', 'wasm', 'webassembly',
  'react native', 'turbomodule', 'mobile', 'git', 'ci/cd'
];

export const JobAnalyzer = ({ onBack, isAIReady }: JobAnalyzerProps) => {
  const [mode, setMode] = useState<'input' | 'analyzing' | 'results'>('input');
  const [jobText, setJobText] = useState('');
  const [quickResult, setQuickResult] = useState<ReturnType<typeof matchSkills> | null>(null);
  const [aiResult, setAiResult] = useState<JobAnalysisResult | null>(null);
  const [isUsingAI, setIsUsingAI] = useState(false);
  const [indexedSources, setIndexedSources] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await extractTextFromPDF(file);
      setJobText(text);
    } catch (error) {
      console.error('Failed to extract PDF text:', error);
      alert('Failed to read PDF. Please try pasting the text directly.');
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await extractTextFromPDF(file);
      const count = await indexDocument(text, file.name);
      alert(`Indexed ${count} sections from ${file.name}`);
      loadIndexedSources();
    } catch (error) {
      console.error('Failed to index resume:', error);
      alert('Failed to index resume PDF.');
    }
  };

  const loadIndexedSources = async () => {
    try {
      const sources = await getIndexedSources();
      setIndexedSources(sources);
    } catch {
      setIndexedSources([]);
    }
  };

  const analyzeQuick = () => {
    if (!jobText.trim()) return;

    setMode('analyzing');
    setIsUsingAI(false);

    // Quick local analysis
    setTimeout(() => {
      const parsed = parseJobDescription(jobText);
      const result = matchSkills(parsed.skills, PROFILE_SKILLS);
      setQuickResult(result);
      setMode('results');
    }, 450);
  };

  const analyzeWithAI = async () => {
    if (!jobText.trim() || !isAIReady) return;

    setMode('analyzing');
    setIsUsingAI(true);

    try {
      const result = await analyzeJobFit(jobText);
      setAiResult(result);
      setMode('results');
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to quick analysis
      analyzeQuick();
    }
  };

  const currentResult = isUsingAI ? aiResult : quickResult;
  const fitScore = isUsingAI ? aiResult?.fitScore : quickResult?.score;
  const matched = isUsingAI ? aiResult?.matchedSkills : quickResult?.matched;
  const missing = isUsingAI ? aiResult?.missingSkills : quickResult?.missing;

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="font-semibold text-gray-800 text-sm">Job Fit Analyzer</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={resumeInputRef}
            onChange={handleResumeUpload}
            accept=".pdf"
            className="hidden"
          />
          <button
            onClick={() => resumeInputRef.current?.click()}
            className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1 font-medium bg-cyan-50 px-2 py-1 rounded"
            title="Index custom resume document for deeper analysis"
          >
            <FileUp size={12} />
            + Custom Resume
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {mode === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Paste Job Description or Requirements:
                </label>
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste job description (skills, requirements, role specs)..."
                  className="w-full h-40 p-3 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/50 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* PDF upload alternative */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 border border-gray-300 border-dashed rounded-xl text-xs text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload size={14} />
                  Upload Job Spec PDF
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={analyzeQuick}
                  disabled={!jobText.trim()}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Search size={14} />
                  Quick Match (Instant)
                </button>
                <button
                  onClick={analyzeWithAI}
                  disabled={!jobText.trim() || !isAIReady}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles size={14} />
                  AI RAG Match
                </button>
              </div>

              {!isAIReady && (
                <p className="text-[10px] text-gray-400 text-center">
                  * Initialize AI chat tab first to enable deep LLM analysis
                </p>
              )}
            </motion.div>
          )}

          {mode === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center py-12 space-y-3"
            >
              <Loader2 size={32} className="text-cyan-500 animate-spin" />
              <p className="text-sm font-medium text-gray-700">
                {isUsingAI ? 'Vector RAG analyzing candidate fit...' : 'Parsing skills and calculating match...'}
              </p>
              <p className="text-xs text-gray-500">Comparing profile against requirements</p>
            </motion.div>
          )}

          {mode === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Score circle */}
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-mono">FIT COMPATIBILITY</span>
                  <div className="text-2xl font-bold font-mono text-gray-900 mt-0.5">
                    {fitScore}%
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    {isUsingAI ? (aiResult?.summary || 'Analysis complete') : quickResult ? `${quickResult.matched.length} matched skills` : ''}
                  </p>
                </div>
                <div className="relative w-14 h-14">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3.5"
                      strokeDasharray={`${fitScore || 0}, 100`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Matched skills */}
              <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-2">
                  <CheckCircle2 size={14} />
                  <span>Strong Matching Skills ({matched?.length || 0})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matched && matched.length > 0 ? (
                    matched.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-mono"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">None detected directly</span>
                  )}
                </div>
              </div>

              {/* Missing skills */}
              {missing && missing.length > 0 && (
                <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-2">
                    <XCircle size={14} />
                    <span>Unmatched / Secondary Requirements ({missing.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset button */}
              <button
                onClick={() => setMode('input')}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium transition-colors"
              >
                Analyze Another Job
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
