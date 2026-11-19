import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const storeAssetsDir = path.join(rootDir, 'store-assets');

if (!fs.existsSync(storeAssetsDir)) {
  fs.mkdirSync(storeAssetsDir, { recursive: true });
}

// Brand SVG Glyph snippet (128x128 squircle)
const brandLogoSvg = (x, y, size) => `
<g transform="translate(${x}, ${y}) scale(${size / 128})">
  <defs>
    <linearGradient id="bg-grad-${x}-${y}" x1="64" y1="4" x2="64" y2="124" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="120" height="120" rx="32" fill="url(#bg-grad-${x}-${y})"/>
  <rect x="5" y="5" width="118" height="118" rx="31" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
  <g stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 34 50 V 38 C 34 35.8 35.8 34 38 34 H 50"/>
    <path d="M 34 78 V 90 C 34 92.2 35.8 94 38 94 H 50"/>
    <path d="M 78 94 H 90 C 92.2 94 94 92.2 94 90 V 78"/>
    <path d="M 76 34 H 80"/>
    <path d="M 94 48 V 52"/>
  </g>
  <path d="M 48 80 H 80" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <path d="M 64 80 V 48" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <path d="M 52 60 L 64 48 L 76 60" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="94" cy="34" r="10" fill="#0F172A"/>
  <circle cx="94" cy="34" r="7.5" fill="#10B981"/>
</g>
`;

// 1. Promo Small Tile: 440 x 280
function getPromoSmallSvg() {
  return `
<svg width="440" height="280" viewBox="0 0 440 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Dark Background (CWS requirement: no transparency) -->
  <rect width="440" height="280" fill="#09090B"/>
  
  <!-- Subtle Technical Grid -->
  <defs>
    <pattern id="grid-sm" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
    <radialGradient id="spot-sm" cx="220" cy="80" r="220" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#09090B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="440" height="280" fill="url(#grid-sm)"/>
  <rect width="440" height="280" fill="url(#spot-sm)"/>

  <!-- Top Edge Accent Highlight -->
  <line x1="0" y1="1" x2="440" y2="1" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

  <!-- Logo and Wordmark -->
  ${brandLogoSvg(40, 36, 44)}
  <text x="96" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" letter-spacing="-0.03em">
    FileFit
  </text>
  <circle cx="166" cy="54" r="3.5" fill="#10B981"/>
  
  <rect x="306" y="40" width="94" height="22" rx="11" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
  <text x="353" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="600" fill="#10B981" text-anchor="middle">
    100% OFFLINE
  </text>

  <!-- Headline -->
  <text x="40" y="118" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" letter-spacing="-0.03em">
    Fit Any Upload in 1 Click
  </text>
  <text x="40" y="142" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="400" fill="#A1A1AA">
    Compress oversized images &amp; convert HEIC right in the upload flow.
  </text>

  <!-- Delta Result Card -->
  <g transform="translate(40, 166)">
    <rect width="360" height="54" rx="12" fill="#18181B" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    
    <!-- Left: Original -->
    <text x="20" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="500" fill="#71717A">
      ORIGINAL FILE
    </text>
    <text x="20" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="600" fill="#F43F5E" font-variant-numeric="tabular-nums">
      4.82 MB <tspan font-size="10" font-weight="700" fill="#FB7185">HEIC</tspan>
    </text>

    <!-- Arrow -->
    <path d="M 140 32 L 152 32 M 148 27 L 153 32 L 148 37" stroke="#71717A" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Right: Fitted -->
    <text x="176" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="500" fill="#71717A">
      FITTED FOR UPLOAD
    </text>
    <text x="176" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="700" fill="#10B981" font-variant-numeric="tabular-nums">
      740 KB <tspan font-size="10" font-weight="700" fill="#34D399">JPG</tspan>
    </text>

    <!-- Badge -->
    <rect x="286" y="14" width="58" height="26" rx="6" fill="#10B981"/>
    <text x="315" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#09090B" text-anchor="middle" font-variant-numeric="tabular-nums">
      -85%
    </text>
  </g>

  <!-- Micro Footer -->
  <text x="220" y="254" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="500" fill="#71717A" text-anchor="middle">
    Zero Server Uploads • Client-Side Privacy Guaranteed
  </text>
</svg>
`;
}

