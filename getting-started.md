# Getting Started with Unravel

This guide introduces **Unravel**, explains the business and architectural challenges it solves, and details how the system functions.

---

## 1. What is Unravel?

**Unravel** is a lightweight, zero-dependency client-side web application designed to normalize, validate, transform, and ingest complex tabular files (Microsoft Excel `.xlsx`, `.csv`, and `.tsv`).

Unlike traditional ETL solutions that require spinning up Python containers, backend cloud lambdas, or transferring sensitive customer files to unknown cloud servers, Unravel runs **entirely in the user's web browser RAM**.

### Core Capabilities
- **Multi-Layout Supplier Profiles**: One schema supports multiple file formats and column names from different suppliers.
- **Smart Offset & Header Detection**: Automatically identifies where header rows and data start, bypassing messy preamble rows or banners.
- **Regex & Pattern Sheet Matching**: For Excel files, dynamically finds sheets based on name patterns, date formats, or preset identifiers.
- **In-Memory Transformation Engine**: Trims strings, converts cases (uppercase, lowercase, capitalize), and transforms date formats across ISO/regional formats.
- **Tolerant Validation Engine**: Categorizes errors into blocking errors and ignorable warnings with default-value fallbacks.
- **Interactive Data Grid**: Excel-like spreadsheet experience with in-cell editing, multi-row deletion, quick filtering (All / Valid / Errors), and real-time rule success/failure counters.
- **Flexible Export**: Clean JSON, normalized CSV, stylized Excel workbook, or direct REST API payload dispatch with custom Bearer tokens.

---

## 2. Why Unravel?

Modern organizations exchange files with hundreds of external partners, vendors, contractors, and internal departments. Inevitably:
1. **Inconsistent Column Headers**: Supplier A labels email as `Contact_Email`, Supplier B uses `E-mail Address`, and Supplier C leaves it in Column D without a header.
2. **Data Dirtiness**: Trailing whitespace, non-standard date formats (`DD/MM/YYYY` vs `MM-DD-YY`), truncated phone numbers, and invalid postal codes cause downstream API pipelines to crash.
3. **Data Privacy & Compliance (GDPR, HIPAA, SOC 2)**: Uploading unvetted customer, patient, financial, or payroll spreadsheets to cloud SaaS services creates compliance liabilities and security audit bottlenecks.
4. **ETL Pipeline Fragility**: Traditional backend ingestion scripts fail abruptly on the first invalid row, leaving operators with no clue how to fix the data.

### The Unravel Solution
Unravel shifts validation to the **point of ingestion**:
- Data never touches an intermediary server.
- The user is presented with immediate visual feedback, highlighting errors in yellow and red cells.
- Errors can be fixed on the spot or dropped before ingestion.
- Once verified, the data can be delivered cleanly to your backend API or exported.

---

## 3. How It Works: The Ingestion Lifecycle

Unravel operates as an 8-stage sequential wizard. The application continuously inspects the dataset state and automatically progresses through steps that require no user intervention:

```
[1. Project Schema] ──► [2. Select Provider] ──► [3. Upload File] ──► [4. Select Sheet]
                                                                             │
[8. Review & Export] ◄── [7. Validate Rules] ◄── [6. Map Columns] ◄── [5. Offset Headers]
```

### High-Level Architecture Flow

1. **Step 1: Project Metadata & Vault**: The user loads a declarative JSON schema defining target columns, data rules, and destination API details. The application initializes an optional browser AES-GCM vault.
2. **Step 2: Provider Layout Profile**: Select the specific vendor or department format (e.g., "Supplier Standard XLSX" or "Partner CSV").
3. **Step 3: File Upload & Validation**: The file is dropped or selected. Unravel checks file headers, verifies MIME types, and flags format discrepancies (e.g., if a CSV was provided when XLSX was expected). If the file is an encrypted Excel document, the optional Decryption Gateway modal is invoked (which transmits the file to your configured cloud or local endpoint; using this service is entirely optional).
4. **Step 4: Worksheet Selection**: For multi-sheet Excel workbooks, the active sheet is selected manually or automatically resolved via regex, preset names, or the **Date String Match strategy (which parses sheet dates and picks the latest sheet)**. For flat CSV/TSV files, this step is automatically bypassed.
5. **Step 5: Header Detection & Data Offset**: Preamble metadata or banner rows are skipped using automatic heuristics or manual row/column offsets.
6. **Step 6: Column Mapping & Transforms**: Source columns are mapped to canonical target schema keys. Transformations (trim, casing, date reformatting) are configured.
7. **Step 7: Rule Validation**: Target records are processed against validation rules (`NotEmpty`, `IsEmail`, `IsPostcode`, `IsPhoneNumber`, `IsInteger`, `MatchRegex`, `IsNHSNumber`). Ignorable failures fall back to default values.
8. **Step 8: Grid Review & Ingestion**: Full Excel-like interactive grid. Filter by *All Rows*, *Valid Rows*, or *Errors Only*. Perform single or bulk deletions, edit cells directly, inspect the rule summary sidebar, and export.

---

## 4. Running Unravel Locally

Because Unravel is completely static, it requires no backend runtime. You can run it with any static web server:

### Option A: Python Built-in Server
```bash
# From the project root:
cd app
python3 -m http.server 8080
```
Open your browser at `http://localhost:8080`.

### Option B: Node.js (npx serve or http-server)
```bash
cd app
npx serve .
# or
npx http-server -p 8080
```

### Option C: Caddy / Nginx
```bash
caddy file-server --root ./app --listen :8080
```

---

## 5. Next Steps
- Follow the **[User Guide](user-guide.md)** for an end-user walkthrough.
- Read the **[Developer Guide](developer-guide.md)** to configure custom schemas.
- Learn about the **[Privacy Policy & Security Model](privacy-policy.md)**.

