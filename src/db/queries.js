import { getDB } from './init.js';

function rowsToObjects(result) {
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

// ── Lab Results ──────────────────────────────────────────────────────────────

export function insertLabResult({ test_name, value, unit, normal_range, status, date, notes }) {
  const db = getDB();
  db.run(
    `INSERT INTO lab_results (test_name, value, unit, normal_range, status, date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [test_name, value, unit, normal_range, status, date, notes]
  );
}

export function getLabResults() {
  const db = getDB();
  const result = db.exec(`SELECT * FROM lab_results ORDER BY date DESC, created_at DESC`);
  return rowsToObjects(result);
}

export function getLabResultsByName(testName) {
  const db = getDB();
  const result = db.exec(
    `SELECT * FROM lab_results WHERE test_name = ? ORDER BY date ASC`,
    [testName]
  );
  return rowsToObjects(result);
}

export function getDistinctLabNames() {
  const db = getDB();
  const result = db.exec(`SELECT DISTINCT test_name FROM lab_results ORDER BY test_name`);
  return rowsToObjects(result).map((r) => r.test_name);
}

// ── Bill Analyses ────────────────────────────────────────────────────────────

export function insertBillAnalysis({ cpt_code, description, charged_amount, average_amount, risk_level, red_flags, recommendation, raw_input }) {
  const db = getDB();
  db.run(
    `INSERT INTO bill_analyses (cpt_code, description, charged_amount, average_amount, risk_level, red_flags, recommendation, raw_input)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [cpt_code, description, charged_amount, average_amount, risk_level,
      typeof red_flags === 'string' ? red_flags : JSON.stringify(red_flags),
      recommendation, raw_input]
  );
}

export function getBillAnalyses() {
  const db = getDB();
  const result = db.exec(`SELECT * FROM bill_analyses ORDER BY created_at DESC`);
  return rowsToObjects(result).map((r) => ({
    ...r,
    red_flags: safeParseJSON(r.red_flags, []),
  }));
}

// ── Insurance Policies ───────────────────────────────────────────────────────

export function insertInsurancePolicy({ provider_name, policy_holder, coverage_start, coverage_end, premium_annual, deductible, out_of_pocket_max, coverage_json }) {
  const db = getDB();
  db.run(
    `INSERT INTO insurance_policies (provider_name, policy_holder, coverage_start, coverage_end, premium_annual, deductible, out_of_pocket_max, coverage_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [provider_name, policy_holder, coverage_start, coverage_end, premium_annual, deductible, out_of_pocket_max,
      typeof coverage_json === 'string' ? coverage_json : JSON.stringify(coverage_json)]
  );
}

export function getInsurancePolicies() {
  const db = getDB();
  const result = db.exec(`SELECT * FROM insurance_policies ORDER BY created_at DESC`);
  return rowsToObjects(result).map((r) => ({
    ...r,
    coverage_json: safeParseJSON(r.coverage_json, {}),
  }));
}

// ── Consultations ────────────────────────────────────────────────────────────

export function insertConsultation({ date, duration_seconds, transcript, diagnoses, medications, tests_ordered, follow_up }) {
  const db = getDB();
  db.run(
    `INSERT INTO consultations (date, duration_seconds, transcript, diagnoses, medications, tests_ordered, follow_up)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [date, duration_seconds, transcript,
      typeof diagnoses === 'string' ? diagnoses : JSON.stringify(diagnoses),
      typeof medications === 'string' ? medications : JSON.stringify(medications),
      typeof tests_ordered === 'string' ? tests_ordered : JSON.stringify(tests_ordered),
      follow_up]
  );
}

export function getConsultations() {
  const db = getDB();
  const result = db.exec(`SELECT * FROM consultations ORDER BY created_at DESC`);
  return rowsToObjects(result).map((r) => ({
    ...r,
    diagnoses: safeParseJSON(r.diagnoses, []),
    medications: safeParseJSON(r.medications, []),
    tests_ordered: safeParseJSON(r.tests_ordered, []),
  }));
}

// ── Drug Analyses ────────────────────────────────────────────────────────────

export function insertDrugAnalysis({ drug_name, dosage, frequency, interactions, generic_alternatives, cost_saving_tips, plain_english, warnings }) {
  const db = getDB();
  db.run(
    `INSERT INTO drug_analyses (drug_name, dosage, frequency, interactions, generic_alternatives, cost_saving_tips, plain_english, warnings)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [drug_name, dosage, frequency,
      typeof interactions === 'string' ? interactions : JSON.stringify(interactions),
      typeof generic_alternatives === 'string' ? generic_alternatives : JSON.stringify(generic_alternatives),
      typeof cost_saving_tips === 'string' ? cost_saving_tips : JSON.stringify(cost_saving_tips),
      plain_english,
      typeof warnings === 'string' ? warnings : JSON.stringify(warnings)]
  );
}

export function getDrugAnalyses() {
  const db = getDB();
  const result = db.exec(`SELECT * FROM drug_analyses ORDER BY created_at DESC`);
  return rowsToObjects(result).map((r) => ({
    ...r,
    interactions: safeParseJSON(r.interactions, []),
    generic_alternatives: safeParseJSON(r.generic_alternatives, []),
    cost_saving_tips: safeParseJSON(r.cost_saving_tips, []),
    warnings: safeParseJSON(r.warnings, []),
  }));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function safeParseJSON(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
