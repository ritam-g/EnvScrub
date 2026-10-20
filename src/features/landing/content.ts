/**
 * Centralized content repository for all landing page copy.
 * Keeps marketing text, FAQs, and explanations strictly separated from JSX.
 */

export const LANDING_CONTENT = {
  hero: {
    headline: 'Share your config,',
    headlineHighlight: 'not your secrets.',
    subheadline:
      'Instantly sanitize .env files and DevOps configs directly in your browser. Remove secrets for safe sharing with AI, tickets, and team chats — or strip quotes for a clean production config.',
    privacyBadge: 'Runs in your browser. Nothing is uploaded.',
    trustPills: ['100% Client-Side', 'No Login Required', 'Zero Telemetry', 'Strict CSP Enforced'],
  },

  howItWorks: {
    title: 'How EnvScrub works',
    subtitle: 'Three simple steps to safe, clean configurations in seconds.',
    steps: [
      {
        number: '01',
        title: 'Paste your config',
        description:
          'Paste any .env file, DevOps CLI JSON dump, or YAML config into the input panel. Structure, order, and comments are fully preserved.',
      },
      {
        number: '02',
        title: 'Choose your mode',
        description:
          "Keep values OFF to sanitize all values for sharing, or ON to strip quotes and format. Use 'Smart Select' to auto-isolate sensitive keys.",
      },
      {
        number: '03',
        title: 'Copy or download',
        description:
          'Instantly copy the clean output to your clipboard or download it as a ready-to-use .env file. Nothing ever touches a server.',
      },
    ],
  },

  beforeAfter: {
    title: 'Before & After Transformation',
    subtitle:
      'See how EnvScrub strips quotes and formats DevOps outputs while keeping comments and structure intact.',
    beforeTitle: 'Raw DevOps Dump / .env (Before)',
    beforeCode: `# Production Database
DATABASE_URL="postgres://admin:s3cr3tP@ss@db.internal:5432/core"
"API_KEY": "sk_live_99238472948729384",
"PORT": 5000,

# Shell export
export JWT_SECRET="super-confidential-jwt-signing-key" # auth`,
    afterSanitizeTitle: 'Sanitized Output (Safe to Share)',
    afterSanitizeCode: `# Production Database
DATABASE_URL=
API_KEY=
PORT=

# Shell export
export JWT_SECRET= # auth`,
    afterCleanTitle: 'Cleaned Output (Quotes Stripped)',
    afterCleanCode: `# Production Database
DATABASE_URL=postgres://admin:s3cr3tP@ss@db.internal:5432/core
API_KEY=sk_live_99238472948729384
PORT=5000

# Shell export
export JWT_SECRET=super-confidential-jwt-signing-key # auth`,
  },

  trustPrivacy: {
    title: 'Why you can trust EnvScrub',
    subtitle: 'Architected from the ground up with zero trust and mathematical privacy guarantees.',
    cards: [
      {
        title: '100% Client-Side Computation',
        description:
          'All parsing, scrubbing, and formatting execute purely in-memory in your local browser JavaScript engine. We have no backend server, no database, and no intermediate APIs.',
      },
      {
        title: 'Strict Content Security Policy (CSP)',
        description:
          "Our HTTP CSP enforces connect-src 'none'. Your browser itself will actively block any outgoing network requests, guaranteeing no data exfiltration is technically possible.",
      },
      {
        title: 'Zero Content Storage',
        description:
          'We never save your pasted configs to localStorage, sessionStorage, cookies, or URL query parameters. When you refresh or close the tab, your data disappears completely.',
      },
      {
        title: 'Verify with Browser DevTools',
        description:
          'Open Chrome or Firefox DevTools (F12) -> Network tab. Paste your secrets, toggle options, and copy results. You will see exactly zero network calls.',
      },
    ],
  },

  supportedFormats: {
    title: 'Supported Formats',
    subtitle: 'Flexible line-based parser handles standard dotenv and common DevOps CLI outputs.',
    formats: [
      { name: 'Standard dotenv', example: 'KEY=value' },
      { name: 'Spaced dotenv', example: 'KEY = value' },
      { name: 'Quoted values', example: 'KEY="val" or \'val\'' },
      { name: 'Export prefixes', example: 'export KEY=value' },
      { name: 'DevOps JSON lines', example: '"KEY": "value",' },
      { name: 'Full JSON objects', example: '{ "KEY": "val", "PORT": 5000 }' },
      { name: 'YAML key-value', example: 'KEY: value' },
      { name: 'Comments & blanks', example: '# note (preserved verbatim)' },
      { name: 'Multi-line keys', example: 'KEY="-----BEGIN RSA..."' },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about privacy, security, and offline support.',
    items: [
      {
        question: 'Is it really safe to paste my production secrets here?',
        answer:
          'Yes. EnvScrub does not have a backend server or any remote database. All parsing is executed in your browser via pure TypeScript. To verify, open your browser DevTools (Network tab) and watch: no data is ever transmitted.',
      },
      {
        question: 'Do you store or log any part of my config?',
        answer:
          'Never. Pasted content is stored only in transient component memory and is never written to disk, cookies, localStorage, or server logs. Only your UI theme and spacing preference are remembered.',
      },
      {
        question: 'Why not just use find-and-replace in VS Code?',
        answer:
          'Manual find-and-replace is slow, error-prone, and one missed token leaks a secret. EnvScrub strips quotes, formats keys, handles inline comments, and sanitizes values in one click.',
      },
      {
        question: 'Does EnvScrub work offline?',
        answer:
          'Yes! Because all assets and fonts are self-hosted and no server is required, once the page is loaded in your browser, you can disconnect from the internet and continue using it seamlessly.',
      },
      {
        question: 'What happens to comments and blank lines?',
        answer:
          'They are preserved 100% verbatim in their exact original lines and ordering. Unparsed or custom lines are also passed through safely without data loss.',
      },
      {
        question: 'Is EnvScrub open source?',
        answer:
          'Yes. EnvScrub is completely free and open source. You can audit the codebase, run it locally, or contribute on GitHub.',
      },
    ],
  },
};