// 2. Promo Marquee Banner: 1400 x 560
function getPromoMarqueeSvg() {
  return `
<svg width="1400" height="560" viewBox="0 0 1400 560" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Dark Canvas (Zero transparency) -->
  <rect width="1400" height="560" fill="#09090B"/>
  
  <defs>
    <pattern id="grid-lg" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
    <radialGradient id="spot-lg" cx="500" cy="200" r="700" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#09090B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1400" height="560" fill="url(#grid-lg)"/>
  <rect width="1400" height="560" fill="url(#spot-lg)"/>

  <!-- Top hairline -->
  <line x1="0" y1="1" x2="1400" y2="1" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

  <!-- Left Column: Value Proposition -->
  <g transform="translate(100, 80)">
    <!-- Header Pill -->
    <rect x="0" y="0" width="180" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    ${brandLogoSvg(6, 4, 20)}
    <text x="36" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="600" fill="#FFFFFF">
      Chrome Extension
    </text>
    <circle cx="160" cy="14" r="3.5" fill="#10B981"/>

    <!-- Main Headline -->
    <text x="0" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="44" font-weight="800" fill="#FFFFFF" letter-spacing="-0.04em">
      Never Get Rejected by
    </text>
    <text x="0" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="44" font-weight="800" fill="#10B981" letter-spacing="-0.04em">
      an Upload Form Again.
    </text>

    <!-- Subhead -->
    <text x="0" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="16" font-weight="400" fill="#A1A1AA" line-height="1.6">
      Intercepts file uploads in real time. Compresses oversized images
    </text>
    <text x="0" y="206" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="16" font-weight="400" fill="#A1A1AA">
      and converts HEIC, HEIF, &amp; WebP to universal JPG in your browser.
    </text>

    <!-- 3 Pill Highlights -->
    <g transform="translate(0, 246)">
      <rect x="0" y="0" width="168" height="34" rx="10" fill="#18181B" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <circle cx="20" cy="17" r="4" fill="#10B981"/>
      <text x="32" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#FFFFFF">
        Binary Search Quality
      </text>

      <rect x="180" y="0" width="168" height="34" rx="10" fill="#18181B" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <circle cx="200" cy="17" r="4" fill="#10B981"/>
      <text x="212" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#FFFFFF">
        100% Offline Privacy
      </text>

      <rect x="360" y="0" width="168" height="34" rx="10" fill="#18181B" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <circle cx="380" cy="17" r="4" fill="#10B981"/>
      <text x="392" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#FFFFFF">
        Native iPhone HEIC
      </text>
    </g>

    <!-- Stat Callout Strip -->
    <g transform="translate(0, 314)">
      <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="500" fill="#71717A">
        AVERAGE COMPRESSION DELTA:
      </text>
      <text x="200" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF" font-variant-numeric="tabular-nums">
        4.6 MB HEIC <tspan fill="#71717A">→</tspan> <tspan fill="#10B981">740 KB JPG</tspan> <tspan font-size="11" fill="#10B981">(-84%)</tspan>
      </text>
    </g>
  </g>

  <!-- Right Column: High-Craft Floating Widget Representation -->
  <g transform="translate(870, 70)">
    <!-- Simulated Frosted Widget Shadow -->
    <rect x="-10" y="-10" width="440" height="420" rx="28" fill="#000000" opacity="0.6"/>
    
    <!-- Widget Body -->
    <rect width="420" height="400" rx="24" fill="#FFFFFF" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    
    <!-- Widget Header -->
    <g transform="translate(24, 20)">
      ${brandLogoSvg(0, 0, 24)}
      <text x="34" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="15" font-weight="700" fill="#09090B">
        FileFit
      </text>
      
      <!-- Local Badge -->
      <rect x="96" y="3" width="56" height="18" rx="9" fill="#ECFDF5" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
      <circle cx="106" cy="12" r="2.5" fill="#10B981"/>
      <text x="114" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="600" fill="#047857">
        Local
      </text>

      <!-- Close icon -->
      <path d="M 360 8 L 370 18 M 370 8 L 360 18" stroke="#A1A1AA" stroke-width="2" stroke-linecap="round"/>
    </g>

    <line x1="0" y1="58" x2="420" y2="58" stroke="#F4F4F5" stroke-width="1"/>

    <!-- Recessed File Well -->
    <g transform="translate(24, 76)">
      <rect width="372" height="74" rx="14" fill="#F4F4F5" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
      <rect x="14" y="15" width="44" height="44" rx="10" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="1"/>
      <!-- File icon -->
      <path d="M 30 29 L 42 29 M 30 37 L 38 37 M 30 45 L 42 45" stroke="#71717A" stroke-width="2" stroke-linecap="round"/>

      <text x="70" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="600" fill="#09090B">
        IMG_4092.HEIC
      </text>
      <text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="500" fill="#71717A" font-variant-numeric="tabular-nums">
        4.62 MB • Apple iPhone HEIC
      </text>

      <rect x="290" y="24" width="68" height="24" rx="6" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1"/>
      <text x="324" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#92400E" text-anchor="middle">
        HEIC
      </text>
    </g>

    <!-- Target Size Control -->
    <g transform="translate(24, 168)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="0.05em">
        TARGET FILE SIZE
      </text>
      <rect y="8" width="372" height="38" rx="12" fill="#F4F4F5" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
      
      <!-- Option 1 -->
      <text x="62" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="500" fill="#71717A" text-anchor="middle">
        &lt; 500 KB
      </text>
      
      <!-- Option 2 (Active Elevated Thumb) -->
      <rect x="126" y="11" width="120" height="32" rx="10" fill="#FFFFFF" stroke="rgba(9,9,11,0.08)" stroke-width="1"/>
      <text x="186" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#09090B" text-anchor="middle">
        &lt; 1 MB
      </text>

      <!-- Option 3 -->
      <text x="310" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="500" fill="#71717A" text-anchor="middle">
        &lt; 2 MB
      </text>
    </g>

    <!-- Convert to JPG Toggle Row -->
    <g transform="translate(24, 236)">
      <rect width="372" height="48" rx="12" fill="#FAFAFA" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
      <text x="16" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="600" fill="#09090B">
        Convert to JPG
      </text>
      <text x="16" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="400" fill="#71717A">
        Universal format with maximum compression
      </text>

      <!-- Tactile Toggle Switch [Active] -->
      <rect x="316" y="14" width="40" height="20" rx="10" fill="#09090B"/>
      <circle cx="344" cy="24" r="8" fill="#FFFFFF"/>
    </g>

    <!-- Primary CTA Button -->
    <g transform="translate(24, 302)">
      <rect width="372" height="46" rx="12" fill="#09090B"/>
      <text x="170" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">
        Compress &amp; Apply
      </text>
      <path d="M 238 24 L 246 24 M 242 20 L 246 24 L 242 28" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <!-- Footer Privacy Note -->
    <g transform="translate(24, 372)">
      <circle cx="130" cy="-2" r="3" fill="#10B981"/>
      <text x="140" y="2" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="500" fill="#71717A">
        100% On-Device • Zero Server Uploads
      </text>
    </g>
  </g>
</svg>
`;
}

