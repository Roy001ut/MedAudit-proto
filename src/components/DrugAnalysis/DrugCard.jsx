import RiskBadge from '../shared/RiskBadge.jsx';
import { AlertTriangle, DollarSign, RefreshCw, Zap } from 'lucide-react';

function List({ title, items, icon: Icon, color }) {
  if (!items?.length) return null;
  return (
    <div className={`rounded-xl p-3 ${color}`}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Icon size={13} className="mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DrugCard({ drug }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{drug.drug_name || 'Drug'}</h3>
          <div className="flex gap-2 text-sm text-gray-500 mt-0.5">
            {drug.dosage && <span>{drug.dosage}</span>}
            {drug.frequency && <span>· {drug.frequency}</span>}
          </div>
        </div>
        <RiskBadge level={drug.risk_level} />
      </div>

      {drug.what_it_does && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{drug.what_it_does}</p>
      )}

      <List
        title="Warnings"
        items={drug.warnings}
        icon={AlertTriangle}
        color="bg-red-50 text-red-700"
      />
      <List
        title="Drug Interactions"
        items={drug.interactions}
        icon={Zap}
        color="bg-orange-50 text-orange-700"
      />
      <List
        title="Generic Alternatives"
        items={drug.generic_alternatives}
        icon={RefreshCw}
        color="bg-green-50 text-green-700"
      />
      <List
        title="Cost Saving Tips"
        items={drug.cost_saving_tips}
        icon={DollarSign}
        color="bg-blue-50 text-blue-700"
      />
    </div>
  );
}
