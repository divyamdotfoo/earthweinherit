**Clear, evidence-backed answers to all your climate change questions.**

Earthweinherit is a RAG-powered Q&A application that lets you ask anything about climate change and get responses grounded in scientific reports from IPCC, UNEP, and other authoritative sources — not hallucinations. Every answer is traceable back to its source.

<p align="center">
  <a href="https://www.youtube.com/watch?v=4Kf3YzN38Qo"><strong>Watch on YouTube →</strong></a>
</p>

## Features

- **RAG-based Q&A** — answers are generated from semantically retrieved chunks of real scientific reports, not from model memory alone
- **Source citations** — every response is annotated with the report name, URL, and source logo so you can verify claims
- **Live climate charts** — visualizes real CO₂ levels, temperature anomalies, and sea ice data using Recharts
- **Persistent chat history** — conversations are saved per user (cookie-based, no sign-up required) with a sidebar for previous sessions
- **Streaming responses** — answers stream in token by token via the Vercel AI SDK
- **Curated resources** — a handpicked reading list linking to IPCC reports, Our World in Data, NASA, WMO, and more

---

## How It Works

```
User question
     │
     ▼
Embed with text-embedding-3-small (768d)
     │
     ▼
Vector similarity search in Supabase (pgvector)
     │
     ▼
Top-k chunks retrieved (threshold: 0.3, k: 7)
     │
     ▼
GPT-4o-mini generates a grounded answer
with citations streamed back to the client
```

The knowledge base is built offline by running a PDF ingestion pipeline that loads scientific reports, splits them into 256-token chunks (with 20-token overlap), embeds each chunk, and stores them in Supabase with their source metadata.

---

## Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 15 (App Router, Turbopack)          |
| Language        | TypeScript                                  |
| UI              | Tailwind CSS, shadcn/ui, Framer Motion      |
| AI              | OpenAI GPT-4o-mini + text-embedding-3-small |
| AI SDK          | Vercel AI SDK (streaming)                   |
| Database        | Supabase (PostgreSQL + pgvector)            |
| Data ingestion  | LangChain (PDF loader, token text splitter) |
| Charts          | Recharts                                    |
| Package manager | pnpm                                        |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Supabase project with pgvector enabled
- An OpenAI API key

### Setup

```bash
# Clone the repo
git clone https://github.com/divyamdotfoo/earthweinherit.git
cd earthweinherit

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_KEY, and OPENAI in .env

# Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Building the Knowledge Base

To ingest a new scientific report (PDF) into the vector store:

```bash
pnpm embed:text path/to/report.pdf
```

To embed images from a report:

```bash
pnpm embed:img path/to/report.pdf
```

To test a query against the vector store directly:

```bash
pnpm query "What are the tipping points in the climate system?"
```

---

## Acknowledgements

Knowledge base sourced from:

- [IPCC Sixth Assessment Report](https://www.ipcc.ch/assessment-report/ar6/)
- [UNEP Strategy 2022–2025](https://www.unep.org/resources/people-and-planet-unep-strategy-2022-2025)
- Other UNEP and WMO publications
