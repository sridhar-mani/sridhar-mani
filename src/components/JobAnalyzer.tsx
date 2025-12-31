import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Search, CheckCircle2, XCircle, Sparkles, Loader2, ArrowLeft, FileUp } from 'lucide-react';
import { extractTextFromPDF, parseJobDescription, matchSkills } from '@/utils/pdfExtractor';
import { analyzeJobFit, indexDocument, getIndexedSources, JobAnalysisResult } from '@/utils/aiWorker';

interface JobAnalyzerProps {
  onBack: () => void;
  isAIReady: boolean;
}

// Profile skills for local matching
const PROFILE_SKILLS = [
  'react', 'typescript', 'javascript', 'python', 'vue', 'next.js',
  'fastapi', 'flask', 'django', 'node', 'postgresql', 'mongodb',
  'docker', 'git', 'tailwind', 'three.js', 'webgl', 'vtk.js',
  'machine learning', 'ai', 'ml', 'langchain', 'chromadb', 'rag',
  'react native', 'mobile', 'rest', 'api', 'graphql',
  'cfd', 'simulation', 'openfoam'
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
    }, 500);
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

  const reset = () => {
    setMode('input');
    setJobText('');
    setQuickResult(null);
    setAiResult(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h3 className="font-semibold text-gray-900">Job Analyzer</h3>
          <p className="text-xs text-gray-500">Check if I'm a good fit</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {mode === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Job Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-40 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none"
                />
              </div>

              {/* Upload JD PDF */}
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Upload size={16} />
                  Upload JD PDF
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-cyan-200 rounded-xl text-sm text-cyan-600 hover:bg-cyan-50 transition-colors"
                >
                  <FileUp size={16} />
                  Add Resume
                </button>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </div>

              {/* Indexed Sources */}
              {indexedSources.length > 0 && (
                <div className="bg-cyan-50 p-3 rounded-xl">
                  <p className="text-xs font-medium text-cyan-800 mb-1">Indexed Documents:</p>
                  <div className="flex flex-wrap gap-1">
                    {indexedSources.map((source, i) => (
                      <span key={i} className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={analyzeQuick}
                  disabled={!jobText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  <Search size={16} />
                  Quick Scan
                </button>
                <button
                  onClick={analyzeWithAI}
                  disabled={!jobText.trim() || !isAIReady}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:shadow-lg transition-all"
                >
                  <Sparkles size={16} />
                  AI Analysis
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 size={40} className="text-cyan-500 animate-spin mb-4" />
              <p className="text-sm text-gray-600">
                {isUsingAI ? 'AI is analyzing the job fit...' : 'Scanning for skill matches...'}
              </p>
            </motion.div>
          )}

          {mode === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Score */}
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 mb-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {aiResult?.fitScore ?? quickResult?.score ?? 0}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">Skill Match Score</p>
              </div>

              {/* Matched Skills */}
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">Matched Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(aiResult?.matchedSkills || quickResult?.matched || []).map((skill, i) => (
                    <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">
                      {skill}
                    </span>
                  ))}
                  {(aiResult?.matchedSkills || quickResult?.matched || []).length === 0 && (
                    <span className="text-xs text-green-600">No specific matches found</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className="text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Skills to Highlight</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(aiResult?.missingSkills || quickResult?.missing || []).map((skill, i) => (
                    <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full capitalize">
                      {skill}
                    </span>
                  ))}
                  {(aiResult?.missingSkills || quickResult?.missing || []).length === 0 && (
                    <span className="text-xs text-orange-600">All required skills covered!</span>
                  )}
                </div>
              </div>

              {/* AI Summary */}
              {aiResult?.summary && (
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">AI Assessment</span>
                  </div>
                  <p className="text-sm text-purple-700">{aiResult.summary}</p>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={reset}
                className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Analyze Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
