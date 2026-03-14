import { Shield, Calendar, DollarSign, AlertCircle } from 'lucide-react';

function Row({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h4>
      {children}
    </div>
  );
}

function fmt(val) {
  if (val === undefined || val === null) return '—';
  if (typeof val === 'number') return val > 0 ? `$${val.toLocaleString()}` : '—';
  return val || '—';
}

export default function CoverageCard({ policy }) {
  const h = policy.health || {};
  const d = policy.dental || {};
  const v = policy.vision || {};
  const rx = h.prescriptions || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{policy.provider_name || 'Insurance Policy'}</h3>
          {policy.policy_holder && <p className="text-sm text-gray-500 mt-0.5">{policy.policy_holder}</p>}
        </div>
        <Shield size={24} className="text-blue-500 shrink-0" />
      </div>

      {policy.coverage_dates && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} />
          {policy.coverage_dates.start} — {policy.coverage_dates.end}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-blue-500 mb-1">Monthly Premium</p>
          <p className="font-bold text-blue-900">{fmt(policy.premium_monthly)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-blue-500 mb-1">Deductible</p>
          <p className="font-bold text-blue-900">{fmt(policy.deductible)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-blue-500 mb-1">OOP Max</p>
          <p className="font-bold text-blue-900">{fmt(policy.out_of_pocket_max)}</p>
        </div>
      </div>

      <Section title="Health Coverage">
        <Row label="Office Visit Copay" value={fmt(h.office_visit_copay)} />
        <Row label="Specialist Copay" value={fmt(h.specialist_copay)} />
        <Row label="ER Copay" value={fmt(h.er_copay)} />
        <Row label="Hospital Inpatient" value={h.hospital_inpatient} />
        <Row label="Lab Tests" value={h.lab_tests} />
        {Object.keys(rx).length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1.5">Prescriptions</p>
            <Row label="Generic" value={fmt(rx.generic)} />
            <Row label="Brand" value={fmt(rx.brand)} />
            <Row label="Specialty" value={fmt(rx.specialty)} />
          </div>
        )}
      </Section>

      {(d.cleaning || d.fillings) && (
        <Section title="Dental">
          <Row label="Cleaning" value={d.cleaning} />
          <Row label="Fillings" value={d.fillings} />
          <Row label="Crown" value={d.crown} />
          <Row label="Orthodontics" value={d.orthodontics} />
        </Section>
      )}

      {(v.eye_exam || v.frames_allowance) && (
        <Section title="Vision">
          <Row label="Eye Exam" value={v.eye_exam} />
          <Row label="Frames Allowance" value={fmt(v.frames_allowance)} />
          <Row label="Contacts Allowance" value={fmt(v.contacts_allowance)} />
        </Section>
      )}

      {policy.excluded_services?.length > 0 && (
        <div className="bg-red-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Excluded Services</p>
          <ul className="space-y-1">
            {policy.excluded_services.map((s, i) => (
              <li key={i} className="text-sm text-red-700 flex gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {policy.important_notes?.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</p>
          <ul className="space-y-1">
            {policy.important_notes.map((n, i) => (
              <li key={i} className="text-sm text-gray-600">• {n}</li>
            ))}
          </ul>
        </div>
      )}

      {policy.annual_cost_estimate > 0 && (
        <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
          <DollarSign size={16} className="text-green-600" />
          <div>
            <p className="text-xs text-green-600">Estimated Annual Cost</p>
            <p className="font-bold text-green-800">${policy.annual_cost_estimate.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
