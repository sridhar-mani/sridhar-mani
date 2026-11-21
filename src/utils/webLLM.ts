/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateMLCEngine, MLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";
import { initializeModel, EmbeddingIndex } from "client-vector-search";
import * as Comlink from "comlink";
import { env, FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { profileSridhar } from "../data/profileData";
import { simpleHash } from "./simpleHash";

// Models in order of preference; the first one this device can load is used. The order comes from an
// on-device benchmark of grounded Q&A on this site's own knowledge base, not from model names.
const MODEL_CHAIN: string[] = [
  "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
  "Llama-3.2-1B-Instruct-q4f32_1-MLC",
];
let activeModel = MODEL_CHAIN[0];

// Qwen3-family and MiniCPM5 models can emit "thinking" tokens; WebLLM can switch that off for them.
const thinkingFamily = (id: string) => /^(Qwen3|MiniCPM5)/.test(id);
const extraFor = (id: string): Record<string, unknown> => (thinkingFamily(id) ? { extra_body: { enable_thinking: false } } : {});
const stripThink = (t: string) => t.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<\/?think>/g, "").trim();

const ANSWER_RULES = `You are the assistant on Sridhar Mani's portfolio website. Answer questions about Sridhar using ONLY the information below. Be concise: 1 to 3 short sentences. Refer to him as "Sridhar". If the information does not contain the answer, say you don't have that information and suggest emailing sridharmani510@gmail.com. Never guess or invent details.`;

async function getAppConfig() {
  return { ...prebuiltAppConfig, cacheBackend: "indexeddb" } as any;
}

let engine: MLCEngine | null = null;
let mydetailsIndex: EmbeddingIndex | null = null;
let embeddingPipeline: FeatureExtractionPipeline | null = null;
let initProgress = 0;

const initProgressCallback = Comlink.proxy(({ progress, text }: { progress: number; text?: string }) => {
  initProgress = progress;
  console.log(`Initialization Progress: ${(progress * 100).toFixed(1)}% ${text ? `- ${text}` : ''}`);
});

const messages: Array<{ role: string; content: string }> = [
  {
    role: "system",
    content: `You are Sridhar Mani, an AI Engineer at Zenteiq Aitech Innovations (previously Associate Software Engineer at NovaCast India). You specialize in stateful workflow orchestration (LangGraph), autonomous coding agents, WebGPU/Three.js 3D pipelines, and high-performance full-stack engineering. When users ask about your background, skills, or projects, answer naturally, professionally, and concisely as yourself.`,
  },
  { role: "user", content: "Hello!" },
];

const changeMsg = ({ cusMsg }: { cusMsg: string }) => {
  messages[1].content = cusMsg;
};

const getProgress = () => {
  return initProgress;
};

async function customEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    await initEmbeddingModel();
  }

  const formattedText =
    text.startsWith("query: ") || text.startsWith("passage: ")
      ? text
      : `passage: ${text}`;

  const result = await embeddingPipeline!(formattedText, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(result.data as Float32Array);
}

async function initEmbeddingModel() {
  try {
    env.allowLocalModels = false;
    env.useBrowserCache = true;

    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/e5-small-v2",
      { quantized: true }
    ) as FeatureExtractionPipeline;

    console.log("Embedding model loaded successfully");
  } catch (error) {
    console.error("Failed to load embedding model:", error);
    throw error;
  }
}

