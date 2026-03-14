import { useState } from 'react';
import ErrorBanner from '../shared/ErrorBanner.jsx';
import { insertLabResult } from '../../db/queries.js';

const STATUS_OPTIONS = ['NORMAL', 'HIGH', 'LOW', 'DEFICIENT', 'BORDER'];

export default function LabUpload({ onAdded }) {
  const [form, setForm] = useState({
    test_name: '',
    value: '',
    unit: '',
    normal_range: '',
    status: 'NORMAL',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.test_name || !form.value) {
      setError('Test name and value are required.');
      return;
    }
    insertLabResult({
      ...form,
      value: parseFloat(form.value),
    });
    onAdded({ ...form, value: parseFloat(form.value) });
    setForm({
      test_name: '',
      value: '',
      unit: '',
      normal_range: '',
      status: 'NORMAL',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <ErrorBanner message={error} onDismiss={() => setError('')} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Test Name *</label>
          <input
            value={form.test_name}
            onChange={(e) => set('test_name', e.target.value)}
            placeholder="e.g. Hemoglobin A1C"
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Value *</label>
          <input
            type="number"
            step="any"
            value={form.value}
            onChange={(e) => set('value', e.target.value)}
            placeholder="5.4"
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Unit</label>
          <input
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}
            placeholder="mg/dL"
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Normal Range</label>
          <input
            value={form.normal_range}
            onChange={(e) => set('normal_range', e.target.value)}
            placeholder="4.0–5.6"
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          >
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <input
        value={form.notes}
        onChange={(e) => set('notes', e.target.value)}
        placeholder="Notes (optional)"
        className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Add Lab Result
      </button>
    </form>
  );
}
