# Code Architecture & Function Overview

This document provides a comprehensive technical overview of Unravel's codebase, architecture, and primary JavaScript / Python functions.

---

## 🗂️ File Structure

```
unravel/
├── app/
│   ├── index.html                     # Primary Ingestion Wizard UI
│   ├── builder/
│   │   └── index.html                 # Dev Studio Schema Builder UI
│   └── assets/
│       ├── css/
│       │   └── style.css              # Main application stylesheet & design tokens
│       ├── js/
│       │   ├── app.js                 # Core Wizard Engine (UnravelApp)
│       │   ├── builder.js             # Visual Schema Builder (UnravelBuilder)
│       │   ├── security.js            # Web Crypto AES-GCM Browser Vault (UnravelSecurity)
│       │   └── validators.js          # Rule Validation Engine (UnravelValidator)
│       ├── sample-data/               # Sample schemas, starter templates, test files
│       └── vendor/                    # Self-contained offline JS/CSS libraries
├── docs/                              # Project documentation suite
└── services/
    ├── unravel_service.py             # Unified FastAPI Decryption Gateway, Parser, Broker & Admin Console
    └── unravel.db                     # SQLite database repository for project schemas & audit logs
```

---

## 1. `app/assets/js/app.js` (`UnravelApp`)

The main wizard controller managing the 8-step pipeline, spreadsheet parsing, cell transformations, validation execution, interactive grid rendering, and exports.

### State & Properties
- `this.currentStep`: Active wizard step index (1 through 8).
- `this.schema`: Current active JSON schema project configuration.
- `this.rawWorkbook`: Parsed SheetJS workbook instance in browser RAM.
- `this.rawSheetData`: 2D array of extracted worksheet/file rows before offset.
- `this.cleanRecords`: Processed, transformed, and validated canonical records.
- `this.validationErrors`: Map of row and column errors with severity levels.
- `this.activeFilter`: Current grid view filter (`'all'`, `'valid'`, `'errors'`).
- `this.selectedRowIndices`: Set of row indices marked for bulk deletion.

### Core Methods

| Method | Description |
| :--- | :--- |
| `init()` | Initializes the application, attaches DOM event listeners, and attempts to load cached schema from local storage. |
| `setupEventListeners()` | Binds ribbon buttons, file drag-and-drop dropzones, stepper buttons, and export triggers. |
| `navigateToStep(stepNumber)` | Transitions the wizard to the requested step, updating step indicators, validation guards, and visibility overlays. |
| `attemptAutoAdvance()` | Checks whether prerequisites for following steps are satisfied and advances the user automatically without unnecessary clicks. |
| `handleFileUpload(file)` | Validates uploaded file MIME type and extension, checks provider expectations, and passes file to parser. |
| `parseSpreadsheet(fileData)` | Uses SheetJS (`XLSX.read`) or PapaParse to parse raw bytes into rows. Detects password-protected workbooks. |
| `decryptEncryptedWorkbook(file, password)` | Sends base64 workbook to the FastAPI Decryption Gateway and loads the returned decrypted workbook. |
| `handleSheetStrategyModeChange()` | Greys out and disables sheet selection controls for flat files (CSV/TSV) with helpful tooltips. |
| `populateSheetSelectionUI()` | Populates workbook worksheets and resolves active sheet based on strategy mode (First Sheet, Preset Name, Regex, or Date String Match to pick the latest date). |
| `executeOffsetDetection()` | Scans the 2D raw data matrix to automatically find header rows and compute X/Y offset coordinates. |
| `applyTransform(value, transformType, extra)` | Applies transforms (`TRIM`, `UPPERCASE`, `LOWERCASE`, `CAPITALIZE`, `DATE_FORMAT`) to a cell value. |
| `runValidationPipeline()` | Iterates through rows, maps columns, applies transforms, evaluates validation rules, handles ignorable fallbacks to default values, and records diagnostics. |
| `renderInteractiveGrid()` | Generates the Excel-like spreadsheet table in Step 8, complete with row checkboxes, error highlighting, and cell edit listeners. |
| `setGridFilter(filterMode)` | Switches between `'all'`, `'valid'`, and `'errors'` row display modes without mutating underlying data. |
| `handleMultiRowDelete()` | Deletes selected rows from `this.cleanRecords` and recalculates validation statistics. |
| `toggleRuleSidebar()` | Expands or collapses the validation breakdown sidebar showing pass/fail counts by column. |
| `exportCleanJSON()` | Formats and triggers download of the valid records as a formatted `.json` file. |
| `exportCleanCSV()` | Generates RFC 4180 compliant CSV using PapaParse and triggers browser download. |
| `exportCleanXLSX()` | Builds a new SheetJS workbook and exports a `.xlsx` file. |
| `dispatchToApi()` | Sends a POST request with the clean dataset to the destination API endpoint using the configured Bearer token. |
| `closeProject()` | Prompts to save dirty changes, resets all in-memory state, purges localStorage cache, strips URL appendages, and returns to Step 1. |
| `clearProjectRouting()` | Purges project/hash keys from `localStorage` and removes hash (`#...`) and search query (`?...`) appendages from the browser address bar. |
| `showSaveLayoutChangesModal()` | Prompts user when modifications were made to mappings/offsets to overwrite provider, update schema, or save as a new layout profile. |
| `showPrivacyPolicyModal()` | Displays the modal explaining the zero-trust in-browser architecture, zero telemetry, and RAM isolation. |

