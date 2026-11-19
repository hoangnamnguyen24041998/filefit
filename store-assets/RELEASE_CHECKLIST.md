# Chrome Web Store Release & Submission Runbook — FileFit v1.0.0

A complete step-by-step runbook for packaging, testing in **Arc Browser** (`arc://extensions`), and submitting **FileFit** to the **Google Chrome Web Store Developer Dashboard**.

---

## Phase 1: Local Verification in Arc / Chrome

### 1. Build and Run Preflight
Run the release build command from the project root:
```bash
npm run release:zip
```
This automatically runs:
- `npm run generate-icons`: Compiles crisp 16, 32, 48, and 128 (96px + 16px safe padding) PNG icons.
- `tsc -b`: Strict TypeScript verification.
- `vite build`: Production minification, source map stripping, and dynamic code-splitting.
- `scripts/pack-release.mjs`: Audits `manifest.json`, icon sizes, zero remote CDN references, and generates `release/filefit-v1.0.0.zip`.

### 2. Load Unpacked in Arc Browser
1. In Arc, open the command bar (`Cmd + T`) and navigate to:
   ```text
   arc://extensions
   ```
   *(or `chrome://extensions` in Google Chrome)*
2. In the top-right corner, ensure **Developer mode** toggle is **ON**.
3. Click **Load unpacked** in the top-left toolbar.
4. Select the build directory:
   ```text
   /Users/namnguyenne/Desktop/filefit/dist
   ```
5. Confirm that **FileFit — Instant Image Compressor & HEIC to JPG** appears with version `1.0.0` and no errors.

### 3. Verify the 4 Scenarios in Test Harness
Open the local test harness in Arc:
```bash
open /Users/namnguyenne/Desktop/filefit/test-playground/index.html
```
- [ ] **Scenario 01 (Form Upload):** Click "4.5 MB JPG" generator button. Verify the Floating Widget appears, shows `national_id_scan_hires.png` (or generated file), and clicking **Compress & Apply** injects a `< 1 MB` file into the form.
- [ ] **Scenario 02 (Hidden Dropzone):** Click custom dropzone. Verify hidden `<input>` is intercepted seamlessly.
- [ ] **Scenario 03 (Auto-Upload Server):** Select an oversized file. Observe server simulator initially rejecting, then turning green `HTTP 200 OK` when fitted.
- [ ] **Scenario 04 (Multi-File):** Select mixed files (image + PDF). Confirm non-image files remain 100% untouched while images are compressed.
- [ ] **Extension Popup:** Click the FileFit toolbar icon. Test toggling between **Manual Assist** and **Auto-Fit**, switching size presets, and pausing the current domain.

---

## Phase 2: Host Privacy Policy on GitHub Pages

Google Chrome Web Store requires a live, publicly accessible **Privacy Policy URL**.

1. Commit and push the repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: release v1.0.0 package"
   git remote add origin https://github.com/hoangnamnguyen24041998/filefit.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Branch: `main`, Folder: `/docs`. Click **Save**.
3. Your live Privacy Policy URL will be:
   ```text
   https://hoangnamnguyen24041998.github.io/filefit/privacy.html
   ```
   *(Test that this URL opens cleanly in any browser before submitting)*

---

## Phase 3: Chrome Web Store Submission Guide

### 1. Developer Dashboard Access
1. Visit the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Sign in with your registered Google Developer account ($5 one-time registration fee if new).

### 2. Upload the Package
1. Click **+ Add new item** (top-right).
2. Drag and drop the packaged zip file:
   ```text
   /Users/namnguyenne/Desktop/filefit/release/filefit-v1.0.0.zip
   ```
3. The dashboard will unpack and validate `manifest.json`. Ensure zero validation errors appear.

### 3. Store Listing Tab
Copy the verified copy from [`store-assets/STORE_LISTING.md`](./STORE_LISTING.md):
- [ ] **Item Name:** `FileFit — Instant Image Compressor & HEIC to JPG`
- [ ] **Summary:** `Compress oversized images & convert HEIC/WebP to JPG right inside any upload field. 100% local & private.`
- [ ] **Description:** Paste the full Markdown/text description from `store-assets/STORE_LISTING.md`.
- [ ] **Category:** Select `Productivity` (or `Workflow & Planning`).
- [ ] **Language:** Select `English (United States)`.

### 4. Graphic Assets Tab
Upload the 6 pre-rendered, pixel-perfect PNG assets from [`store-assets/`](./):
- [ ] **Store Icon:** Upload `public/icons/icon-128.png` (128×128 canvas with 96×96 squircle + 16px CWS safe padding).
- [ ] **Small Promo Tile:** Upload `store-assets/promo-small-440x280.png` (`440x280`).
- [ ] **Marquee Promo Tile:** Upload `store-assets/promo-marquee-1400x560.png` (`1400x560`).
- [ ] **Screenshots (1280×800):**
  1. `store-assets/screenshot-1-instant-fit-1280x800.png`
  2. `store-assets/screenshot-2-heic-convert-1280x800.png`
  3. `store-assets/screenshot-3-autofit-mode-1280x800.png`
  4. `store-assets/screenshot-4-offline-privacy-1280x800.png`

### 5. Privacy Practices Tab (Critical for 1st-Pass Approval)
Follow the exact copy-paste justifications in `store-assets/STORE_LISTING.md`:
- [ ] **Single Purpose Description:**  
  `FileFit provides 100% client-side image compression and format conversion (HEIC/HEIF/WebP/PNG to JPG) directly within file upload fields on web pages without uploading user files to any server.`
- [ ] **Permission: storage:**  
  Paste justification from `store-assets/STORE_LISTING.md`.
- [ ] **Permission: activeTab:**  
  Paste justification from `store-assets/STORE_LISTING.md`.
- [ ] **Host Permission: `<all_urls>`:**  
  Paste justification from `store-assets/STORE_LISTING.md`.
- [ ] **Remote Code Declaration:** Select **No** (confirm zero remote code).
- [ ] **Data Usage Checkboxes:** Leave **all categories unchecked** (no personal data, location, or website content is collected).
- [ ] **Privacy Policy URL:** Paste your live GitHub Pages URL (`https://hoangnamnguyen24041998.github.io/filefit/privacy.html`).

### 6. Distribution & Pricing Tab
- [ ] **Visibility:** Public
- [ ] **Pricing:** Free

---

## Phase 4: Submit for Review

1. Click **Submit for review**.
2. Select **Publish automatically after review** (standard).
3. Manifest V3 extensions with zero remote code and clean privacy justifications typically pass automated and manual review in **24 to 48 hours**.
