# EnvScrub 🛡️

> **Share your config, not your secrets.**
> Free, no-login, 100% client-side web application to sanitize and format `.env` files and DevOps configurations in one click.

---

## 🚀 Live Demo & Purpose

Developers and DevOps engineers frequently share environment configurations in Slack, Jira tickets, release emails, or with AI chats (ChatGPT, Claude). Doing this manually requires:
1. Deleting every secret token, password, or key (slow, tedious, and prone to accidental leaks).
2. Manually stripping DevOps JSON quotes (`"KEY": "value"` or `KEY="value"`).

**EnvScrub solves both instantly:**
- **Sanitize Mode (Keep values OFF):** Strips all values while keeping keys, structure, and `# comments` identical.
- **Clean Mode (Keep values ON):** Retains values while removing DevOps quotes, trailing commas, and formatting inconsistencies.
- **Per-Key Overrides & Smart Select:** Keep non-sensitive variables (`PORT`, `NODE_ENV`) while stripping secrets (`API_KEY`, `DB_PASSWORD`).

---

## 🔒 The Privacy Promise (Zero Data Exfiltration)

1. **100% Client-Side:** Everything runs in transient browser memory via pure TypeScript. There is **zero backend server**, zero API requests, and zero content logging.
2. **Strict Content Security Policy (CSP):** Enforces `connect-src 'none'`. The browser blocks any outgoing network requests.
3. **Zero Content Persistence:** Pasted configs are never saved to `localStorage`, `sessionStorage`, cookies, or URL parameters. Only the UI theme and spacing settings are remembered.
4. **Self-Hosted Assets:** Fonts (`Inter` and `JetBrains Mono`) are self-hosted via `@fontsource-variable` packages — no requests to Google Fonts.
5. **Verify in DevTools:** Open `DevTools (F12) -> Network tab`. Paste your secrets and watch: **zero network requests** are sent.

---

## 🛠️ Architecture & Pipeline

```
       [Raw Input: .env / DevOps JSON / YAML]
                         │
                         ▼
             ┌───────────────────────┐
             │    parseDocument()    │ ◄── Handles BOM, CRLF, Multi-line Quotes
             └───────────┬───────────┘
                         │ ParsedLine[]
                         ▼
             ┌───────────────────────┐
             │        scrub()        │ ◄── Applies Global Mode + Overrides + Spacing
             └───────────┬───────────┘
                         │ ScrubbedLine[]
                         ▼
             ┌───────────────────────┐
             │      serialize()      │ ◄── Formats KEY= or KEY = into output text
             └───────────┬───────────┘
                         │
                         ▼
       [Clean / Sanitized .env Output Text]
```

- `src/features/scrubber/engine/` is pure TypeScript with **zero React or DOM dependencies**. It can be compiled for CLI tools, VS Code extensions, or standalone npm packages.
- Live debounced conversion (~150ms).

---

## 📋 Supported Formats

| Format | Input Example | Output (Sanitize) | Output (Clean) |
|---|---|---|---|
| dotenv (plain) | `PORT=3000` | `PORT=` | `PORT=3000` |
| dotenv (spaced) | `PORT = 3000` | `PORT=` | `PORT=3000` |
| Quoted values | `SECRET="my secret"` | `SECRET=` | `SECRET=my secret` |
| Single quotes | `TOKEN='token123'` | `TOKEN=` | `TOKEN=token123` |
| Export prefix | `export DB_HOST=localhost` | `export DB_HOST=` | `export DB_HOST=localhost` |
| DevOps JSON line | `"gemin_api_key ": "088w9eoundn"` | `gemin_api_key=` | `gemin_api_key=088w9eoundn` |
| Full JSON object | `{ "KEY": "val", "PORT": 5000 }` | `KEY=\nPORT=` | `KEY=val\nPORT=5000` |
| YAML-like | `API_URL: https://api.io` | `API_URL=` | `API_URL=https://api.io` |
| Comments & blanks | `# Database config` | `# Database config` | `# Database config` |
| Multi-line quoted | `RSA_KEY="-----BEGIN...\n...-----END..."` | `RSA_KEY=` | `RSA_KEY="-----BEGIN...\n...-----END..."` |

---

## 📁 Folder Structure

```
envscrub/
├── public/
│   └── favicon.svg                  # SVG favicon
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Page composition
│   │   └── providers/
│   │       └── ThemeProvider.tsx    # Dark / Light theme context
│   ├── components/
│   │   ├── ui/                      # Reusable UI primitives (Button, Toggle, Select, Badge, Card)
│   │   └── layout/                  # Responsive layout (Header, Footer, Container, Section)
│   ├── features/
│   │   ├── landing/                 # Marketing sections
│   │   │   ├── components/          # Hero, HowItWorks, BeforeAfter, TrustPrivacy, Formats, Faq
│   │   │   └── content.ts           # Centralized marketing text & copy
│   │   └── scrubber/                # Core product feature
│   │       ├── components/          # ScrubberTool, InputPanel, OutputPanel, OptionsBar, KeyList, StatsBar
│   │       ├── engine/              # Pure TypeScript parsing engine (Zero React/DOM)
│   │       │   ├── parseLine.ts & parseLine.test.ts
│   │       │   ├── parseDocument.ts & parseDocument.test.ts
│   │       │   ├── scrub.ts & scrub.test.ts
│   │       │   ├── serialize.ts & serialize.test.ts
│   │       │   ├── sensitiveKeys.ts & sensitiveKeys.test.ts
│   │       │   └── sampleData.ts
│   │       ├── hooks/               # useScrubber, useDebouncedValue
│   │       └── ScrubberTool.test.tsx# RTL integration tests
│   ├── hooks/                       # Shared hooks (useClipboard, useLocalStorage, useTheme)
│   ├── lib/                         # Utility helpers (cn, download)
│   ├── styles/                      # Tailwind CSS v4 entry
│   └── main.tsx                     # React root mount
├── index.html                       # Strict CSP & SEO metadata
├── vite.config.ts                   # Tailwind v4 plugin, alias, Vitest
└── tsconfig.json                    # Strict TypeScript configuration
```

---

## 💻 How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/your-username/envscrub.git
cd envscrub

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Tests
```bash
# Run all Vitest engine and RTL integration tests (43 tests)
npm test

# Watch mode
npm run test:watch
```

### Production Build & Lint
```bash
# Run ESLint (enforces strict mode, no-explicit-any)
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔌 How to Add a New Input Format

The engine is modular by design. To add support for a new syntax (e.g., Docker Compose `- KEY=val` or Kubernetes config maps):

1. **Update `SourceFormat` in `src/features/scrubber/types.ts`:**
   ```ts
   export type SourceFormat = 'dotenv' | 'json' | 'yaml' | 'docker-compose';
   ```
2. **Add format detection in `src/features/scrubber/engine/parseLine.ts`:**
   ```ts
   // Example: Detect Docker Compose environment list items
   if (workingLine.startsWith('- ')) {
     const trimmedEntry = workingLine.slice(2).trim();
     // parse as key-value pair and tag sourceFormat: 'docker-compose'
   }
   ```
3. **Add unit test in `src/features/scrubber/engine/parseLine.test.ts`:**
   Assert that lines matching the format correctly yield `{ kind: 'entry', key, value, sourceFormat }`.
4. **Run `npm test`:**
   Verify that all existing tests and new format tests pass.

---

## 📜 License

MIT License. Open source, privacy-first software built for developers.
