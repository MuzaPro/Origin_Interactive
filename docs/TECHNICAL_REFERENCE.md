# Technical Reference

Complete technical documentation for the Origin Interactive Experience.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [State Machine](#state-machine)
3. [CSS Structure](#css-structure)
4. [Feature Implementations](#feature-implementations)
5. [Performance Optimizations](#performance-optimizations)
6. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### File Structure

```
project-root/
├── index.html                    # HTML structure
├── style.css                     # All styling
├── script.js                     # State machine and interactions
├── assets/
│   ├── images/                   # Static state backgrounds
│   │   ├── state1.webp
│   │   ├── state2.webp
│   │   ├── state3.webp
│   │   └── state4.webp
│   ├── animations/               # Transition videos
│   │   ├── 1to2.webm
│   │   ├── 2to1.webm
│   │   ├── 2to3.webm
│   │   ├── 3to2.webm
│   │   ├── 1to3.webm
│   │   └── 3to1.webm
│   ├── vector_graphics/          # SVG diagrams
│   │   ├── stitching.svg
│   │   └── q-logic-gates.svg
│   ├── sound/
│   │   └── buttonSFX.wav
│   └── ui-icons/nav-bar/         # Navigation icons
└── docs/
    ├── README.md
    ├── TECHNICAL_REFERENCE.md
    └── CONTENT_GUIDE.md
```

### Design Principles

1. **Single-File Architecture**: All CSS in one file, all JS in one file for easy integration
2. **No Dependencies**: Pure vanilla JavaScript, no frameworks required
3. **Graceful Degradation**: Features fail safely if assets are unavailable
4. **Mobile-First Performance**: Pre-rendered content over real-time 3D

---

## State Machine

### State Definition Structure

```javascript
const states = {
    1: {
        title: "State Title",
        descriptions: [
            "First paragraph",
            "Second paragraph with <span class='highlight'>highlights</span>",
            "Optional third paragraph (appears after SVG)"
        ],
        image: "assets/images/state1.webp",
        svg: "assets/vector_graphics/optional.svg",      // Optional
        videoUrl: "https://youtube.com/...",             // Optional - shows video button
        loopingVideo: "assets/animations/loop.webm"      // Optional - replaces static image
    }
};
```

### State Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Main heading displayed in content area |
| `descriptions` | array | Yes | Array of 1-3 HTML strings for paragraphs |
| `image` | string | Yes* | Path to static background image |
| `svg` | string | No | Path to SVG graphic (displays between desc 2 and 3) |
| `videoUrl` | string | No | External video URL (shows "Watch Video" button) |
| `loopingVideo` | string | No | Path to looping background video (replaces image) |

*Required unless `loopingVideo` is provided

### Animation Mapping

```javascript
const animations = {
    "1-2": "assets/animations/1to2.webm",
    "2-1": "assets/animations/2to1.webm",
    "2-3": "assets/animations/2to3.webm",
    "3-2": "assets/animations/3to2.webm",
    "1-3": "assets/animations/1to3.webm",
    "3-1": "assets/animations/3to1.webm"
};
```

### Transition Logic

1. **Direct Transition**: If animation exists for `currentState-targetState`, play it
2. **Instant Fallback**: If no animation, instantly swap static images

The transition function handles:
- Preventing double-clicks during transitions (`isTransitioning` flag)
- Scrolling content to top on state change
- Text fade animations
- SVG loading/clearing
- Layout adjustments for portrait mode

### Current Transition Map

```
State 1 ←→ State 2  (direct animations)
State 2 ←→ State 3  (direct animations)
State 1 ←→ State 3  (direct animations)
State 3 → State 4   (instant - no animation)
State 4 → State 3   (instant - no animation)
State 1/2 → State 4 (instant)
State 4 → State 1/2 (instant)
```

---

## CSS Structure

### CSS Variables

```css
:root {
    --secondary-bg: #0F282D;
    --main-bg: #183948;
    --menu-bar: #09181F;
    --secondary: #166470;
    --accent: #3EC1C9;
    --text-overlay-bg: rgba(15, 40, 45, 0.8);
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(62, 193, 201, 0.1);
}
```

### Layout Breakpoints

```css
/* Desktop: Default layout */
/* Width > 768px */
.sidebar { width: 30vw; }

/* Tablet */
@media (max-width: 1024px) {
    .sidebar { width: 42vw; }
}

/* Mobile (all orientations) */
@media (max-width: 768px) {
    .sidebar { display: none; }
    .mobile-nav-bar { display: flex; }
    .mobile-content-strip { display: block; }
}

/* Mobile Portrait specific */
@media (max-width: 768px) and (orientation: portrait) {
    /* Content strip positioned dynamically by JS */
}

/* Mobile Landscape */
@media (max-width: 1024px) and (orientation: landscape) {
    .sidebar { width: 17vw; display: flex; }
    .content-area { left: 17vw; width: 33vw; }
    .background-container { left: 52vw; width: 48vw; }
}
```

### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `.sidebar` | Desktop left panel (nav + content) |
| `.nav-menu` | Navigation button container |
| `.nav-item` | Individual navigation button |
| `.nav-item.active` | Currently active state |
| `.content-area` | Desktop text content container |
| `.mobile-nav-bar` | Mobile top navigation bar |
| `.mobile-content-strip` | Mobile bottom content area |
| `.background-container` | Visual/animation container |
| `.state-visual` | Static background image |
| `.state-animation` | Video animation element |
| `.click-capture-layer` | Transparent touch/click capture overlay |
| `.svg-container` | SVG diagram container |
| `.highlight` | Accent-colored text spans |

### Glass Morphism Effect

The UI uses backdrop blur for a frosted glass appearance:

```css
.sidebar {
    background: rgba(15, 40, 45, 0.4);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}
```

---

## Feature Implementations

### Touch/Click Navigation

Users can tap the background visual to advance through states sequentially (1→2→3→4→1).

**HTML Structure:**
```html
<div class="background-container">
    <div id="clickCaptureLayer" class="click-capture-layer"></div>
    <img class="state-visual" id="stateVisual">
    <video class="state-animation" id="stateAnimation"></video>
</div>
```

**JavaScript Handler:**
```javascript
const nextState = { 1: 2, 2: 3, 3: 4, 4: 1 };

clickCaptureLayer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const targetState = nextState[currentState];
    if (!isTransitioning && targetState) {
        transitionToState(targetState);
    }
}, { passive: false });
```

**CSS Protection:**
```css
.state-visual, .state-animation {
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
}

.click-capture-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: auto;
}
```

### SVG Graphics Display

SVGs appear between description paragraphs 2 and 3.

**Loading Function:**
```javascript
async function loadSVG(svgPath, container) {
    // Fade out existing content
    if (container.innerHTML.trim()) {
        container.style.opacity = '0';
        await wait(200);
    }
    
    // Fetch and inject SVG
    const response = await fetch(svgPath);
    const svgContent = await response.text();
    container.innerHTML = svgContent;
    
    // Fade in
    container.style.opacity = '1';
}
```

**SVG File Requirements:**

SVGs MUST include `viewBox` and `preserveAspectRatio` for proper responsive scaling:

```xml
<svg width="597" height="324" 
     viewBox="0 0 597 324" 
     preserveAspectRatio="xMidYMid meet"
     xmlns="http://www.w3.org/2000/svg">
```

Without these attributes, SVGs will crop incorrectly on different screen sizes.

### Looping Video Background

State 4 uses a continuously looping video instead of a static image.

**State Definition:**
```javascript
4: {
    title: "Deterministic Entanglement",
    descriptions: [...],
    loopingVideo: "assets/animations/Resonators.webm",
    svg: "assets/vector_graphics/q-logic-gates.svg"
}
```

**Playback Handling:**
```javascript
if (newState.loopingVideo) {
    stateVisual.style.opacity = '0';
    stateAnimation.src = newState.loopingVideo;
    stateAnimation.loop = true;
    stateAnimation.muted = true;
    stateAnimation.style.opacity = '1';
    stateAnimation.play();
}
```

**Cleanup on Exit:**
```javascript
if (stateAnimation.loop) {
    stateAnimation.pause();
    stateAnimation.loop = false;
    stateAnimation.style.opacity = '0';
}
stateVisual.style.opacity = '1';
```

### Audio System

Uses Web Audio API for zero-latency playback.

**Initialization:**
```javascript
async function initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    
    const response = await fetch('assets/sound/buttonSFX.wav');
    const audioData = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(audioData);
}
```

**Playback:**
```javascript
function playButtonSound() {
    if (!soundEnabled || !audioContext || !audioBuffer) return;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = audioBuffer;
    gainNode.gain.value = 0.05;  // Volume control
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
}
```

**Note:** The audio toggle button is hidden by default (`.utility-menu { display: none }`). Enable by changing to `display: flex`.

### Text Transitions

Text fades out and in during state changes:

```javascript
function fadeTextTransition(element, fromText, toText) {
    let wrapper = element.querySelector('.text-transition-wrapper');
    if (!wrapper) {
        element.innerHTML = `<div class="text-transition-wrapper">${element.innerHTML}</div>`;
        wrapper = element.querySelector('.text-transition-wrapper');
    }
    
    wrapper.style.opacity = '0';
    
    setTimeout(() => {
        wrapper.innerHTML = toText;
        wrapper.style.opacity = '1';
    }, 200);
}
```

### Scroll Reset

Content scrolls to top when changing states:

```javascript
// In transitionToState():
const layoutMode = getLayoutMode();
const scrollContainer = layoutMode === 'portrait' ? mobileContentArea : contentArea;
if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
}
```

### Portrait Layout Positioning

In mobile portrait mode, the content strip is positioned dynamically below the image:

```javascript
function adjustPortraitLayout() {
    if (getLayoutMode() === 'portrait') {
        const imageRect = stateVisual.getBoundingClientRect();
        const imageBottom = imageRect.bottom;
        
        mobileContentStrip.style.position = 'fixed';
        mobileContentStrip.style.top = imageBottom + 'px';
    }
}
```

---

## Performance Optimizations

### Asset Preloading

All images and videos are preloaded on page load:

```javascript
const preloadedVideos = new Map();
const preloadedImages = new Map();

async function preloadAllAssets() {
    // Preload images
    const imagePromises = Object.values(states).map(state => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                preloadedImages.set(state.image, img);
                resolve();
            };
            img.src = state.image;
        });
    });
    
    // Preload videos
    const videoPromises = Object.entries(animations).map(([key, path]) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.onloadeddata = () => {
                preloadedVideos.set(path, video);
                resolve();
            };
            video.src = path;
        });
    });
    
    await Promise.all([...imagePromises, ...videoPromises]);
}
```

### Touch Response Optimization

```css
html, body {
    touch-action: manipulation;  /* Disable 300ms tap delay */
    -webkit-tap-highlight-color: transparent;
}
```

```javascript
// Use touchstart/mousedown instead of click
['touchstart', 'mousedown'].forEach(eventType => {
    item.addEventListener(eventType, handler, { passive: false });
});
```

### GPU Acceleration

```css
.nav-item,
.state-visual,
.state-animation,
.content-area {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
}
```

### Video Configuration

```html
<video muted 
       playsinline 
       webkit-playsinline 
       disablePictureInPicture>
```

These attributes prevent iOS from forcing fullscreen and enable inline autoplay.

---

## Troubleshooting

### Video Not Playing

1. Check file path (case-sensitive on some servers)
2. Verify WebM format with VP9 codec
3. Ensure `muted` attribute is present (required for autoplay)
4. Check browser console for errors

### SVG Cropping

**Cause:** Missing `viewBox` attribute

**Fix:** Add to SVG opening tag:
```xml
viewBox="0 0 [width] [height]" preserveAspectRatio="xMidYMid meet"
```

### Layout Broken on Specific Device

1. Check which breakpoint is triggering
2. Verify `getLayoutMode()` returns expected value
3. Test with browser DevTools responsive mode
4. Check for CSS specificity conflicts

### Touch Navigation Not Working

1. Verify `clickCaptureLayer` element exists
2. Check z-index (should be above video/image)
3. Ensure `pointer-events: auto` on capture layer
4. Check console for JavaScript errors

### Content Not Updating

1. Verify state definition exists in `states` object
2. Check DOM element IDs match JavaScript selectors
3. Verify `updateContent()` is being called
4. Check for JavaScript errors in console

### Audio Not Playing

1. Modern browsers require user interaction first
2. Check `audioContext.state` - may need `resume()`
3. Verify audio file path and format
4. Check if `soundEnabled` is true

### Slow Performance

1. Check if videos are properly preloaded
2. Verify image sizes aren't excessive
3. Monitor memory usage in DevTools
4. Check for animation/transition conflicts

---

## Browser Compatibility Notes

### Safari (Primary Target)

- Requires `-webkit-` prefixes for `backdrop-filter`
- Video autoplay requires `muted` and `playsinline`
- Web Audio API requires user interaction to start

### iOS Safari

- Requires `webkit-playsinline` attribute on videos
- Touch events need `{ passive: false }` for `preventDefault()`
- `position: fixed` can be unreliable - use sparingly

### Chrome/Firefox

- Full support for all features
- WebM with VP9 plays natively

---

## Code Style Guidelines

1. Use `const` for values that don't change
2. Use async/await for asynchronous operations
3. Handle errors with try/catch blocks
4. Keep functions focused and single-purpose
5. Comment complex logic
6. Use meaningful variable names
