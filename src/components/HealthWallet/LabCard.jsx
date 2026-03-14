import RiskBadge from '../shared/RiskBadge.jsx';
import { FlaskConical } from 'lucide-react';

export default function LabCard({ lab }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
        <FlaskConical size={18} className="text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{lab.test_name}</p>
          <RiskBadge level={lab.status} />
        </div>
        <p className="text-sm text-gray-500 mt-0.5">
          <span className="font-semibold text-gray-700">{lab.value} {lab.unit}</span>
          {lab.normal_range && <span className="ml-2 text-gray-400">Normal: {lab.normal_range}</span>}
        </p>
        {lab.notes && <p className="text-xs text-gray-400 mt-0.5">{lab.notes}</p>}
      </div>
      <div className="text-xs text-gray-400 shrink-0">{lab.date}</div>
    </div>
  );
}
