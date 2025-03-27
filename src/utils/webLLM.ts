import { CreateMLCEngine, MLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";
import {
  initializeModel,
  getEmbedding,
  EmbeddingIndex,
} from "client-vector-search";
import * as Comlink from "comlink";
import {
  env,
  FeatureExtractionPipeline,
  Pipeline,
  pipeline,
} from "@xenova/transformers";
import mammoth from "mammoth";
import { profileSri } from "../data";
import { simpleHash } from ".";

const selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

const initProgressCallback = Comlink.proxy(({ progress }) => {
  console.log(`Initialization Progress:${progress * 100}`);
});

let engine: MLCEngine;
let mydetailsIndex: EmbeddingIndex | null = null;
let docVector: number[] | null = null;
let embeddingPipeline: FeatureExtractionPipeline | null = null;
let retrievedContext: string = "";

const messages = [
  {
    role: "system",
    content: `You are Sridhar M, a Full-Stack Developer. Use the following information about yourself to answer questions. Information: ${retrievedContext}

    Always answer as if you are Sridhar himself.`,
  },
  { role: "user", content: "Hello!" },
];

const changeMsg = ({ cusMsg }) => {
  messages[1].content = cusMsg;
};

async function customEmbedding(text) {
  if (!embeddingPipeline) await initEmbeddingModel();

  const formatedText =
    text.startsWith("query: ") || text.startsWith("passage: ")
      ? text
      : `passage: ${text}`;

  const result = await embeddingPipeline(formatedText, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(result.data);
}

async function initEmbeddingModel() {
  try {
    env.allowLocalModels = false;
    env.useBrowserCache = false;
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/e5-small-v2",
      { quantized: true }
    );

    console.log("Embedding model loaded");
  } catch (error) {
    console.error("Failed to load embedding model:", error);
  }
}

async function embedProfile(profileText) {
  const paragraphs = profileText.split(/[.;\n]+/);

  const filteredParagraphs = paragraphs
    .map((p) => p.trim())
    .filter((p) => p.length > 10);

  // Load existing data from IndexedDB
  let existingDb = await mydetailsIndex.getAllObjectsFromIndexedDB(
    "ragIndexedDB",
    "ragDB"
  );

  for (let i = 0; i < filteredParagraphs.length; i++) {
    const para = filteredParagraphs[i].trim();
    const uniqueId = `profile_${simpleHash(para)}`;

    // Check if this paragraph is already embedded using the unique id
    if (existingDb && existingDb.some((item) => item.id === uniqueId)) {
      console.log(`Paragraph already embedded: ${para.slice(0, 60)}...`);
      continue;
    }

    const embedding = await customEmbedding(para);
    mydetailsIndex.add({
      id: uniqueId,
      name: "Profile",
      text: para,
      embedding: embedding,
    });

    // Update our local snapshot
    existingDb.push({
      id: uniqueId,
      name: "Profile",
      text: para,
      embedding: embedding,
    });

    await mydetailsIndex.saveToIndexedDB("ragIndexedDB", "ragDB");
  }
}

async function initEngine() {
  try {
    const config = prebuiltAppConfig;
    config.useIndexedDBCache = true;

    engine = await CreateMLCEngine(selectedModel, {
      initProgressCallback: initProgressCallback,
      appConfig: config,
    });

    await initEmbeddingModel();

    mydetailsIndex = new EmbeddingIndex([]);
    initializeModel();

    if (profileSri) {
      const existingDb = await mydetailsIndex.getAllObjectsFromIndexedDB(
        "ragIndexedDB",
        "ragDB"
      );

      const profileExists = existingDb && existingDb.length > 0;

      if (!profileExists) {
        await embedProfile(profileSri);
      }
    }
  } catch (error) {
    console.error("Engine initialization failed:", error);
  }
}

async function embedText(data) {
  if (mydetailsIndex) {
    const profileEmbedding = await getEmbedding(data);
    mydetailsIndex.add(profileEmbedding);

    // Save the updated index back to IndexedDB
    await mydetailsIndex.saveToIndexedDB("ragIndexedDB", "ragDB");
    return mydetailsIndex;
  }
  return null;
}
async function embedDoc(doc) {
  try {
    const res = await fetch(doc);
    if (!res.ok) {
      console.error("Fetching detail document failed");
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const docText = result.value;

    // Split by paragraphs or meaningful chunks
    const paragraphs = docText.split(/\n\s*\n/);

    // Filter out empty paragraphs
    const filteredParagraphs = paragraphs.filter((p) => p.trim().length > 0);

    // Embed each paragraph and add to index
    for (const paragraph of filteredParagraphs) {
      if (paragraph.length > 10) {
        // Skip very short segments
        const embedding = await customEmbedding(paragraph);
        mydetailsIndex.add({
          embedding: embedding,
          text: paragraph,
        });
      }
    }

    // Save the updated index
    await mydetailsIndex.saveToIndexedDB("ragIndexedDB", "ragDB");
    return true;
  } catch (er) {
    console.error("Error embedding document: ", er);
    return null;
  }
}

async function reply() {
  if (!engine) await initEngine();

  const querTxt = messages[1].content;

  const queryEmbed = await customEmbedding(`query: ${querTxt}`);

  if (mydetailsIndex) {
    // Search for similar content using the embedding
    const searchResults = await mydetailsIndex.search(queryEmbed, {
      useStorage: "indexedDB",
      topK: 1,
      storageOptions: {
        indexedDBName: "ragIndexedDB",
        indexedDBObjectStoreName: "ragDB",
      },
    }); // Get top 3 most relevant entriess

    console.log(searchResults);

    debugger;

    // Extract and format the retrieved content
    retrievedContext = searchResults
      .map((result) => result.object.text)
      .join("\n\n");

    // Add retrieved context to system message or create a new message with context
    const enhancedMessages = [
      { role: "system", content: `Relevant information: ${retrievedContext}` },
      messages[1],
    ];

    return await engine.chat.completions.create({
      messages: enhancedMessages,
      temperature: 0.9,
      top_p: 0.1,
      max_tokens: 100,
      presence_penalty: 0.5,
      // frequency_penalty: 0.5,
    });
  }

  return await engine.chat.completions.create({
    messages: messages,
    temperature: 0.9,
    top_p: 0.1,
    max_tokens: 100,
    presence_penalty: 0.5,
    // frequency_penalty: 0.5,
  });
}

Comlink.expose({ initEngine, reply, changeMsg, embedDoc, embedText });
