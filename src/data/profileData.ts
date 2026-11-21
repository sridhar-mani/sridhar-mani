// The assistant's knowledge base. One "##" section = one retrievable chunk, so keep each section short and
// self-contained. Every fact here comes from the résumé, the projects' READMEs or the live sites.
export const KB_VERSION = 2;

export const profileSridhar = `
## About
Sridhar Mani is an AI engineer at Zenteiq Aitech Innovations in Bengaluru, India. He builds agentic workflows, coding agents, retrieval systems and full-stack products with Python and TypeScript. He is open to AI, agent and software engineering roles.

## Current role at Zenteiq
Since March 2026 Sridhar has worked as an AI Engineer at Zenteiq Aitech Innovations in Bengaluru. He builds AI-enabled engineering applications that combine agentic workflows, deep-learning and physics models, and specialised engineering data. He develops coding-agent and workflow orchestration systems for long-horizon automation, with stateful execution, tool integration and evaluation workflows. He builds FastAPI services and numerical processing pipelines for document intelligence and workflow automation, and fine-tunes open-weight models on specialised datasets. Stack: Python, FastAPI, LangGraph, SQL, Docker, Git.

## Previous role at NovaCast India
From June 2024 to February 2026 Sridhar was an Associate Software Engineer at NovaCast India in Coimbatore. He built a browser-based visualisation product for multi-gigabyte simulation datasets with React, TypeScript, Python and WebSockets. Progressive binary streaming over Socket.IO cut initial render latency by about 30%. Reworking chunked file parsing cut peak server memory by about 40%. He also designed relational schemas, indexing, asynchronous pipelines, automated tests and technical specifications.

## Education and certification
Sridhar has a B.Tech from Anna University, Chennai (2019 to 2023). He completed a Diploma in Programming at IIT Madras (January 2022 to October 2024) and a Diploma in Data Science at IIT Madras (January 2022 to September 2025). He holds the NVIDIA certification Building RAG Agents with LLMs.

## Skills
Languages and frameworks: Python, TypeScript, JavaScript, React, Next.js, Vue.js, Node.js, FastAPI, Flask. AI and LLM: LangGraph, LangChain, RAG, agents and tool calling, PyTorch, Hugging Face, Ollama, vLLM, embeddings and vector search. Data: PostgreSQL, SQLite, Redis, SQL, Pandas, NumPy, SQLAlchemy, Drizzle ORM. Systems: Docker, Git, GitHub Actions, Linux, Azure, CI/CD, WebSockets, Socket.IO. Graphics and web platform: Three.js, WebGPU, WebAssembly, Web Workers, VTK.js, OpenCascade. Testing: Jest, Vitest, Playwright.

## NPC Code
NPC Code is Sridhar's coding agent for the terminal and VS Code. It parses a project into a syntax tree, measures how far a change can spread (its blast radius), and applies a patch only once the tests qualify it. It ships as a CLI, a VS Code extension and a core runtime with tool execution, session management and model routing. Built with TypeScript. It is public on GitHub at github.com/sridhar-mani/npc-code.

## YUGHO
YUGHO is a live online store for sweat-proof undershirts that ships across India, at yughoclothing.com. Sridhar built the full store: catalog, cart, checkout, orders, reviews, coupons, preorders, inventory, variants and an admin side. Payments use PhonePe. Shipping uses NimbusPost with warehouse-aware serviceability, courier selection, tracking and webhooks. Stack: Next.js, React, TypeScript, PostgreSQL.

## GourmetOS
GourmetOS is a restaurant operating system with zero commission. Guests order from a QR code on the table, orders reach a live kitchen display, and payments settle by UPI directly to the restaurant. It is multi-tenant, with server-authoritative pricing, idempotent mutations, a transactional outbox and an offline-safe PWA. Stack: Next.js, React, TypeScript, PostgreSQL, Drizzle ORM. The live demo is at custom-diner-gamma.vercel.app.

## CAD Fusion
CAD Fusion is a CAD workspace that runs in the browser. It has sketching, solid modelling such as extrude, revolve, booleans, fillet and shell, a scene tree, measurement tools, persistence and cloud sync. Geometry runs on OpenCascade compiled to WebAssembly, and a LangChain agent drives deterministic CAD tools. Stack: React, TypeScript, Three.js, OpenCascade, LangChain, WebGPU. It is live at web-cad-fusion-sketch.vercel.app.

## Ardor
Ardor is a progressive web app for making friends in real life. People join circles around an interest or neighbourhood, plan hangouts with RSVP, chat in groups, play party games and watch video in sync. It runs on free tiers with no socket server: Web Push carries events, WebRTC carries live play, and a spatial privacy grid protects location. It is available in English and Hindi. Stack: Next.js, React, TypeScript, Turso.

## Other projects
Code-DCR is a PyTorch implementation accompanying a research paper on representation learning for code structure. AiDocs is a private desktop app for document intelligence with local embeddings, vector search and local LLM analysis, built with Electron, React and ChromaDB. CFD-Toolkit is an npm package to parse, slice and view OpenFOAM output in the browser. RN SMS Fetch is a Kotlin TurboModule for React Native, published on npm. FEAScript-core is an open-source project where Sridhar contributed Gmsh mesh import, worker-based compute and WebGPU acceleration.

## Contact
Email: sridharmani510@gmail.com. GitHub: github.com/sridhar-mani. LinkedIn: linkedin.com/in/sridharmanimuthusamy. Based in Bengaluru, India. Open to AI, agent and software engineering roles.
`;