// 3. Screenshot 1: 1280 x 800 - Instant Fit & Pain Point Resolution
function getScreenshot1Svg() {
  return `
<svg width="1280" height="800" viewBox="0 0 1280 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Background -->
  <rect width="1280" height="800" fill="#0C0F17"/>
  
  <!-- Studio Header -->
  <g transform="translate(80, 50)">
    <rect width="140" height="26" rx="13" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.3)" stroke-width="1"/>
    <text x="70" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#FB7185" text-anchor="middle">
      UPLOAD REJECTED
    </text>
    <text x="156" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="600" fill="#10B981">
      → Solved In-Place by FileFit
    </text>
    <text x="0" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" letter-spacing="-0.03em">
      Say Goodbye to "File Exceeds Size Limit" Errors
    </text>
    <text x="0" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="400" fill="#94A3B8">
      FileFit intercepts oversized file uploads before forms reject them, compressing images directly inside your browser.
    </text>
  </g>

  <!-- Mocked Browser Window Container -->
  <g transform="translate(80, 165)">
    <!-- Window Frame -->
    <rect width="1120" height="575" rx="16" fill="#FFFFFF" stroke="#334155" stroke-width="1"/>
    
    <!-- Title Bar -->
    <path d="M 0 16 C 0 7.16 7.16 0 16 0 L 1104 0 C 1112.84 0 1120 7.16 1120 16 L 1120 44 L 0 44 Z" fill="#F8FAFC"/>
    <circle cx="24" cy="22" r="5" fill="#EF4444"/>
    <circle cx="40" cy="22" r="5" fill="#F59E0B"/>
    <circle cx="56" cy="22" r="5" fill="#10B981"/>
    
    <!-- URL Bar -->
    <rect x="240" y="10" width="640" height="24" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <text x="560" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="500" fill="#64748B" text-anchor="middle">
      portal.enterprise.gov/apply/document-submission
    </text>

    <!-- Webpage Content Area -->
    <g transform="translate(60, 75)">
      <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="20" font-weight="700" fill="#0F172A">
        Identity Verification &amp; Document Upload
      </text>
      <text x="0" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="400" fill="#64748B">
        Please upload your government-issued ID or passport. Maximum allowed size is 2.00 MB.
      </text>

      <!-- Host Portal Rejection Warning Banner -->
      <g transform="translate(0, 70)">
        <rect width="600" height="52" rx="10" fill="#FEF2F2" stroke="#FECACA" stroke-width="1"/>
        <circle cx="28" cy="26" r="10" fill="#EF4444"/>
        <text x="28" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">!</text>
        <text x="52" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#991B1B">
          Upload Error: File size exceeds 2.00 MB limit
        </text>
        <text x="52" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="500" fill="#B91C1C">
          Selected: "national_id_scan_hires.png" (4.82 MB). Please compress and re-upload.
        </text>
      </g>

      <!-- Mock Upload Dropzone -->
      <g transform="translate(0, 140)">
        <rect width="600" height="180" rx="12" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8 8"/>
        <text x="300" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="600" fill="#334155" text-anchor="middle">
          Drop identity card or passport here
        </text>
        <text x="300" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="400" fill="#94A3B8" text-anchor="middle">
          Supports JPG, PNG up to 2.00 MB
        </text>
      </g>
    </g>

    <!-- Overlay: FileFit Floating Widget Intercepting the Action -->
    <g transform="translate(710, 80)">
      <rect width="360" height="440" rx="20" fill="#FFFFFF" stroke="rgba(9,9,11,0.12)" stroke-width="1" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.18))"/>
      
      <!-- Widget Header -->
      <g transform="translate(20, 18)">
        ${brandLogoSvg(0, 0, 22)}
        <text x="30" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="700" fill="#09090B">
          FileFit
        </text>
        <rect x="88" y="2" width="50" height="18" rx="9" fill="#ECFDF5" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
        <circle cx="98" cy="11" r="2" fill="#10B981"/>
        <text x="104" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" font-weight="600" fill="#047857">Local</text>
      </g>

      <line x1="0" y1="52" x2="360" y2="52" stroke="#F4F4F5" stroke-width="1"/>

      <!-- File Summary Well -->
      <g transform="translate(20, 68)">
        <rect width="320" height="68" rx="12" fill="#F4F4F5" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
        <text x="14" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="600" fill="#09090B">
          national_id_scan_hires.png
        </text>
        <text x="14" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="500" fill="#71717A" font-variant-numeric="tabular-nums">
          4.82 MB • High Resolution
        </text>
        <rect x="246" y="20" width="60" height="22" rx="6" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1"/>
        <text x="276" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#92400E" text-anchor="middle">HEAVY</text>
      </g>

      <!-- Target Segmented Control -->
      <g transform="translate(20, 150)">
        <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#71717A">
          TARGET SIZE PRESET
        </text>
        <rect y="8" width="320" height="34" rx="10" fill="#F4F4F5"/>
        <text x="53" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#71717A" text-anchor="middle">&lt; 500 KB</text>
        <rect x="108" y="11" width="104" height="28" rx="8" fill="#FFFFFF" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
        <text x="160" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#09090B" text-anchor="middle">&lt; 1 MB</text>
        <text x="267" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#71717A" text-anchor="middle">&lt; 2 MB</text>
      </g>

      <!-- Convert to JPG Row -->
      <g transform="translate(20, 214)">
        <rect width="320" height="44" rx="10" fill="#FAFAFA" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
        <text x="14" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#09090B">Convert to JPG</text>
        <text x="14" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" fill="#71717A">Universal upload compatibility</text>
        <rect x="270" y="12" width="36" height="20" rx="10" fill="#09090B"/>
        <circle cx="296" cy="22" r="8" fill="#FFFFFF"/>
      </g>

      <!-- Primary CTA Button -->
      <g transform="translate(20, 276)">
        <rect width="320" height="44" rx="12" fill="#09090B"/>
        <text x="144" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">
          Compress &amp; Apply
        </text>
        <path d="M 212 23 L 220 23 M 216 19 L 220 23 L 216 27" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- Success Prediction Pill -->
      <g transform="translate(20, 334)">
        <rect width="320" height="42" rx="10" fill="#ECFDF5" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
        <text x="14" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#047857" font-variant-numeric="tabular-nums">
          Result: 4.82 MB → 740 KB JPG (-85%)
        </text>
        <rect x="254" y="10" width="54" height="22" rx="6" fill="#10B981"/>
        <text x="281" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">READY</text>
      </g>

      <!-- Micro Footer -->
      <text x="180" y="408" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="500" fill="#94A3B8" text-anchor="middle">
        100% Client-Side • Form Accepts Fitted File Instantly
      </text>
    </g>
  </g>
</svg>
`;
}