async function embedProfile(profileText: string) {
  if (!mydetailsIndex) return;

  const filteredParagraphs = profileText
    .split(/\n(?=##\s)/g)
    .map((s) => s.trim())
    .map((s) => s.replace(/^##\s*/, ""))
    .filter((s) => s.length > 0);

  let existingDb: any[] = [];
  try {
    existingDb = (await mydetailsIndex.getAllObjectsFromIndexedDB(
      "ragIndexedDB_v2",
      "ragDB"
    )) || [];
  } catch {
    existingDb = [];
  }

  for (let i = 0; i < filteredParagraphs.length; i++) {
    const para = filteredParagraphs[i].trim();
    const uniqueId = `profile_${simpleHash(para)}`;

    if (existingDb && existingDb.some((item: any) => item.id === uniqueId)) {
      continue;
    }

    const embedding = await customEmbedding(para);
    mydetailsIndex.add({
      id: uniqueId,
      name: "Profile",
      text: para,
      embedding: embedding,
    });

    existingDb.push({
      id: uniqueId,
      name: "Profile",
      text: para,
      embedding: embedding,
    });
  }

  await mydetailsIndex.saveToIndexedDB("ragIndexedDB_v2", "ragDB");
  console.log("Profile embedded and saved to IndexedDB");
}

async function initEngine() {
  try {
    console.log(`Initializing LLM engine...`);
    const appConfig = await getAppConfig();

    const candidates = MODEL_CHAIN.filter((id) => appConfig.model_list?.some((m: any) => m.model_id === id));
    let lastError: unknown = null;
    for (const id of candidates) {
      try {
        engine = await CreateMLCEngine(id, { initProgressCallback: initProgressCallback, appConfig: appConfig });
        activeModel = id;
        break;
      } catch (error) {
        lastError = error;
        console.warn(`Could not load ${id}, trying the next model`, error);
      }
    }
    if (!engine) throw lastError ?? new Error("No model in the chain could be loaded");

    console.log(`LLM engine initialized with ${activeModel}`);

    await initEmbeddingModel();

    mydetailsIndex = new EmbeddingIndex([]);
    initializeModel();

    if (profileSridhar) {
      let existingDb: any[] = [];
      try {
        existingDb = (await mydetailsIndex.getAllObjectsFromIndexedDB(
          "ragIndexedDB_v2",
          "ragDB"
        )) || [];
      } catch {
        existingDb = [];
      }

      if (!existingDb || existingDb.length === 0) {
        console.log("Embedding profile for the first time...");
        await embedProfile(profileSridhar);
      }
    }

    return true;
  } catch (error) {
    console.error("Engine initialization failed:", error);
    throw error;
  }
}

async function reply() {
  if (!engine) {
    await initEngine();
  }

  const queryTxt = messages[1].content;
  let retrievedContext = "";

  try {
    const queryEmbed = await customEmbedding(`query: ${queryTxt}`);

    if (mydetailsIndex) {
      const searchResults = await mydetailsIndex.search(queryEmbed, {
        useStorage: "indexedDB",
        topK: 4,
        storageOptions: {
          indexedDBName: "ragIndexedDB_v2",
          indexedDBObjectStoreName: "ragDB",
        },
      });

      retrievedContext = searchResults
        .map((result: any) => result.object.text)
        .join("\n\n");
    }
  } catch (error) {
    console.error("RAG search failed:", error);
  }

  // Construct focused prompt reflecting current role and work
  const systemPrompt = `${ANSWER_RULES}\n\nInformation:\n${retrievedContext ? retrievedContext.slice(0, 2400) : "Sridhar Mani is an AI engineer at Zenteiq Aitech Innovations in Bengaluru who builds agentic workflows, coding agents, retrieval systems and full-stack products with Python and TypeScript."}`;

  const enhancedMessages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: queryTxt },
  ];

  const response = await engine!.chat.completions.create({
    messages: enhancedMessages as any,
    temperature: 0.3,
    top_p: 0.9,
    max_tokens: 220,
    stop: ["---", "User:", "Assistant:"],
    ...extraFor(activeModel),
  });

  for (const c of response.choices) { if (c.message?.content) c.message.content = stripThink(c.message.content); }
  return response;
}

async function indexDocument(text: string, source: string) {
  if (!mydetailsIndex) {
    await initEngine();
  }

  const chunks = text
    .split(/\n\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 50);

  let indexedCount = 0;

  for (const chunk of chunks) {
    const uniqueId = `doc_${source}_${simpleHash(chunk)}`;

    let existingDb: any[] = [];
    try {
      existingDb = (await mydetailsIndex!.getAllObjectsFromIndexedDB(
        "ragIndexedDB_v2",
        "ragDB"
      )) || [];
    } catch {
      existingDb = [];
    }

    if (existingDb.some((item: any) => item.id === uniqueId)) {
      continue;
    }

    const embedding = await customEmbedding(chunk);
    mydetailsIndex!.add({
      id: uniqueId,
      name: source,
      text: chunk,
      embedding: embedding,
    });
    indexedCount++;
  }

  await mydetailsIndex!.saveToIndexedDB("ragIndexedDB_v2", "ragDB");
  console.log(`Indexed ${indexedCount} chunks from ${source}`);
  return indexedCount;
}

async function analyzeJobFit(jobDescription: string) {
  if (!engine) {
    await initEngine();
  }

  // Comprehensive NLP skill keyword pattern including latest agentic, WebGPU, and deep learning skills
  const skillPatterns = /\b(react|vue|angular|typescript|javascript|python|node|flask|django|fastapi|sql|postgresql|mongodb|redis|docker|kubernetes|aws|gcp|azure|git|ci\/cd|machine learning|ai|ml|deep learning|nlp|llm|three\.js|webgl|webgpu|opengl|vtk|cfd|simulation|rest|api|graphql|microservices|tailwind|css|html|langchain|langgraph|agent|agents|agentic|chromadb|rag|next\.js|vite|testing|agile|pytorch|ollama|socket\.io|wasm|turbomodule)\b/gi;
  const jdSkills = [...new Set((jobDescription.toLowerCase().match(skillPatterns) || []))];

  // Get relevant context from indexed profile
  const queryEmbed = await customEmbedding(`query: ${jdSkills.join(' ')}`);
  let relevantContext = "";

  try {
    if (mydetailsIndex) {
      const results = await mydetailsIndex.search(queryEmbed, {
        useStorage: "indexedDB",
        topK: 3,
        storageOptions: {
          indexedDBName: "ragIndexedDB_v2",
          indexedDBObjectStoreName: "ragDB",
        },
      });
      relevantContext = results.map((r: any) => r.object.text).join("\n");
    }
  } catch (error) {
    console.error("RAG search error:", error);
  }

  // Step 1: Try LLM-based analysis first
  try {
    console.log("Attempting LLM-based job analysis...");

    const analysisPrompt = `JD Skills: ${jdSkills.slice(0, 16).join(', ')}
Candidate Profile: ${relevantContext.slice(0, 800)}

Match candidate profile against JD skills. Return ONLY valid JSON:
{"matched":["skill"],"missing":["skill"],"score":85,"note":"one sentence summary"}`;

    const response = await engine!.chat.completions.create({
      messages: [
        { role: "system", content: "You are a senior tech recruiter and skill matcher. Output strictly valid JSON only." },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.3,
      max_tokens: 200,
      stop: ["\n\n"],
      ...extraFor(activeModel),
    });

    const content = stripThink(response.choices[0].message.content || "");
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const result = {
        matchedSkills: parsed.matched || parsed.matchedSkills || [],
        missingSkills: parsed.missing || parsed.missingSkills || [],
        fitScore: typeof parsed.score === 'number' ? parsed.score : (parsed.fitScore || 60),
        summary: parsed.note || parsed.summary || "LLM match analysis complete"
      };

      if (result.matchedSkills.length > 0 || result.missingSkills.length > 0) {
        return result;
      }
    }
  } catch (error) {
    console.warn("LLM analysis failed, using local NLP fallback:", error);
  }

  // Step 2: Fallback - Comprehensive local NLP matching with all latest skills
  const profileSkills = [
    'python', 'typescript', 'javascript', 'react', 'next.js', 'vue',
    'fastapi', 'flask', 'django', 'node', 'langchain', 'langgraph',
    'agents', 'agentic', 'pytorch', 'deep learning', 'three.js',
    'webgpu', 'webgl', 'vtk', 'cfd', 'simulation', 'docker', 'sql',
    'postgresql', 'sqlite', 'redis', 'chromadb', 'rag', 'tailwind',
    'ollama', 'socket.io', 'rest', 'api', 'wasm', 'turbomodule'
  ];

  const matched = jdSkills.filter(s => profileSkills.includes(s.toLowerCase()));
  const missing = jdSkills.filter(s => !profileSkills.includes(s.toLowerCase()));

  return {
    matchedSkills: matched,
    missingSkills: missing,
    fitScore: jdSkills.length > 0 ? Math.round((matched.length / jdSkills.length) * 100) : 0,
    summary: `Matched ${matched.length}/${jdSkills.length} required skills based on Sridhar's profile`
  };
}

async function getIndexedSources() {
  if (!mydetailsIndex) {
    return [];
  }

  try {
    const existingDb = (await mydetailsIndex.getAllObjectsFromIndexedDB(
      "ragIndexedDB_v2",
      "ragDB"
    )) || [];

    const sources = [...new Set(existingDb.map((item: any) => item.name))];
    return sources;
  } catch {
    return [];
  }
}

Comlink.expose({ initEngine, reply, changeMsg, getProgress, indexDocument, analyzeJobFit, getIndexedSources });
