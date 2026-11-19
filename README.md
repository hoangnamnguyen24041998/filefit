# FileFit — Instant Image Compressor & HEIC to JPG

> **100% Client-Side Upload Interceptor & Converter for Chrome & Arc (Manifest V3)**  
> *Store Title:* `FileFit — Instant Image Compressor & HEIC to JPG`

FileFit is an obsessive-craft, privacy-first Chrome Extension micro-utility designed with Swiss precision (Linear / Raycast / macOS design aesthetics). It intercepts `<input type="file">` change events in the browser's global capture phase to compress oversized images and convert incompatible formats (`HEIC`, `HEIF`, `WebP`, heavy `PNG`) to `JPG` right inside the upload flow.

---

## ⚡ Key Highlights

- **Zero Server / 100% Offline Privacy:** 0 external API calls, 0 analytics, minimal MV3 permissions (`storage`, `activeTab`).
- **Dynamic Module Code-Splitting:** `heic2any` is isolated into its own bundle chunk (~340 KB gzipped) and dynamically loaded **only** when a `.heic` or `.heif` image is actually selected.
- **Precision Image Engine:**
  - Binary search quality optimization (`0.45` to `0.92`, max 6 iterations) preserving text legibility on IDs and documents.
  - Progressive step-down resize (`0.8x`, safe minimum floor `800px`).
  - Solid `#FFFFFF` canvas background fill so transparent PNG/WebP alpha channels never turn black.
- **Bulletproof Interception & Shadow DOM Isolation:**
  - Capture-phase listener (`document.addEventListener('change', handler, true)`) supporting dynamically mounted SPAs (React, Vue, Angular, Dropzone).
  - Loop guard via `WeakSet<HTMLInputElement>`.
  - Re-dispatches both `input` and `change` events with `{ bubbles: true, composed: true }`.
  - Shadow DOM mounting (`attachShadow({ mode: 'open' })`) with inline CSS injection and base font-size locking to defeat host `rem` distortion.

---

## 📁 Project Architecture

```text
filefit/
├── manifest.json              # Clean Manifest V3 definition
├── vite.config.ts             # Vite + @crxjs/vite-plugin v3+
├── popup.html                 # Extension popup entry
├── scripts/
│   ├── generate-icons.mjs     # Sharp-based icon generator (16, 32, 48, 128)
│   └── verify-engine.mjs      # Engine assertion test suite
├── public/
│   └── icons/                 # icon-16.png, icon-32.png, icon-48.png, icon-128.png
├── test-playground/
│   └── index.html             # Local harness simulating 4 real-world upload scenarios
└── src/
    ├── assets/
    │   ├── logo-mark.svg      # Master 128x128 vector squircle logo
    │   └── logo-mark-16.svg   # Optically simplified 16x16 toolbar mark
    ├── components/
    │   └── BrandLogo.tsx      # Multi-scale vector logo component
    ├── background/
    │   └── index.ts           # Service worker (install setup + badge status)
    ├── content/
    │   ├── index.tsx          # Content script entry + Shadow DOM mounting
    │   └── widget.css         # Isolated CSS with font-size lock & custom styling
    ├── popup/
    │   ├── main.tsx           # Popup entry
    │   ├── popup.css          # Tailwind popup styling
    │   └── App.tsx            # 320px Hallmark popup UI
    └── features/
        ├── compression/
        │   ├── compressImage.ts  # Binary search canvas quality & step-down resize
        │   ├── convertHeic.ts    # Lazy-loaded heic2any wrapper
        │   └── types.ts
        ├── interceptor/
        │   ├── fileInterceptor.ts # Capture-phase listener & DataTransfer injection
        │   └── fileAnalyzer.ts    # Size & format inspection + accept attribute logic
        ├── widget/
        │   └── FloatingWidget.tsx # Floating utility card (recessed wells, segmented controls)
        └── settings/
            ├── storage.ts         # Chrome storage sync helper with fallback
            └── types.ts           # Config presets (< 500 KB, < 1 MB, < 2 MB)
```

---

## 🚀 Quick Start & Building

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Real PNG Icons
```bash
npm run generate-icons
```

### 3. Run Verification Tests
```bash
npm run test
```

### 4. Build Production Bundle & Chrome Web Store Package
```bash
npm run release:zip
```
This runs TypeScript checks, builds `dist/`, performs strict preflight audits, and produces `release/filefit-v1.0.0.zip`.

### 5. Generate Chrome Web Store Marketing Assets
```bash
npm run generate-store-assets
```
Generates all 6 promotional PNG tiles and screenshot assets in `store-assets/`.

---

## 🌐 Loading Unpacked in Arc & Chrome

1. In **Arc**, enter `arc://extensions` in your command bar (or `chrome://extensions` in Chrome/Brave/Edge).
2. Toggle on **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the `dist/` directory inside `/Users/namnguyenne/Desktop/filefit/dist`.
5. Pin **FileFit** to your toolbar. Click the extension icon to verify the 320px Hallmark popup interface.

---

## 🧪 Testing the 4 Real-World Scenarios

Open the local test harness in Arc/Chrome:
```bash
open test-playground/index.html
```

The test page features 4 simulated upload scenarios:
1. **Standard Form Upload (`<form>`):** Tests live image preview and form submission metadata.
2. **Visually Hidden Dropzone Button (`display: none`):** Tests programmatic `.click()` on hidden inputs used by modern SPAs.
3. **Auto-Upload Server Simulator:** Simulates immediate upload on `change` and strictly enforces `< 2 MB` and `JPG only`. Shows live server HTTP status.
4. **Multi-File Batch Upload (`multiple`):** Mixes oversized images with non-image files (PDFs) to verify that non-image documents remain 100% untouched.
