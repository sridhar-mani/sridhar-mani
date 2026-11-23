# EMPLOYEE PROBATION: Technical Work Report

*Standard template for six-month probation evaluation. Filled in for Sridhar from git history on this machine.*

> **STRICTLY CONFIDENTIAL – TECHNICAL / PRODUCT REVIEW.** HR access is not permitted unless specifically authorised by the Founder / Director.
> **Review chain:** Employee > Engineering Lead > VP – Product > VP – Engineering > Founder / Director.
> **Classification:** Internal – Restricted Technical.

## How this draft was built (read before submitting)

- **Source of every item below:** commits authored by `sridhar@zenteiq.com` (and `sridhar.zenteiq` / `sridhar-zenteiq`) across the local repos under `~/Documents/sridhar/`, `~/libraries` and `~/Documents/test`. Other people's commits (Lokesh, Nazaar, Chaitanya, Hardik, Ravish and others) are **excluded**.
- **Two groups use a personal email** (`mailtosridhar01@gmail.com`, GitHub `sridhar-mani`): `foundation` (fm-physics) and `pi-main` (npc-code). They are listed in Section 4.F and 4.G, marked **[CONFIRM]**. Keep them only if they are sanctioned Zenteiq work.
- **Not in the git data, so left as `[FILL]`:** designation, joining date, engineering lead, KRAs assigned by the company, Azure DevOps board states, outcomes and impact numbers, reviewer feedback, and the self-assessment ratings.
- **Commit counts are approximate.** Some commits show up under several refs and branches. Treat counts as "about", not exact.
- **`[VERIFY]` marks claims** I read from a commit message but did not confirm in running code or on the board (for example "merged", "in production").
- **Sources checked:** local git repos; GitHub account `sridhar-zenteiq-ai` (10 repos, about 411 commits found by GitHub search, 23 PRs); the `zenteiq-inference` and `zenteiq-sciml` orgs; file dates in `~/Downloads`; Claude Code session folders.
- **System logs are no help for dates.** The systemd journal only covers today's boot (23 Nov), `.bash_history` has no timestamps, and `/var/log` holds only rotated package and auth logs. File dates in `~/Downloads` and GitHub commit dates are used instead.
- **Downloaded documents are not proof of authorship.** The Kognex `.docx` files carry no author metadata (`Un-named`), and some are plainly team documents (for example `Team_Allocation_and_Timeline`). Any document listed below without matching commits of mine is marked **[CONFIRM authorship]**.
- **March 2026 is covered by GitHub and file dates,** not by the local repos: `verifier-agent` (18 Mar), the Kogenyx architecture diagrams (17–25 Mar), the FEniCSx agent architecture (30 Mar) and `fenics` (31 Mar). See Section 4.K.

---

## 1. Employee & Probation Details

| Field | Value |
|---|---|
| Employee Name | Sridhar |
| Employee ID | `[FILL]` |
| Designation | `[FILL]` |
| Team / Product / Function | Kognex platform, SciML / AI agents, ZFormatter, ZIQ-Code, foundation-model research |
| Engineering Lead | `[FILL]` |
| Date of Joining / Probation start | `[FILL]` |
| Probation completion date | `[FILL]` |
| Evidence window used for this draft | 13 Mar 2026 to 23 Nov 2026 |

## 2. Role & Responsibilities (as actually performed)

| # | Responsibility |
|---|---|
| 1 | **Kognex backend services:** designed and built the Project Service (catalogue, projects, analyses, snapshots, MCP tools) and the first cut of the Insight Service on Azure DevOps. |
| 2 | **Kognex AI / agent layer:** built the LLM service (Google ADK orchestration, FastMCP SciML tools, intent scoping, human-in-the-loop approval, model-tune orchestration). |
| 3 | **Kognex frontend:** built the SciML agentic hub UI (chat, sessions, SSE streaming, strategy approval cards, VTK.js results viewer). |
| 4 | **Design and architecture documents:** wrote the Project Service, Geometry Service and Screening designs and the Kognex demo versions in the common architecture repo. |
| 5 | **Data tooling:** built ZFormatter (OpenFOAM / FEniCSx output to compressed Z-format with simulation IR) and its bridge into the SciML service. |
| 6 | **Developer tooling:** extended the ZIQ-Code agent CLI (harness, guardrails, sandboxing, benchmarks) and contributed code-review skills to the shared skills repo. |
| 7 | **Research:** physics foundation-model and tokenizer research, wavelet-operator (WNO) work, `[CONFIRM]` ownership. |

## 3. Objectives / KRAs During Probation

The company-assigned KRAs are not recorded on this machine. The table below groups the delivered work into objectives for you to map onto your real KRAs.

| Objective | Expected outcome | Status | Evidence |
|---|---|---|---|
| Kognex Project Service (pilot APIs) | Catalogue, projects, analyses, snapshots, tools served over REST, gRPC and MCP | Delivered, merged PRs `[VERIFY board state]` | Azure repo `kogneX/kognex-project-service`, stories #1665 to #1673, #152, #2592, #2619 to #2621 |
| Kognex LLM service (SciML agent) | Prompt-driven agent that scopes, plans, approves and runs SciML jobs | Delivered, in iteration | `sridhar-zenteiq/kognex-llm-service` |
| Kognex frontend (agentic hub) | Chat, approvals, run progress, results viewer | Delivered, in iteration | `kognex-frontend`, `kognex-source-hub` |
| Kognex design documents | Design docs and demos in the common repo | Delivered | `kognex-initial-arch` (my commits only) |
| ZFormatter | Convert solver output to Z-format for ML pipelines | Delivered v1 | `sridhar-zenteiq/ZFormatter` |
| ZIQ-Code agent CLI | Branded coding agent with evolution harness and safety guardrails | Delivered, ongoing | `zenteiq-inference/ziq-code` |
| Foundation-model research `[CONFIRM]` | Benchmarks and audited findings on physics tokenizers | Delivered, ongoing | `fm-physics` |

---

## 4. Key Work & Deliverables (one by one)

### K. Kognex: rebuilt five times (Mar – Nov 2026)

