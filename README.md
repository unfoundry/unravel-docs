# Unravel Documentation

Welcome to the comprehensive documentation suite for **Unravel** — the client-side, zero-trust tabular data ingestion, rule validation, and normalization platform for Excel (XLSX), CSV, and TSV files.

---

## 📚 Documentation Index

| Guide | Description | Target Audience |
| :--- | :--- | :--- |
| **[Getting Started](getting-started.md)** | What Unravel is, why it was created, and how it works under the hood. | All Users & Developers |
| **[User Guide](user-guide.md)** | Step-by-step walkthrough of the 8-stage ingestion wizard, grid operations, and exports. | End Users & Business Analysts |
| **[Developer Guide](developer-guide.md)** | JSON schema specification, validation rules, transforms, Dev Studio, and templates. | Developers & System Integrators |
| **[Deployment Guide](deployment.md)** | Static hosting (Nginx, Docker, S3, Vercel, Netlify) and air-gapped environments. | DevOps & Infrastructure Engineers |
| **[XLSX Decryption Gateway](decryption-service.md)** | Optional Python/FastAPI companion service for password-protected Excel files. | Backend & Security Engineers |
| **[Customization Guide](customization.md)** | White-labeling: App name, logos, themes, custom rules, and UI modifications. | Product Teams & Administrators |
| **[Code Overview](code-overview.md)** | Detailed architecture and function descriptions for `app.js`, `builder.js`, `security.js`, etc. | Core Contributors & Developers |
| **[Privacy Policy & Security Model](privacy-policy.md)** | Zero-trust architecture, in-browser RAM execution, Web Crypto AES-GCM vault, compliance. | Compliance, Legal & Security Officers |

---

## ⚡ What is Unravel?

**Unravel** solves a universal enterprise headache: ingesting messy, heterogeneous spreadsheets and flat files from disparate suppliers, partners, clients, or internal departments without leaking sensitive data to third-party servers.

### Key Pillars
- **Zero-Trust Client-Side Architecture**: 100% of parsing, column mapping, transformation, and validation occurs entirely inside the user's browser memory (WebAssembly + JavaScript). No records ever leave the device unless explicitly submitted to an API endpoint you specify.
- **Strict Rule-Based Normalization**: Automated checks for data integrity (emails, phone numbers, postal codes, checksums, regex matching, required fields).
- **Graceful Error Tolerances**: Define *ignorable* vs *blocking* errors, with automated fallbacks to default values, interactive cell editing, and bulk row exclusions.
- **Dev Studio**: Visual JSON schema authoring tool with drag-and-drop sample scaffolding, dynamic layout switching, and starter templates.
- **Air-Gapped & Offline Capable**: Bundles all dependencies (Bootstrap, SheetJS, PapaParse, SweetAlert2, Moment.js) locally. Zero CDN dependencies.

---

## 🚀 Quick Links
- **Application Runner**: `app/index.html`
- **Developer Studio**: `app/builder/index.html`
- **Decryption & Backend Service**: `services/unravel_service.py`

_This project was developed with AI Assisted Coding_
