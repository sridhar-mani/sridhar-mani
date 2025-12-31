import * as Comlink from "comlink";

interface JobAnalysisResult {
  matchedSkills: string[];
  missingSkills: string[];
  fitScore: number;
  summary: string;
}

interface AIWorkerAPI {
  initEngine: () => Promise<boolean>;
  reply: () => Promise<{ choices: Array<{ message: { content: string } }> }>;
  changeMsg: (params: { cusMsg: string }) => void;
  getProgress: () => number;
  indexDocument: (text: string, source: string) => Promise<number>;
  analyzeJobFit: (jobDescription: string) => Promise<JobAnalysisResult>;
  getIndexedSources: () => Promise<string[]>;
}

let worker: Worker | null = null;
let aiWorker: Comlink.Remote<AIWorkerAPI> | null = null;

export function getAIWorker(): Comlink.Remote<AIWorkerAPI> {
  if (!worker) {
    worker = new Worker(new URL("./webLLM.ts", import.meta.url), {
      type: "module",
    });
    aiWorker = Comlink.wrap<AIWorkerAPI>(worker);
  }
  return aiWorker!;
}

export async function initAI(): Promise<boolean> {
  const ai = getAIWorker();
  return await ai.initEngine();
}

export async function getReply(message: string): Promise<string> {
  const ai = getAIWorker();
  await ai.changeMsg({ cusMsg: message });
  const response = await ai.reply();
  return response.choices[0].message.content;
}

export async function getInitProgress(): Promise<number> {
  const ai = getAIWorker();
  return await ai.getProgress();
}

export async function indexDocument(text: string, source: string): Promise<number> {
  const ai = getAIWorker();
  return await ai.indexDocument(text, source);
}

export async function analyzeJobFit(jobDescription: string): Promise<JobAnalysisResult> {
  const ai = getAIWorker();
  return await ai.analyzeJobFit(jobDescription);
}

export async function getIndexedSources(): Promise<string[]> {
  const ai = getAIWorker();
  return await ai.getIndexedSources();
}

export type { JobAnalysisResult };
