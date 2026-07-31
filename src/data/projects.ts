export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  huggingfaceUrl?: string | null;
  ollamaUrl?: string | null;
  status?: 'live' | 'development';
  pinned?: boolean;
  color: string;
  bgColor: string;
  challenges: string[];
  solutions: string[];
  features: string[];
  techStack: Record<string, string[]>;
  lastUpdated?: string;
  images: string[];
  mockup?: string;
  video?: string;
  /** Third-party data or libraries this project depends on */
  attributions?: {
    name: string;
    url: string;
    license?: string;
  }[];
}

export const projects: Project[] = [
  {
    "id": 2,
    "title": "NekoBeat",
    "category": "Music & Streaming",
    "status": "live",
    "description": "Find and play music from a few sources in one app, without jumping between tabs.",
    "longDescription": "I built NekoBeat because I got tired of digging for tracks in three places at once. Search, hit play, done.",
    "tags": [
      "TypeScript",
      "Rust",
      "JavaScript",
      "CSS",
      "HTML"
    ],
    "lastUpdated": "2026-05-04",
    "liveUrl": "https://nishal21.github.io/NekoBeat-Website/",
    "githubUrl": "https://github.com/nishal21/NekoBeat",
    "color": "from-pink-400 to-rose-400",
    "bgColor": "from-pink-400/10 to-rose-400/10",
    "challenges": [
      "Multiple music data sources",
      "Smooth in-browser playback"
    ],
    "solutions": [
      "API abstraction with caching",
      "Responsive player UI"
    ],
    "features": [
      "Cross-platform discovery",
      "Streaming playback",
      "Artist metadata"
    ],
    "techStack": {
      "languages": [
        "TypeScript",
        "Rust",
        "JavaScript",
        "CSS",
        "HTML"
      ],
      "deployment": [
        "GitHub Pages"
      ]
    },
    "images": [
      "/projects/neko-beat.svg"
    ],
    "pinned": true
  },
  {
    "id": 15,
    "title": "Geo Q&A",
    "category": "Machine Learning · Python",
    "status": "live",
    "description": "Plain-English geography Q&A. Verified database and Wikidata first; fine-tuned GPT-2 only when lookup fails.",
    "longDescription": "Ask about capitals, cities, countries, timezones, and currencies in plain English. Geo Q&A checks dr5hn's Countries States Cities Database and Wikidata (Wikimedia / Wikipedia) before touching a model, and tags answers as [verified database] or [wikidata]. The included GPT-2 was fine-tuned for under $2 on a rented Vast.ai GPU—it is a fallback, not the source of truth. Run python src/main.py for reliable facts; pull nishal21/geo-capital-llm from Hugging Face or Ollama only if you want the small model on its own.",
    "tags": [
      "Python",
      "GPT-2",
      "Hugging Face",
      "Wikidata",
      "Ollama"
    ],
    "lastUpdated": "2026-06-07",
    "liveUrl": null,
    "githubUrl": "https://github.com/nishal21/capital_llm_model",
    "huggingfaceUrl": "https://huggingface.co/nishal21/geo-capital-llm",
    "ollamaUrl": "https://ollama.com/nishal21/geo-capital-llm",
    "color": "from-teal-400 to-emerald-500",
    "bgColor": "from-teal-400/10 to-emerald-500/10",
    "challenges": [
      "No budget for larger models or scratch training",
      "LLM-only answers are unreliable for geographic facts"
    ],
    "solutions": [
      "Layered lookup: dataset → Wikidata → GPT-2 fallback",
      "Honest output tags and --db mode to skip the model"
    ],
    "features": [
      "150k+ cities via Countries States Cities Database (dr5hn)",
      "Wikidata for capitals and official languages",
      "GPT-2 fallback labeled [llm fallback]",
      "Published as nishal21/geo-capital-llm on Hugging Face and Ollama",
      "Database-only mode with --db"
    ],
    "attributions": [
      {
        "name": "Countries States Cities Database (dr5hn)",
        "url": "https://github.com/dr5hn/countries-states-cities-database",
        "license": "ODbL 1.0"
      },
      {
        "name": "Wikidata (Wikimedia / Wikipedia)",
        "url": "https://www.wikidata.org/",
        "license": "CC0"
      }
    ],
    "techStack": {
      "languages": [
        "Python"
      ],
      "models": [
        "GPT-2",
        "geo-capital-llm"
      ],
      "data": [
        "dr5hn/countries-states-cities-database",
        "Wikidata (Wikimedia)"
      ],
      "deployment": [
        "Hugging Face",
        "Ollama",
        "Vast.ai"
      ]
    },
    "images": [
      "/projects/geo-q-a.svg"
    ],
    "pinned": true
  },
  {
    "id": 1,
    "title": "NekoDroid",
    "category": "Systems · Wasm",
    "status": "development",
    "description": "Android emulator in the browser. Drop an APK in a tab, it runs in Wasm. No server in the middle.",
    "longDescription": "NekoDroid is the big systems bet: Rust core compiled to Wasm so Android apps can run client-side. Still very much in progress.",
    "tags": [
      "Rust",
      "TypeScript",
      "C",
      "CSS",
      "HTML"
    ],
    "lastUpdated": "2026-03-04",
    "liveUrl": null,
    "githubUrl": "https://github.com/nishal21/NekoDroid",
    "color": "from-slate-400 to-cyan-400",
    "bgColor": "from-slate-400/10 to-cyan-400/10",
    "challenges": [
      "Wasm performance for emulation",
      "APK loading without a backend"
    ],
    "solutions": [
      "Rust core compiled to Wasm",
      "Client-only execution model"
    ],
    "features": [
      "Browser APK runner (in progress)",
      "Wasm-native architecture",
      "Open source"
    ],
    "techStack": {
      "languages": [
        "Rust",
        "TypeScript",
        "C",
        "CSS",
        "HTML"
      ],
      "platform": [
        "WebAssembly",
        "Browser",
        "Android ABI"
      ]
    },
    "images": [
      "/projects/neko-droid.svg"
    ],
    "pinned": true
  },
  {
    "id": 6,
    "title": "Publicolio",
    "category": "Developer Tools",
    "status": "live",
    "description": "Turn a GitHub profile into a portfolio site. Pick repos, tweak the look, share a link.",
    "longDescription": "Publicolio pulls your GitHub profile, lets you curate what shows up, and gives you a page you can send to people.",
    "tags": [
      "TypeScript",
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "lastUpdated": "2026-05-01",
    "liveUrl": "https://app.publicolio.qzz.io/",
    "githubUrl": "https://github.com/nishal21/Publicolio",
    "color": "from-indigo-400 to-blue-400",
    "bgColor": "from-indigo-400/10 to-blue-400/10",
    "challenges": [
      "GitHub rate limits",
      "Theme without config files"
    ],
    "solutions": [
      "Cached API fetching",
      "Live theme preview"
    ],
    "features": [
      "Profile import",
      "Repo picker",
      "Shareable deploy"
    ],
    "techStack": {
      "languages": [
        "TypeScript",
        "HTML",
        "CSS",
        "JavaScript"
      ],
      "apis": [
        "GitHub API"
      ]
    },
    "images": [
      "/projects/publicolio.svg"
    ],
    "pinned": true
  },
  {
    "id": 13,
    "title": "Sigil-extractor",
    "category": "Cryptography · Rust",
    "status": "live",
    "description": "Rust tool that hides license proofs inside datasets using crypto steganography. Pull them back out and verify later.",
    "longDescription": "Sigil-extractor embeds cryptographic license proofs in data so you can prove who licensed what without trusting a server to hold the proof.",
    "tags": [
      "Rust"
    ],
    "lastUpdated": "2026-05-04",
    "liveUrl": "https://nishal21.github.io/Sigil-extractor/",
    "githubUrl": "https://github.com/nishal21/Sigil-extractor",
    "color": "from-violet-400 to-indigo-500",
    "bgColor": "from-violet-400/10 to-indigo-500/10",
    "challenges": [
      "ZK proof embedding in binary data",
      "Recoverable without server trust"
    ],
    "solutions": [
      "Rust-native crypto pipeline",
      "Browser demo on GitHub Pages"
    ],
    "features": [
      "License proof embedding",
      "Verification workflow",
      "Open source",
      "Rust core"
    ],
    "techStack": {
      "languages": [
        "Rust"
      ],
      "deployment": [
        "GitHub Pages"
      ]
    },
    "images": [
      "/projects/sigil-extractor.svg"
    ],
    "pinned": true
  },
  {
    "id": 8,
    "title": "CarbonLint",
    "category": "Developer Tools",
    "status": "live",
    "description": "Profiles your system in real time and rough-guesses the carbon footprint of the code you're running.",
    "longDescription": "CarbonLint shows energy use while you work and turns it into carbon numbers that are useful for comparison, not gospel.",
    "tags": [
      "JavaScript",
      "Rust",
      "CSS",
      "TypeScript",
      "HTML"
    ],
    "lastUpdated": "2026-05-01",
    "liveUrl": "https://carbonlint.netlify.app/",
    "githubUrl": "https://github.com/nishal21/CarbonLint",
    "color": "from-green-400 to-lime-400",
    "bgColor": "from-green-400/10 to-lime-400/10",
    "challenges": [
      "Accurate energy modeling",
      "Readable carbon metrics"
    ],
    "solutions": [
      "Real-time profiler",
      "Developer-friendly dashboard"
    ],
    "features": [
      "Energy tracking",
      "Carbon estimates",
      "Green dev tips"
    ],
    "techStack": {
      "languages": [
        "JavaScript",
        "Rust",
        "CSS",
        "TypeScript",
        "HTML"
      ]
    },
    "images": [
      "/projects/carbonlint.svg"
    ],
    "pinned": true
  },
  {
    "id": 7,
    "title": "Extracto",
    "category": "AI / Automation",
    "status": "live",
    "description": "Paste a URL, describe what you want, get structured data back. No custom scraper per site.",
    "longDescription": "Extracto turns plain-language prompts into scraped output. Handy when every site has different HTML.",
    "tags": [
      "Python"
    ],
    "lastUpdated": "2026-05-01",
    "liveUrl": "https://nishal21.github.io/Extracto/",
    "githubUrl": "https://github.com/nishal21/Extracto",
    "color": "from-emerald-400 to-teal-400",
    "bgColor": "from-emerald-400/10 to-teal-400/10",
    "challenges": [
      "Varied site layouts",
      "Prompt-to-schema mapping"
    ],
    "solutions": [
      "AI-guided extraction",
      "JSON export pipeline"
    ],
    "features": [
      "URL + prompt input",
      "Structured export",
      "Open source"
    ],
    "techStack": {
      "languages": [
        "Python"
      ]
    },
    "images": [
      "/projects/extracto.svg"
    ],
    "pinned": true
  },
  {
    "id": 11,
    "title": "NMHelper",
    "category": "Kerala Education",
    "status": "live",
    "description": "Noon-meal tracking for Kerala schools. Teachers and clerks log class strength without the paper chase.",
    "longDescription": "NMHelper swaps manual rounds for Malayalam-friendly forms and meal reports that clerks can actually use.",
    "tags": [
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS"
    ],
    "lastUpdated": "2026-05-27",
    "liveUrl": "https://nmhelper.in/",
    "githubUrl": null,
    "color": "from-orange-400 to-red-400",
    "bgColor": "from-orange-400/10 to-red-400/10",
    "challenges": [
      "Low-tech onboarding",
      "Government meal accuracy"
    ],
    "solutions": [
      "Malayalam UI",
      "Validated exports"
    ],
    "features": [
      "Strength tracking",
      "Meal calculations",
      "Admin dashboards"
    ],
    "techStack": {
      "standards": [
        "HTML5",
        "CSS3",
        "JavaScript (ES2022+)"
      ],
      "components": [
        "React",
        "Tailwind CSS",
        "Framer Motion",
        "Capacitor"
      ],
      "backend": [
        "Node.js",
        "Express",
        "PostgreSQL"
      ],
      "languages": [
        "English",
        "Malayalam"
      ],
      "doctype": [
        "HTML5"
      ]
    },
    "images": [
      "/projects/nmhelper.svg"
    ],
    "pinned": true
  },
  {
    "id": 19,
    "title": "World News CLI",
    "category": "Developer Tools · Terminal",
    "status": "live",
    "pinned": true,
    "description": "Full-screen terminal news reader for Python. Headlines, speak aloud, optional AI — free on PyPI as worldnews-cli.",
    "longDescription": "World News CLI (PyPI: worldnews-cli) is a full-screen Textual news reader for the terminal. Feeds on the left, headlines in the middle, article on the right — keyboard-first with themes, offline cache, custom RSS, speak aloud (Edge TTS by default), and optional AI summarize. Runs on Windows Terminal, macOS, Linux, and Android via Termux. Install with pip install worldnews-cli, then worldnews or python -m worldnews. Product site: nishal21.github.io/News-CLI. Source: github.com/nishal21/News-CLI.",
    "tags": [
      "Python",
      "Textual",
      "CLI",
      "PyPI"
    ],
    "lastUpdated": "2026-08-01",
    "liveUrl": "https://nishal21.github.io/News-CLI/",
    "githubUrl": "https://github.com/nishal21/News-CLI",
    "color": "from-emerald-400 to-lime-500",
    "bgColor": "from-emerald-400/10 to-lime-500/10",
    "challenges": [
      "Reading news in a terminal without a clunky pager",
      "PATH and install friction on Windows and Termux"
    ],
    "solutions": [
      "Three-pane Textual TUI with responsive narrow layouts",
      "Module entry (python -m worldnews) plus clear PATH docs"
    ],
    "features": [
      "Feeds, headline list, and article reader in one TUI",
      "Speak aloud (Edge TTS free; optional providers)",
      "Optional AI summarize / explain",
      "Custom RSS and built-in categories",
      "Offline cache and keyboard-first controls",
      "Free on PyPI: pip install worldnews-cli"
    ],
    "techStack": {
      "languages": [
        "Python"
      ],
      "stack": [
        "Textual",
        "PyPI"
      ],
      "platform": [
        "Windows",
        "macOS",
        "Linux",
        "Termux"
      ],
      "deployment": [
        "GitHub Pages",
        "PyPI"
      ]
    },
    "images": [
      "/projects/world-news-cli.svg"
    ]
  },
  {
    "id": 18,
    "title": "SANTRA",
    "category": "Kerala Education · Desktop",
    "status": "live",
    "description": "Offline student savings ledger for Kerala schools. Counter posts, balances, contra, and PDF reports on the school PC.",
    "longDescription": "SANTRA at santra.nishal.dev is a desktop student savings ledger for Kerala schools. Staff post deposits and withdrawals with a running cash balance, manage per-student accounts, record contra moves between SB, FD, and cash in hand, and print PDF reports for office or auditors. The SQLite ledger lives on the school PC—daily counter work runs fully offline, with no cloud account. Schools are onboarded by hand (WhatsApp or email); the site explains the product, and sign-in lives inside the Windows or Linux installer. Built for the savings desk where messy cash books break month-end totals.",
    "tags": [
      "Desktop",
      "SQLite",
      "PDF",
      "Kerala Schools"
    ],
    "lastUpdated": "2026-07-28",
    "liveUrl": "https://santra.nishal.dev/",
    "githubUrl": null,
    "color": "from-amber-400 to-orange-500",
    "bgColor": "from-amber-400/10 to-orange-500/10",
    "challenges": [
      "School savings counters lose track when paper cash books drift",
      "Need offline-first tooling that clerks can run on an existing PC"
    ],
    "solutions": [
      "Local SQLite ledger with counter, accounts, contra, and staff roles",
      "PDF reports plus hand-onboarded Windows/Linux installers per school"
    ],
    "features": [
      "Deposit and withdrawal posting with running cash balance",
      "Per-student accounts and savings history",
      "Contra between SB, FD, and cash in hand",
      "PDF reports for office, auditors, and parents",
      "Admin and counter staff logins",
      "Fully offline after install (SQLite on the school PC)"
    ],
    "techStack": {
      "platform": [
        "Windows",
        "Linux",
        "Desktop"
      ],
      "storage": [
        "SQLite"
      ],
      "features": [
        "PDF reports",
        "Staff roles"
      ],
      "deployment": [
        "santra.nishal.dev"
      ]
    },
    "images": [
      "/projects/santra.svg"
    ]
  },
  {
    "id": 17,
    "title": "Handoff",
    "category": "Developer Tools · P2P",
    "status": "live",
    "description": "Send files and text peer-to-peer in the browser. No upload server, no account.",
    "longDescription": "Handoff at send.nishal.dev shares files and text directly between browsers over a peer link—no middle server holding your data, no signup. Built for quick handoffs between your own devices or someone you trust on the same session. Free to use in the browser. Source repo is private.",
    "tags": [
      "TypeScript",
      "WebRTC",
      "P2P"
    ],
    "lastUpdated": "2026-07-28",
    "liveUrl": "https://send.nishal.dev/",
    "githubUrl": null,
    "color": "from-sky-400 to-cyan-500",
    "bgColor": "from-sky-400/10 to-cyan-500/10",
    "challenges": [
      "File drops that force a cloud upload first",
      "Sharing snippets without pasting into a third-party paste site"
    ],
    "solutions": [
      "Browser-native P2P transfer over WebRTC",
      "Single link for files and text in one flow"
    ],
    "features": [
      "Peer-to-peer file sharing",
      "In-browser text and code handoff",
      "No account required",
      "No upload server in the middle",
      "Free at send.nishal.dev"
    ],
    "techStack": {
      "languages": [
        "TypeScript"
      ],
      "apis": [
        "WebRTC"
      ],
      "deployment": [
        "send.nishal.dev"
      ]
    },
    "images": [
      "/projects/handoff.svg"
    ]
  },
  {
    "id": 16,
    "title": "RYTU",
    "category": "Productivity · Life OS",
    "status": "live",
    "description": "Habits, tasks, and planner in one tab. Data stays on your device—no signup.",
    "longDescription": "RYTU is a local-first life OS at rytu.nishal.dev: track habits and streaks, pin focus tasks, plan the week, and read momentum from one Today screen. Habits and tasks live in IndexedDB on your device—no RYTU cloud account, no ads. Optional AI uses your own Groq, OpenAI, Anthropic, or Hack Club AI key, encrypted with AES-GCM before storage. Install as a PWA or use in the browser; export JSON anytime from Settings. Published under NK Codex LLP. Source repo is private.",
    "tags": [
      "TypeScript",
      "PWA",
      "IndexedDB",
      "Dexie"
    ],
    "lastUpdated": "2026-07-28",
    "liveUrl": "https://rytu.nishal.dev/",
    "githubUrl": null,
    "color": "from-violet-400 to-purple-500",
    "bgColor": "from-violet-400/10 to-purple-500/10",
    "challenges": [
      "Habits, tasks, and calendar usually split across apps",
      "Users who refuse another cloud signup flow"
    ],
    "solutions": [
      "Single Today view with habits, focus tasks, and momentum",
      "Local-first Dexie/IndexedDB storage with JSON export"
    ],
    "features": [
      "Habits, streaks, and momentum score",
      "Tasks with up to three pinned focus items",
      "Planner, routines, and weekly calendar",
      "Optional BYOK AI (keys encrypted at rest)",
      "Works offline; installable PWA",
      "No account, no ads, no RYTU cloud backend"
    ],
    "techStack": {
      "languages": [
        "TypeScript"
      ],
      "storage": [
        "IndexedDB",
        "Dexie"
      ],
      "platform": [
        "PWA",
        "Android"
      ],
      "deployment": [
        "rytu.nishal.dev"
      ]
    },
    "images": [
      "/projects/rytu.svg"
    ]
  },
  {
    "id": 14,
    "title": "GitHub Stars Organizer",
    "category": "Developer Tools · CLI",
    "status": "live",
    "description": "Sort 300+ GitHub stars into lists in minutes. Free heuristics by default, optional LLM if you want it.",
    "longDescription": "GitHub's API can star repos but not manage Star Lists. This CLI fetches your stars, groups them by topics and language, lets you review the plan, then applies lists through your browser session. No paid AI required to get started.",
    "tags": [
      "Python",
      "CLI",
      "GitHub API"
    ],
    "lastUpdated": "2026-06-08",
    "liveUrl": null,
    "githubUrl": "https://github.com/nishal21/github-stars-organizer",
    "color": "from-amber-400 to-yellow-500",
    "bgColor": "from-amber-400/10 to-yellow-500/10",
    "challenges": [
      "No public API for GitHub Star Lists",
      "Hundreds of repos to categorize fairly"
    ],
    "solutions": [
      "Heuristic planner with custom category rules",
      "Dry-run apply and resume after interrupts"
    ],
    "features": [
      "Plan from public metadata only",
      "Optional multi-provider LLM mode",
      "Browser session apply with CSRF handling",
      "PyPI-ready Python package"
    ],
    "techStack": {
      "languages": [
        "Python"
      ],
      "tooling": [
        "uv",
        "pytest",
        "ruff"
      ],
      "apis": [
        "GitHub REST API"
      ]
    },
    "images": [
      "/projects/github-stars-organizer.svg"
    ]
  },
  {
    "id": 3,
    "title": "Otazumi",
    "category": "Anime & Streaming",
    "status": "live",
    "description": "Anime streaming with search, favorites, watch parties, and a pile of backend services holding it together.",
    "longDescription": "Otazumi is the anime app I kept adding to: streaming front end plus auth, reviews, mail, watch parties. Where my edit brain meets full-stack work.",
    "tags": [
      "JavaScript"
    ],
    "lastUpdated": "2025-10-28",
    "liveUrl": "https://www.otazumi.page/",
    "githubUrl": "https://github.com/nishal21/otazumi-auth",
    "color": "from-teal-400 to-emerald-400",
    "bgColor": "from-teal-400/10 to-emerald-400/10",
    "challenges": [
      "Large catalog search",
      "Streaming UX across devices"
    ],
    "solutions": [
      "Cached API layer",
      "Favorites & watchlists"
    ],
    "features": [
      "Anime library",
      "User favorites",
      "Watch party",
      "Responsive design"
    ],
    "techStack": {
      "languages": [
        "JavaScript"
      ],
      "services": [
        "otazumi-auth",
        "otazumi-mail",
        "otazumi-notification",
        "otazumi-review"
      ]
    },
    "images": [
      "/projects/otazumi.svg"
    ],
  },
  {
    "id": 4,
    "title": "OtakuPulse",
    "category": "Discord & Anime",
    "status": "live",
    "description": "Discord bot for anime and manga alerts, daily quotes, trailers, plus a web dashboard.",
    "longDescription": "OtakuPulse pings Discord servers when episodes drop, pulls from AniList, and gives admins a dashboard to configure it.",
    "tags": [
      "JavaScript"
    ],
    "lastUpdated": "2025-10-18",
    "liveUrl": "https://otakupulse.onrender.com/",
    "githubUrl": "https://github.com/nishal21/OtakuPulse",
    "color": "from-blue-400 to-purple-400",
    "bgColor": "from-blue-400/10 to-purple-400/10",
    "challenges": [
      "API polling at scale",
      "Per-server config"
    ],
    "solutions": [
      "Rate-limited AniList sync",
      "MongoDB server settings"
    ],
    "features": [
      "Episode alerts",
      "Daily quotes",
      "Web dashboard"
    ],
    "techStack": {
      "languages": [
        "JavaScript"
      ],
      "stack": [
        "Node.js",
        "Discord.js",
        "MongoDB"
      ]
    },
    "images": [
      "/projects/otaku-pulse.svg"
    ],
  },
  {
    "id": 5,
    "title": "Musico",
    "category": "Music & Discovery",
    "status": "live",
    "description": "Browse music with stations, lyrics, and artist info pulled from a few APIs.",
    "longDescription": "Musico is metadata-heavy browsing with stations and recommendations. Sister project to NekoBeat, same music brain.",
    "tags": [
      "TypeScript",
      "JavaScript",
      "CSS"
    ],
    "lastUpdated": "2025-10-27",
    "liveUrl": "https://musico21.netlify.app/",
    "githubUrl": "https://github.com/nishal21/musico",
    "color": "from-violet-400 to-fuchsia-400",
    "bgColor": "from-violet-400/10 to-fuchsia-400/10",
    "challenges": [
      "Multi-API metadata",
      "In-browser stations"
    ],
    "solutions": [
      "Unified API layer",
      "Redis caching"
    ],
    "features": [
      "Search",
      "Lyrics",
      "Stations",
      "Recommendations"
    ],
    "techStack": {
      "languages": [
        "TypeScript",
        "JavaScript",
        "CSS"
      ],
      "stack": [
        "Node.js",
        "Redis",
        "MongoDB"
      ]
    },
    "images": [
      "/projects/musico.svg"
    ],
  },
  {
    "id": 9,
    "title": "ARGUS",
    "category": "Data Viz · 3D",
    "status": "live",
    "description": "3D globe that tracks flights and satellites. CRT, night vision, and thermal shader modes because why not.",
    "longDescription": "ARGUS plots live tracking data on a WebGL globe. I went heavy on post-processing because the spy-movie look is half the fun.",
    "tags": [
      "JavaScript",
      "CSS",
      "HTML"
    ],
    "lastUpdated": "2026-03-03",
    "liveUrl": "https://nishal21.github.io/ARGUS/",
    "githubUrl": "https://github.com/nishal21/ARGUS",
    "color": "from-lime-400 to-green-600",
    "bgColor": "from-lime-400/10 to-green-600/10",
    "challenges": [
      "Real-time object feeds",
      "Heavy shader performance"
    ],
    "solutions": [
      "Optimized globe renderer",
      "Toggleable post-FX modes"
    ],
    "features": [
      "Flight tracking",
      "Satellite layer",
      "Shader modes"
    ],
    "techStack": {
      "languages": [
        "JavaScript",
        "CSS",
        "HTML"
      ],
      "features": [
        "WebGL",
        "3D Globe",
        "Shaders"
      ]
    },
    "images": [
      "/projects/argus.svg"
    ],
  },
  {
    "id": 10,
    "title": "Veyra",
    "category": "Programming Language",
    "status": "live",
    "description": "Programming language I'm designing. Docs and a playground live on GitHub Pages.",
    "longDescription": "Veyra is a language experiment: syntax I'm happy with, types that help, toolchain in Rust.",
    "tags": [
      "Rust"
    ],
    "lastUpdated": "2025-12-29",
    "liveUrl": "https://nishal21.github.io/veyraweb/",
    "githubUrl": "https://github.com/nishal21/veyra",
    "color": "from-violet-400 to-purple-500",
    "bgColor": "from-violet-400/10 to-purple-500/10",
    "challenges": [
      "Expressive syntax",
      "Compiler speed"
    ],
    "solutions": [
      "Rust toolchain",
      "Interactive docs"
    ],
    "features": [
      "Modern syntax",
      "Type inference",
      "Playground"
    ],
    "techStack": {
      "languages": [
        "Rust"
      ],
      "deployment": [
        "GitHub Pages"
      ]
    },
    "images": [
      "/projects/veyra.svg"
    ],
  },
  {
    "id": 12,
    "title": "Askira",
    "category": "Form Builder",
    "status": "development",
    "description": "Form builder with conditional logic and custom themes. Still building it.",
    "longDescription": "Askira is meant to be a proper form platform: drag fields, validate smart, share with a team. Private repo while the core ships.",
    "tags": [
      "React",
      "Node.js",
      "TypeScript",
      "In Development"
    ],
    "liveUrl": null,
    "githubUrl": null,
    "color": "from-purple-400 to-pink-400",
    "bgColor": "from-purple-400/10 to-pink-400/10",
    "challenges": [
      "Drag-and-drop builder",
      "Real-time collaboration"
    ],
    "solutions": [
      "React state architecture",
      "WebSocket sync (planned)"
    ],
    "features": [
      "Form builder UI (WIP)",
      "Conditional logic",
      "Themes",
      "Analytics"
    ],
    "techStack": {
      "frontend": [
        "React",
        "TypeScript"
      ],
      "backend": [
        "Node.js",
        "PostgreSQL"
      ]
    },
    "images": [
      "/projects/askira.svg"
    ],
    }
];

export function getProjectThumbnail(id: number): string | null {
  const project = projects.find((p) => p.id === id);
  return project?.images?.[0] ?? project?.mockup ?? null;
}

export function isProjectInDevelopment(project: Project): boolean {
  return project.status === 'development';
}

export function getProjectSlug(project: Project): string {
  if (project.githubUrl) {
    const match = project.githubUrl.match(/\/([^/]+)\/?$/);
    if (match) return match[1].toLowerCase();
  }

  return project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getProjectBySlug(slug: string): Project | undefined {
  const normalized = slug.toLowerCase();
  return projects.find((project) => getProjectSlug(project) === normalized);
}
