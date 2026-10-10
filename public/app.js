* {
  box-sizing: border-box;
}

:root {
  --bg: #f4f7fb;
  --card: #ffffff;
  --primary: #1d4ed8;
  --primary-dark: #1237a0;
  --success: #15803d;
  --warning: #b45309;
  --danger: #b91c1c;
  --text: #111827;
  --muted: #6b7280;
  --line: #e5e7eb;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(180deg, #eef4ff 0%, #f8fafc 100%);
  color: var(--text);
}

.hidden {
  display: none !important;
}

.auth-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-card {
  width: min(500px, 100%);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 28px;
}

.auth-header {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  font-weight: bold;
}

h1 {
  margin: 0;
  font-size: clamp(28px, 3vw, 40px);
}

h2 {
  margin-top: 0;
}

.auth-form,
.field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-group {
  margin-bottom: 18px;
}

label {
  font-weight: 600;
}

input,
textarea,
select,
button {
  font: inherit;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  outline: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

textarea {
  resize: vertical;
}

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 700;
}

.primary-btn {
  background: var(--primary);
  color: white;
}

.primary-btn:hover {
  background: var(--primary-dark);
}

.secondary-btn {
  background: #e0e7ff;
  color: #1e3a8a;
}

.small-btn {
  white-space: nowrap;
}

.full-width {
  width: 100%;
}

.app-shell {
  width: min(1280px, calc(100% - 32px));
  margin: 32px auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-pill {
  padding: 10px 18px;
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  color: var(--primary-dark);
  font-weight: 600;
}

.dashboard {
  display: grid;
  gap: 22px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--card);
  border-radius: 18px;
  padding: 22px 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
}

.stat-card span {
  display: block;
  color: var(--muted);
  margin-bottom: 10px;
}

.stat-card strong {
  font-size: clamp(30px, 2vw, 40px);
}

.accent-blue { border-top: 5px solid #3b82f6; }
.accent-green { border-top: 5px solid #22c55e; }
.accent-purple { border-top: 5px solid #8b5cf6; }
.accent-gold { border-top: 5px solid #f59e0b; }

.content-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 22px;
}

.panel {
  background: var(--card);
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
  padding: 22px;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.verify-box {
  margin-bottom: 16px;
}

.verify-row {
  display: flex;
  gap: 10px;
}

.verify-result {
  min-height: 120px;
}

.verify-card {
  border: 1px solid var(--line);
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.status-box {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
}

.status-box.hidden { display: none; }
.status-box.pending { background: #e0f2fe; color: #075985; }
.status-box.success { background: #dcfce7; color: #166534; }
.status-box.error { background: #fee2e2; color: #991b1b; }

.warning {
  color: var(--danger);
  font-weight: 600;
}

.table-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.table-controls input,
.table-controls select {
  min-width: 150px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  color: var(--muted);
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
}

tbody td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}

tbody tr:hover {
  background: #f9fafb;
}

.status-select {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--line);
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-uploaded { background: #dbeafe; color: #1d4ed8; }
.status-verified { background: #dcfce7; color: #166534; }
.status-approved { background: #e0e7ff; color: #3730a3; }
.status-rejected { background: #fee2e2; color: #991b1b; }

.muted {
  color: var(--muted);
  text-align: center;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .stats-grid,
  .content-grid,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .topbar,
  .table-topbar,
  .table-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .verify-row {
    flex-direction: column;
  }
}
