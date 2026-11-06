# Customization & Configuration Guide

Unravel is built to be easily configured and white-labeled without modifying core source code. You can configure endpoints, application branding, theme colors, and features directly via `app/config.json`.

---

## 1. Declarative Customization via `app/config.json`

At application startup, both the Ingestion Runner (`app/index.html`) and Dev Studio (`app/builder/index.html`) automatically load [`app/config.json`](../app/config.json).

### Full `config.json` Reference
```json
{
  "appName": "Unravel",
  "appSubtitle": "Tabular Data Ingestion & Normalizer",
  "appLogoIcon": "bi-layers-half",
  "companyName": "Enterprise Global Operations",
  "supportEmail": "operations@enterprise.org",
  "privacyPolicyUrl": "docs/privacy-policy.md",
  "documentationUrl": "docs/README.md",

  "endpoints": {
    "unravelServiceUrl": "http://127.0.0.1:8001",
    "userInfoUrl": "assets/sample-data/user-info.json",
    "defaultApiUrl": "https://api.enterprise.org/v1/ingest/clients",
    "defaultAuthToken": ""
  },

  "theme": {
    "name": "lumen",
    "primary": "#158cba",
    "primaryDark": "#117095",
    "primaryLight": "#23a8dc",
    "accent": "#158cba",
    "success": "#28b62c",
    "warning": "#ff851b",
    "danger": "#ff4136",
    "surface": "#f6f6f6",
    "border": "#dddddd"
  },

  "features": {
    "enableSamples": false,
    "enableUnravelService": false,
    "enableDecryptionService": true,
    "enableFileBroker": true,
    "enableTelemetry": true,
    "enableHybridEncryption": false,
    "enableDevStudio": true,
    "autoAdvanceFurthestStep": true,
    "defaultSheetDateFormat": "YYYY-MM-DD",
    "maxPreviewRows": 5,
    "allowUnsavedExitWarning": true
  }
}
```

### Configurable Properties

| Key | Description |
| :--- | :--- |
| `appName` | Custom product name rendered in browser title, header ribbons, status bars, and modals. |
| `appSubtitle` | Sub-header description shown in the header ribbon and actively applied as the HTML page `<meta name="description">`. |
| `appRoot` | Base deployment path prefix (e.g. `"/app"` when deployed in a subdirectory, or `"/"` when deployed at the site root). |
| `appLogoImage` | Custom image URL, relative path, or base64 data URI for the app logo (takes precedence over `appLogoIcon`). |
| `appLogoIcon` | Any Bootstrap Icons class (e.g. `bi-layers-half`, `bi-database-check`, `bi-shield-check`) used as fallback when `appLogoImage` is empty. |
| `endpoints.unravelServiceUrl` | Unified base URL for all Unravel Service features (Decryption, Live File Broker, SQLite Projects, Telemetry). |
| `endpoints.userInfoUrl` | API endpoint or relative JSON file returning logged-in author metadata (username, email, role). |
| `endpoints.defaultApiUrl` | Default REST API ingestion endpoint populated in Step 1. |
| `theme.*` | Dynamic CSS color overrides. Injected directly into CSS Custom Properties at runtime. |
| `features.enableSamples` | When `false`, hides all built-in sample files (sample CSV, XLSX, encrypted XLSX), quick sample schemas, and Starter Templates across the app and Developer Studio. Defaults to `true`. |
| `features.enableUnravelService` | Master toggle. When `false`, disables all remote Unravel Service calls and operates strictly in local zero-trust mode. |
| `features.enableDecryptionService` | When `false`, disables the remote XLSX Decryption Service. |
| `features.enableFileBroker` | When `false`, disables the live Unravel Ingestion File Broker redirect button. |
| `features.enableTelemetry` | When `false`, disables dispatching session error/completion telemetry to Unravel Service. |
| `features.enableHybridEncryption` | When `true`, enables client-side RSA-OAEP + AES-256-GCM payload encryption for cloud transit. |

---

## 2. Modifying Color Palettes & CSS Themes

Unravel uses CSS Custom Properties defined at the root of `app/assets/css/style.css`:

```css
:root {
  /* Brand Theme Colors (Bootswatch Lumen Palette) */
  --unravel-primary: #158cba;        /* Main brand color (Headers, buttons, active steps) */
  --unravel-primary-dark: #117095;   /* Hover states, dark accents */
  --unravel-primary-light: #23a8dc;  /* Highlights, active borders */
  --unravel-accent: #158cba;         /* Secondary accent */

  /* Semantic State Colors */
  --unravel-success: #28b62c;        /* Valid cells, success notices */
  --unravel-warning: #ff851b;        /* Ignored errors, fallback default indicators */
  --unravel-danger: #ff4136;         /* Blocking errors, failed cells */
  --unravel-teal: #75caeb;           /* Badges, info highlights */
  --unravel-purple: #7c2855;         /* Special tokens */

  /* Surface & Background */
  --unravel-surface: #f6f6f6;        /* Ribbon background, subtle card fills */
  --unravel-border: #dddddd;         /* Table borders, card outlines */
  --unravel-text: #222222;           /* Primary text */
  --unravel-muted: #777777;          /* Secondary text */
}
```

You can customize these either directly in `app/config.json` (no CSS editing required) or by editing `style.css`.

---

## 3. Registering Custom Validation Rules

Unravel's validation engine is fully extensible. You can register custom domain validation logic in `app/assets/js/validators.js`:

### Step 1: Add Validator Method
Open `app/assets/js/validators.js` and add a static method to `UnravelValidator`:

```javascript
/**
 * Custom Validator: Validates ISO 3166-1 alpha-2 country codes
 */
static isCountryCode(val) {
  if (!val) return { valid: false, error: "Country code is required" };
  const validCodes = ['US', 'GB', 'CA', 'DE', 'FR', 'JP', 'AU'];
  const clean = String(val).trim().toUpperCase();
  if (validCodes.includes(clean)) {
    return { valid: true, error: null };
  }
  return { valid: false, error: `Invalid country code "${val}". Must be ISO-2 (e.g. US, GB).` };
}
```

### Step 2: Register in Rule Dispatcher
In `UnravelValidator.validate(value, rule)`, add your rule name to the switch statement:

```javascript
case 'iscountrycode':
  return this.isCountryCode(val);
```

### Step 3: Register in Dev Studio
To allow power users to select your custom rule in the Dev Studio dropdown, open `app/assets/js/builder.js` and append your rule name to `availableRules`:

```javascript
const availableRules = [
  'NotEmpty', 'IsEmail', 'IsPostcode', 'IsPhoneNumber',
  'IsNumber', 'IsInteger', 'IsAlphanumeric', 'MatchRegex',
  'IsCountryCode' // <--- Added custom rule
];
```

---

## 4. Customizing Default Starter Templates

Edit `app/assets/sample-data/starter-templates.json` to configure the templates displayed when developers open the Dev Studio. You can define organization-specific fields (e.g., Department Codes, GL Accounts, Employee IDs, Inventory SKUs) so your team never has to build schemas from scratch.