// 4. Screenshot 2: 1280 x 800 - iPhone HEIC to JPG
function getScreenshot2Svg() {
  return `
<svg width="1280" height="800" viewBox="0 0 1280 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="800" fill="#0C0F17"/>
  
  <g transform="translate(80, 50)">
    <rect width="180" height="26" rx="13" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
    <text x="90" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#10B981" text-anchor="middle">
      APPLE IPHONE FORMAT FIX
    </text>
    <text x="0" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" letter-spacing="-0.03em">
      Convert iPhone HEIC Photos to JPG In-Place
    </text>
    <text x="0" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="400" fill="#94A3B8">
      Websites often refuse .HEIC and .HEIF images. FileFit converts them to universal JPG before they ever leave your device.
    </text>
  </g>

  <!-- Split Comparison Layout -->
  <g transform="translate(80, 170)">
    <!-- Left Card: The Common Problem -->
    <g transform="translate(0, 0)">
      <rect width="520" height="550" rx="18" fill="#18181B" stroke="rgba(244,63,94,0.3)" stroke-width="1"/>
      <rect x="24" y="24" width="120" height="26" rx="8" fill="rgba(244,63,94,0.15)"/>
      <text x="84" y="41" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#FB7185" text-anchor="middle">
        WITHOUT FILEFIT
      </text>

      <text x="24" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="20" font-weight="700" fill="#FFFFFF">
        Upload Failed: Format Rejected
      </text>
      <text x="24" y="114" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" fill="#71717A">
        Most websites, portal forms, and e-commerce stores reject .heic
      </text>

      <!-- Mock File Icon -->
      <g transform="translate(180, 160)">
        <rect width="160" height="190" rx="14" fill="#27272A" stroke="#3F3F46" stroke-width="1"/>
        <text x="80" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="18" font-weight="700" fill="#A1A1AA" text-anchor="middle">
          HEIC
        </text>
        <text x="80" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="600" fill="#F43F5E" text-anchor="middle" font-variant-numeric="tabular-nums">
          4.62 MB
        </text>
        <text x="80" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" fill="#71717A" text-anchor="middle">
          IMG_4092.HEIC
        </text>
      </g>

      <!-- Rejection Notification -->
      <g transform="translate(40, 390)">
        <rect width="440" height="60" rx="10" fill="#450A0A" stroke="#7F1D1D" stroke-width="1"/>
        <text x="20" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#FCA5A5">
          "Error: Unsupported image format .heic"
        </text>
        <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#F87171">
          Server only accepts JPG, PNG, or GIF. Please convert file.
        </text>
      </g>

      <text x="260" y="490" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="500" fill="#71717A" text-anchor="middle">
        Requires opening third-party converter sites or apps
      </text>
    </g>

    <!-- Right Card: The FileFit Solution -->
    <g transform="translate(600, 0)">
      <rect width="520" height="550" rx="18" fill="#18181B" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
      <rect x="24" y="24" width="100" height="26" rx="8" fill="rgba(16,185,129,0.15)"/>
      <text x="74" y="41" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#10B981" text-anchor="middle">
        WITH FILEFIT
      </text>

      <text x="24" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="20" font-weight="700" fill="#FFFFFF">
        Automatic In-Browser Fitting
      </text>
      <text x="24" y="114" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" fill="#A1A1AA">
        WASM engine converts HEIC to standard JPG in &lt; 300ms locally
      </text>

      <!-- Conversion Transformation Visual -->
      <g transform="translate(40, 160)">
        <rect width="440" height="190" rx="14" fill="#09090B" stroke="#27272A" stroke-width="1"/>
        
        <!-- Left: HEIC -->
        <g transform="translate(30, 30)">
          <rect width="100" height="130" rx="10" fill="#18181B" stroke="#3F3F46" stroke-width="1"/>
          <text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="700" fill="#F59E0B" text-anchor="middle">HEIC</text>
          <text x="50" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#FFFFFF" text-anchor="middle" font-variant-numeric="tabular-nums">4.62 MB</text>
          <text x="50" y="100" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" fill="#71717A" text-anchor="middle">iPhone Raw</text>
        </g>

        <!-- Center arrow & engine indicator -->
        <g transform="translate(160, 80)">
          ${brandLogoSvg(10, -10, 36)}
          <text x="28" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#10B981" text-anchor="middle">
            LOCAL ENGINE
          </text>
        </g>

        <!-- Right: JPG -->
        <g transform="translate(310, 30)">
          <rect width="100" height="130" rx="10" fill="#064E3B" stroke="#059669" stroke-width="1"/>
          <text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="700" fill="#34D399" text-anchor="middle">JPG</text>
          <text x="50" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle" font-variant-numeric="tabular-nums">740 KB</text>
          <rect x="25" y="94" width="50" height="18" rx="4" fill="#10B981"/>
          <text x="50" y="107" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="800" fill="#09090B" text-anchor="middle">-84%</text>
        </g>
      </g>

      <!-- Acceptance Banner -->
      <g transform="translate(40, 390)">
        <rect width="440" height="60" rx="10" fill="#064E3B" stroke="#059669" stroke-width="1"/>
        <text x="20" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#A7F3D0">
          ✓ Form Accepted: "IMG_4092.jpg" (740 KB)
        </text>
        <text x="20" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#6EE7B7">
          Compatible with 100% of web upload fields and government portals.
        </text>
      </g>

      <text x="260" y="490" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="600" fill="#10B981" text-anchor="middle">
        Zero external tool installations. Zero file re-uploads.
      </text>
    </g>
  </g>
</svg>
`;
}

