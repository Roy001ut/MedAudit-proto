import RiskBadge from '../shared/RiskBadge.jsx';
import { AlertTriangle, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export default function BillCard({ bill }) {
  const overcharge = bill.overcharge_percentage ?? bill.overchargePercentage;
  const flags = Array.isArray(bill.red_flags) ? bill.red_flags : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{bill.procedure_name || bill.description || 'Procedure'}</h3>
          {bill.cpt_code && <p className="text-xs text-gray-400 mt-0.5">CPT: {bill.cpt_code}</p>}
        </div>
        <RiskBadge level={bill.risk_level} />
      </div>

      {bill.plain_english && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{bill.plain_english}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Charged Amount</p>
          <p className="font-bold text-gray-900">${(bill.charged_amount ?? 0).toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Regional Average</p>
          <p className="font-bold text-gray-900">${(bill.regional_average ?? bill.average_amount ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {overcharge !== undefined && overcharge !== 0 && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
          ${overcharge > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <DollarSign size={15} />
          {overcharge > 0
            ? `Overcharged by ${overcharge}% above regional average`
            : `Within normal range (${Math.abs(overcharge)}% below average)`}
        </div>
      )}

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          {bill.diagnosis_match
            ? <CheckCircle size={15} className="text-green-500" />
            : <XCircle size={15} className="text-red-500" />}
          <span className="text-gray-600">Diagnosis match</span>
        </div>
        <div className="flex items-center gap-1.5">
          {bill.medically_necessary
            ? <CheckCircle size={15} className="text-green-500" />
            : <XCircle size={15} className="text-red-500" />}
          <span className="text-gray-600">Medically necessary</span>
        </div>
        {bill.duplicate_detected && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-orange-500" />
            <span className="text-orange-600 font-medium">Duplicate detected</span>
          </div>
        )}
      </div>

      {flags.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Red Flags</p>
          <ul className="space-y-1">
            {flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {bill.recommended_action && (
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Recommended Action</p>
          <p className="text-sm text-blue-800">{bill.recommended_action}</p>
        </div>
      )}
    </div>
  );
}
