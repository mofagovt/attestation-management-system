const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'uploads');
const recordsFile = path.join(dataDir, 'records.json');

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

if (!fs.existsSync(recordsFile)) {
  fs.writeFileSync(recordsFile, '[]', 'utf8');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
    const timestamp = Date.now();
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

function readRecords() {
  const raw = fs.readFileSync(recordsFile, 'utf8');
  try {
    return JSON.parse(raw) || [];
  } catch (error) {
    return [];
  }
}

function writeRecords(records) {
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2), 'utf8');
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function makeRecordId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ATT-${Date.now().toString().slice(-6)}-${random}`;
}

function buildQrPayload(record) {
  return {
    recordId: record.recordId,
    title: record.title,
    department: record.department,
    category: record.category,
    uploadedAt: record.uploadedAt,
    fileName: record.fileName,
  };
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(rootDir, 'public')));

app.get('/api/summary', (req, res) => {
  const records = readRecords();
  const todayKey = getDateKey();

  const todayCount = records.filter((record) => record.dateKey === todayKey).length;
  const totalCount = records.length;
  const categories = [...new Set(records.map((record) => record.category).filter(Boolean))];

  res.json({
    totalCount,
    todayCount,
    categoriesCount: categories.length,
    departmentsCount: [...new Set(records.map((record) => record.department).filter(Boolean))].length,
  });
});

app.get('/api/records', (req, res) => {
  const records = readRecords().sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  res.json(records);
});

app.get('/api/records/:recordId', (req, res) => {
  const record = readRecords().find((item) => item.recordId === req.params.recordId);

  if (!record) {
    return res.status(404).json({ message: 'Record not found' });
  }

  res.json(record);
});

app.post('/api/records', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a document.' });
  }

  const { title, department, category, notes } = req.body;
  const recordId = makeRecordId();
  const uploadedAt = new Date().toISOString();
  const dateKey = getDateKey();

  const record = {
    recordId,
    title: title || req.file.originalname,
    department: department || 'General Administration',
    category: category || 'Attestation',
    notes: notes || 'No additional notes provided.',
    fileName: req.file.originalname,
    storedFileName: req.file.filename,
    filePath: `/uploads/${req.file.filename}`,
    uploadedAt,
    dateKey,
    status: 'Uploaded',
  };

  const qrPayload = buildQrPayload(record);
  record.qrData = qrPayload;
  record.qrImage = await QRCode.toDataURL(JSON.stringify(qrPayload));

  const records = readRecords();
  records.unshift(record);
  writeRecords(records);

  res.status(201).json({
    message: 'Document uploaded successfully.',
    record,
  });
});

app.get('/verify/:recordId', (req, res) => {
  const record = readRecords().find((item) => item.recordId === req.params.recordId);

  if (!record) {
    return res.status(404).send('<h2>Record not found</h2>');
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Attestation</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f3f4f6; color: #111827; padding: 24px; }
          .card { max-width: 760px; margin: 40px auto; background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .grid { display: grid; grid-template-columns: 1fr 220px; gap: 24px; }
          h1 { margin-top: 0; }
          .meta { margin: 12px 0; }
          .qr { text-align: center; }
          img { width: 180px; height: 180px; }
          a { color: #1d4ed8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="grid">
            <div>
              <h1>Attestation Verified</h1>
              <p class="meta"><strong>Record ID:</strong> ${record.recordId}</p>
              <p class="meta"><strong>Title:</strong> ${record.title}</p>
              <p class="meta"><strong>Department:</strong> ${record.department}</p>
              <p class="meta"><strong>Category:</strong> ${record.category}</p>
              <p class="meta"><strong>Uploaded:</strong> ${formatDate(record.uploadedAt)}</p>
              <p class="meta"><strong>Notes:</strong> ${record.notes}</p>
              <p><a href="/uploads/${record.storedFileName}" target="_blank">Open uploaded document</a></p>
            </div>
            <div class="qr">
              <img src="${record.qrImage}" alt="QR Code" />
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  res.send(html);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Attestation management system running on http://localhost:${PORT}`);
});
