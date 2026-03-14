import { useState } from 'react';
import FileUpload from '../shared/FileUpload.jsx';
import LoadingCard from '../shared/LoadingCard.jsx';
import ErrorBanner from '../shared/ErrorBanner.jsx';
import { callClaude } from '../../lib/claude.js';
import { handleFile } from '../../lib/fileParser.js';
import { insertDrugAnalysis } from '../../db/queries.js';

const SYSTEM = `You are a medical AI assistant. Analyze the prescription and return ONLY valid JSON.`;

const PROMPT = (input) => `Analyze this prescription:

${input}

Return JSON:
{
  "drug_name": "",
  "dosage": "",
  "frequency": "",
  "what_it_does": "",
  "warnings": [],
  "interactions": [],
  "generic_alternatives": [],
  "cost_saving_tips": [],
  "risk_level": "LOW | MEDIUM | HIGH"
}`;

export default function DrugInput({ onAnalysis }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    if (!text.trim() && !file) {
      setError('Enter a drug name/prescription or upload an image.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let fileData = null;
      let userPrompt = PROMPT(text.trim() || '[See attached image]');

      if (file) {
        const parsed = await handleFile(file);
        if (parsed.type === 'text') {
          userPrompt = PROMPT(parsed.content);
        } else {
          fileData = parsed;
          userPrompt = PROMPT('[See attached prescription image]');
        }
      }

      const result = await callClaude(SYSTEM, userPrompt, fileData);

      insertDrugAnalysis({
        drug_name: result.drug_name,
        dosage: result.dosage,
        frequency: result.frequency,
        interactions: result.interactions,
        generic_alternatives: result.generic_alternatives,
        cost_saving_tips: result.cost_saving_tips,
        plain_english: result.what_it_does,
        warnings: result.warnings,
      });

      onAnalysis(result);
      setText('');
      setFile(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingCard message="Analyzing prescription..." />;

  return (
    <div className="space-y-4">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Drug name, dosage, or paste prescription text..."
        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        onKeyDown={(e) => e.key === 'Enter' && analyze()}
      />
      <FileUpload onFile={setFile} label="Or upload prescription image (JPG, PNG, PDF)" accept=".jpg,.jpeg,.png,.pdf,.txt" />
      <button
        onClick={analyze}
        disabled={!text.trim() && !file}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Analyze Prescription
      </button>
    </div>
  );
}
