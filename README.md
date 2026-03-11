# 🔥 Roast My Code

Paste your code, get brutally roasted by AI — then get real fixes.

Built with Next.js + Claude API (Anthropic).

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- An [Anthropic API key](https://console.anthropic.com/settings/keys)

---

## Setup

**1. Clone the repo**
```bash
git clone https://github.com/ringku1/roast-my-code.git
cd roast-my-code
```

**2. Install dependencies**
```bash
npm install
```

**3. Add your API key**
```bash
cp .env.local.example .env.local
```
Then open `.env.local` and replace `your_api_key_here` with your actual Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

**4. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How it works

1. Paste any code snippet (up to 10,000 characters)
2. Select your language and roast level — Mild, Medium, or Savage
3. Hit **Roast Me** — the AI roasts your code live as it streams in
4. After the roast, it gives you actual fixes

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| AI | Claude Opus 4.6 (Anthropic) |
| Language | TypeScript |