// 5. Screenshot 3: 1280 x 800 - Popup Showcase & Modes
function getScreenshot3Svg() {
  return `
<svg width="1280" height="800" viewBox="0 0 1280 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="800" fill="#0C0F17"/>
  
  <g transform="translate(80, 50)">
    <rect width="150" height="26" rx="13" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="75" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">
      FULL CONTROL
    </text>
    <text x="0" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" letter-spacing="-0.03em">
      Flexible Modes: Manual Assist vs Auto-Fit
    </text>
    <text x="0" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="400" fill="#94A3B8">
      Tune target sizes (<span font-weight="600" fill="#FFFFFF">500 KB</span>, <span font-weight="600" fill="#FFFFFF">1 MB</span>, <span font-weight="600" fill="#FFFFFF">2 MB</span>), pause per domain, or let FileFit compress silently in the background.
    </text>
  </g>

  <!-- Center Popup Mockup -->
  <g transform="translate(480, 160)">
    <!-- Popup Card Shadow -->
    <rect x="-12" y="-12" width="344" height="524" rx="20" fill="#000000" opacity="0.6"/>
    
    <!-- 320px Popup Frame -->
    <rect width="320" height="500" rx="16" fill="#FFFFFF" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    
    <!-- Top Header -->
    <g transform="translate(16, 16)">
      ${brandLogoSvg(0, 0, 24)}
      <text x="32" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="15" font-weight="700" fill="#09090B">
        FileFit
      </text>
      <circle cx="86" cy="14" r="3" fill="#10B981"/>

      <!-- Master Power Toggle [Active] -->
      <rect x="220" y="2" width="68" height="24" rx="12" fill="#09090B"/>
      <circle cx="232" cy="14" r="2.5" fill="#10B981"/>
      <text x="242" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#FFFFFF">Active</text>
    </g>

    <line x1="0" y1="56" x2="320" y2="56" stroke="#F4F4F5" stroke-width="1"/>

    <!-- Active Site Card -->
    <g transform="translate(16, 72)">
      <rect width="288" height="52" rx="12" fill="#F4F4F5" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
      <!-- Globe icon -->
      <circle cx="24" cy="26" r="8" stroke="#71717A" stroke-width="1.5" fill="none"/>
      <text x="40" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="600" fill="#09090B">
        portal.company.com
      </text>
      <text x="40" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" fill="#71717A">
        Auto-intercepting uploads
      </text>
      <rect x="224" y="14" width="52" height="24" rx="6" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="1"/>
      <text x="250" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="600" fill="#3F3F46" text-anchor="middle">
        Pause
      </text>
    </g>

    <!-- Operating Mode Selector -->
    <g transform="translate(16, 142)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="0.05em">
        OPERATING MODE
      </text>
      <rect y="8" width="288" height="36" rx="10" fill="#F4F4F5"/>
      
      <!-- Manual Assist (Selected) -->
      <rect x="3" y="11" width="138" height="30" rx="8" fill="#FFFFFF" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
      <text x="72" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#09090B" text-anchor="middle">
        Manual Assist
      </text>

      <!-- Auto-Fit -->
      <text x="214" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="500" fill="#71717A" text-anchor="middle">
        Auto-Fit
      </text>

      <text x="0" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" fill="#71717A">
        Shows floating widget to review, tune size, and apply.
      </text>
    </g>

    <!-- Target Size Presets -->
    <g transform="translate(16, 226)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="0.05em">
        DEFAULT TARGET SIZE
      </text>
      <rect y="8" width="288" height="34" rx="10" fill="#F4F4F5"/>
      <text x="48" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#71717A" text-anchor="middle">&lt; 500 KB</text>
      
      <!-- < 1 MB active -->
      <rect x="96" y="11" width="96" height="28" rx="8" fill="#FFFFFF" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
      <text x="144" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#09090B" text-anchor="middle">&lt; 1 MB</text>
      
      <text x="240" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#71717A" text-anchor="middle">&lt; 2 MB</text>
    </g>

    <!-- Convert to JPG Toggle -->
    <g transform="translate(16, 290)">
      <rect width="288" height="46" rx="12" fill="#F4F4F5" stroke="rgba(9,9,11,0.06)" stroke-width="1"/>
      <text x="14" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="600" fill="#09090B">Auto-convert to JPG</text>
      <text x="14" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" fill="#71717A">Converts HEIC, WebP, and heavy PNGs</text>
      <rect x="238" y="13" width="36" height="20" rx="10" fill="#09090B"/>
      <circle cx="264" cy="23" r="8" fill="#FFFFFF"/>
    </g>

    <!-- Footer Strip -->
    <g transform="translate(0, 456)">
      <rect width="320" height="44" fill="#F8FAFC"/>
      <circle cx="24" cy="22" r="3.5" fill="#10B981"/>
      <text x="36" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="600" fill="#0F172A">
        100% On-Device
      </text>
      <text x="286" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" fill="#94A3B8" font-weight="500">
        v1.0.0
      </text>
    </g>
  </g>

  <!-- Left Annotation Card -->
  <g transform="translate(100, 260)">
    <rect width="320" height="160" rx="14" fill="#18181B" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="24" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">
      Manual Assist Mode
    </text>
    <text x="24" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" fill="#A1A1AA" line-height="1.5">
      Displays the floating widget. Fine-tune size presets, toggle JPG conversion, and see exact before/after savings before applying.
    </text>
    <rect x="24" y="114" width="130" height="24" rx="6" fill="rgba(255,255,255,0.06)"/>
    <text x="89" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="600" fill="#E4E4E7" text-anchor="middle">
      DEFAULT SETTING
    </text>
  </g>

  <!-- Right Annotation Card -->
  <g transform="translate(860, 260)">
    <rect width="320" height="160" rx="14" fill="#18181B" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
    <text x="24" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="700" fill="#10B981">
      Auto-Fit Mode
    </text>
    <text x="24" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" fill="#A1A1AA" line-height="1.5">
      Zero interaction required. Pauses immediate form upload, compresses silently, and re-dispatches standard DOM events seamlessly.
    </text>
    <rect x="24" y="114" width="140" height="24" rx="6" fill="rgba(16,185,129,0.15)"/>
    <text x="94" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#10B981" text-anchor="middle">
      POWER USER MODE
    </text>
  </g>
</svg>
`;
}

