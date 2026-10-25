/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateMLCEngine, MLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";
import { initializeModel, EmbeddingIndex } from "client-vector-search";
import * as Comlink from "comlink";
import { env, FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { profileSridhar } from "../data/profileData";
import { simpleHash } from "./simpleHash";

// Use stable Qwen2.5-1.5B-Instruct for conversational AI (with fallback to Llama-3.2-1B)
const primaryModel = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
const fallbackModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

let activeModel = primaryModel;
let customAppConfig: any = null;

// Initialize with prebuilt config, auto-detect model availability
async function getAppConfig() {
  if (customAppConfig) return customAppConfig;

  const prebuilt = prebuiltAppConfig;
  const qwenExists = prebuilt.model_list?.some((m: any) => m.model_id === primaryModel);

  if (qwenExists) {
    activeModel = primaryModel;
    prebuilt.useIndexedDBCache = true;
    return prebuilt;
  }

  // Fallback to Llama-3.2-1B
  console.log("Qwen2.5 not found in prebuilt catalog, switching to Llama-3.2-1B fallback");
  activeModel = fallbackModel;
  prebuilt.useIndexedDBCache = true;
  return prebuilt;
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
      "ragIndexedDB",
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

  await mydetailsIndex.saveToIndexedDB("ragIndexedDB", "ragDB");
  console.log("Profile embedded and saved to IndexedDB");
}

async function initEngine() {
  try {
    console.log(`Initializing LLM engine...`);
    const appConfig = await getAppConfig();

    engine = await CreateMLCEngine(activeModel, {
      initProgressCallback: initProgressCallback,
      appConfig: appConfig,
    });

    console.log(`LLM engine initialized with ${activeModel}`);

    await initEmbeddingModel();

    mydetailsIndex = new EmbeddingIndex([]);
    initializeModel();

    if (profileSridhar) {
      let existingDb: any[] = [];
      try {
        existingDb = (await mydetailsIndex.getAllObjectsFromIndexedDB(
          "ragIndexedDB",
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
        topK: 3,
        storageOptions: {
          indexedDBName: "ragIndexedDB",
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
  const systemPrompt = retrievedContext 
    ? `You are Sridhar Mani, an AI Engineer at Zenteiq Aitech Innovations. Use this information to answer:\n${retrievedContext.slice(0, 700)}\n\nAnswer concisely in 1-3 sentences. Be specific.`
    : `You are Sridhar Mani, an AI Engineer at Zenteiq specializing in agentic workflows, LangGraph, Python, WebGPU/Three.js, and full-stack systems. Answer concisely in 1-2 sentences.`;

  const enhancedMessages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: queryTxt },
  ];

  const response = await engine!.chat.completions.create({
    messages: enhancedMessages as any,
    temperature: 0.5,
    top_p: 0.9,
    max_tokens: 100,
    stop: ["\n\n", "---", "User:", "Assistant:"],
  });

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
        "ragIndexedDB",
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

  await mydetailsIndex!.saveToIndexedDB("ragIndexedDB", "ragDB");
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
          indexedDBName: "ragIndexedDB",
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
      max_tokens: 160,
      stop: ["\n\n"],
    });

    const content = response.choices[0].message.content || "";
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
      "ragIndexedDB",
      "ragDB"
    )) || [];

    const sources = [...new Set(existingDb.map((item: any) => item.name))];
    return sources;
  } catch {
    return [];
  }
}

Comlink.expose({ initEngine, reply, changeMsg, getProgress, indexDocument, analyzeJobFit, getIndexedSources });