---

## 2. `app/assets/js/builder.js` (`UnravelBuilder`)

The visual schema authoring engine powering the Dev Studio.

### Core Methods

| Method | Description |
| :--- | :--- |
| `init()` | Loads starter templates, initializes empty/cached schema, and renders Dev Studio panels. |
| `loadStarterTemplates()` | Fetches `starter-templates.json` or falls back to built-in templates. |
| `renderStarterTemplates()` | Renders template cards on the Dev Studio dashboard. |
| `handleAutoScaffold(file)` | Parses an uploaded sample spreadsheet or CSV, samples column headers and types, and generates target columns and layout mappings. |
| `renderTargetColumns()` | Renders the target schema table where developers define keys, labels, required flags, and default rules. |
| `renderLayouts()` | Manages provider layout profiles, file type selections, sheet strategies, and header offset settings. |
| `renderMappings()` | Generates column-by-column mapping controls, transformation selectors, date format inputs, and validation rule tags. |
| `addValidationRule(targetKey, ruleType)` | Attaches a validation rule to a column mapping with custom arguments (e.g. regex patterns). |
| `validateSchema()` | Diagnoses schema configuration for duplicate keys, missing IDs, or malformed slugs. |
| `downloadJSON()` | Serializes current schema to JSON and triggers browser download. |
| `launchInRunner()` | Saves schema to `localStorage` and redirects browser to `../index.html` with schema pre-loaded. |

---

## 3. `app/assets/js/security.js` (`UnravelSecurity`)

Client-side cryptographic vault implementing standard Web Crypto API primitives.

### Core Methods

| Method | Description |
| :--- | :--- |
| `hasVaultPassword()` | Returns `true` if a master vault password has been initialized on the current browser. |
| `isSessionUnlocked()` | Checks if the current session tab has verified the vault password. |
| `deriveKey(password, salt)` | Derives a 256-bit AES-GCM key from user password and salt using PBKDF2 (100,000 iterations of SHA-256). |
| `setupVaultPassword(password)` | Initializes a fresh vault, generates a cryptographically random salt, and stores a verification token. |
| `verifyPassword(password)` | Validates the user's password against the stored encrypted verification token. |
| `encryptData(plaintext, password)` | Encrypts arbitrary strings or JSON objects with AES-GCM using a unique 12-byte initialization vector (IV). |
| `decryptData(ciphertext, password)` | Decrypts AES-GCM ciphertext blocks back into UTF-8 plaintext. |
| `lockSession()` | Clears session tokens from `sessionStorage`, locking cached projects. |

---

## 4. `app/assets/js/validators.js` (`UnravelValidator`)

Zero-dependency validation rule engine.

### Core Methods

| Method | Description |
| :--- | :--- |
| `validate(value, ruleConfig)` | Master dispatcher routing a cell value to the appropriate validation check. |
| `notEmpty(val)` | Asserts value is not null, undefined, or empty whitespace. |
| `isEmail(val)` | Validates standard email address formats. |
| `isPostcode(val)` | Validates UK postal codes using official alphanumeric patterns. |
| `isPhoneNumber(val)` | Validates domestic and international telephone numbers. |
| `isNumber(val)` | Validates integers and decimal floating-point numbers. |
| `isInteger(val)` | Validates whole numbers. |
| `isAlphanumeric(val)` | Validates strings consisting solely of letters and digits. |
| `matchRegex(val, pattern, msg)` | Evaluates a value against an arbitrary regular expression pattern. |
| `isNHSNumber(val)` | Executes Modulus 11 checksum verification for 10-digit UK NHS numbers. |

---

## 5. `services/unravel_service.py`

Unified single-file FastAPI microservice for password-protected Excel workbook decryption, project schema hosting, headless validation parsing, live destination broker dispatching, and Bootswatch telemetry admin console.

### Key Endpoints
- `GET /`: Operational status page displaying live uptime ("Up since...").
- `GET /health`: Health-check endpoint returning service capabilities and database status.
- `GET /admin`: Bootswatch-powered Admin Dashboard displaying telemetry stats, usage metrics, rule pain points, and audit logs.
- `POST /api/decrypt-xlsx`: In-memory workbook decryption gateway via `msoffcrypto`.
- `POST /api/decrypt-xlsx-hybrid`: Zero-trust hybrid encrypted decryption (RSA-OAEP + AES-GCM).
- `GET /api/projects`: Public project schema retrieval repository.
- `POST /api/parse`: Headless parsing & validation engine for automations.
- `POST /api/broker/dispatch`: Zero-trust destination forwarder.
- `POST /api/telemetry/session`: Anonymized validation error logging.