// 6. Screenshot 4: 1280 x 800 - Zero Server Uploads & Privacy Architecture
function getScreenshot4Svg() {
  return `
<svg width="1280" height="800" viewBox="0 0 1280 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="800" fill="#0C0F17"/>
  
  <g transform="translate(80, 50)">
    <rect width="170" height="26" rx="13" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
    <text x="85" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#10B981" text-anchor="middle">
      PRIVACY ARCHITECTURE
    </text>
    <text x="0" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" letter-spacing="-0.03em">
      100% Client-Side • Safe for Passports &amp; ID Cards
    </text>
    <text x="0" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="400" fill="#94A3B8">
      Your confidential files never touch an external server or cloud API. All image decoding and compression runs strictly in local browser memory.
    </text>
  </g>

  <!-- Visual Architecture Diagram Card -->
  <g transform="translate(80, 160)">
    <rect width="1120" height="340" rx="20" fill="#18181B" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    
    <!-- Left Boundary: Local Browser Sandbox -->
    <g transform="translate(40, 40)">
      <rect width="640" height="260" rx="16" fill="#09090B" stroke="#10B981" stroke-width="1.5" stroke-dasharray="6 6"/>
      
      <!-- Label -->
      <rect x="20" y="-12" width="220" height="24" rx="6" fill="#064E3B"/>
      <text x="130" y="4" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#A7F3D0" text-anchor="middle">
        LOCAL DEVICE BROWSER MEMORY
      </text>

      <!-- Step 1: Input -->
      <g transform="translate(30, 50)">
        <rect width="160" height="150" rx="12" fill="#18181B" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">
          Selected File
        </text>
        <text x="80" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#F43F5E" text-anchor="middle" font-variant-numeric="tabular-nums">
          4.8 MB HEIC / PNG
        </text>
        <text x="80" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" fill="#71717A" text-anchor="middle">
          Contract / Passport / Photo
        </text>
      </g>

      <!-- Arrow -->
      <path d="M 205 125 L 225 125 M 220 120 L 225 125 L 220 130" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>

      <!-- Step 2: In-Memory Engine -->
      <g transform="translate(240, 50)">
        <rect width="160" height="150" rx="12" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
        ${brandLogoSvg(60, 20, 36)}
        <text x="80" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">
          FileFit Engine
        </text>
        <text x="80" y="100" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" fill="#A7F3D0" text-anchor="middle">
          Canvas + Offscreen API
        </text>
        <text x="80" y="120" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" fill="#D1FAE5" text-anchor="middle">
          WASM HEIC Decoder
        </text>
      </g>

      <!-- Arrow -->
      <path d="M 415 125 L 435 125 M 430 120 L 435 125 L 430 130" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>

      <!-- Step 3: Fitted Output -->
      <g transform="translate(450, 50)">
        <rect width="160" height="150" rx="12" fill="#18181B" stroke="#27272A" stroke-width="1"/>
        <text x="80" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">
          Injected to Form
        </text>
        <text x="80" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" font-weight="700" fill="#10B981" text-anchor="middle" font-variant-numeric="tabular-nums">
          740 KB JPG (-85%)
        </text>
        <text x="80" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="9" fill="#71717A" text-anchor="middle">
          Passed to target site form
        </text>
      </g>
    </g>

    <!-- Right Barrier: Cloud / External Server Block -->
    <g transform="translate(740, 40)">
      <rect width="340" height="260" rx="16" fill="#18181B" stroke="#EF4444" stroke-width="1.5"/>
      <rect x="20" y="-12" width="200" height="24" rx="6" fill="#7F1D1D"/>
      <text x="120" y="4" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="10" font-weight="700" fill="#FCA5A5" text-anchor="middle">
        EXTERNAL CLOUD SERVERS
      </text>

      <g transform="translate(40, 40)">
        <circle cx="130" cy="50" r="32" fill="#450A0A" stroke="#DC2626" stroke-width="1.5"/>
        <text x="130" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="28" font-weight="800" fill="#EF4444" text-anchor="middle">✕</text>

        <text x="130" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">
          Zero Cloud Uploads
        </text>
        <text x="130" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">
          No external APIs or servers are ever contacted.
        </text>
        <text x="130" y="160" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">
          Zero tracking, zero analytics, zero data storage.
        </text>
      </g>
    </g>
  </g>

  <!-- 3 Bottom Guarantee Cards -->
  <g transform="translate(80, 530)">
    <g transform="translate(0, 0)">
      <rect width="350" height="180" rx="14" fill="#18181B" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="24" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
        🔒 Confident for ID Documents
      </text>
      <text x="24" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" fill="#94A3B8" line-height="1.6">
        Safe to compress driver licenses, national identity cards, passports, and medical records. Your private images remain in your browser RAM.
      </text>
    </g>

    <g transform="translate(385, 0)">
      <rect width="350" height="180" rx="14" fill="#18181B" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="24" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
        ✈️ Works 100% Offline
      </text>
      <text x="24" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" fill="#94A3B8" line-height="1.6">
        All compression logic, canvas algorithms, and HEIC conversion libraries run offline. Fully functional in airplane mode without internet.
      </text>
    </g>

    <g transform="translate(770, 0)">
      <rect width="350" height="180" rx="14" fill="#18181B" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="24" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
        🛡️ Minimal MV3 Permissions
      </text>
      <text x="24" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="12" fill="#94A3B8" line-height="1.6">
        Strictly requests only "storage" (to save your preset preferences) and "activeTab". No invasive broad host permissions or background trackers.
      </text>
    </g>
  </g>
</svg>
`;
}

