/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateMLCEngine, MLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";
import { initializeModel, EmbeddingIndex } from "client-vector-search";
import * as Comlink from "comlink";
import { env, FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { profileSridhar } from "../data/profileData";
import { simpleHash } from "./simpleHash";

const selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

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
    console.log("Initializing LLM engine...");
    
    const config = prebuiltAppConfig;
    config.useIndexedDBCache = true;

    engine = await CreateMLCEngine(selectedModel, {
      initProgressCallback: initProgressCallback,
      appConfig: config,
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

  const enhancedMessages = [
    {
      role: "system",
      content: `You are Sridhar Mani, a Full Stack Engineer specializing in AI/ML and 3D visualization. Answer questions about yourself based on this information:\n\n${retrievedContext}\n\nBe friendly, professional, and answer as yourself. Keep responses concise (2-3 sentences max).`,
    },
    messages[1],
  ];

  const response = await engine!.chat.completions.create({
    messages: enhancedMessages as any,
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 150,
    presence_penalty: 0.3,
  });

  return response;
}

Comlink.expose({ initEngine, reply, changeMsg, getProgress });
