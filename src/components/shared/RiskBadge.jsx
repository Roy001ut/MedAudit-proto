const COLORS = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
  NORMAL: 'bg-green-100 text-green-800 border-green-200',
  DEFICIENT: 'bg-blue-100 text-blue-800 border-blue-200',
  BORDER: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  IMPROVING: 'bg-green-100 text-green-800 border-green-200',
  STABLE: 'bg-blue-100 text-blue-800 border-blue-200',
  CONCERNING: 'bg-orange-100 text-orange-800 border-orange-200',
  WORSENING: 'bg-red-100 text-red-800 border-red-200',
};

export default function RiskBadge({ level }) {
  const normalized = (level || '').toUpperCase();
  const cls = COLORS[normalized] || 'bg-gray-100 text-gray-800 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {level || 'UNKNOWN'}
    </span>
  );
}
