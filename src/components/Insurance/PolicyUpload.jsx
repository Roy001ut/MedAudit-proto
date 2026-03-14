import { useState } from 'react';
import FileUpload from '../shared/FileUpload.jsx';
import LoadingCard from '../shared/LoadingCard.jsx';
import ErrorBanner from '../shared/ErrorBanner.jsx';
import { callClaude } from '../../lib/claude.js';
import { handleFile } from '../../lib/fileParser.js';
import { insertInsurancePolicy } from '../../db/queries.js';

const SYSTEM = `You are an insurance policy analysis AI. Parse the policy document and return ONLY valid JSON.`;

const PROMPT = (input) => `Policy document:

${input}

Return JSON:
{
  "provider_name": "",
  "policy_holder": "",
  "coverage_dates": { "start": "", "end": "" },
  "premium_monthly": 0,
  "deductible": 0,
  "out_of_pocket_max": 0,
  "health": {
    "office_visit_copay": 0,
    "specialist_copay": 0,
    "er_copay": 0,
    "hospital_inpatient": "",
    "lab_tests": "",
    "prescriptions": { "generic": 0, "brand": 0, "specialty": 0 }
  },
  "dental": {
    "cleaning": "",
    "fillings": "",
    "crown": "",
    "orthodontics": ""
  },
  "vision": {
    "eye_exam": "",
    "frames_allowance": 0,
    "contacts_allowance": 0
  },
  "excluded_services": [],
  "pre_auth_required": [],
  "important_notes": [],
  "annual_cost_estimate": 0
}`;

export default function PolicyUpload({ onPolicy }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    if (!text.trim() && !file) {
      setError('Please enter policy details or upload a document.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let fileData = null;
      let userPrompt = PROMPT(text.trim() || '[See attached document]');

      if (file) {
        const parsed = await handleFile(file);
        if (parsed.type === 'text') {
          userPrompt = PROMPT(parsed.content);
        } else {
          fileData = parsed;
          userPrompt = PROMPT('[See attached document/image]');
        }
      }

      const result = await callClaude(SYSTEM, userPrompt, fileData);

      insertInsurancePolicy({
        provider_name: result.provider_name,
        policy_holder: result.policy_holder,
        coverage_start: result.coverage_dates?.start,
        coverage_end: result.coverage_dates?.end,
        premium_annual: (result.premium_monthly ?? 0) * 12,
        deductible: result.deductible,
        out_of_pocket_max: result.out_of_pocket_max,
        coverage_json: result,
      });

      onPolicy(result);
      setText('');
      setFile(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingCard message="Parsing insurance policy..." />;

  return (
    <div className="space-y-4">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your insurance policy text here..."
        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <FileUpload onFile={setFile} label="Or upload policy document (PDF, DOCX)" />
      <button
        onClick={analyze}
        disabled={!text.trim() && !file}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Parse Policy
      </button>
    </div>
  );
}