Kognex was designed and rebuilt in five distinct versions. Each row is backed by commits or dated files.

| # | Version | When | What it was | Evidence |
|---|---|---|---|---|
| 0 | **"Kogenyx" concept and verifier agent** | 13–31 Mar | First architecture and flow diagrams (`arch.drawio`, `flow.drawio`, `flowarch.drawio`, five edits of `architecture.xml`, `Kogenyx.png`, `kogenyx1.png`). Verifier agent with a sandbox runner (`main.py`, `sandbox_runner.py`, `schema.py`, `chains.py`, `prompts.py`, `tools.py`). FEniCSx agent architecture (`arch_fenicsx.png`, `archagentfenicsx.png`) and a FEniCSx Poisson backend. Background research on autonomous PDE pipelines (AutoNumerics paper, 27 Mar). | GitHub `verifier-agent` (18 Mar, 2 commits), `fenics` (31 Mar, 2 commits); Downloads files dated 13–30 Mar |
| 1 | **KogneX v1: event-driven monorepo** | 2–16 Apr | Monorepo with 11 services (api-chat, orchestrator, planner, execution, fm-engine, fm-manager, db-service, a2a-workers, skill-registry, reporting, admin), shared `kognex-events` and `kognex-messaging` packages, an event contract, a saga-pattern simulation lifecycle, A2A persona workers, a closed learning loop for skill extraction, and a Next.js frontend with a VTK mission viewer. Architecture diagrams redrawn about ten times (`archfin`, `arcg.svg`, `arch.svg`, `testarch.xml`). Also mesh-generation experiments (`delaunay.py`, `refinement.py`, `boundary.py`, `optimize_pipeline.py`, 16 Apr). | GitHub `KogneX` (11–14 Apr), with `ARCHITECTURE.md`, `EVENT_DICTIONARY.md`, `DEVELOPMENT_STATE.md` |
| 2 | **Kognex v2: SciML agentic hub on the team frontend** | 25 Apr – 3 Jun | VTK/VTP viewers and SciML UI in the team `kognex-frontend`; the new `kognex-llm-service` (ADK and FastMCP) from 7 May; written design set `ARCHITECTURE.md`, `HLD.md`, `LLD.md` (19–20 May): "turns natural-language engineering queries into validated, audited solver runs", with cross-service `TenantContext`. | Section 4.E and 4.F commits; Downloads files dated 19–20 May **[CONFIRM authorship of HLD/LLD]** |
| 3 | **Kognex v3: redesigned frontend and agent HLD** | 5 Jun – 27 Aug | Rebrand and redesign in `kognex-source-hub`; POC architecture export (19 Jun, `kognex arch/`); ZFormatter and `.zmesh` wired into the agent; Transolver surrogate path; **KogneX Agent Orchestration HLD** (18 Aug, `.docx` and `.pdf`) documenting the `kognex-llm-service` orchestration, with mermaid diagrams (19 Aug). | GitHub `kognex-source-hub` (28 commits in Jun), `kognex-llm-service` **[CONFIRM authorship of the Agent HLD]** |
| 4 | **Kognex v4: enterprise platform on Azure DevOps** | 11 Sep – 23 Nov | Platform reset to an enterprise microservice design: Confluence docs (11 Sep), the `Kognex-initial` design pack (28 Sep), design review comments (9–11 Oct), `Kognex_Final` revisions (13–15 Oct), Enterprise Architecture V1/V2 (23 Oct), demos v2 → v2.1 → v2.3 → v2.4-s → v2.5 (12 Oct – 11 Nov), and the Insight Service & Pilot AI brief (27 Oct). My own build in this version: the Project Service, the first cut of the Insight Service, the deployment stack, the Project, Geometry and Screening design PRs, and the elbow input pack. | Sections 4.B–4.D; Azure repos; 19 merged or closed PRs in `kognex-initial-arch` **[CONFIRM authorship of the shared design pack and V1/V2 docs]** |

**Agent architecture diagrams.** Ten diagram images trace the design from a linear Agno pipeline (17 Mar), through critic-driven coarse-to-fine execution (30 Mar), a three-layer cognitive/protocol/memory design (1 Apr), a VTK-to-IR data pipeline (26 May), the first layered build (19 Jun) and a target design with identity and project services (19 Jun), to the final four-plane LangGraph design (19 Aug) whose node names match `kognex-llm-service`. Details are in `contribution_reports/08_agent_architecture_diagrams.md`.

**Why it was rebuilt (fill in):** `[FILL]` — for example a change of scope from a chat-driven agent to an enterprise platform, the team growing, the move from GitHub to Azure DevOps.

### L. zcode: internal coding-agent desktop app (`sridhar-zenteiq-ai/zcode`), 2–15 Jul 2026

78 commits in two weeks.

1. Desktop app (Rust/Tauri backend) packaged as a `.deb`, with offline `node_modules` bundled in, an architecture-independent package, and a shell wrapper for headless or non-x86 machines.
2. arm64 cross-compilation (`Dockerfile.cross`, sysroot via `--download-only`, usr-merge symlinks).
3. Tailscale peer setup (`ping_neighbors`, IPv4 validation, filtering unrelated nodes) and cleanup on removal.
4. Inference proxy: dynamic model discovery from `/v1/models`, routing to TPU inference, DeepSeek reasoning-effort and token clamping, inference timeout handling.
5. Team feedback: survey panel with admin DB checks, global survey banner, telemetry archive fixes.
6. Reliability: request locking, double-submit debouncing, SQLite `busy_timeout`, database moved to `/var/lib/zcode`.
7. Related evaluation documents: Coding Agent Quick Survey and AI Agent DX Evaluation Survey (4–6 Jul), Coding Agent Framework Comparison (6 Jul), Harnesses Comparative Feature Analysis (7 Aug) **[CONFIRM authorship]**.

### M. SciML LLM data and benchmarks (May – Aug 2026)

Dated files in Downloads, no repo.

