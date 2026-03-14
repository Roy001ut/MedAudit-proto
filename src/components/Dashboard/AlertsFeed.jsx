import { AlertTriangle, TrendingUp, Calendar, FlaskConical } from 'lucide-react';

export default function AlertsFeed({ bills, labs, consultations }) {
  const alerts = [];

  bills.forEach((b) => {
    if (b.risk_level === 'CRITICAL' || b.risk_level === 'HIGH') {
      alerts.push({
        type: 'bill',
        level: b.risk_level,
        message: `${b.risk_level} risk bill: ${b.description || b.cpt_code || 'Unknown procedure'}`,
        sub: b.recommendation || '',
        icon: AlertTriangle,
        color: b.risk_level === 'CRITICAL' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50',
      });
    }
  });

  labs.forEach((l) => {
    if (l.status === 'HIGH' || l.status === 'LOW' || l.status === 'DEFICIENT') {
      alerts.push({
        type: 'lab',
        level: l.status,
        message: `${l.test_name}: ${l.value} ${l.unit} (${l.status})`,
        sub: l.normal_range ? `Normal range: ${l.normal_range}` : '',
        icon: FlaskConical,
        color: l.status === 'DEFICIENT' ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50',
      });
    }
  });

  consultations.forEach((c) => {
    if (c.follow_up) {
      alerts.push({
        type: 'followup',
        level: 'INFO',
        message: `Follow-up: ${c.follow_up}`,
        sub: c.date ? `Consultation on ${c.date}` : '',
        icon: Calendar,
        color: 'text-purple-600 bg-purple-50',
      });
    }
  });

  if (alerts.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        No alerts. Everything looks good!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.slice(0, 8).map((alert, i) => {
        const Icon = alert.icon;
        return (
          <div key={i} className={`flex items-start gap-3 rounded-xl p-3 ${alert.color}`}>
            <Icon size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">{alert.message}</p>
              {alert.sub && <p className="text-xs opacity-70 mt-0.5">{alert.sub}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
