# Developer Guide

This guide is designed for developers, integration engineers, and technical administrators who build, maintain, or customize schema configurations for **Unravel**.

---

## 1. Schema Specification Reference

Unravel schemas are declarative JSON documents defining how external data should be normalized into canonical business objects.

### Top-Level Schema Structure

```json
{
  "$schema": "https://unravel.internal/schema.v1.json",
  "projectId": "crm-customers-v1",
  "name": "Customer CRM Master Ingestion",
  "version": "1.2.0",
  "author": {
    "username": "data.architect",
    "email": "architect@enterprise.org"
  },
  "destination": {
    "postUrl": "https://api.enterprise.org/v2/contacts/sync",
    "headers": {
      "Authorization": "Bearer {{TOKEN}}",
      "Content-Type": "application/json"
    }
  },
  "targetColumns": [ ... ],
  "layouts": [ ... ]
}
```

---

## 2. Target Columns Specification

`targetColumns` defines the canonical schema your downstream systems expect:

```json
{
  "key": "email",
  "label": "Email Address",
  "required": true,
  "ignorable": false,
  "defaultValue": "",
  "defaultValidations": ["IsEmail"]
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `key` | `string` | Unique identifier used as the JSON object property name in exported payloads. |
| `label` | `string` | Human-readable label displayed in headers and column pickers. |
| `required` | `boolean` | When `true`, empty or null values will trigger a blocking validation error. |
| `ignorable` | `boolean` | When `true`, failures in this column will not drop the row. Instead, the cell is assigned `defaultValue`. |
| `defaultValue` | `string` | Fallback value populated when a cell is blank or has an ignored validation failure. |
| `defaultValidations` | `array[string]` | Default validation rule names attached to this column. |

---

## 3. Supplier Layout Profiles

`layouts` allows you to define multiple format variations for different suppliers or data providers:

```json
{
  "id": "layout_supplier_acme",
  "name": "ACME Corp Monthly Billing (.xlsx)",
  "fileType": "xlsx",
  "filePassword": "",
  "sheetStrategy": {
    "mode": "regex",
    "presetName": "",
    "regexPattern": "^(Billing|Invoice)[_\\-\\s]?\\d*$",
    "dateFormatString": "YYYY-MM-DD"
  },
  "offset": {
    "offsetX": 0,
    "offsetY": 2,
    "autoDetect": true,
    "maxColumns": "Auto",
    "maxRows": "Auto"
  },
  "mappings": [ ... ]
}
```

### Sheet Strategies
- `"mode": "first_sheet"`: Selects the workbook's first visible tab.
- `"mode": "preset"`: Matches the tab matching `presetName`.
- `"mode": "regex"`: Evaluates all tab names against `regexPattern`.
- `"mode": "date_parse"`: Evaluates all sheet names against `dateFormatString` (e.g. `YYYY-MM-DD`, `DD/MM/YYYY`, `MMMM-YYYY`) and **automatically selects the latest sheet by parsed date**.

---

## 4. Column Mappings & Transforms

Inside each layout, `mappings` defines how raw file columns map to `targetColumns`:

```json
{
  "sourceColumn": "Account Code",
  "targetColumn": "account_id",
  "fallbackIndex": "A2",
  "transform": "UPPERCASE",
  "ignorable": false,
  "defaultValue": "",
  "validations": [
    { "type": "NotEmpty" },
    { "type": "MatchRegex", "pattern": "^[A-Z]{2}-\\d{4}$", "message": "Must match format XX-0000" }
  ]
}
```

### Available Transformations

| Transform | Behavior | Extra Fields |
| :--- | :--- | :--- |
| `NONE` | Passes value without modification. | - |
| `TRIM` | Removes leading and trailing whitespace. | - |
| `UPPERCASE` | Converts all characters to uppercase. | - |
| `LOWERCASE` | Converts all characters to lowercase. | - |
| `CAPITALIZE` | Capitalizes first letter of each word. | - |
| `DATE_FORMAT` | Re-parses dates and formats output using Moment.js. | `dateFormatSource`, `dateFormatTarget` |

#### Date Formatting Example
```json
{
  "sourceColumn": "JoinedOn",
  "targetColumn": "signup_date",
  "transform": "DATE_FORMAT",
  "dateFormatSource": "DD/MM/YYYY",
  "dateFormatTarget": "YYYY-MM-DD"
}
```

---

## 5. Built-in Validation Rules

| Rule Name | Options / Parameters | Description |
| :--- | :--- | :--- |
| `NotEmpty` | - | Rejects empty strings, null, or undefined. |
| `IsEmail` | - | Validates standard RFC 5322 email patterns. |
| `IsPostcode` | - | Validates UK postal code formats. |
| `IsPhoneNumber` | - | Validates standard national/international telephone numbers. |
| `IsNumber` | - | Validates numeric values (integers or floating-point decimals). |
| `IsInteger` | - | Validates whole numbers only. |
| `IsAlphanumeric`| - | Validates letters and digits (no symbols or spaces). |
| `MatchRegex` | `pattern`, `message` | Evaluates cell against custom regular expression pattern. |
| `IsNHSNumber` | - | Validates UK 10-digit National Health Service Modulus 11 checksum. |

---

## 6. Unravel Dev Studio

Unravel includes a complete visual schema editor located at `app/builder/index.html`.

### Key Features
1. **Dropzone Auto-Scaffolding**: Drag any real-world `.csv` or `.xlsx` file into the Dev Studio dropzone. Unravel automatically parses headers, samples cell values, infers appropriate data types (e.g. emails, numbers, postal codes), and generates candidate target columns and mappings.
2. **Interactive Rule Inspector**: Add or remove validation rules per column with real-time regex testing.
3. **Starter Template Registry**: Choose from pre-built starter configurations (Customer CRM, Payroll HR, Healthcare, or Blank) or save your current schema as a new reusable template.
4. **Direct Local Test**: Click **Test in Unravel Runner** to immediately launch the ingestion engine with your new schema loaded into session RAM.
5. **JSON Import / Export**: Download your finished schema as a `.json` file for distribution or version control.

---

## 7. Global Configuration File (`app/config.json`)

To configure default API endpoints, decryption gateways, and theme branding across both the Runner and Dev Studio without editing code, use `app/config.json`. See the [Customization Guide](customization.md) for full schema details.

