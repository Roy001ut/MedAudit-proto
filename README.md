# MedAudit

AI-powered medical billing and healthcare management app. Analyze bills for fraud, parse insurance policies, understand prescriptions, track lab results, and transcribe doctor consultations — all in the browser.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Database:** SQLite via sql.js (in-browser, no server required)
- **AI:** Anthropic Claude API (claude-sonnet-4-6)
- **Charts:** Recharts
- **File parsing:** mammoth (DOCX), FileReader (PDF/image/text)

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd MedAudit-proto
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then open `.env` and replace the placeholder with your Anthropic API key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## Features

### Dashboard
The home screen aggregates data from all modules and shows:
- **Health Score** — derived from bill risk levels and abnormal lab results (0–100)
- **Cost Summary** — total billed, potential overcharges, annual insurance premiums
- **Alerts Feed** — high-risk bills, abnormal labs, upcoming follow-ups

### Bill Analysis
Detect fraud and overcharges in medical bills.

1. Navigate to **Bill Analysis**
2. Paste bill text (CPT codes, descriptions, amounts) **or** upload a PDF/image/DOCX
3. Click **Analyze Bill**
4. Review the results:
   - Risk level (LOW / MEDIUM / HIGH / CRITICAL)
   - Overcharge percentage vs. regional average
   - Red flags and duplicate detection
   - Recommended action

### Insurance
Parse and understand your insurance policy.

1. Navigate to **Insurance**
2. Paste policy text **or** upload a PDF/DOCX
3. Click **Parse Policy**
4. View a structured breakdown:
   - Deductible, out-of-pocket max, monthly premium
   - Health, dental, and vision copays
   - Excluded services and pre-authorization requirements

### Drug Analysis
Understand prescriptions and find cheaper alternatives.

1. Navigate to **Drug Analysis**
2. Type a drug name/dosage **or** upload a prescription image
3. Click **Analyze Prescription**
4. See plain-English explanation, warnings, drug interactions, generic alternatives, and cost-saving tips

### Health Wallet
Track lab results over time and spot trends.

1. Navigate to **Health Wallet**
2. Fill in the form (test name, value, unit, normal range, date) and click **Add Lab Result**
3. To view a chart, select a test from the **Trend Analysis** dropdown
4. Click **Analyze Trend** (requires 2+ entries for the same test) to get an AI assessment of whether values are improving, stable, or worsening

### Consultation Recorder
Transcribe and summarize doctor visits.

1. Navigate to **Consultation**
2. Click **Start Recording** — speak naturally (uses your browser's built-in speech recognition)
3. Click **Stop Recording** when done, then **Analyze Transcript**
   - Or type/paste a transcript manually and click **Analyze Transcript**
4. Review the structured summary: diagnoses, medications, tests ordered, follow-up date, action items

> **Note:** Speech recognition requires Chrome or another browser that supports the Web Speech API.

---

## Data Persistence

Data is stored in-memory using sql.js (a WebAssembly build of SQLite). **It resets on page refresh.** This is by design for the prototype. To persist across sessions, the database would need to be serialized to `localStorage` or a backend.

---

## Project Structure

```
src/
├── db/
│   ├── init.js          # sql.js setup + table creation
│   └── queries.js       # insert/select helpers for all tables
├── lib/
│   ├── claude.js        # Anthropic API wrapper
│   └── fileParser.js    # PDF/DOCX/image → base64 or text
├── components/
│   ├── Layout/          # Sidebar (desktop) + TabBar (mobile)
│   ├── shared/          # FileUpload, LoadingCard, RiskBadge, ErrorBanner
│   ├── BillAnalysis/    # UC2 — bill fraud detection
│   ├── Insurance/       # UC5 — policy parser
│   ├── DrugAnalysis/    # UC1 — prescription analysis
│   ├── HealthWallet/    # UC4 — lab tracking + trend charts
│   ├── Consultation/    # UC3 — consultation recorder
│   └── Dashboard/       # Aggregated overview
└── App.jsx              # Tab routing, DB init, top-level state
```
