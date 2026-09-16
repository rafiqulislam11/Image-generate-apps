# AI Pattern & Image Design Studio PRO

![AI Pattern Studio PRO](https://img.shields.io/badge/AI_Pattern_Studio-PRO_SaaS-6366f1?style=for-the-badge&logo=canvas&logoColor=white)
![Categories](https://img.shields.io/badge/Categories-30_Design_Categories-10b981?style=for-the-badge)
![Patterns](https://img.shields.io/badge/Patterns-203+_Procedural_+_8_Master-ec4899?style=for-the-badge)
![Exports](https://img.shields.io/badge/Exports-PNG_|_JPG_|_SVG_|_PDF_|_CSV_|_ZIP-f59e0b?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A state-of-the-art, high-performance generative pattern, texture, and commercial stock design studio. Combines natural language AI prompt parsing, 203+ mathematical procedural engines, curated templates, multi-layer compositing, seamless tiling diagnostics, and multi-platform commercial stock metadata generation.

---

## 🌟 Core Product Capabilities

### 1. 🤖 Prompt → AI Analysis → Live Studio
- **Natural Language Prompt Parser (`js/ai-parser.js`)**: Parses complex design prompts into structured design cards specifying: Category, Pattern Engine, Color Palette, Scale, Line Density, Complexity, and Recommended Export Dimensions.
- **AI Service Integration (`js/ai-service.js`)**:
  - Transparent connection manager supporting Google Gemini, OpenAI, or Stability AI.
  - **Zero Fake AI**: When no API key is provided, clearly indicates `"AI provider not configured."` and executes the deterministic **Local Demo Generator**.
  - Built-in credit management indicator (e.g. 72 / 100 remaining).
  - `.env.example` provided for safe, environment-based key setup.

### 2. 🗂️ 30 Searchable Design Categories (`data/categories.js`)
- Geometric, Floral, Botanical, Islamic Geometric, Radial Mandala, Abstract Fluid, Minimal Line Art, Seamless Repeating, Hand-Drawn Line Art, Organic Cellular, Kids & Nursery, Animal Print, Food & Culinary, Nature Landscapes, Retro 70s/80s, Vintage Victorian, Luxury Gold, Christmas Holiday, Halloween Gothic, New Year Glamour, Wedding Romantic, Corporate Business, Woven Textile, Wallpaper & Mural, Background Texture, Decorative Ornament, Monogram Typographic, Damask Acanthus, Tribal Ethnic, and Zentangle Doodle.
- Searchable by name, description, tags, and category chips (`Classic`, `Modern`, `Seasonal`, `Artistic`).

### 3. 🎨 Curated Design Templates (`data/templates.js`)
- 1-click ready-to-edit templates across Luxury, Geometric, Organic, Minimalist, Cyberpunk, and Classic styles.
- Automatically applies balanced procedural configurations, color harmony, and post-processing effects.

### 4. 📐 Precision Viewport & Canvas Tools (`js/canvas-tools.js`)
- **Interactive Rulers (`Ctrl+R`)**: Real-time pixel markings along top and left viewport borders.
- **Alignment Grid (`Ctrl+G`)**: Precision grid overlay with customizable spacing.
- **Pan & Zoom Viewport**: Center, 100% reset, and full-screen view.
- **Before / After Split Comparison Slider**: Real-time split drag handle to compare current design tweaks against baseline.

### 5. 🔁 Mathematical Seamless Pattern Matrix Tester (`js/seamless-tester.js`)
- Renders 2×2, 3×3, 4×4, and 5×5 interactive repeating grid simulations.
- **Mathematical Boundary Verification**: Performs mean squared error (MSE) pixel comparison along top/bottom and left/right seam edges without false claims.

### 6. 🥞 Multi-Layer Compositing Engine (`js/layer-system.js`)
- 6-layer architecture: `Background`, `Base Pattern`, `Primary Accent`, `Secondary Geometric`, `FX & Textures`, and `Text/Branding`.
- Independent visibility, opacity, blend modes (Multiply, Screen, Overlay, Hard Light), and reordering.

### 7. 🖨️ CMYK & Color Harmony Studio (`js/color-engine.js`)
- Real-time RGB-to-CMYK breakdown (Cyan, Magenta, Yellow, Key/Black).
- Grayscale contrast checker and commercial print gamut safety warning.
- Harmonies: Monochromatic, Complementary, Triadic, Analogous, Split-Complementary, Tetradic.

### 8. 🔍 Duplicate & Uniqueness Analyzer (`js/similarity-engine.js`)
- Evaluates parameter distance and color variance against reference designs.
- Provides novelty scores and duplicate alerts with clear disclaimers.

### 9. 📦 Enterprise Multi-Format Exports (`js/export.js`, `js/vector-pdf-export.js`)
- **Master 10MB+ PNG**: High-density 8K UHD output (up to 7680×4320 @ 600 PPI) with uncompressed padding blocks.
- **Clean Vector SVG**: Synthesizes mathematical `<path>`, `<polygon>`, and `<circle>` nodes with clean semantic attributes.
- **Print-Ready PDF**: ISO 32000-1 compliant vector PDF documents with title, author, and timestamp metadata.
- **Commercial Stock CSV (`js/metadata-engine.js`)**: 12-column standardized metadata spreadsheet ready for Adobe Stock, Shutterstock, Freepik, Creative Fabrica, and Design Bundles.
- **Organized Project ZIP**: Hierarchical bundle containing `/high_res`, `/web_ready`, `/vector`, `/metadata`, and `project.json`.

### 10. 📁 Project Manager (`js/project-manager.js`)
- 6 organized folders: `My Designs`, `Favorites`, `Client Projects`, `Stock Ready`, `Templates`, and `Archived`.
- Tagging, search, sorting, and full structured JSON project import/export.

---

## ⌨️ Keyboard Shortcuts

| Key Combination | Action |
|---|---|
| `Ctrl + K` / `Cmd + K` | **Command Palette** (Quick Search Actions & Patterns) |
| `Ctrl + R` / `Cmd + R` | **Toggle Rulers** |
| `Ctrl + G` / `Cmd + G` | **Toggle Grid Overlay** |
| `Ctrl + S` / `Cmd + S` | **Download Pattern** |
| `Ctrl + Z` / `Cmd + Z` | **Undo** |
| `Ctrl + Y` / `Cmd + Y` | **Redo** |
| `Space` or `R` | **Randomize Pattern & Seed** |
| `G` | **Generate Current State** |
| `V` | **Generate Variations** |
| `F` | **Save to Favorites** |
| `P` | **Open Projects Library** |
| `B` | **Open Batch Export Modal** |
| `[` / `]` | **Previous / Next Pattern** |
| `?` | **Keyboard Shortcuts Cheatsheet** |
| `Esc` | **Close Active Modal / Palette** |

---

## 🚀 Quick Start

1. Clone or open the repository folder.
2. (Optional) Copy `.env.example` to `.env` and insert your Gemini / OpenAI / Stability AI key:
   ```bash
   cp .env.example .env
   ```
3. Open `index.html` directly in any modern browser, or launch via local web server:
   ```bash
   # Using Node.js:
   npx serve .
   
   # Or using Python:
   python -m http.server 8080
   ```
4. Access `http://localhost:8080/` in your browser.

---

## 🧪 Running Automated Tests

Run the comprehensive unit test suite:
```bash
node tests/unit-test.js
node tests/verify-assets.js
```

---

## 🌍 Supported Languages & Themes
- **Languages**: English (`EN`), বাংলা (`BN`), العربية (`AR` with native Right-to-Left layout).
- **Accent Themes**: Indigo Blue, Emerald Zen, Cyber Neon, Royal Gold, Sunset Glow.
- **Appearance**: Dark Mode, Light Mode, and System Default.
