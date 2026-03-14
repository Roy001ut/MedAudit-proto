let db = null;

export async function initDB() {
  if (db) return db;

  const SQL = await import('sql.js').then((m) => m.default);
  const sqlPromise = SQL({
    locateFile: (file) => `/${file}`,
  });

  const sqlInstance = await sqlPromise;
  db = new sqlInstance.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS lab_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_name TEXT NOT NULL,
      value REAL,
      unit TEXT,
      normal_range TEXT,
      status TEXT,
      date TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bill_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpt_code TEXT,
      description TEXT,
      charged_amount REAL,
      average_amount REAL,
      risk_level TEXT,
      red_flags TEXT,
      recommendation TEXT,
      raw_input TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS insurance_policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_name TEXT,
      policy_holder TEXT,
      coverage_start TEXT,
      coverage_end TEXT,
      premium_annual REAL,
      deductible REAL,
      out_of_pocket_max REAL,
      coverage_json TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      duration_seconds INTEGER,
      transcript TEXT,
      diagnoses TEXT,
      medications TEXT,
      tests_ordered TEXT,
      follow_up TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS drug_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_name TEXT,
      dosage TEXT,
      frequency TEXT,
      interactions TEXT,
      generic_alternatives TEXT,
      cost_saving_tips TEXT,
      plain_english TEXT,
      warnings TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  return db;
}

export function getDB() {
  return db;
}
