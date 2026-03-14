import { Receipt, Pill, Mic, FlaskConical, Shield, LayoutDashboard } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bills', label: 'Bill Analysis', icon: Receipt },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'drugs', label: 'Drug Analysis', icon: Pill },
  { id: 'health', label: 'Health Wallet', icon: FlaskConical },
  { id: 'consult', label: 'Consultation', icon: Mic },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen py-6">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-blue-700">MedAudit</h1>
        <p className="text-xs text-gray-400 mt-1">AI Healthcare Management</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${active === id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
