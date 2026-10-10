const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const logoutBtn = document.getElementById('logoutBtn');
const loggedUserLabel = document.getElementById('loggedUserLabel');

const summaryEls = {
  totalCount: document.getElementById('totalCount'),
  todayCount: document.getElementById('todayCount'),
  categoriesCount: document.getElementById('categoriesCount'),
  departmentsCount: document.getElementById('departmentsCount'),
};

const recordsTableBody = document.getElementById('recordsTableBody');
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');
const verifyBtn = document.getElementById('verifyBtn');
const verifyResult = document.getElementById('verifyResult');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const departmentFilter = document.getElementById('departmentFilter');
const exportBtn = document.getElementById('exportBtn');

let allRecords = [];

function showLogin() {
  loginView.classList.remove('hidden');
  appView.classList.add('hidden');
}

function showDashboard(user) {
  loggedUserLabel.textContent = `Logged in: ${user.username}`;
  loginView.classList.add('hidden');
  appView.classList.remove('hidden');
  fetchSummary();
  fetchRecords();
}

async function checkSession() {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      showLogin();
      return;
    }

    const data = await response.json();
    showDashboard(data.user);
  } catch (error) {
    showLogin();
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const username = formData.get('username');
  const password = formData.get('password');

  loginStatus.classList.remove('hidden');
  loginStatus.classList.remove('error', 'success');
  loginStatus.classList.add('pending');
  loginStatus.textContent = 'Signing in...';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    loginStatus.classList.remove('pending');
    loginStatus.classList.add('success');
    loginStatus.textContent = `Welcome, ${result.user.username}!`;
    showDashboard(result.user);
  } catch (error) {
    loginStatus.classList.remove('pending');
    loginStatus.classList.add('error');
    loginStatus.textContent = error.message;
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  showLogin();
});

async function fetchSummary() {
  try {
    const response = await fetch('/api/summary');
    const data = await response.json();

    summaryEls.totalCount.textContent = data.totalCount;
    summaryEls.todayCount.textContent = data.todayCount;
    summaryEls.categoriesCount.textContent = data.categoriesCount;
    summaryEls.departmentsCount.textContent = data.departmentsCount;
  } catch (error) {
    console.error('Summary fetch failed:', error);
  }
}

function populateDepartmentFilter(records) {
  const departments = [...new Set(records.map((record) => record.department).filter(Boolean))].sort();
  const currentValue = departmentFilter.value;

  departmentFilter.innerHTML = '<option value="">All departments</option>' +
    departments.map((department) => `<option value="${department}">${department}</option>`).join('');

  if (departments.includes(currentValue)) {
    departmentFilter.value = currentValue;
  }
}

function getFilteredRecords() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const statusValue = statusFilter.value;
  const departmentValue = departmentFilter.value;

  return allRecords.filter((record) => {
    const searchText = [
      record.record_id,
      record.title,
      record.applicant_name,
      record.department,
      record.category,
      record.notes,
      record.attestation_number,
      record.case_number,
    ].join(' ').toLowerCase();

    const matchesSearch = !searchValue || searchText.includes(searchValue);
    const matchesStatus = !statusValue || (record.status || 'Uploaded') === statusValue;
    const matchesDepartment = !departmentValue || record.department === departmentValue;
    return matchesSearch && matchesStatus && matchesDepartment;
  });
}

function renderRecords() {
  const filteredRecords = getFilteredRecords();

  if (!filteredRecords.length) {
    recordsTableBody.innerHTML = '<tr><td colspan="8" class="muted">No matching records found.</td></tr>';
    return;
  }

  recordsTableBody.innerHTML = filteredRecords
    .map((record) => {
      const statusText = record.status || 'Uploaded';
      const statusClass = `status-${statusText.toLowerCase()}`;
      const applicantName = record.applicant_name || record.title || 'Applicant';

      return `
        <tr>
          <td><strong>${record.record_id}</strong></td>
          <td>${applicantName}</td>
          <td>${record.department}</td>
          <td>${record.category}</td>
          <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
            <div class="status-editor">
              <select class="status-select" data-record-id="${record.record_id}">
                <option value="Uploaded" ${statusText === 'Uploaded' ? 'selected' : ''}>Uploaded</option>
                <option value="Verified" ${statusText === 'Verified' ? 'selected' : ''}>Verified</option>
                <option value="Approved" ${statusText === 'Approved' ? 'selected' : ''}>Approved</option>
                <option value="Rejected" ${statusText === 'Rejected' ? 'selected' : ''}>Rejected</option>
              </select>
            </div>
          </td>
          <td>${new Date(record.uploaded_at).toLocaleDateString('en-PK')}</td>
          <td><a href="${record.file_path}" target="_blank">Open</a></td>
          <td><a href="/verify/${record.record_id}" target="_blank">View QR</a></td>
        </tr>
      `;
    })
    .join('');
}

