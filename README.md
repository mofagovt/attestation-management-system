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

async function fetchRecords() {
  try {
    const response = await fetch('/api/records');
    const data = await response.json();

    if (!data.length) {
      recordsTableBody.innerHTML = '<tr><td colspan="7" class="muted">No documents uploaded yet.</td></tr>';
      return;
    }

    recordsTableBody.innerHTML = data
      .map(
        (record) => `
          <tr>
            <td><strong>${record.record_id}</strong></td>
            <td>${record.title}</td>
            <td>${record.department}</td>
            <td>${record.category}</td>
            <td>${new Date(record.uploaded_at).toLocaleDateString('en-PK')}</td>
            <td><a href="${record.file_path}" target="_blank">Open</a></td>
            <td><a href="/verify/${record.record_id}" target="_blank">View QR</a></td>
          </tr>
        `
      )
      .join('');
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
    uploadStatus.textContent = `${result.message} Record ID: ${result.record.recordId}`;
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
        <p><strong>Title:</strong> ${record.title}</p>
        <p><strong>Department:</strong> ${record.department}</p>
        <p><strong>Category:</strong> ${record.category}</p>
        <p><strong>Uploaded:</strong> ${new Date(record.uploaded_at).toLocaleString('en-PK')}</p>
        <p><strong>Notes:</strong> ${record.notes}</p>
        <a href="${record.file_path}" target="_blank">Open attached file</a>
      </div>
    `;
  } catch (error) {
    verifyResult.innerHTML = `<p class="warning">${error.message}</p>`;
  }
});

checkSession();
