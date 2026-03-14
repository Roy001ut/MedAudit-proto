import { useState, useEffect } from 'react';
import { initDB } from './db/init.js';
import {
  getBillAnalyses, getLabResults, getInsurancePolicies,
  getConsultations, getDrugAnalyses,
} from './db/queries.js';

import Sidebar from './components/Layout/Sidebar.jsx';
import TabBar from './components/Layout/TabBar.jsx';
import LoadingCard from './components/shared/LoadingCard.jsx';
import ErrorBanner from './components/shared/ErrorBanner.jsx';

// Feature sections
import BillUpload from './components/BillAnalysis/BillUpload.jsx';
import BillCard from './components/BillAnalysis/BillCard.jsx';
import PolicyUpload from './components/Insurance/PolicyUpload.jsx';
import CoverageCard from './components/Insurance/CoverageCard.jsx';
import DrugInput from './components/DrugAnalysis/DrugInput.jsx';
import DrugCard from './components/DrugAnalysis/DrugCard.jsx';
import LabUpload from './components/HealthWallet/LabUpload.jsx';
import LabCard from './components/HealthWallet/LabCard.jsx';
import TrendChart from './components/HealthWallet/TrendChart.jsx';
import Recorder from './components/Consultation/Recorder.jsx';
import ConsultSummary from './components/Consultation/ConsultSummary.jsx';
import SummaryPanel from './components/Dashboard/SummaryPanel.jsx';
import AlertsFeed from './components/Dashboard/AlertsFeed.jsx';
import CostSummary from './components/Dashboard/CostSummary.jsx';

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
      {message}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState('');

  // Per-tab state
  const [bills, setBills] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [consults, setConsults] = useState([]);

  useEffect(() => {
    initDB()
      .then(() => {
        setBills(getBillAnalyses());
        setPolicies(getInsurancePolicies());
        setDrugs(getDrugAnalyses());
        setLabs(getLabResults());
        setConsults(getConsultations());
        setDbReady(true);
      })
      .catch((e) => setDbError(e.message));
  }, []);

  if (!dbReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        {dbError
          ? <ErrorBanner message={`DB Error: ${dbError}`} />
          : <LoadingCard message="Initializing database..." />}
      </div>
    );
  }

  function renderContent() {
    switch (tab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <PageHeader title="Dashboard" subtitle="Your health financial overview" />
            <SummaryPanel bills={bills} labs={labs} />
            <CostSummary bills={bills} policies={policies} />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Alerts</h3>
              <AlertsFeed bills={bills} labs={labs} consultations={consults} />
            </div>
          </div>
        );

      case 'bills':
        return (
          <div className="space-y-6">
            <PageHeader title="Bill Analysis" subtitle="Detect fraud, overcharges, and billing errors" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Analyze a Bill</h3>
              <BillUpload
                onAnalysis={(result) => {
                  setBills(getBillAnalyses());
                }}
              />
            </div>
            {bills.length === 0
              ? <EmptyState message="No bills analyzed yet. Submit a bill above to get started." />
              : <div className="space-y-3">{bills.map((b) => <BillCard key={b.id} bill={b} />)}</div>}
          </div>
        );

      case 'insurance':
        return (
          <div className="space-y-6">
            <PageHeader title="Insurance" subtitle="Parse and understand your coverage" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Upload Policy</h3>
              <PolicyUpload
                onPolicy={() => setPolicies(getInsurancePolicies())}
              />
            </div>
            {policies.length === 0
              ? <EmptyState message="No policies added yet." />
              : <div className="space-y-3">
                  {policies.map((p) => (
                    <CoverageCard key={p.id} policy={typeof p.coverage_json === 'object' ? p.coverage_json : p} />
                  ))}
                </div>}
          </div>
        );

      case 'drugs':
        return (
          <div className="space-y-6">
            <PageHeader title="Drug Analysis" subtitle="Understand prescriptions, interactions, and alternatives" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Analyze Prescription</h3>
              <DrugInput
                onAnalysis={() => setDrugs(getDrugAnalyses())}
              />
            </div>
            {drugs.length === 0
              ? <EmptyState message="No drug analyses yet." />
              : <div className="space-y-3">{drugs.map((d) => <DrugCard key={d.id} drug={d} />)}</div>}
          </div>
        );

      case 'health':
        return (
          <div className="space-y-6">
            <PageHeader title="Health Wallet" subtitle="Track lab results and spot trends" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Add Lab Result</h3>
              <LabUpload
                onAdded={() => setLabs(getLabResults())}
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Trend Analysis</h3>
              <TrendChart labs={labs} />
            </div>
            {labs.length === 0
              ? <EmptyState message="No lab results yet." />
              : <div className="space-y-2">{labs.map((l) => <LabCard key={l.id} lab={l} />)}</div>}
          </div>
        );

      case 'consult':
        return (
          <div className="space-y-6">
            <PageHeader title="Consultation" subtitle="Record and transcribe doctor visits" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Record Consultation</h3>
              <Recorder
                onConsult={() => setConsults(getConsultations())}
              />
            </div>
            {consults.length === 0
              ? <EmptyState message="No consultations recorded yet." />
              : <div className="space-y-3">{consults.map((c) => <ConsultSummary key={c.id} consult={c} />)}</div>}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={tab} onSelect={setTab} />
      <main className="flex-1 p-6 pb-24 md:pb-6 max-w-3xl mx-auto w-full">
        {renderContent()}
      </main>
      <TabBar active={tab} onSelect={setTab} />
    </div>
  );
}