async function fetchRecords() {
  try {
    const response = await fetch('/api/records');
    const data = await response.json();
    allRecords = data || [];
    populateDepartmentFilter(allRecords);
    renderRecords();
  } catch (error) {
    console.error('Record fetch failed:', error);
  }
}

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);

  uploadStatus.classList.remove('hidden');
  uploadStatus.classList.remove('error', 'success');
  uploadStatus.classList.add('pending');
  uploadStatus.textContent = 'Uploading document...';

  try {
    const response = await fetch('/api/records', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Upload failed');
    }

    uploadStatus.classList.remove('pending');
    uploadStatus.classList.add('success');
    uploadStatus.textContent = `${result.message} Record ID: ${result.record.record_id}`;
    uploadForm.reset();
    fetchSummary();
    fetchRecords();
  } catch (error) {
    uploadStatus.classList.remove('pending');
    uploadStatus.classList.add('error');
    uploadStatus.textContent = error.message;
  }
});

verifyBtn.addEventListener('click', async () => {
  const recordId = document.getElementById('recordIdLookup').value.trim();

  if (!recordId) {
    verifyResult.innerHTML = '<p class="warning">Please enter a record ID.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/records/${recordId}`);
    const record = await response.json();

    if (!response.ok) {
      throw new Error(record.message || 'Record not found');
    }

    verifyResult.innerHTML = `
      <div class="verify-card">
        <h3>Verified Document</h3>
        <p><strong>Applicant:</strong> ${record.applicant_name || record.title}</p>
        <p><strong>Attestation No:</strong> ${record.attestation_number || 'Not provided'}</p>
        <p><strong>Department:</strong> ${record.department}</p>
        <p><strong>Category:</strong> ${record.category}</p>
        <p><strong>Status:</strong> ${record.status || 'Uploaded'}</p>
        <p><strong>Uploaded:</strong> ${new Date(record.uploaded_at).toLocaleString('en-PK')}</p>
        <p><strong>Notes:</strong> ${record.notes}</p>
        <a href="${record.file_path}" target="_blank">Open attached file</a>
      </div>
    `;
  } catch (error) {
    verifyResult.innerHTML = `<p class="warning">${error.message}</p>`;
  }
});

searchInput.addEventListener('input', renderRecords);
statusFilter.addEventListener('change', renderRecords);
departmentFilter.addEventListener('change', renderRecords);

recordsTableBody.addEventListener('change', async (event) => {
  const select = event.target.closest('.status-select');
  if (!select) return;

  const recordId = select.dataset.recordId;
  const newStatus = select.value;

  try {
    const response = await fetch(`/api/records/${recordId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to update status');
    }

    fetchSummary();
    fetchRecords();
  } catch (error) {
    alert(error.message);
  }
});

exportBtn.addEventListener('click', () => {
  const rows = getFilteredRecords();
  if (!rows.length) {
    alert('No records to export.');
    return;
  }

  const header = ['Record ID', 'Applicant', 'Attestation No', 'Department', 'Category', 'Status', 'Uploaded At'];
  const csv = [header.join(',')]
    .concat(
      rows.map((row) => [
        row.record_id,
        `"${(row.applicant_name || row.title || '').replace(/"/g, '""')}"`,
        `"${(row.attestation_number || '').replace(/"/g, '""')}"`,
        `"${(row.department || '').replace(/"/g, '""')}"`,
        `"${(row.category || '').replace(/"/g, '""')}"`,
        row.status || 'Uploaded',
        new Date(row.uploaded_at).toISOString(),
      ].join(','))
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'attestation-records.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

checkSession();
