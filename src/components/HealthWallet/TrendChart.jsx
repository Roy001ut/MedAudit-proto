import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ReferenceArea, ResponsiveContainer, Legend,
} from 'recharts';
import RiskBadge from '../shared/RiskBadge.jsx';
import LoadingCard from '../shared/LoadingCard.jsx';
import ErrorBanner from '../shared/ErrorBanner.jsx';
import { callClaude } from '../../lib/claude.js';
import { getLabResultsByName, getDistinctLabNames } from '../../db/queries.js';

const SYSTEM = `You are a health analytics AI. Analyze lab result trends and return ONLY valid JSON.`;
const PROMPT = (json) => `Lab history: ${json}

Return JSON:
{
  "test_name": "",
  "trend": "IMPROVING | STABLE | CONCERNING | WORSENING",
  "rate_of_change": "",
  "current_status": "NORMAL | HIGH | LOW | DEFICIENT | BORDER",
  "time_to_target": "",
  "analysis": "",
  "recommendations": []
}`;

function parseNormalRange(range) {
  if (!range) return null;
  const match = range.match(/([\d.]+)\s*[–\-—~to]+\s*([\d.]+)/);
  if (!match) return null;
  return { low: parseFloat(match[1]), high: parseFloat(match[2]) };
}

export default function TrendChart({ labs }) {
  const [selectedTest, setSelectedTest] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testNames = getDistinctLabNames();
  const testData = selectedTest
    ? getLabResultsByName(selectedTest).map((r) => ({ ...r, date: r.date || r.created_at?.slice(0, 10) }))
    : [];

  const normalRange = testData.length > 0 ? parseNormalRange(testData[0].normal_range) : null;

  async function runAnalysis() {
    if (!selectedTest || testData.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const result = await callClaude(SYSTEM, PROMPT(JSON.stringify(testData)));
      setAnalysis(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (testNames.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Add lab results above to view trends.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Select Test</label>
          <select
            value={selectedTest}
            onChange={(e) => { setSelectedTest(e.target.value); setAnalysis(null); }}
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">— choose a test —</option>
            {testNames.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button
          onClick={runAnalysis}
          disabled={!selectedTest || testData.length < 2 || loading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Analyze Trend
        </button>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {selectedTest && testData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h4 className="font-medium text-gray-800 mb-4">{selectedTest} over time</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={testData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              {normalRange && (
                <ReferenceArea
                  y1={normalRange.low}
                  y2={normalRange.high}
                  fill="#bbf7d0"
                  fillOpacity={0.3}
                  label={{ value: 'Normal', position: 'insideTopRight', fontSize: 10, fill: '#16a34a' }}
                />
              )}
              {normalRange && <ReferenceLine y={normalRange.low} stroke="#16a34a" strokeDasharray="3 3" />}
              {normalRange && <ReferenceLine y={normalRange.high} stroke="#16a34a" strokeDasharray="3 3" />}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {testData[0]?.unit && (
            <p className="text-xs text-gray-400 text-center mt-1">Unit: {testData[0].unit}</p>
          )}
        </div>
      )}

      {loading && <LoadingCard message="Analyzing trend data..." />}

      {analysis && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-gray-900">Trend Analysis</h4>
            <RiskBadge level={analysis.trend} />
            <RiskBadge level={analysis.current_status} />
          </div>
          {analysis.analysis && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{analysis.analysis}</p>
          )}
          {analysis.rate_of_change && (
            <p className="text-sm text-gray-500">Rate of change: {analysis.rate_of_change}</p>
          )}
          {analysis.time_to_target && (
            <p className="text-sm text-gray-500">Time to target: {analysis.time_to_target}</p>
          )}
          {analysis.recommendations?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recommendations</p>
              <ul className="space-y-1">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-gray-600">• {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
