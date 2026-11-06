# Unravel Documentation

Welcome to the comprehensive documentation suite for **Unravel** — the client-side, zero-trust tabular data ingestion, rule validation, and normalization platform for Excel (XLSX), CSV, and TSV files.

---

## Documentation Index

| Guide | Description | Target Audience |
| :--- | :--- | :--- |
| **[Getting Started](getting-started.md)** | Platform overview, core pillars, and high-level workflow architecture. | All Users & Developers |
| **[User Guide](user-guide.md)** | Step-by-step walkthrough of the ingestion wizard, row filters, grid operations, and clean/excluded exports. | End Users & Business Analysts |
| **[Developer Guide](developer-guide.md)** | JSON schema specification, validation rules, type casting, calculated columns, and Dev Studio. | Developers & System Integrators |
| **[Deployment Guide](deployment.md)** | Static hosting (Nginx, Docker, S3, Vercel, Netlify) and air-gapped environments. | DevOps & Infrastructure Engineers |
| **[XLSX Decryption Gateway](decryption-service.md)** | Python/FastAPI companion service for password-protected Excel files and headless ingestion. | Backend & Security Engineers |
| **[Customization Guide](customization.md)** | White-labeling: App name, logos, Bootswatch Lumen theme, custom rules, and UI modifications. | Product Teams & Administrators |
| **[Code Overview](code-overview.md)** | Detailed multi-repository architecture, frontend classes, and backend endpoints. | Core Contributors & Developers |
| **[Privacy Policy & Security Model](privacy-policy.md)** | Zero-trust architecture, in-browser RAM execution, Web Crypto AES-GCM vault, and compliance. | Compliance, Legal & Security Officers |

---

## What is Unravel?

**Unravel** solves a universal enterprise headache: ingesting messy, heterogeneous spreadsheets and flat files from disparate suppliers, partners, clients, or internal departments without leaking sensitive data to third-party servers.

### Key Pillars

- **Zero-Trust Client-Side Architecture**: 100% of parsing, column mapping, transformation, and validation occurs entirely inside the user's browser memory (WebAssembly + JavaScript). No records ever leave the device unless explicitly submitted to an API endpoint you specify.
- **Pre-Validation Ingestion Row Filters**: Filter out irrelevant or out-of-scope rows before validation using `=`, `!=`, `>`, `>=`, `<`, `<=` operators on numbers and strings, with dedicated export options for excluded records.
- **Calculated Columns (Virtual Fields)**: Derive virtual columns computed via bracketed token formulas (e.g. `[sale_qty] * [sale_unit_price]` or `([sale_qty] > 100) ? 'large' : 'small'`).
- **Strict Rule-Based Normalization**: Automated checks for data integrity (emails, phone numbers, postal codes, checksums, regex matching, required fields).
- **Type Casting & Transformation Pipelines**: Chained data transformations (`CAST_STRING`, `CAST_FLOAT`, `CAST_INTEGER`, `CAST_DATE`, `TRIM`, `UPPERCASE`, `LOWERCASE`).
- **Dev Studio**: Visual JSON schema authoring tool with drag-and-drop sample scaffolding, dynamic layout switching, target column toolbars, undo/redo, and starter templates.
- **Air-Gapped & Offline Capable**: Bundles all dependencies (Bootstrap, SheetJS, PapaParse, SweetAlert2, Moment.js) locally. Zero CDN dependencies.

---

## Multi-Repository Ecosystem

- **Frontend Web App & Dev Studio (`unravel-ui`)**: Client-side application runner and developer schema studio.
- **Headless Backend & Decryption Service (`unravel-service`)**: Independent Python/FastAPI companion service with admin telemetry and schema management.
- **Documentation Portal (`unravel-docs`)**: VitePress documentation portal published via GitHub Pages.

_This project was developed with AI Assisted Coding_
