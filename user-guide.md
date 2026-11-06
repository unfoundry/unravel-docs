# User Guide

Welcome to the **Unravel User Guide**. This document explains how to use Unravel to ingest, normalize, and validate messy spreadsheet and flat-file records.

---

## Interface Overview

Unravel features a clean, professional spreadsheet-inspired workspace:
- **Top Ribbon**: Quick access to file operations, Project Info, Dev Studio, Help, Privacy Policy, and Local Vault Lock status.
- **Workflow Step Container**: Displays the active step in the ingestion wizard.
- **Validation Sidebar**: Appears during data review to give an instant breakdown of active columns, rules applied, and success/failure counts.

---

## The Ingestion Pipeline

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
  - **Format Check**: If your selected provider expects a `.csv` file but an `.xlsx` file is supplied (or vice versa), Unravel displays an alert.
  - **Encrypted Excel Support**: If the Excel file is password-protected, Unravel opens the decryption dialog, allowing you to enter the workbook password and decrypt the file into browser RAM via the optional decryption gateway.
  - **Automatic Forwarding**: Once uploaded, Unravel reads file headers and automatically navigates to the furthest valid step without manual clicks.

### Stage 4: Worksheet Selection
- **Excel (`.xlsx`)**: Select the worksheet you want to process. Unravel supports:
  - **First Sheet**: Automatically grabs the first tab.
  - **Preset Sheet Name**: Looks for a designated tab name (e.g. `ClientData`).
  - **Regex Match**: Automatically finds sheets matching a pattern (e.g., `^(Clients|Accounts)[_\-\s]?\d*$`).
  - **Date String Match (Selects Latest Sheet)**: Parses date stamps across worksheet names using standard calendar patterns, and automatically selects the latest sheet by parsed date.
- **CSV / TSV Files**: Delimited files have no worksheets. Unravel automatically bypasses this step with an informative status message.

### Stage 5: Header Detection & Data Offset
- **What it does**: Identifies where column headers begin and where data rows start.
- **Auto-Detection**: Unravel scans the top rows to skip preamble notices, empty lines, or supplier logo banners.
- **Manual Controls**: If auto-detection misses the correct row, adjust the **Header Row Offset** (Y) and **Column Offset** (X) using the number steppers.

### Stage 6: Column Translation & Mappings
- **What it does**: Maps supplier columns to your system's canonical target schema fields using clean dropdown pickers with auto-matched suggestions.
- **Available Transformations & Type Casting**:
  - `TRIM`: Strips leading and trailing whitespace.
  - `UPPERCASE` / `LOWERCASE`: Standardizes case formatting.
  - `CAPITALIZE`: Capitalizes the first letter of each word.
  - `CAST_STRING`: Casts input into string format.
  - `CAST_FLOAT`: Casts to floating-point numeric format with customizable decimal precision.
  - `CAST_INTEGER`: Casts to integer, automatically rounding if decimal values are provided.
  - `CAST_DATE`: Converts dates from a source format (e.g. `DD/MM/YYYY`) to target standard formats (e.g. `YYYY-MM-DD`).

### Stage 7: Ingestion Row Filters & Calculated Columns
- **Ingestion Row Filters**: Filters out irrelevant rows before validation. Define conditions using operators (`=`, `!=`, `>`, `>=`, `<`, `<=`) on numbers or text, combined with `AND` or `OR` logic.
- **Calculated Columns (Virtual Fields)**: Computes dynamic columns using bracketed tokens (e.g. `[sale_qty] * [sale_unit_price]` or `([sale_qty] > 100) ? 'large' : 'small'`).

### Stage 8: Rule Validation & Error Tolerances
- **Rule Verification**:
  - `NotEmpty`: Requires a non-blank value.
  - `IsEmail`: Validates email formats.
  - `IsPostcode`: Validates postal codes.
  - `IsPhoneNumber`: Validates domestic and international telephone numbers.
  - `IsInteger` / `IsNumber`: Validates numeric input.
  - `IsAlphanumeric`: Validates letters and digits.
  - `MatchRegex`: Custom regular expression pattern check.
  - `IsNHSNumber`: Modulus 11 checksum verification for 10-digit UK NHS numbers.
- **Error Tolerances**:
  - **Required Fields**: Flagged if blank or failing rules.
  - **Optional Fields**: Fall back gracefully to configured `defaultValue` if empty or invalid.

### Stage 9: Review Grid & Dual Export
- **Grid Filters**: Filter by *All Rows*, *Valid Rows*, or *Errors Only*.
- **Cell Editing**: Click any cell in the grid to edit its value directly. Validation updates in real time.
- **Multi-Row Operations**: Select rows via checkboxes and delete invalid records in bulk.
- **Rule Breakdown Sidebar**: Inspect rule pass/fail percentages across each column.
- **Export Clean Data**:
  - **Download JSON**: Generates structured, normalized JSON records.
  - **Download CSV**: Generates RFC 4180 compliant CSV.
  - **Download XLSX**: Generates clean Microsoft Excel workbook.
  - **Dispatch to REST API**: Posts the clean payload directly to your configured endpoint with your Authorization Bearer token.
- **Download Excluded Rows**:
  - Button group option in the export menu allowing you to export a `.csv` file containing only the rows excluded by filters or user actions, including an explicit column detailing the reason for exclusion.
