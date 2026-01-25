# Changelog

## v1.2.7 (01/24/2026)

#### **🚀 New Features**
- **`FMHY Notes Display`**  
    - The extension popup now shows relevant notes from the FMHY wiki when visiting mapped websites.  
- **`Live Note Fetching`**  
    - Notes are fetched from the official FMHY GitHub repository and cached for performance.  
- **`Comprehensive Domain Mapping`**  
    - 80+ domain mappings included (1337x, mobilism, yts, spicetify, movie-web, audiobookbay, etc.).  
- **`Pattern-Based Matching`**  
    - Support for sites with multiple TLDs (e.g., `yts.mx`, `yts.rs`, `yts.lt` all show the same note).  
- **`Markdown Rendering`**  
    - Notes are rendered with support for links, lists, bold, italic, and code formatting.  

#### **🔧 Enhancements**
- **`Improved Message Handling`**  
    - Converted async message listener to Promise-based pattern for better cross-browser compatibility.  
- **`Better Popup Display`**  
    - Notes appear in a styled collapsible section below the site status.  

#### **🐞 Bug Fixes**
- **`Fixed Async Response Handling`**  
    - Resolved issue where async message listeners returned `Promise<false>` instead of keeping the channel open.  
- **`Fixed Markdown Formatting`**  
    - Popup markdown parser now properly removes duplicate headers and handles paragraphs correctly.  

#### **🔍 Technical Details**
- **`New Files`**  
    - `notes-mapping.js` – Standalone reference file for domain-to-note mappings.  
- **`Modified Files`**  
    - `background.js` – Added notes mapping, fetch/cache logic, and `getNoteForSite` message handler.  
    - `index.html` – Added note display section with CSS styling.  
    - `index.js` – Added markdown parser and note fetching logic.
