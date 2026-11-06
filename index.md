---
layout: home

hero:
  name: "Unravel"
  text: "Data Ingestion & Normalizer"
  tagline: "Client-side, zero-trust tabular data parsing, rule validation, and schema transformation for enterprise Excel, CSV, and TSV files."
  image:
    src: /logo.svg
    alt: Unravel Logo
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: Developer Guide
      link: /developer-guide
    - theme: alt
      text: GitHub
      link: https://github.com/unfoundry/unravel-docs

features:
  - icon: 🔒
    title: Zero-Trust Client-Side
    details: 100% of parsing, column mapping, transformations, and validations run directly in your browser memory. No sensitive records ever touch third-party servers.
  - icon: ⚡
    title: High Performance Engine
    details: Powered by WebAssembly and streaming parsers to validate and clean tens of thousands of rows in milliseconds with Excel-like responsiveness.
  - icon: 🎯
    title: Visual Schema Dev Studio
    details: Build, customize, and test schemas visually. Drag-and-drop sample files to auto-scaffold target columns, validations, and column mappings.
  - icon: 🧮
    title: Calculated Fields & Filters
    details: Derive virtual columns dynamically via custom formulas ([qty] * [price]) and apply pre-validation ingestion row filters with multi-condition logic.
  - icon: ✈️
    title: Air-Gapped & Offline Ready
    details: Fully functional offline with zero external runtime CDN dependencies. Built-in PWA service worker and local encrypted vault.
  - icon: 🛡️
    title: Independent Headless Service
    details: Companion Python/FastAPI service for AES-256 encrypted XLSX decryption, telemetry tracking, and automated server-side batch pipelines.
---

