# Integration & Deployment Guide

How to deploy the Origin Interactive Experience and integrate it into Webflow or other platforms.

---

## Table of Contents

1. [File Overview](#file-overview)
2. [Webflow Integration](#webflow-integration)
3. [Standalone Deployment](#standalone-deployment)
4. [Configuration Options](#configuration-options)
5. [Common Integration Scenarios](#common-integration-scenarios)
6. [Troubleshooting Integration Issues](#troubleshooting-integration-issues)

---

## File Overview

### Required Files

```
├── index.html          # Main HTML (or embed content in Webflow)
├── style.css           # All styles (link or embed)
├── script.js           # All JavaScript (link or embed)
└── assets/
    ├── images/         # State background images
    ├── animations/     # Transition videos
    ├── vector_graphics/# SVG diagrams
    ├── sound/          # Audio files
    └── ui-icons/       # Navigation icons
```

### File Dependencies

The app has **no external JavaScript dependencies**. It only requires:

- Google Fonts (Overpass) - loaded via CSS link
- Asset files in correct relative paths

---

## Webflow Integration

### Option 1: Embed as Full Page

1. **Create new page in Webflow**
2. **Add Embed element** to page body
3. **Paste HTML content** from `index.html` (body contents only)
4. **Add CSS** via:
   - Page Settings → Custom Code → Head Code
   - Paste: `<style>/* contents of style.css */</style>`
5. **Add JavaScript** via:
   - Page Settings → Custom Code → Footer Code
   - Paste: `<script>/* contents of script.js */</script>`
6. **Upload assets** to Webflow and update paths

### Option 2: Embed in Existing Page

1. **Create container div** with fixed height (e.g., 100vh)
2. **Add Embed element** inside container
3. **Paste HTML** structure from `index.html`
4. **Scope CSS** to avoid conflicts:
   ```css
   .origin-experience * {
       /* Scoped styles */
   }
   ```
5. **Initialize on container** instead of document

### Option 3: iframe Embed

1. **Host app separately** (Vercel, Netlify, etc.)
2. **Add iframe in Webflow:**
   ```html
   <iframe 
       src="https://your-domain.com/origin-experience/" 
       width="100%" 
       height="100vh" 
       frameborder="0"
       allow="autoplay">
   </iframe>
   ```

### Asset Hosting in Webflow

**For images and videos:**
1. Upload to Webflow Assets
2. Update paths in `script.js`:
   ```javascript
   const states = {
       1: {
           image: "https://uploads-ssl.webflow.com/xxx/state1.webp"
       }
   };
   ```

**For SVGs:**
- Upload to Webflow Assets, or
- Host externally (GitHub, CDN), or
- Inline SVG content directly in JavaScript

---

## Standalone Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

**vercel.json** (optional, for caching):
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### GitHub Pages

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch and folder
4. Site will be available at `username.github.io/repo-name`

### Any Static Host

Simply upload all files maintaining the folder structure:

```
/
├── index.html
├── style.css
├── script.js
└── assets/
    └── (all subdirectories)
```

---

## Configuration Options

### Enable Audio Toggle

The audio toggle button is hidden by default. To enable:

**In `style.css`, find:**
```css
.utility-menu {
    display: none;
}
```

**Change to:**
```css
.utility-menu {
    display: flex;
}
```

### Change Color Theme

Modify CSS variables in `:root`:

```css
:root {
    --secondary-bg: #0F282D;    /* Dark background */
    --main-bg: #183948;         /* Panel background */
    --menu-bar: #09181F;        /* Darkest background */
    --secondary: #166470;       /* Secondary accent */
    --accent: #3EC1C9;          /* Primary accent (cyan) */
}
```

### Disable Sound Completely

**In `script.js`, find `initAudio()` call and comment it out:**

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    // initAudio();  // Commented out - no audio
    
    setupNavListeners();
    // ... rest of init
});
```

### Disable Background Click Navigation

**In `script.js`, comment out in DOMContentLoaded:**

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    // ...
    // setupBackgroundClickNavigation();  // Commented out
    // ...
});
```

### Change Initial State

**In `script.js`, modify:**

```javascript
let currentState = 1;  // Change to desired starting state
```

---

## Common Integration Scenarios

### Scenario: Full-Screen Experience

Ensure container takes full viewport:

```css
.origin-experience {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
```

### Scenario: Embedded in Page Section

Constrain to parent container:

```css
.origin-experience {
    position: relative;
    width: 100%;
    height: 800px;  /* Or min-height */
}
```

**Important:** The app uses `position: fixed` internally. When embedding, you may need to change some fixed positions to absolute.

### Scenario: Modal/Lightbox

Wrap in modal container:

```html
<div class="modal-overlay">
    <div class="modal-content origin-experience">
        <!-- App content -->
    </div>
    <button class="modal-close">×</button>
</div>
```

### Scenario: Different Aspect Ratios

The app handles various aspect ratios automatically:
- Desktop (landscape): 3-column layout
- Mobile landscape: Narrow sidebar layout
- Mobile portrait: Stacked layout

Breakpoints are defined in CSS media queries. Adjust if needed:

```css
@media (max-width: 768px) { /* Mobile */ }
@media (max-width: 1024px) and (orientation: landscape) { /* Tablet landscape */ }
```

---

## Troubleshooting Integration Issues

### Assets Not Loading

**Symptom:** Blank images, no video playback

**Solution:**
1. Check browser Network tab for 404 errors
2. Verify paths are correct and case-sensitive
3. Ensure assets are uploaded to same domain (CORS)
4. Check file permissions

### CSS Conflicts

**Symptom:** Styling looks wrong, layout broken

**Solution:**
1. Use CSS scoping:
   ```css
   .origin-experience .nav-item { /* scoped styles */ }
   ```
2. Increase specificity or use `!important` (last resort)
3. Check for conflicting global styles in parent site

### JavaScript Conflicts

**Symptom:** Console errors, interactions not working

**Solution:**
1. Wrap in IIFE to avoid global conflicts:
   ```javascript
   (function() {
       // All script.js content
   })();
   ```
2. Check for jQuery conflicts (`$` namespace)
3. Verify DOMContentLoaded fires correctly

### Video Autoplay Blocked

**Symptom:** Transition videos don't play

**Solution:**
1. Ensure videos are muted (required for autoplay)
2. Add `playsinline` attribute to video elements
3. For iOS, ensure `webkit-playsinline` is also present

### Touch Events Not Working

**Symptom:** Mobile taps don't register

**Solution:**
1. Check z-index of click capture layer
2. Verify no overlapping elements blocking touch
3. Ensure `touch-action: manipulation` on container

### Layout Shifts on Mobile

**Symptom:** Content jumps during transitions

**Solution:**
1. Check `adjustPortraitLayout()` is being called
2. Verify image dimensions are consistent
3. Test with actual device (DevTools can differ)

---

## Performance Recommendations

### Before Deployment

- [ ] Compress images to WebP (target: 50-150KB each)
- [ ] Optimize videos (VP9, 2-4 Mbps)
- [ ] Minify CSS and JavaScript (optional)
- [ ] Test on target devices

### Server Configuration

Set appropriate cache headers:

```
# Images and videos - long cache
Cache-Control: public, max-age=31536000, immutable

# HTML - short cache
Cache-Control: public, max-age=3600
```

Enable compression:
```
# Enable gzip/brotli for CSS and JS
Content-Encoding: gzip
```

### CDN Recommendations

For best performance:
- Host video files on CDN with global distribution
- Use lazy loading for off-screen assets
- Consider adaptive quality based on connection speed

---

## Support Checklist

If issues persist after integration:

1. [ ] Browser console has no errors
2. [ ] Network tab shows all assets loaded (200 status)
3. [ ] CSS variables are defined in `:root`
4. [ ] JavaScript initializes after DOM ready
5. [ ] Asset paths match actual file locations
6. [ ] CORS headers allow cross-origin requests (if needed)
7. [ ] Video elements have autoplay-required attributes
8. [ ] Touch events have correct passive/non-passive settings
