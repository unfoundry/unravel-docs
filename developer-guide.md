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
  "version": "1.3.0",
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
  "calculatedColumns": [ ... ],
  "rowFilters": { ... },
  "layouts": [ ... ]
}
```

---

## 2. Target Columns Specification

`targetColumns` defines the canonical schema your downstream systems expect:

```json
{
  "key": "sale_price",
  "label": "Unit Sale Price",
  "required": true,
  "defaultValue": "0.00",
  "defaultValidations": ["IsNumber"],
  "transforms": [
    "TRIM",
    { "type": "CAST_FLOAT", "precision": 2 }
  ]
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `key` | `string` | Unique identifier used as the JSON object property name in exported payloads. |
| `label` | `string` | Human-readable label displayed in headers and column pickers. |
| `required` | `boolean` | When `true`, empty or null values will trigger a blocking validation error. When `false`, falls back to `defaultValue`. |
| `defaultValue` | `string` | Fallback value populated when an optional cell is blank or has an ignored validation failure. |
| `defaultValidations` | `array[string]` | Default validation rule names attached to this column. |
| `transforms` | `array[string\|object]` | Sequential transformation pipeline applied to cell values. |

### Dev Studio Target Columns Toolbar

In Developer Studio, each target column is managed via a compact, single-row toolbar:
`[REQUIRED TOGGLE]` `[Display Label]` `[Default Value]` `[(N) Validation]` `[(N) Transformation]` `[BIN ICON]`

---

## 3. Ingestion Row Filters

`rowFilters` enables pre-validation filtering of incoming data. Rows that do not meet these criteria are excluded before validation grid processing, and can be exported with failure diagnostics.

```json
{
  "rowFilters": {
    "combine": "AND",
    "rules": [
      {
        "column": "sale_value",
        "operator": ">",
        "value": "0",
        "type": "number"
      },
      {
        "column": "sale_value",
        "operator": "<=",
        "value": "1000",
        "type": "number"
      },
      {
        "column": "status",
        "operator": "!=",
        "value": "CANCELLED",
        "type": "string"
      }
    ]
  }
}
```

| Property | Supported Values | Description |
| :--- | :--- | :--- |
| `combine` | `"AND"`, `"OR"` | Logical evaluator across configured rule items. |
| `column` | `string` | Target column key or mapped source field identifier. |
| `operator`| `"="`, `"!="`, `">"`, `">="`, `"<"`, `"<="` | Relational comparison operator. |
| `value` | `string` | Target threshold value for comparison. |
| `type` | `"number"`, `"string"` | Type coercion applied before comparison. |

---

## 4. Calculated Columns (Virtual Fields)

`calculatedColumns` allows developers to derive virtual columns computed from custom formulas using bracketed token references:

```json
{
  "calculatedColumns": [
    {
      "key": "sale_total",
      "label": "Total Revenue",
      "formula": "[sale_qty] * [sale_unit_price]",
      "transforms": [{ "type": "CAST_FLOAT", "precision": 2 }]
    },
    {
      "key": "sale_category",
      "label": "Volume Class",
      "formula": "([sale_qty] > 100) ? 'large' : 'small'"
    }
  ]
}
```

- Tokens: Any existing column identifier enclosed in brackets `[column_id]` is dynamically replaced with the row's value.
- Arithmetic: Standard operators (`+`, `-`, `*`, `/`, `%`) and parenthetical expressions.
- Conditionals: JavaScript-style ternary logic `(condition) ? true_val : false_val`.

---

## 5. Type Casting & Transformation Pipelines

Transformations can be specified as simple strings or structured objects with configuration parameters:

| Transform | Options | Description |
| :--- | :--- | :--- |
| `TRIM` | - | Strips leading and trailing whitespace. |
| `UPPERCASE` | - | Converts all characters to uppercase. |
| `LOWERCASE` | - | Converts all characters to lowercase. |
| `CAPITALIZE` | - | Capitalizes the first letter of each word. |
| `CAST_STRING` | - | Converts numbers or booleans into standard string format. |
| `CAST_FLOAT` | `precision: number` | Parses floating-point number and rounds to specified decimal places (e.g. `2`). |
| `CAST_INTEGER`| - | Parses numeric value and rounds to nearest whole integer. |
| `CAST_DATE` | `dateFormatSource`, `dateFormatTarget` | Converts dates from source format (e.g. `DD/MM/YYYY`) to target format (e.g. `YYYY-MM-DD`). |

---

## 6. Supplier Layout Profiles

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
- `"mode": "date_parse"`: Evaluates all sheet names against `dateFormatString` and automatically selects the latest sheet by parsed date.

---

## 7. Built-in Validation Rules

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

## 8. Unravel Dev Studio

Located at `builder/index.html` inside `repos/unravel-ui/`.

### Key Capabilities
1. **Dropzone Auto-Scaffolding**: Drag any `.csv` or `.xlsx` sample file into Dev Studio. Unravel automatically parses headers, samples cell values, infers appropriate data types, and generates candidate target columns and mappings.
2. **Compact Target Columns Toolbar**: Configure required flags, display labels, fallback default values, validations, and transformation pipelines in a single unified row per field.
3. **Full Undo / Redo**: Keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`) and ribbon buttons allow full traversal of schema modifications.
4. **Collapsible JSON Live Preview**: Toggle the right-hand JSON schema code view to maximize screen space when editing large schemas.
5. **Direct Local Test**: Click **Test in Unravel Runner** to immediately launch the ingestion engine with your new schema loaded into session RAM.
6. **JSON Import / Export**: Download your finished schema as a `.json` file for distribution or version control.
