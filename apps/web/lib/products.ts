import type { StatusLevel } from "@konjoai/ui";

export type ProductFeature = {
  glyph: string;
  title: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  /** Glyph rendered in cards and behind the product hero. */
  glyph: string;
  /** Eyebrow used on the product page hero — e.g. sprint position. */
  eyebrow: string;
  /** Current shipped version (string from each repo). */
  version: string;
  /** Mock service health surfaced on the /status page. */
  status: StatusLevel;
  github: string;
  demo: string;
  /** Long-form description shown on the product page below the hero. */
  about: string;
  features: ProductFeature[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "squish",
    name: "squish",
    tagline: "MLX-accelerated local LLM inference for Apple Silicon, OpenAI-compatible.",
    glyph: "◐",
    eyebrow: "Sprint 4 · Inference Cockpit",
    version: "v9.14.0",
    status: "operational",
    github: "https://github.com/konjoai/squish",
    demo: "https://squish.konjo.ai",
    about:
      "A local-first inference server with honest quantization, agent tool execution, and Ollama/OpenAI-compatible APIs. Routes to MLX on Apple Silicon and PyTorch elsewhere — same wire format, same observability.",
    features: [
      {
        glyph: "◐",
        title: "Apple Silicon native",
        description: "MLX + mlx-lm path on M-series — Metal-accelerated decode without leaving Python.",
      },
      {
        glyph: "→",
        title: "OpenAI-compatible API",
        description: "SSE streaming, agent tools, /v1/chat/completions parity — drop-in for existing clients.",
      },
      {
        glyph: "◇",
        title: "Honest quantization gates",
        description: "INT4 AWQ ≥ 70.6% arc_easy on Qwen2.5-1.5B. SQINT2 ships only when it beats the gate.",
      },
    ],
  },
  {
    slug: "vectro",
    name: "vectro",
    tagline: "Ultra-high-performance embedding compression — Rust kernels, optional Mojo SIMD.",
    glyph: "◇",
    eyebrow: "Sprint 6 · Quantization Forge",
    version: "v5.0.2 / v8.0.0",
    status: "operational",
    github: "https://github.com/konjoai/vectro",
    demo: "https://vectro.konjo.ai",
    about:
      "Seven codecs for compressing dense embeddings — INT8, NF4, PQ-96, Binary, HNSW, RQ, VQZ — with PyO3 bindings, criterion benchmarks, and a Mojo path for SIMD-friendly hardware.",
    features: [
      {
        glyph: "▦",
        title: "Seven codecs",
        description: "INT8 · NF4 · PQ-96 · Binary · HNSW · RQ · VQZ — pick the floor of your accuracy / size trade.",
      },
      {
        glyph: "⌬",
        title: "Rust + Mojo SIMD",
        description: "ndarray + rayon under the hood; optional Mojo backend for SIMD-friendly chips.",
      },
      {
        glyph: "≡",
        title: "1020 + 109 tests passing",
        description: "Python and Rust suites both green. PyO3 zero-copy interop verified per release.",
      },
    ],
  },
  {
    slug: "kyro",
    name: "kyro",
    tagline: "Production RAG with hybrid retrieval, ColBERT reranking, and end-to-end RAGAS evals.",
    glyph: "✸",
    eyebrow: "Sprint 5 · RAG Observatory",
    version: "v1.2.0",
    status: "operational",
    github: "https://github.com/konjoai/kyro",
    demo: "https://kyro.konjo.ai",
    about:
      "BM25 + dense fusion, HyDE, ColBERT reranking, GraphRAG, multi-tenancy, distributed semantic cache on Redis, OTel + Prometheus, Helm charts, and an MCP server — all behind a streaming agent.",
    features: [
      {
        glyph: "✶",
        title: "Hybrid retrieval",
        description: "BM25 + dense fusion, HyDE expansion, ColBERT rerank — measured against RAGAS.",
      },
      {
        glyph: "◈",
        title: "Production-grade",
        description: "OTel + Prometheus, distributed Redis cache, Helm charts, multi-tenant by default.",
      },
      {
        glyph: "⌘",
        title: "MCP server included",
        description: "Drop kyro into Claude Code or any MCP host as a retrieval primitive.",
      },
    ],
  },
  {
    slug: "kairu",
    name: "kairu",
    tagline: "Real-time inference optimizer — speculative decoding, early-exit, KV caching, p50/p95/p99 budgets.",
    glyph: "▲",
    eyebrow: "Sprint 3 · Speed Cockpit",
    version: "v0.6.0",
    status: "operational",
    github: "https://github.com/konjoai/kairu",
    demo: "https://kairu.konjo.ai",
    about:
      "Python-first speed lab — speculative decoding, early-exit decoding, KV cache management, token budgets, benchmarking with strict p50/p95/p99 SLOs, streaming API, and a Rich live dashboard.",
    features: [
      {
        glyph: "↟",
        title: "Speculative decoding",
        description: "Draft model proposes, target verifies — measure acceptance rate before celebrating.",
      },
      {
        glyph: "○",
        title: "Optional ML stack",
        description: "Core ships without PyTorch — HF backend is `kairu[hf]`, server is `kairu[server]`.",
      },
      {
        glyph: "⌖",
        title: "p50/p95/p99 budgets",
        description: "Latency SLOs encoded in CI — regressions block merge before they ship.",
      },
    ],
  },
  {
    slug: "miru",
    name: "miru",
    tagline: "Multimodal reasoning tracer — what vision-language models actually attend to.",
    glyph: "◉",
    eyebrow: "Sprint 2 · Mind of the Machine",
    version: "v0.5.0",
    status: "operational",
    github: "https://github.com/konjoai/miru",
    demo: "https://miru.konjo.ai",
    about:
      "Extract, visualize, and explain VLM attention. Overlay maps on the original image, capture reasoning traces, and record labeled corpora for training data collection.",
    features: [
      {
        glyph: "◎",
        title: "Attention overlays",
        description: "Per-token / per-layer attention rendered on the source image with explanatory captions.",
      },
      {
        glyph: "▼",
        title: "Dataset recorder",
        description: "Capture (image, prompt, attention, decision) tuples for downstream fine-tuning.",
      },
      {
        glyph: "◌",
        title: "FastAPI + Pydantic v2",
        description: "Strict typed inputs, optional CLIP integration, batch upload from a single CLI.",
      },
    ],
  },
  {
    slug: "toki",
    name: "toki",
    tagline: "Adversarial fine-tuning lab — break the model, fix the model, prove it.",
    glyph: "✕",
    eyebrow: "Sprint 8 · Adversarial Arena",
    version: "v0.5.0",
    status: "degraded",
    github: "https://github.com/konjoai/toki",
    demo: "https://toki.konjo.ai",
    about:
      "Generate adversarial datasets (jailbreak, injection, edge-case, boundary), evaluate robustness, LoRA fine-tune, and measure what actually improved. Rust CLI delegates to a Python PEFT trainer.",
    features: [
      {
        glyph: "✕",
        title: "Adversarial datasets",
        description: "Four canonical sets: jailbreak, prompt injection, edge-case, decision boundary.",
      },
      {
        glyph: "↺",
        title: "LoRA + measurement",
        description: "Train the patch, then verify against the same adversarial axis. No vibes-only gains.",
      },
      {
        glyph: "◀",
        title: "Rust CLI · Python core",
        description: "clap-driven Rust front-end; PEFT trainer behind `toki[train]`.",
      },
    ],
  },
  {
    slug: "kohaku",
    name: "kohaku",
    tagline: "Episodic memory for LLMs — persistent, associative, beyond context windows.",
    glyph: "❖",
    eyebrow: "Sprint 7 · Memory Garden",
    version: "v0.4.0",
    status: "operational",
    github: "https://github.com/konjoai/kohaku",
    demo: "https://kohaku.konjo.ai",
    about:
      "Hyperdimensional Computing in Rust with optional Python bindings. Temporal decay, semantic consolidation, and an OpenAI-compatible memory middleware that drops in front of any chat completion API.",
    features: [
      {
        glyph: "❖",
        title: "HDC memory",
        description: "Hyperdimensional vectors give cheap, associative recall — no embedding model required.",
      },
      {
        glyph: "⌛",
        title: "Temporal decay",
        description: "Memories age out by configurable half-life; consolidation preserves semantic essence.",
      },
      {
        glyph: "↳",
        title: "OpenAI middleware",
        description: "Drop in front of any /v1/chat/completions and your agent has persistent memory.",
      },
    ],
  },
  {
    slug: "lopi",
    name: "lopi",
    tagline: "Rust agent orchestrator for Claude Code — git-isolated branches, retries, chat control.",
    glyph: "⌬",
    eyebrow: "Tooling · Agent Orchestrator",
    version: "v0.1.0",
    status: "operational",
    github: "https://github.com/konjoai/lopi",
    demo: "https://lopi.konjo.ai",
    about:
      "Run concurrent Claude Code agents on isolated git branches with retry loops, SQLite memory, a TUI + web dashboard, and remote control over Telegram and WhatsApp.",
    features: [
      {
        glyph: "⌬",
        title: "Git-isolated agents",
        description: "Branch-per-task with diffable outputs — merge what you want, throw away the rest.",
      },
      {
        glyph: "▤",
        title: "TUI · web · chat",
        description: "ratatui for the terminal, axum for the web, teloxide for Telegram. Same state.",
      },
      {
        glyph: "◇",
        title: "SQLite session memory",
        description: "Persistent across restarts. Resume an in-flight investigation from any device.",
      },
    ],
  },
  {
    slug: "drex",
    name: "drex",
    tagline: "Post-transformer hybrid architecture — break the inference paradigm.",
    glyph: "✦",
    eyebrow: "Research · Hybrid Architecture",
    version: "v0.2",
    status: "research",
    github: "https://github.com/konjoai/drex",
    demo: "https://drex.konjo.ai",
    about:
      "ESN reservoir + HDC token encoder + Mamba PCN backbone + NoProp semantic memory + RL controller + KAN readout. Research-grade, CI-gated, Metal-accelerated via candle.",
    features: [
      {
        glyph: "✦",
        title: "Six-stage hybrid",
        description: "ESN · HDC · Mamba PCN · NoProp · RL · KAN — each stage tested in isolation and end-to-end.",
      },
      {
        glyph: "▣",
        title: "Metal-accelerated",
        description: "candle-core on Apple Silicon; PyO3 bridge to a Python research front-end.",
      },
      {
        glyph: "≋",
        title: "136 tests passing",
        description: "Workspace gates: oxidizr + blazr crates green. CI hard-stops at any red.",
      },
    ],
  },
];

export const PRODUCT_BY_SLUG: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
);

export const PRODUCT_NAV_GROUP = {
  label: "Products",
  items: PRODUCTS.map((p) => ({ label: p.name, href: `/products/${p.slug}` })),
};
