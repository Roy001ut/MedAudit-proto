import { Stethoscope, Pill, FlaskConical, Calendar, CheckSquare, AlertCircle } from 'lucide-react';

function Section({ icon: Icon, title, children, color = 'bg-gray-50' }) {
  return (
    <div className={`${color} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default function ConsultSummary({ consult }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Consultation Summary</h3>
        {consult.date && <span className="text-sm text-gray-400">{consult.date}</span>}
      </div>

      {consult.key_points?.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Key Points</p>
          <ul className="space-y-1">
            {consult.key_points.map((pt, i) => (
              <li key={i} className="text-sm text-blue-800">• {pt}</li>
            ))}
          </ul>
        </div>
      )}

      {consult.diagnoses?.length > 0 && (
        <Section icon={Stethoscope} title="Diagnoses">
          <ul className="space-y-2">
            {consult.diagnoses.map((d, i) => (
              <li key={i}>
                <p className="text-sm font-medium text-gray-800">{d.name}</p>
                {d.plain_english && <p className="text-xs text-gray-500">{d.plain_english}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {consult.medications?.length > 0 && (
        <Section icon={Pill} title="Medications" color="bg-green-50">
          <ul className="space-y-2">
            {consult.medications.map((m, i) => (
              <li key={i} className="text-sm text-gray-800">
                <span className="font-medium">{m.name}</span>
                {m.dosage && <span className="text-gray-500"> — {m.dosage}</span>}
                {m.frequency && <span className="text-gray-400"> ({m.frequency})</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {consult.tests_ordered?.length > 0 && (
        <Section icon={FlaskConical} title="Tests Ordered" color="bg-purple-50">
          <ul className="space-y-2">
            {consult.tests_ordered.map((t, i) => (
              <li key={i}>
                <p className="text-sm font-medium text-gray-800">{t.name}</p>
                {t.reason && <p className="text-xs text-gray-500">{t.reason}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {consult.follow_up && (
        <div className="flex items-start gap-2 bg-orange-50 rounded-xl p-3">
          <Calendar size={16} className="text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-0.5">Follow-up</p>
            <p className="text-sm text-orange-800">{consult.follow_up}</p>
          </div>
        </div>
      )}

      {consult.action_items?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare size={15} className="text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">Action Items</p>
          </div>
          <ul className="space-y-1">
            {consult.action_items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <AlertCircle size={13} className="mt-0.5 shrink-0 text-gray-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