async function generateAllStoreAssets() {
  console.log('Generating Chrome Web Store Marketing Assets (PNG)...');

  const assets = [
    {
      filename: 'promo-small-440x280.png',
      width: 440,
      height: 280,
      svg: getPromoSmallSvg(),
      description: 'Small Promo Tile (440x280)',
    },
    {
      filename: 'promo-marquee-1400x560.png',
      width: 1400,
      height: 560,
      svg: getPromoMarqueeSvg(),
      description: 'Marquee Promo Banner (1400x560)',
    },
    {
      filename: 'screenshot-1-instant-fit-1280x800.png',
      width: 1280,
      height: 800,
      svg: getScreenshot1Svg(),
      description: 'Screenshot 1 — Instant Fit & Error Resolution (1280x800)',
    },
    {
      filename: 'screenshot-2-heic-convert-1280x800.png',
      width: 1280,
      height: 800,
      svg: getScreenshot2Svg(),
      description: 'Screenshot 2 — iPhone HEIC to JPG (1280x800)',
    },
    {
      filename: 'screenshot-3-autofit-mode-1280x800.png',
      width: 1280,
      height: 800,
      svg: getScreenshot3Svg(),
      description: 'Screenshot 3 — Popup UI & Dual Modes (1280x800)',
    },
    {
      filename: 'screenshot-4-offline-privacy-1280x800.png',
      width: 1280,
      height: 800,
      svg: getScreenshot4Svg(),
      description: 'Screenshot 4 — Offline Privacy Architecture (1280x800)',
    },
  ];

  for (const asset of assets) {
    const outPath = path.join(storeAssetsDir, asset.filename);
    const svgBuffer = Buffer.from(asset.svg.trim());

    // CWS requires solid 24-bit RGB PNG (no alpha channel on screenshots/promo tiles)
    await sharp(svgBuffer, { density: 150 })
      .resize(asset.width, asset.height, { fit: 'fill' })
      .flatten({ background: '#09090B' }) // Flatten transparency to solid obsidian
      .png({
        compressionLevel: 9,
        palette: false, // 24-bit RGB
      })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    console.log(`✓ store-assets/${asset.filename} (${asset.width}x${asset.height}, ${(stats.size / 1024).toFixed(1)} KB) — ${asset.description}`);
  }

  console.log('\nAll 6 Chrome Web Store marketing PNG assets generated successfully!');
}

generateAllStoreAssets().catch((err) => {
  console.error('Failed to generate store assets:', err);
  process.exit(1);
});
