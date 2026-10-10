# Government Attestation Management Portal

A daily document upload and verification app for managing attestation records. It allows staff to upload attestation documents, generate QR codes for each record, and verify records from the web dashboard.

## Features

- Upload attestation documents (PDF, JPG, PNG, WEBP)
- Auto-generated record IDs
- Daily upload tracking
- QR code generation and verification links
- Simple admin dashboard for viewing uploaded documents
- Local file storage and JSON-backed record log

## Tech Stack

- Node.js
- Express.js
- Multer
- QRCode
- Vanilla JavaScript and CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Open the app in a browser:
   ```bash
   http://localhost:3000
   ```

## Project Structure

```text
attestation-management-system/
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── uploads/
│   └── .gitkeep
├── data/
│   └── records.json
├── .gitignore
├── package.json
├── README.md
├── server.js
└── uploads/
```

## Notes

This version is designed as a secure and practical prototype for government document tracking. For production deployment, it should be enhanced with authentication, database storage, audit logging, and role-based access control.
