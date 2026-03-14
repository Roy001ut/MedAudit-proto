import { useState } from 'react';
import FileUpload from '../shared/FileUpload.jsx';
import LoadingCard from '../shared/LoadingCard.jsx';
import ErrorBanner from '../shared/ErrorBanner.jsx';
import { callClaude } from '../../lib/claude.js';
import { handleFile } from '../../lib/fileParser.js';
import { insertBillAnalysis } from '../../db/queries.js';

const SYSTEM = `You are a medical billing fraud detection AI. Return ONLY valid JSON.`;

const PROMPT = (input) => `Analyze this medical bill:

${input}

Return JSON:
{
  "cpt_code": "",
  "procedure_name": "",
  "plain_english": "",
  "charged_amount": 0,
  "regional_average": 0,
  "overcharge_percentage": 0,
  "duplicate_detected": false,
  "duplicate_dates": "",
  "diagnosis_match": true,
  "diagnosis": "",
  "code_indicates": "",
  "medically_necessary": true,
  "red_flags": [],
  "risk_level": "LOW | MEDIUM | HIGH | CRITICAL",
  "recommended_action": ""
}`;

export default function BillUpload({ onAnalysis }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    if (!text.trim() && !file) {
      setError('Please enter bill details or upload a file.');
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

      insertBillAnalysis({
        cpt_code: result.cpt_code,
        description: result.procedure_name,
        charged_amount: result.charged_amount,
        average_amount: result.regional_average,
        risk_level: result.risk_level,
        red_flags: result.red_flags,
        recommendation: result.recommended_action,
        raw_input: text.trim() || file?.name || '',
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

  if (loading) return <LoadingCard message="Analyzing bill for fraud and overcharges..." />;

  return (
    <div className="space-y-4">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste bill details, CPT codes, or description here..."
        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <FileUpload onFile={setFile} label="Or upload bill document (PDF, image, DOCX)" />
      <button
        onClick={analyze}
        disabled={!text.trim() && !file}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Analyze Bill
      </button>
    </div>
  );
}
