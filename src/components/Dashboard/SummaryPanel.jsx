import { Heart } from 'lucide-react';

function scoreColor(score) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function scoreBg(score) {
  if (score >= 80) return 'bg-green-50 border-green-100';
  if (score >= 60) return 'bg-yellow-50 border-yellow-100';
  if (score >= 40) return 'bg-orange-50 border-orange-100';
  return 'bg-red-50 border-red-100';
}

function scoreLabel(score) {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Attention';
  return 'At Risk';
}

export default function SummaryPanel({ bills, labs }) {
  // Derive health score: penalise HIGH/CRITICAL bills, penalise abnormal labs
  let score = 100;

  bills.forEach((b) => {
    if (b.risk_level === 'CRITICAL') score -= 15;
    else if (b.risk_level === 'HIGH') score -= 8;
    else if (b.risk_level === 'MEDIUM') score -= 3;
  });

  labs.forEach((l) => {
    if (l.status === 'DEFICIENT') score -= 10;
    else if (l.status === 'HIGH' || l.status === 'LOW') score -= 6;
    else if (l.status === 'BORDER') score -= 2;
  });

  score = Math.max(0, Math.min(100, score));

  return (
    <div className={`rounded-2xl border p-6 ${scoreBg(score)}`}>
      <div className="flex items-center gap-3 mb-2">
        <Heart size={20} className={scoreColor(score)} />
        <h3 className="font-semibold text-gray-800">Health Score</h3>
      </div>
      <div className="flex items-end gap-3">
        <span className={`text-5xl font-bold ${scoreColor(score)}`}>{score}</span>
        <span className={`text-lg font-medium mb-1 ${scoreColor(score)}`}>{scoreLabel(score)}</span>
      </div>
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Based on {bills.length} bill{bills.length !== 1 ? 's' : ''} and {labs.length} lab result{labs.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
