# User Guide

Welcome to the **Unravel User Guide**. This document explains how to use Unravel to ingest, normalize, and validate messy spreadsheet and flat-file records.

---

## 🧭 Interface Overview

Unravel features a clean, professional spreadsheet-inspired workspace:
- **Top Ribbon**: Quick access to file operations, Project Info, Dev Studio, Help, Privacy Policy, and Local Vault Lock status.
- **Workflow Step Container**: Displays the active step in the 8-stage ingestion process. Non-scrollable viewport keeps tools easily reachable.
- **Validation Sidebar**: Appears during data review to give an instant breakdown of active columns, rules applied, and success/failure counts.

---

## 📋 The 8-Stage Ingestion Pipeline

### Stage 1: Project Configuration & Security Vault
- **What it does**: Displays the current ingestion schema, destination REST endpoint, and project metadata.
- **Actions**:
  - Click **Edit Metadata** to update project name, target API endpoint, or API Authorization Bearer Token.
  - Setup or unlock your **Browser Vault** to encrypt saved session configurations with AES-GCM 256-bit cryptography.
  - Click **Proceed** to select a provider profile.

### Stage 2: Select Provider / Supplier Profile
- **What it does**: Select the specific layout profile that corresponds to the file format provided by your supplier or department.
- **Why it matters**: Different suppliers often submit columns under varying headers or file types. Profiles pre-configure mapping and offset rules.

### Stage 3: File Upload & Verification
- **What it does**: Drag and drop your `.xlsx`, `.csv`, or `.tsv` file into the upload dropzone, or click **Browse Files**.
- **Smart Validation**:
  - **Format Check**: If your selected provider expects a `.csv` file but an `.xlsx` file is supplied (or vice versa), Unravel displays a warning modal. You can choose to proceed or upload the correct file.
  - **Encrypted Excel Support**: If the Excel file is password-protected, Unravel opens the decryption dialog, allowing you to enter the workbook password and decrypt the file into browser RAM via the optional decryption gateway. *(Note: The decryption service transmits the encrypted file to your configured endpoint in the cloud or local server, and is entirely optional).*
  - **Automatic Forwarding**: Once uploaded, Unravel reads file headers and automatically navigates to the furthest valid step without manual clicks.

### Stage 4: Worksheet Selection
- **Excel (`.xlsx`)**: Select the worksheet you want to process. Unravel supports:
  - **First Sheet**: Automatically grabs the first tab.
  - **Preset Sheet Name**: Looks for a designated tab name (e.g. `ClientData`).
  - **Regex Match**: Automatically finds sheets matching a pattern (e.g., `^(Clients|Accounts)[_\-\s]?\d*$`).
  - **Date String Match (Selects Latest Sheet)**: Parses date stamps across worksheet names (e.g., `2026-10-01`, `15/11/2026`, `Report_2026_11_30`) using your specified date format or standard calendar patterns, and **automatically selects the latest sheet by parsed date**.
- **CSV / TSV Files**: Delimited files have no worksheets. Unravel automatically greys out this step with an informative tooltip and skips straight to Step 5.

### Stage 5: Header Detection & Data Offset
- **What it does**: Identifies where column headers begin and where data rows start.
- **Auto-Detection**: Unravel scans the top rows to skip preamble notices, empty lines, or supplier logo banners.
- **Manual Controls**: If auto-detection misses the correct row, adjust the **Header Row Offset** (Y) and **Column Offset** (X) using the number steppers.

### Stage 6: Column Mapping & Transforms
- **What it does**: Maps supplier columns to your system's target schema.
- **Available Transformations**:
  - `TRIM`: Strips leading and trailing whitespace.
  - `UPPERCASE`: Converts all letters to uppercase (ideal for postal codes and identifiers).
  - `LOWERCASE`: Converts strings to lowercase (ideal for email addresses).
  - `CAPITALIZE`: Capitalizes the first letter of each word (ideal for personal names).
  - `DATE_FORMAT`: Converts dates from a source format (e.g. `DD/MM/YYYY`) to a target format (e.g. `YYYY-MM-DD`).

### Stage 7: Rule Validation & Error Tolerances
- **What it does**: Validates transformed cell values against strict rules.
- **Rule Types**:
  - `NotEmpty`: Requires a non-blank value.
  - `IsEmail`: Validates standard email addresses.
  - `IsPostcode`: Validates UK postal code formats.
  - `IsPhoneNumber`: Validates telephone numbers.
  - `IsInteger` / `IsNumber`: Validates numeric input.
  - `IsAlphanumeric`: Validates letters and digits.
  - `MatchRegex`: Custom regular expression pattern check.
- **Error Handling**:
  - **Blocking Errors**: Red cells. The record cannot be ingested until fixed or removed.
  - **Ignorable Errors**: Yellow cells. If a non-critical field fails validation (e.g., an optional phone number), the cell falls back to the configured `defaultValue` (e.g. `N/A`) and the row remains valid for export.

### Stage 8: Review Grid, Multi-Row Operations & Export
- **Grid Filters**:
  - **All Rows**: Shows the entire dataset.
  - **Valid Rows**: Displays clean rows and rows where ignorable errors fell back to default values.
  - **Errors Only**: Isolates only rows containing blocking errors.
- **Cell Editing**: Double-click or click any cell in the grid to edit its value directly. Validation updates in real time.
- **Row Selection & Multi-Row Deletion**:
  - Check individual row boxes or click the master checkbox in the header to select all visible rows.
  - Click **Delete Selected Rows** to drop bad or duplicate records in bulk.
- **Live Rule Sidebar**: Click **Toggle Rule Stats** to inspect rule pass/fail percentages across each column.
- **Ingestion Summary**: Review the total valid, ignored, and dropped row counts before exporting.
- **Exporting**:
  - **Download JSON**: Generates structured, normalized JSON records.
  - **Download CSV**: Generates RFC 4180 compliant CSV.
  - **Download XLSX**: Generates clean Microsoft Excel workbook.
  - **Dispatch to REST API**: Posts the clean payload directly to your configured endpoint with your Authorization Bearer token.
- **Save Layout Changes**: If you modified column mappings or offsets, click **Save Layout Changes** to overwrite the provider, update the schema, or save as a new layout profile.