1. SciData VTK IR document (16 May) and an SFT IR inference script, followed by the `scidata-ir` multi-field pipeline (23 Jun).
2. Teacher-dataset generator and SFT datasets: `qwen_sft_dataset.jsonl` (26 Jun), cleaned version (29 Jun), `wells_dataset_sft.jsonl` (30 Jun), `sft_unified_scidata.jsonl` (7 Aug).
3. Model comparison: Rayleigh head-to-head DeepSeek vs Gemma (26 Jun), benchmark suite and results (2–3 Jul).

**[CONFIRM]** these are mine and not downloaded from a colleague.

### O. Physics SFT pipeline on Ramanujan (GPU server, user `sridhar`), Jun – Sep 2026

Evidence: `~/Documents/sridhar/ramanujan_backup` (18 GB), copied from `ramanujan:~/` on 10 Sep by `transfer.sh`. Work done on the server after 10 Sep is not covered.

1. **`physics_sft` pipeline** for fine-tuning a scientific LLM on CFD and Rayleigh–Bénard simulation data:
   - `annotation/`: teacher-model annotation (`generate_teacher_dataset.py`, `generate_scidata_teacher_dataset.py`), multistage pipeline, retry and regenerate-with-feedback, TPU inference runner, dataset verifier.
   - `data/`: per-patch 32k-context datasets, spatial datasets, conversion of The Well to patches, filtering.
   - `training/`: LoRA fine-tuning for Stage 2 (20k context) and Stage 3 (32k context), Qwen wrapper, LoRA merge.
   - `eval/`: benchmark suite, ablations, context-length comparison, GPT-2 baseline, prompt-level tests, HNSW similarity, PDF report generator.
   - `pipeline/`: master, parallel, TPU, Stage 2 queue and verification run scripts.
   - `physics_finetuning_documentation.md` (27 Jun): architecture, anti-hallucination routing and auditing, under- and over-fitting controls, IR prompt format, strict JSON schema, dataset metrics, audit findings.
2. **Model trained:** `qwen2.5-14b-stage2-lora` (1–2 Jul, 5 checkpoints, about 1.1 GB adapter).
3. **Benchmark (50 samples, seed 42; `benchmark_comparison.md`, 3 Jul), base → Stage 2:**
   - schema compliance 0.0 → 0.72
   - semantic similarity 0.29 → 0.72
   - ROUGE-L 0.15 → 0.30
   - counterfactual depth 0.0 → 0.76
   - hallucination proxy 0.97 → 0.70
   - Trade-offs: JSON validity dropped from 0.94 to 0.72, and mean latency rose from 45 s to 50 s.
4. **Dataset audit:** `audit_report.json` (1 Jul) holds 326 annotation records audited by Gemma-31B, mean score 4.17 out of 5.
5. **Datasets:** `qwen_sft_dataset.jsonl` (18 Jun) and the cleaned version (29 Jun).
6. **Other artefacts on the server:** a Transolver ShapeNet-Car checkpoint (26 Jul) used by the Kognex surrogate path, and a working copy of `scirex-zenteiq`.

### P. Agentic workflows and proofs of concept (local folders, Mar – Nov 2026)

