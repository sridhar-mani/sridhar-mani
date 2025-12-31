/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateMLCEngine, MLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";
import { initializeModel, EmbeddingIndex } from "client-vector-search";
import * as Comlink from "comlink";
import { env, FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { profileSridhar } from "../data/profileData";
import { simpleHash } from "./simpleHash";

// Use stable Qwen2.5-1.5B-Instruct for conversational AI (DeepSeek-R1 is for reasoning, not chat)
const selectedModel = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";

// Use prebuilt config - Qwen2.5-1.5B-Instruct is included in web-llm v0.2.80
let customAppConfig: any = null;

// Initialize with prebuilt config, fallback to custom if needed
async function getAppConfig() {
  if (customAppConfig) return customAppConfig;
  
  // Check if model exists in prebuilt config
  const prebuilt = prebuiltAppConfig;
  const modelExists = prebuilt.model_list?.some((m: any) => m.model_id === selectedModel);
  
  if (modelExists) {
    prebuilt.useIndexedDBCache = true;
    return prebuilt;
  }
  
  // Fallback: try Llama-3.2-1B if Qwen not available
  console.log("Qwen2.5 not found in prebuilt, using Llama-3.2-1B fallback");
  prebuilt.useIndexedDBCache = true;
  return prebuilt;
}

let engine: MLCEngine | null = null;
let mydetailsIndex: EmbeddingIndex | null = null;
let embeddingPipeline: FeatureExtractionPipeline | null = null;
let initProgress = 0;

const initProgressCallback = Comlink.proxy(({ progress }: { progress: number }) => {
  initProgress = progress;
  console.log(`Initialization Progress: ${(progress * 100).toFixed(1)}%`);
});

const messages: Array<{ role: string; content: string }> = [
  {
    role: "system",
    content: `You are Sridhar Mani, a Full Stack Engineer. When users ask about your background, skills, projects, or experience, answer naturally as yourself. Be friendly, professional, and concise. If you don't know something specific, say so honestly.`,
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

  // Load existing data from IndexedDB
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

    // Check if this paragraph is already embedded
    if (existingDb && existingDb.some((item: any) => item.id === uniqueId)) {
      console.log(`Paragraph already embedded: ${para.slice(0, 40)}...`);
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
    console.log(`Initializing LLM engine with ${selectedModel}...`);
    
    const appConfig = await getAppConfig();

    engine = await CreateMLCEngine(selectedModel, {
      initProgressCallback: initProgressCallback,
      appConfig: appConfig,
    });

    console.log("LLM engine initialized");

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

      const profileExists = existingDb && existingDb.length > 0;

      if (!profileExists) {
        console.log("Embedding profile for the first time...");
        await embedProfile(profileSridhar);
      } else {
        console.log("Profile already embedded, skipping...");
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

      console.log("Search results:", searchResults);

      retrievedContext = searchResults
        .map((result: any) => result.object.text)
        .join("\n\n");
    }
  } catch (error) {
    console.error("RAG search failed:", error);
  }

  // Construct focused prompt
  const systemPrompt = retrievedContext 
    ? `You are Sridhar Mani. Use this info to answer:\n${retrievedContext.slice(0, 600)}\n\nAnswer in 1-2 sentences. Be specific.`
    : `You are Sridhar Mani, a Full Stack Engineer skilled in React, Python, AI/ML, and 3D visualization. Answer in 1-2 sentences.`;

  const enhancedMessages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: queryTxt },
  ];

  const response = await engine!.chat.completions.create({
    messages: enhancedMessages as any,
    temperature: 0.5,
    top_p: 0.9,
    max_tokens: 80,
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
    
    // Check if already indexed
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

  // Extract key skills from job description using NLP patterns
  const skillPatterns = /\b(react|vue|angular|typescript|javascript|python|node|flask|django|fastapi|sql|postgresql|mongodb|redis|docker|kubernetes|aws|gcp|azure|git|ci\/cd|machine learning|ai|ml|deep learning|nlp|llm|three\.js|webgl|opengl|vtk|cfd|simulation|rest|api|graphql|microservices|tailwind|css|html|langchain|chromadb|rag|next\.js|vite|testing|agile)\b/gi;
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
    
    const analysisPrompt = `JD Skills: ${jdSkills.slice(0, 15).join(', ')}
Profile: ${relevantContext.slice(0, 800)}

Match skills to profile. Return ONLY valid JSON:
{"matched":["skill"],"missing":["skill"],"score":75,"note":"one sentence"}`;

    const response = await engine!.chat.completions.create({
      messages: [
        { role: "system", content: "You are a skill matcher. Output valid JSON only. No explanations." },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.3,
      max_tokens: 150,
      stop: ["\n\n"],
    });

    const content = response.choices[0].message.content || "";
    console.log("LLM response:", content);
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const result = {
        matchedSkills: parsed.matched || parsed.matchedSkills || [],
        missingSkills: parsed.missing || parsed.missingSkills || [],
        fitScore: typeof parsed.score === 'number' ? parsed.score : (parsed.fitScore || 50),
        summary: parsed.note || parsed.summary || "LLM analysis complete"
      };
      
      // Validate result has reasonable data
      if (result.matchedSkills.length > 0 || result.missingSkills.length > 0) {
        console.log("LLM analysis successful:", result);
        return result;
      }
    }
    console.log("LLM returned invalid format, falling back to regex...");
  } catch (error) {
    console.error("LLM analysis failed, using regex fallback:", error);
  }

  // Step 2: Fallback - Local NLP/regex matching
  console.log("Using regex-based skill matching...");
  const profileSkills = [
    'react', 'typescript', 'javascript', 'python', 'vue', 'next.js',
    'fastapi', 'flask', 'django', 'three.js', 'langchain', 'chromadb',
    'docker', 'postgresql', 'webgl', 'vtk', 'ai', 'ml', 'rag', 'tailwind'
  ];
  
  const matched = jdSkills.filter(s => profileSkills.includes(s.toLowerCase()));
  const missing = jdSkills.filter(s => !profileSkills.includes(s.toLowerCase()));
  
  return {
    matchedSkills: matched,
    missingSkills: missing,
    fitScore: jdSkills.length > 0 ? Math.round((matched.length / jdSkills.length) * 100) : 0,
   summary: `Matched ${matched.length}/${jdSkills.length} required skills`
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
