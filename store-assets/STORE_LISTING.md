# Chrome Web Store Listing Package — FileFit

---

## 1. Store Metadata

- **Item Name (Store Title):**  
  `FileFit — Instant Image Compressor & HEIC to JPG`  
  *(48 characters — keyword-optimized for "Image Compressor", "HEIC to JPG", "File Fit")*

- **Short Summary (Promotional Summary):**  
  `Compress oversized images & convert HEIC/WebP to JPG right inside any upload field. 100% local & private.`  
  *(104 characters — strictly under Google's 132-character limit)*

- **Category:**  
  `Productivity` *(Secondary: `Workflow & Planning`)*

- **Primary Language:**  
  `English (United States)`

- **Privacy Policy URL:**  
  `https://hoangnamnguyen24041998.github.io/filefit/privacy.html`  
  *(Deploy `docs/privacy.html` via GitHub Pages or host on your custom domain)*

---

## 2. Store Description (Ready to Paste)

### [English — Primary]

Tired of upload forms screaming *"File size exceeds 2 MB limit"* or *"Unsupported file format .heic"*?

**FileFit** is an obsessive-craft, 100% client-side micro-utility for Chrome & Arc that intercepts file upload fields in real time. It compresses oversized photos and converts incompatible formats (iPhone HEIC, HEIF, WebP, heavy PNG) into clean, universal JPGs right inside the upload flow—with zero server uploads and zero privacy risk.

---

### ⚡ Why FileFit?

1. **Instant In-Place Interception:**
   No more switching tabs, opening suspicious online converters, or fiddling with desktop editors. When you drop or select an image in any web form, FileFit catches it in-flight and prepares it instantly.

2. **Native iPhone HEIC & HEIF Conversion:**
   Modern iPhones take stunning HEIC photos, but most job application forms, visa portals, and government websites still reject them. FileFit decodes HEIC locally via high-speed WebAssembly and outputs standard JPG files in milliseconds.

3. **Smart Target-Size Compression:**
   Pick your target with one click: `< 500 KB`, `< 1 MB`, or `< 2 MB`. FileFit's binary-search quality engine maximizes image and text legibility—essential for driver's licenses, passports, contracts, and receipts.

4. **100% Offline & Private (Safe for ID Cards):**
   Your photos, national ID cards, and confidential documents **never leave your device**. All compression algorithms and format decoders run in local browser RAM using standard Canvas APIs. Zero external API calls, zero analytics, zero tracking.

5. **Two Flexible Operating Modes:**
   - **Manual Assist (Default):** Displays a sleek, frosted floating utility card showing before/after sizes, format tags, and savings percentages (`4.6 MB → 740 KB • -84%`). Click *Compress & Apply* when ready.
   - **Auto-Fit:** Power-user mode that pauses the form's immediate submission, compresses silently using your preset, and re-dispatches standard DOM events seamlessly.

6. **Per-Site Controls:**
   Easily pause interception on specific websites or intranet portals with a single click in the extension popup.

---

### 🚀 Supported Formats

- **Inputs Accepted:** `HEIC`, `HEIF`, `PNG`, `WebP`, `JPEG`, `JPG`
- **Output:** Universal optimized `JPEG` (`.jpg`)
- **Non-image files:** Multi-file selections containing PDFs, DOCX, or spreadsheets are preserved 100% untouched.

---

### 🔒 Privacy Guarantee

- **Zero Cloud Uploads:** No file data is ever transmitted across the internet.
- **Minimal Permissions:** FileFit requests only `storage` (to save your size preset) and `activeTab` (to detect current domain).
- **Works Completely Offline:** Functions in airplane mode without internet connectivity.

---
---

### [Tiếng Việt — Vietnamese Section]

Bạn cảm thấy phiền phức khi biểu mẫu tải lên báo lỗi *"Kích thước tệp vượt quá 2MB"* hoặc *"Định dạng .heic không được hỗ trợ"*?

**FileFit** là tiện ích mở rộng siêu nhẹ, hoạt động 100% trên trình duyệt (client-side), tự động can thiệp vào các khung tải tệp (`<input type="file">`) để nén ảnh dung lượng lớn và chuyển đổi định dạng `HEIC/HEIF` từ iPhone, `WebP`, hoặc `PNG` sang `JPG` chuẩn ngay trong luồng tải lên.

#### Điểm nổi bật:
- **Bảo mật tuyệt đối 100%:** Dữ liệu ảnh, CMND/CCCD, hộ chiếu, hóa đơn không bao giờ tải lên máy chủ. Mọi thao tác giải mã và nén diễn ra trực tiếp trong bộ nhớ RAM trình duyệt của bạn. Hoạt động offline hoàn toàn.
- **Chuyển đổi ảnh iPhone HEIC tức thì:** Tự động phát hiện và chuyển đổi ảnh chụp từ iPhone sang JPG tương thích với mọi cổng thông tin, sàn thương mại điện tử và dịch vụ công.
- **Nén thông minh theo mục tiêu:** Chọn nhanh `< 500 KB`, `< 1 MB`, hoặc `< 2 MB`. Thuật toán tìm kiếm nhị phân giữ độ sắc nét tối đa cho chữ và tài liệu.
- **Hai chế độ linh hoạt:** Chế độ Hỗ trợ Thủ công (Manual Assist) với giao diện floating card cao cấp chuẩn macOS/Linear, hoặc Tự động (Auto-Fit) nén ngầm không cần nhấn chuột.
- **Tiết kiệm dung lượng:** Trung bình giảm từ 70% đến 85% dung lượng tệp (`4.8 MB → 740 KB`).

---

## 3. Chrome Web Store "Privacy Practices" Tab (Copy-Paste Guide)

Google requires specific justifications for every permission and data practice. Use these exact answers to guarantee fast review approval:

### A. Single Purpose Description
> `FileFit provides 100% client-side image compression and format conversion (HEIC/HEIF/WebP/PNG to JPG) directly within file upload fields on web pages without uploading user files to any server.`

### B. Permission Justifications

#### 1. Permission: `storage`
> `The 'storage' permission is required strictly to persist user configuration locally across browser sessions, including default target file size presets (<500KB, <1MB, <2MB), operating mode (Manual Assist vs. Auto-Fit), and the user's list of paused domains via chrome.storage.sync. No personal data or file content is ever stored.`

#### 2. Permission: `activeTab`
> `The 'activeTab' permission is used strictly when the user opens the extension popup to inspect the current tab's hostname. This allows the user to click 'Pause on this domain' to disable file interception on specific sites.`

#### 3. Host Permission / Content Script: `<all_urls>`
> `File upload forms (<input type="file">) exist across unpredictable third-party websites, including applicant tracking systems, job boards, e-commerce platforms, customer support portals, and government websites. The content script operates passively with a global capture-phase change listener that activates ONLY when a user selects a file in an upload field. It performs all image decoding and compression strictly in local browser memory and never initiates any network requests.`

### C. Remote Code Declaration
- **Question:** Does your extension use remote code?
- **Answer:** **No**  
*(All scripts, stylesheets, and WebAssembly chunks—including the `heic2any` library—are bundled 100% locally inside the extension package).*

### D. Data Usage & Collection Checkboxes
- **Personally Identifiable Information:** Unchecked (None collected)
- **Health Information:** Unchecked (None collected)
- **Financial Information:** Unchecked (None collected)
- **Authentication Information:** Unchecked (None collected)
- **Personal Communications:** Unchecked (None collected)
- **Location:** Unchecked (None collected)
- **User Activity (Clicks, Mouse, Scroll):** Unchecked (None collected)
- **Website Content:** Unchecked (None collected)

*(Check the declaration box: "I certify that this extension does not collect, transmit, or sell any user data.")*