| When | Folder | What it is |
|---|---|---|
| 13–18 Mar | `tokenizer/verification agent` | Verification agent service: chains, prompts, tools, endpoints, schema, sandboxed verifier, Dockerfile (same code as GitHub `verifier-agent`) |
| Feb – May | `google-adk/` | Google ADK samples, used as the base for `kognex-llm-service` |
| to 2 Apr | `MCP-SIM-main` | Multi-agent simulation pipeline adapted to local models: input clarifier, parsing, code builder, simulation executor, error diagnosis, mechanical insight agents, Ollama adapter `[CONFIRM which parts I changed; upstream is third-party]` |
| 21 Apr – 7 May | `mesh_testing/` | DOLFINx/FEniCSx code dataset builder, FEniCSx docs vector index, labelled hybrid-graph reports |
| 23 Apr | `gmsh_syn_datasets_sample/` | Synthetic Gmsh instruction dataset in arms A1–A6 (concept, API deep-dive, codegen, error, reasoning, why-not) and B |
| 22–23 Jun | `scidata-ir/` | IR pre-training and SFT dataset generation guides (target 50k–100k annotated thermal interpretations), patching modules, hybrid training strategy |
| 27 Jun – 14 Jul | `meshing process/` | **Multi-node DGX Blackwell serving:** DeepSeek-V4-Flash (149 GB, TP=2) across two Spark nodes behind a LiteLLM proxy, with an operational manual and stabilisation report marked "operational / verified"; Nastran BDF viewer |
| 29 Jul – 12 Nov | `plans/` | Kognex chat-workflow implementation plan (physics grounding, physics-critic sub-agent, model cascading, telemetry UI); zenteiq skills drafts |
| 8–12 Oct | `scirex-trials/` | SciREX export work: StableHLO architecture guide, BrahmX IREE VMFB export architecture |
| 4 Nov | `scirex-adapter-poc/` | SciRex model adapter proof of concept on the 2D channel example, 38 tests |
| 21–23 Nov | `gino-adapter/`, `models/elbow-gino-1.0.0` | Model registry PoC for stories MOD-95 (Platform-Common #2585) and MOD-96 (kogneX #2586): how the registry holds a model version and how the orchestrator's router picks and explains a surrogate, with an LLM agent on top; elbow GINO model and plots |

### Q. Kognex v4 design work and technical leadership (Sep – Nov 2026)

**Named in the team's own documents.** No file has my name in its author metadata: the Office files say `Un-named`, `python-docx` or `openpyxl`. The documents below name me in their text.

| Document | What it says |
|---|---|
| `Team_Allocation_and_Timeline` (Kognex-initial pack, 28 Sep) | **Lead of Pod C – Physics, Compute & Results** (with UmaDevi). Owner of `kognex-compute-manager` including the solver registry, and of the OpenFOAM solver adapter ("direct carry-over from the POCs") |
| `07-service-briefs` | Pod C / Sridhar owns geometry-service, compute-manager, remote-agent and rendering-service |
| Enterprise Architecture V1 / V2 (23 Oct) | Pod C, "Sridhar (lead)"; Sridhar on `kognex-compute-manager` and the pilot solver adapter |
| Confluence `03_KogneX_Tech_Overview` (14 Aug) | **Author: @Sridhar M** |
| `05_ADR_AGENT_RUNTIME` (3 Nov) | **Decider: Sridhar** (with Nazaar); pilot stance "minimal, with the architecture ready" is my ruling |
| `04_INS-01_DESIGN` (3 Nov, author Hardik) | **Reviewer: Sridhar (ARC-10)**; my scope ruling and my "minimal record for later retraining" ruling are quoted |
| `06_MCP_CONTRACT_CONVENTIONS` | MCP library rules need my agreement ("since it's a library rule") |
| `Validation_Steps_Before_Screening` | My design, with my replies to Nazaar's review comments |

**My own design documents** (`~/Documents/sridhar/azure/my kognex design`, with dated backups of every revision; 55 snapshots in the archive folder, plus `.before-*` copies beside each draft):

1. **`Kognex_Design`** (`.docx` 30 Oct, `.md` to 19 Nov). 22 revision snapshots on 30 Oct alone: favourites, states, physics group, set-up handling, gRPC catalogue, override rules, solver engines, cursor paging, templates, equation terms and others.
2. **MOD-01 SciRex Model Adapter Design** (v1.2 on 4 Nov, v1.3 on 13 Nov), with figures.
3. **PHY-02 SciRex Model Screening Design** (27 Oct – 18 Nov).
4. **PHY-05 Physics Definitions and Favourites Design** (18 Nov).
5. **PHY-20 Shortlist Guard Design** (6 Nov), with figures.
6. **18 – Geometry Service** design, v0.3 to v0.7 and beyond (4–20 Nov).
7. **20 – Storing Run Results** (6 Nov). **LIB – Chat and Agent Storage Design** (12 Nov). **Analysis Templates Design Draft** (18 Nov).
8. **Model matching and screening research:** a research-backed pipeline plus a revised version (2 Nov), architecture and AI flow, surrogate-confidence research note, SciRex package requirements for screening (6 Nov), and Validation Steps Before Screening (about 20 revisions, 5–11 Nov, including replies to Nazaar's review).
9. **Demo and API:** Kognex Demo v2.4-s / v2.4-sri / v2.5 (about 20 revision snapshots, 10–19 Nov), demo decisions and unbacked screens, Demo v2.1 gap analysis, Kognex v2.1 API reference, web-app gaps.
10. **Planning:** Sprint 2 summary, Sprint 2 Project Service tables, Sprint 3 stories analysis and story edits, board stories (4 Nov), geometry task list and story rewording, Project Service run plan, stand-in specs for the Project and Insight services, snapshot contract for the orchestrator, project-service worklog.
11. **Branching:** Kognex branching strategy (`.docx`) **[CONFIRM authorship]**.

### R. Mentoring interns on ZIQ-Code (Aug 2026)

I trained two interns, **Ajay K** and **Sashriya M**, on ZIQ-Code, and gave them real features to build so they learned the actual flows (harness, quality gate, tools). Their commits in `zenteiq-inference/ziq-code`:

| Intern | Dates | Delivered |
|---|---|---|
| Sashriya M | 17–30 Aug | Firecrawl scraping and dynamic crawler support, crawler and scraping controls, ON/OFF toggle, DuckDuckGo search |
| Ajay K | 24–30 Aug | Quality gate integrated into task evaluation, quality-gate updates, harness subtask feedback, conversation stats, harness version |

`[FILL]` how the training was run: walkthroughs, code reviews, how features were assigned, and what each intern can now do on their own.

### S. ZIQ-Code design pack and orchestrator handover (from Downloads archives)

- **ZIQ-Code design pack (24 Sep – 1 Oct):** seven documents: core-features meeting summary, detailed architecture alignment (nine capabilities), feature plan with difficulty ratings, a six-agent feature comparison, a Codex evaluation for a private-model fork, a Copilot Chat evaluation, and a Copilot telemetry-path analysis. They fed the build-versus-fork decision and match the guardrail, sandbox, worktree and subagent features built in Sections 4.G and 4.H. **[CONFIRM authorship]**
- **Project Service contract for the orchestrator (11 Nov):** `CONTRACT.md`, two `.proto` files and a sample snapshot response: the gRPC contract the simulation orchestrator uses to fetch an analysis snapshot at run start, with caller-identity and tenant rules. Details in `contribution_reports/09_downloads_archives.md`.

### T. Further items found in a final file sweep

- **Transolver on the 3-D elbow pipe (19 Nov), confirmed as yours:** `train_transolver.py` and `transolver_elbow.yaml`, a YAML-driven pipeline with prepare, train and StableHLO-export stages.
- **Elbow model pack status (20 Nov), confirmed as yours:** an honest scoping review of what the GINO model (`gino_v2`, 220 FEniCSx cases) can and cannot deliver for the pilot.
- **Kognex Confluence doc set (14 Aug – 11 Sep), confirmed as yours:** eleven architecture documents: platform overview, system architecture, tech overview, agent architecture, AI/agent architecture, backend, database, job orchestration, storage and artifact, authentication and authorization, and a LangGraph Swarm vs A2A comparison.
- **Hiring:** you took part in interviewing candidates for the team (Oct 2026). `[FILL]` how many interviews, for which roles, and the outcome.
- **Excluded:** `battery_pack_test/` (not yours); the Code-DCR paper, its scripts and the hackathon proposal (personal); OCR experiments.

Full classification in `contribution_reports/10_sweep_unmentioned_files.md`.

### N. Upstream and cross-repo pull requests (GitHub)

| Date | Repo | PR | State |
|---|---|---|---|
| 8 Jun | `airexlab/fastvpinns` | #28 `write_vtk` produced invalid VTK files with a missing POINT_DATA header | open |
| 1 Sep | `anomalyco/opencode` (upstream) | #46552 Dynamic context compaction and TUI responsiveness | closed |
| 3 Sep | `zenteiq-inference/ziq-code` | #1 Autonomous self-evolution, security hooks, evaluation dossier | closed |
| 26 Oct – 20 Nov | `kognex-initial-arch` | 19 PRs: #2, #4, #5, #6, #8, #11, #18, #27, #29, #30, #31, #32, #48, #49, #51, #52, #53, #54, #58, #61 (Project, Geometry, Screening, demo) | closed `[VERIFY merged vs closed]` |

"Closed" on GitHub can mean merged or rejected; check each one before quoting it as merged.

### A. ZFormatter (`zenteiq-sciml/ZFormatter`, mirrored at `sridhar-zenteiq/ZFormatter`), 4–5 Jun 2026

**What it is.** A Python library that converts OpenFOAM (`foamToVTK`) and FEniCSx VTU output into compressed Z-format files (`.zmesh`, `.zscal`, `.zmeta`) with a deterministic simulation IR, for use in ML pipelines. Package name `zformat-sim`.

**What I owned and delivered**
1. Initial implementation and first commit (4 Jun), about 8.9k lines added across 8 commits by me. A second author (`abhilash-zenteiq-ai`) contributed 2 commits.
2. Converter with separate toggles for field patching and geometry patching, with tests for each.
3. Performance optimisation: skip loading and concatenating non-VOF field data when `enable_field_patches` is off.
4. Refactor: removed unused classes, functions and imports, fixed formatting, added spatial model adaptation.
5. VOF-only generation path with a converter-level test.
6. VTU readers written directly from XML (5 Jun) to remove a heavy dependency.
7. Reads simulation metadata from `system/controlDict`, `fvSchemes` and similar files, so metadata is optional for the caller.
8. Bridge into the SciML service: *"Integrate ZFormat bridge into SCIML service"* (1 Jun, in the LLM service), plus native `.zmesh` ingestion (23 Jun).

**Outcome / impact.** `[FILL]` (for example compression ratio, load time versus raw VTK, which pipelines now consume `.zmesh`). No benchmark numbers are recorded in the repo.

### B. Kognex Project Service (Azure DevOps, 19 Oct – 20 Nov 2026)

Repo: `kogneX/kognex-project-service`. This is the largest single deliverable. Each story below was a feature-branch commit and, where marked, a merged PR. About 50 other commits in the history are automated "Agent host session" checkpoints and are not counted as work.

| Story | What I delivered | PR |
|---|---|---|
| #1665 | Base setup with proto and access check | PR 8 |
| #1666 | Physics catalogue tables and seed of the pilot thermal model | PR 9 |
| #1667 | List and read physics definitions and favourites | PR 13 |
| #1668 | Parameter schema served over REST and gRPC (breaking change) | PR 27 |
| #1669 | Create a draft project | PR 28 |
| #1670 | List and read projects | PR 29 |
| #1671 | Rename and describe projects, Alembic migrations | PR 33 |
| #1672 / #1673 | Create an analysis or an iteration of one; list, read, rename, delete and set up analyses | PR 37 |
| #2594 | Test that each region keeps its role when a set-up is saved | `[VERIFY]` |
| #152 | Analysis snapshot: freeze an analysis for a run with real identity, list the geometry's ready part forms, return version tag and part measurements; fix reading the geometry service's real status and region values | PR 101, PR 121 |
| #2592 | Project tools served over MCP following the library design, draft tools (#2636), review-finding fixes; later versioned definitions, wizard drafts and pilot seeds | PR 116, PR 150 |
| #2619 | Seed the elbow pipe pilot, load its inputs into the pilot definition, real downgrades in migrations | `[VERIFY]` |
| #2620 / #2621 | Refuse a set-up save made on an old version; refuse a set-up that cannot run when it is saved | `[VERIFY]` |
| #132 | Seed the pilot thermal run report template | `[VERIFY]` |
| (final) | Folded the migrations into three, rules onto their enums (20 Nov) | `[VERIFY]` |

**Engineering practice shown:** conventional commits with story numbers, breaking changes marked with `!`, review-finding fix commits, contract-first (proto and `contracts/`), Alembic migrations with real downgrades, `AGENTS.md` and `azure-pipelines.yml` in the repo.

**Outcome / impact.** `[FILL]` (which downstream services call it, what the pilot demo could do once it landed).

### C. Kognex design documents (common repo `kognex-initial-arch`), 26 Oct – 20 Nov 2026

About 62 commits of mine in a repo shared with Nazaar, Lokesh, Chaitanya, Hardik and Ravish. Only my work is listed.

1. **Project Service design** (story #1656): pilot data model and APIs, favourites table and PascalCase catalogue values, analysis set-up as data on the analysis, `catalogue_as_of` as a date, solver compatibility asks the orchestrator and not the compute manager, equations of an analysis as separate terms, how the set-up is checked, saved and extended by add-ons, a Markdown copy of the design for agents.
2. **Later Project Service changes (18–19 Nov):** save and continue later on all ten wizard steps, wizard drafts, finished-set-up versions, symbols, notifications, one analysis-definition concept as the physics catalogue, the snapshot carries set-up and parameter rules and two pilot definitions, and a decision that the pilot has no consumer of `analysis.updated`.
3. **Geometry Service design** (story #140): polyMesh part flow and reuse, gmsh pilot part and reader per format, viewer surface on request, regions of one mesh file, per-region part forms and region matching, `region_keys`, solver tag per region and unique per type, sampling spec catalogue, point count on the form.
4. **Screening design** (story #1657): screening of models and points, with review replies; cover each point from the model's design table, not its training data.
5. **Kognex demo v2.4-s and v2.5** (10–11 Nov): the elbow pipe pilot demo, template lifecycle for analysis and report templates, reviewer sees every screened point before approving, project / analysis / run told apart, shortlist edits recorded.
6. **Skills added to the shared repo (26 Oct):** `z-design-drafts` skill, the `zenteiq-skills` suite, a personal locations registry for the usage navigator, and the Kognex platform rules and error framework skills. `[VERIFY authorship of the skills versus other contributors]`.
7. **Code-review skill rules (28 Oct):** test, alias and code-smell rules for `zenteiq-code-reviewer` in `zenteiq-coding-agent-skills`.

**Outcome / impact.** `[FILL]` (which design decisions were adopted by other teams).

### D. Kognex deployment and Insight Service (Oct – Nov 2026)

1. **`kognex-deployment`** (7 commits): project service demo stack, one docker compose that runs both demos, smoke test, link a project's geometry, documentation of every API with a real request, answer and refusal example, and (20 Nov, story #2436) running the latest project service with pilot stand-ins.
2. **`kognex-insight-service`** (12 Nov, 4 commits): created the insight service, its worker and tables (story #4, merged PR 111); rejection of any finding without evidence (#9); accept an analysis request and work on it later (#7). A second copy of the repo (`-ins06`) holds the same commits.
3. **`kognex-input-pack`** (23 Nov): the elbow GINO pack, mesh and contract drafts. Work in progress.

### E. Kognex LLM service (`sridhar-zenteiq/kognex-llm-service`), 7 May – 15 Sep 2026

About 65 commits. Built from an empty repository to a working SciML agent.

1. **May – initial service:** standalone repo, ADK orchestration, FastMCP SciML tools, REST API routes, `kognex_mcp` package, chat DB persistence, traditional-ML HTTP, SciML planner and tune hooks.
2. **May – model-tune orchestration:** scope, strategy plane, registry executors.
3. **Jun – ZFormat bridge and OpenFOAM:** ZFormat integration, OpenFOAM proof of concept, physics-informed critique-corrector agent, SSE training-progress stream, session-scoped artifact resolution, 7-day TTL caching, bidirectional provenance write-back, native `.zmesh` ingestion.
4. **Jul – Transolver and scoping:** Transolver skill integration, session-run artifact persistence, forced intent scoping on new prompts, strict session isolation for project memory (fixed a cross-session memory leak), multimodal image context, human-in-the-loop approval resume loop, 3D ROI sliders, Ramanujan remote model, planner mapping of OpenFOAM requests to the Transolver surrogate.
5. **Aug – planner and approval behaviour:** strategy LLM extracts parameter overrides, strategy plan message carries the `sciml_route` payload, Gmsh meshing guarded to physics queries only, NIM timeout 15 s to 120 s, endless auto-approval loop fixed, `/sessions` filtered by project and group (fixed chat threads leaking across projects), large external meshes routed to Transolver, dynamic OpenFOAM boundary conditions in place of template fallbacks.
6. **Zero-hardcoding rule:** repeatedly removed hardcoded keyword lists and regex parameter extraction in favour of prompt-driven LLM decisions (Jul 30, Aug 5, Aug 27, Sep 15); replaced hardcoded localhost URLs with settings.
7. **Sep – DB-backed prompt store with TTL cache and hot-reload**, and removal of hardcoded values.

**Outcome / impact.** `[FILL]` (response time for the surrogate path, number of conversations or runs served, demo milestones).

### F. Kognex frontend (`kognex-frontend`, `kognex-source-hub`), 25 Apr – 27 Aug 2026

About 60 unique commits across the two repos. `kognex-source-hub` also contains commits from the Lovable bot, which are not mine.

1. **Apr – results viewer:** VTKViewer with dynamic scalar fields and graceful handling of missing scalar data, VTPViewer using `@kitware/vtk.js`, SciML model integration UI.
2. **May – agentic hub:** chat and conversation clients pointed at the LLM service, LLM-backed projects, chat route, sessions sidebar, traditional-ML CSV attach, session-runs UI, model-tune SSE, design-system polish.
3. **Jun – new frontend (`source-hub`):** rebrand and redesign of Kognex, results page with VTK.js, workspace layout, theme toggle, agent-flow panel, chunked/XHR upload with progress stream and cancellation in chat.
4. **Jul – results and approvals:** Transolver metrics viewer and CAD geometry notice, 3D ROI box wireframe, multi-axis sliders, approval-card lifecycle fixes.
5. **Aug – streaming and cards:** duplicate approval card fixes, interactive strategy card only on the last AI message, "Physics Engine Executing" card only while the solver runs, dynamic streaming banner, `[DONE]` SSE handling, execution-milestone run dots and results buttons.
6. **27 Aug:** removed comments, mock datasets and dead legacy code.

### G. ZIQ-Code (`zenteiq-inference/ziq-code`, forked from opencode), 4 Aug – 15 Sep 2026

About 290 commits. `[CONFIRM]` how much was mine versus the upstream fork history; the count includes only commits authored under my email.

1. **Harness and self-evolution:** recursive evolutionary harness, prompt evolution, rule pruning, quality gate with dynamic task-aware evidence, AVO refiner, long-horizon hop tracker, personalization (structured LLM extraction stored in SQLite), domain library with vector similarity.
2. **Context handling:** LLM-based compaction in place of string slicing, larger buffer with a hard input ceiling, parallel swarm fan-out and join with result compression.
3. **Safety:** hard guardrails for command auditing and privilege protection, a three-layer env guard (allowlist, key blocklist, value scan), credential-prompt masking, Git worktree shadow isolation and Bubblewrap OS sandbox.
4. **Benchmarks:** automated SWE-bench batch runner with a dual-arm comparator, vLLM/DGX launch scripts (128k to 131k context, Blackwell fix), SHA-256 verified reproducibility report.
5. **Routing:** NVIDIA Switchyard composite classifier and libsy-aligned model router, with an interactive demo and tier-shifting verification.
6. **Product and tooling:** rebrand to ZIQ-CODE, Ink TUI components, Live Telemetry and Knowledge Graph sidebar, Hugging Face Hub integration, cross-platform install scripts and `INSTALL.md`, startup-freeze and TUI crash fixes.

### H. ZIQ-Code VS Code agent, Pi-based track, 29 Sep – 16 Oct 2026 `[CONFIRM with lead]`

Built as the **Ziq** coding agent: the VS Code commands were branded Ziq from 30 Sep. This is a separate codebase from the opencode-based ZIQ-Code CLI in Section 4.G. It is built on the open-source Pi agent (MIT) with a Copilot-Chat-derived VS Code extension, and only the work on top of that import is counted here (about +70.7k / −59.8k lines). It shares the Switchyard router with ZIQ-Code. Code currently lives at `github.com/sridhar-mani/npc-code`, under a personal account, and was renamed on 7–8 Oct.

About 340 commits.

1. VS Code extension for the Pi agent: live editor context injected into requests, VS Code language-model tools exposed to Pi, React/Radix sidebar, session persistence scoped to the workspace, Ollama integration, diagnostic logs, reproducible VSIX build and CI gates.
2. Runtime parity: ordered thinking, tool and subagent activity, queue and steer modes, skill manager, worktree isolation with merge and discard, guardrail modes, Switchyard picker (PR #13).
3. Agent architectures adapted from recent papers (RRSI, procedural graphs, Harness-Zero), exec-critic, airgap guard, PR autopilot, output reducer, dangerous-command prediction, and an Excel skill.

### I. Physics foundation-model research (`sridhar-mani/fm-physics`), 31 Aug – 31 Oct 2026 `[CONFIRM org relevance]`

About 175 commits under the personal email.

1. **Sep:** LoRA scope audit and forgetting check, velocity regularisation (halves H=5 rollout error), benchmark against MARIO, Flow Marching and GPhyT, followed by a **self-audit that retracted invalid benchmark claims** and fixed the metrics.
2. **Sep:** physics-conditioned continuous measurement tokenizer (Gates 1.1 to 1.6), Stage 2 frozen-tokenizer transfer, Stage 3 RINO / LNO / Transolver comparison, repository clean-up around a canonical C3 architecture specification.
3. **Sep – Oct:** novelty portfolio, tracks A to J run with pre-registered kill criteria; Tracks K, L, M, N (dual-scale tokenizer, drag R² 0.987 `[VERIFY]`), audits on real CFD data, 10k paired bootstrap runs.
*The WNO speech enhancement and WNO-Speech ASR work (27–31 Oct) is a personal project and is not included in this report.*

### J. Smaller items

| Date | Repo | Item |
|---|---|---|
| 31 Mar 2026 | `fenics` | First commit and requirements for the FEniCSx agent backend (Poisson script) |
| 2–3 Apr 2026 | `Reflective-Consolidation` | Initial commit |
| 27 Apr 2026 | `Paper repos/fenicspaper/MCP-SIM` | Test commit |
| 8 Jun 2026 | `fastvpinns` | Fix `write_vtk` to write a valid POINT_DATA section in 2D geometry |
| 15 Jun 2026 | `SciREX` | Refactored VTK export to use meshio and stabilised TensorFlow imports |
| 23 Jun 2026 | `scidata-ir` | Evolved single-field SciML pipeline to multi-field scaling with OpenFOAM and FEniCSx loaders |
| 4 Aug 2026 | `android/AutoAI` | Initial commit |

---

## 5. Technical / Functional Contributions

| Contribution area | What I contributed and why it mattered |
|---|---|
| Backend service design and build | Took the Project Service from a design document (#1656) to merged, contract-first REST, gRPC and MCP APIs with migrations, snapshots and pilot seed data. |
| Agentic AI orchestration | Built the SciML agent: intent scoping, planning, human-in-the-loop approval, model-tune, with prompts held in a database instead of code. |
| Data engineering | ZFormatter turns solver output into a compact, ML-ready format and is wired into the agent pipeline. |
| Safety and quality engineering | Guardrails and sandboxing in ZIQ-Code, session isolation fixes in the LLM service, and refusal rules in the Project and Insight services. |
| Research rigour | Self-audits and retractions in the foundation-model work, pre-registered kill criteria. |

## 6. Outcomes & Measurable Impact

Only figures that appear in the repos are filled in. Everything else needs your input.

| Area | Baseline / problem | Outcome / impact | Evidence |
|---|---|---|---|
| Project Service | No service for physics catalogue, projects, analyses | 9+ stories delivered, merged PRs 8, 9, 13, 27, 28, 29, 33, 37, 101, 116, 121, 150 | Azure repo |
| LLM service | No agent for SciML scoping or planning | Working agent with approval loop | `kognex-llm-service` |
| Chat privacy | Chat sessions and project memory leaked across projects or sessions | Filtered by project and group; strict session isolation (5 Aug, 30 Jul) | commits |
| Surrogate path | NIM fallback after 15 s | Timeout set to 120 s; surrogate path forced for sub-second runs (`[FILL]` measured latency) | commits |
| ZFormatter | Solver output not ML-ready | v1 with tests; `[FILL]` compression and speed numbers | repo |
| Physics SFT (Ramanujan) | Base Qwen produced no schema-compliant physics output | Stage 2 LoRA: schema compliance 0.0 → 0.72, semantic similarity 0.29 → 0.72; JSON validity fell 0.94 → 0.72 | `ramanujan_backup/benchmark_results/benchmark_comparison.md` |
| Model serving | No shared large-model endpoint | DeepSeek-V4-Flash served across two DGX Blackwell nodes behind LiteLLM `[VERIFY still in use]` | `meshing process/distributed_blackwell_stabilization_report.md` |
| Foundation research | Benchmark claims unverified | Invalid claims retracted, audited metrics `[FILL]` | `fm-physics` |

## 7. Quality, Validation & Engineering Rigour

- **Practices used:** tests with features (ZFormatter, ZIQ-Code, Project Service), review-finding fix commits, conventional commit format with story numbers, breaking-change markers, real downgrade migrations, `AGENTS.md` rules in repos.
- **Gaps and rework seen in history:** repeated scoping and approval-loop fixes in the LLM service (30 Jul, 5 Aug) and many `fix(vscode)` commits in NPC show iteration on unclear requirements; later commits remove hardcoded values `[REFLECT on lessons]`.
- **Standards followed:** zenteiq coding agent skills, Kognex platform rules, zero-hardcoding rule.
- **Evidence of quality:** merged PRs after review on Azure DevOps (PR 111, 116, 121, 150 and others).

## 8. Ownership & Problem Solving

| Prompt | Example (from the history) |
|---|---|
| Independent ownership | Built `kognex-llm-service` from an empty repo (7 May) and the Project Service from story #1665 onward. |
| Significant problem solved | Fixed chat threads and project memory leaking across sessions and projects. |
| Escalation / judgement | Rolled back a wrong direction (retracted benchmark claims, reverted TUI timeout guards); `[FILL]` any escalation to leads. |

## 9. Collaboration & Team Contribution

- **Cross-functional:** design documents in a repo shared with the platform team; the Project Service consumes the Geometry Service (#152, #140) built by another team member.
- **Knowledge sharing:** code-review skills, `z-design-drafts`, per-API request/answer/refusal documentation in `kognex-deployment`, `INSTALL.md` for ZIQ-Code.
- **Technical leadership:** lead of Pod C (Physics, Compute & Results) in the Kognex team allocation. Decider on the agent-runtime ADR. Reviewer (ARC-10) of the INS-01 insight design. Owner of the MCP contract rules (Section 4.Q).
- **Mentoring:** trained interns Ajay K and Sashriya M on ZIQ-Code through real feature work (Section 4.R).
- `[FILL]` feedback from reviewers and teammates.

## 10. Learning & Capability Development

| Capability | What I learned / improved | How applied |
|---|---|---|
| Contract-first service design | Proto, REST and MCP contracts before code; Alembic migrations | Project Service |
| Agent orchestration | ADK, FastMCP, SSE, human-in-the-loop resume | LLM service |
| Scientific data formats | OpenFOAM, FEniCSx VTU, VTK.js | ZFormatter, frontend viewer |
| Evaluation discipline | Pre-registration, bootstrap CIs, self-audit | foundation research |

## 11. Challenges, Lessons & Improvement Areas

| Challenge | Lesson | Change going forward |
|---|---|---|
| Approval and scoping loops repeated across several fixes | Decide the routing contract and test it before wiring UI | `[FILL]` |
| Hardcoded values kept returning | Enforce the zero-hardcoding rule in review | Prompt store and settings |
| Several one-word commit messages (`done`, `check`, `latest`, `Changes`) | Hard to audit later | Follow the zenteiq-commit convention everywhere |

## 12. Engineering, Data, IP & Information Discipline

- [ ] Work artefacts are stored in approved repositories, not only personal storage. **Check:** `pi-main` and `foundation` use a personal GitHub account (`sridhar-mani`), and `zformat` and the LLM service use `sridhar-zenteiq`.
- [ ] Proprietary code, model, data and product information handled within authorised access. **Check:** `~/Documents/keys and secs.txt` exists locally; keep secrets out of repos and this report.
- [ ] Review and approval steps followed. Azure PRs show this; the GitHub repos should be checked.

## 13. Employee Self-Assessment

Ratings are yours to give (1 = needs significant improvement, 3 = meets, 5 = exceptional).

| Dimension | Rating | Evidence |
|---|---|---|
| Technical / Functional Capability | `[FILL]` | Sections 4A to 4I |
| Quality & Rigour | `[FILL]` | Section 7 |
| Execution & Delivery | `[FILL]` | Section 4B merged PR list |
| Ownership & Accountability | `[FILL]` | Section 8 |
| Problem Solving & Learning Agility | `[FILL]` | Sections 4E, 4I |
| Collaboration & Communication | `[FILL]` | Section 9 |
| Professional / Information Discipline | `[FILL]` | Section 12 |

## 14. Next Six-Month Contribution Plan

`[FILL]`. Suggested starting points drawn from open work in the history:

1. Finish the elbow pipe pilot end to end (Project, Geometry, Insight services and `kognex-input-pack`).
2. Harden the LLM service (tests for scoping and approval routing, measured latency).
3. Publish ZFormatter with benchmark numbers.
4. Decide the status of ZIQ-Code, NPC and the foundation research inside the company.

## 15. Supporting Evidence Registry

| # | Evidence | Location |
|---|---|---|
| 1 | Project Service code and PRs | `dev.azure.com/zenteiq/kogneX/_git/kognex-project-service` |
| 2 | Design documents | `kognex-initial-arch` (Project, Geometry, Screening, demos) |
| 3 | Deployment demo stack | Azure repo `kognex-deployment` |
| 4 | Insight Service | Azure repo `kognex-insight-service` |
| 5 | LLM service | `github.com/sridhar-zenteiq/kognex-llm-service` |
| 6 | Frontend | `kognex-frontend`, `kognex-source-hub` |
| 7 | ZFormatter | `github.com/zenteiq-sciml/ZFormatter` |
| 7a | KogneX v1 monorepo | `github.com/sridhar-zenteiq-ai/KogneX` |
| 7b | Verifier agent, FEniCSx backend | `github.com/sridhar-zenteiq-ai/verifier-agent`, `/fenics` |
| 7c | zcode | `github.com/sridhar-zenteiq-ai/zcode` |
| 7d | Kognex design history (diagrams, HLD/LLD, Agent HLD, demos) | dated files in `~/Downloads`; move approved copies to a shared workspace before citing them |
| 8 | ZIQ-Code | `github.com/zenteiq-inference/ziq-code` |
| 9 | ZIQ-Code VS Code agent (Pi-based track) `[CONFIRM]` | `github.com/sridhar-mani/npc-code`; move to the Zenteiq org before citing |
| 10 | Foundation research `[CONFIRM]` | `github.com/sridhar-mani/fm-physics` |

## 16. Employee Declaration & Submission

I confirm that this report accurately represents my work and contribution during the stated period. I have distinguished my individual contribution from team contribution and provided evidence references in good faith.

| Employee Name | Signature | Date |
|---|---|---|
| Sridhar | `[FILL]` | `[FILL]` |

Submitted to: Engineering Lead `[FILL]`. Version: v0.1 draft.

## 17. Leadership Technical Review Acknowledgement

| Reviewer | Review status | Date | Initial / signature |
|---|---|---|---|
| Engineering Lead | [ ] Reviewed | | |
| VP – Product | [ ] Reviewed | | |
| VP – Engineering | [ ] Reviewed | | |
| Founder / Director | [ ] Reviewed | | |

*Record retention: Founder / Director controlled technical record. Not part of the general HR personnel file.*
