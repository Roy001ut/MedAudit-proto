import { Receipt, Pill, Mic, FlaskConical, Shield, LayoutDashboard } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'bills', label: 'Bills', icon: Receipt },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'drugs', label: 'Drugs', icon: Pill },
  { id: 'health', label: 'Health', icon: FlaskConical },
  { id: 'consult', label: 'Consult', icon: Mic },
];

export default function TabBar({ active, onSelect }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors
            ${active === id ? 'text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Icon size={20} className="mb-0.5" />
          {label}
        </button>
      ))}
    </nav>
  );
}
