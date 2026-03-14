import { DollarSign, TrendingUp, Shield } from 'lucide-react';

export default function CostSummary({ bills, policies }) {
  const totalCharged = bills.reduce((s, b) => s + (b.charged_amount || 0), 0);
  const totalAverage = bills.reduce((s, b) => s + (b.average_amount || b.regional_average || 0), 0);
  const potentialOvercharge = Math.max(0, totalCharged - totalAverage);

  const highRiskCount = bills.filter((b) => b.risk_level === 'HIGH' || b.risk_level === 'CRITICAL').length;

  const totalPremium = policies.reduce((s, p) => s + (p.premium_annual || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={16} className="text-green-500" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Billed</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">${totalCharged.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">{bills.length} bill{bills.length !== 1 ? 's' : ''} analyzed</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-red-500" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Potential Overcharge</p>
        </div>
        <p className={`text-2xl font-bold ${potentialOvercharge > 0 ? 'text-red-600' : 'text-green-600'}`}>
          ${potentialOvercharge.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">{highRiskCount} high-risk item{highRiskCount !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-blue-500" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Annual Premiums</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">${totalPremium.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">{policies.length} polic{policies.length !== 1 ? 'ies' : 'y'}</p>
      </div>
    </div>
  );
}
