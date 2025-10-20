# Quantum Source Interactive Experience - Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & File Structure](#architecture--file-structure)
3. [State Machine System](#state-machine-system)
4. [Sound System](#sound-system)
5. [CSS Structure & Responsive Design](#css-structure--responsive-design)
6. [Adding New Features](#adding-new-features)
7. [Troubleshooting & Common Issues](#troubleshooting--common-issues)
8. [Performance Optimization](#performance-optimization)
9. [Browser Compatibility](#browser-compatibility)

---

## Project Overview

The Quantum Source Interactive Experience is a state-driven web application that simulates exploring a quantum computing laboratory environment. The application uses pre-rendered animations and static images to create the illusion of 3D navigation while maintaining high performance across all devices.

### Key Technologies
- **JavaScript**: State management and animation control
- **CSS3**: Responsive design with height-based breakpoints
- **HTML5**: Semantic structure with accessibility considerations
- **Web Audio API**: Sound effects and user feedback

### Design Philosophy
- **Performance First**: Pre-rendered content loads faster than real-time 3D
- **Universal Compatibility**: Works on desktop, tablet, and mobile without plugins
- **Graceful Degradation**: Features fail safely if resources are unavailable

---

## Architecture & File Structure

```
project-root/
├── index.html              # Main HTML structure
├── style.css               # All styling and responsive design
├── script.js               # State machine logic and interactivity
├── assets/
│   ├── images/             # Static state images
│   │   ├── state1-static.webp
│   │   ├── state2-static.webp
│   │   ├── state3-static.webp
│   │   └── state5-static.webp
│   ├── animations/         # Transition videos
│   │   ├── 1to2.webm
│   │   ├── 1to5.webm
│   │   ├── 2to1.webm
│   │   ├── 2to3.webm
│   │   ├── 3to1.webm
│   │   └── 3to2.webm
│   └── sound/              # Audio effects
│       └── buttonSFX.wav
└── README.md
```

### File Responsibilities

**index.html**
- Semantic HTML structure
- Accessibility attributes
- Google Fonts integration
- Background container and navigation elements

**style.css**
- CSS custom properties (color palette)
- Responsive design with height-based breakpoints
- Animation transitions and fade effects
- Typography and brand styling

**script.js**
- State machine logic
- Animation preloading and playback
- Sound effect management
- Error handling and fallbacks

---

## State Machine System

### Core Concept

The state machine treats each view as a discrete "state" with defined transitions between them. This approach ensures predictable navigation and makes it easy to add new views or modify existing ones.

### State Definition Structure

```javascript
const states = {
    1: {
        title: "State Title",
        descriptions: [
            "First paragraph of content",
            "Second paragraph with <span class='highlight'>highlighted</span> text"
        ],
        image: "assets/images/state1-static.webp"
    }
    // ... more states
};
```

### Animation Mapping

```javascript
const animations = {
    "1-2": "assets/animations/1to2.webm",    // Direct transition
    "2-1": "assets/animations/2to1.webm",    // Reverse transition
    // Missing transitions trigger compound routing
};
```

### Transition Logic Flow

1. **Direct Transition**: If animation exists for `currentState-targetState`, play it directly
2. **Compound Transition**: If no direct path, route through intermediate state
3. **Instant Fallback**: If no animation available, instantly swap static images

```javascript
// Example compound transition: 2→5 becomes 2→1→5
if (currentState === 2 && targetState === 5) {
    await performCompoundTransition(2, 1, 5);
}
```

### Current Transition Routes

**Direct Transitions:**
- 1↔2, 1↔5, 2↔3, 3→1, 3↔2

**Compound Transitions:**
- 1→3: goes through state 2
- 2→5, 3→5: go through state 1 first
- 5→2, 5→3: go through state 1 first

### State Machine Error Handling

```javascript
try {
    await transitionToState(targetState);
} catch (error) {
    console.error('Transition error:', error);
    // Graceful recovery: update content without animation
    updateContent(targetState);
    currentState = targetState;
    updateActiveNav();
} finally {
    isTransitioning = false;  // Always unlock transitions
}
```

---

## Sound System

### Implementation Overview

The sound system uses the Web Audio API to provide immediate audio feedback for user interactions. It's designed to fail gracefully if audio is not supported or files are missing.

### Sound Preloading

```javascript
function preloadSounds() {
    try {
        buttonSound = new Audio('assets/sound/buttonSFX.wav');
        buttonSound.preload = 'auto';
        buttonSound.volume = 0.5;  // 50% volume
        
        buttonSound.onerror = () => {
            console.warn('Could not load button sound effect');
            buttonSound = null;  // Disable sound gracefully
        };
    } catch (error) {
        console.warn('Audio not supported');
        buttonSound = null;
    }
}
```

### Playing Sound Effects

```javascript
function playButtonSound() {
    if (buttonSound) {
        try {
            buttonSound.currentTime = 0;  // Reset to beginning
            buttonSound.play().catch(err => {
                console.warn('Could not play sound:', err);
            });
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }
}
```

### Customizing Sound Effects

**Adjust Volume:**
```javascript
buttonSound.volume = 0.3;  // 30% volume (0.0 = silent, 1.0 = full)
```

**Change Sound File:**
```javascript
buttonSound = new Audio('assets/sound/newButtonSound.mp3');
```

**Add Multiple Sound Effects:**
```javascript
// In preloadSounds():
hoverSound = new Audio('assets/sound/hover.wav');
errorSound = new Audio('assets/sound/error.wav');
successSound = new Audio('assets/sound/success.wav');

// Create corresponding play functions:
function playHoverSound() {
    if (hoverSound) {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(console.warn);
    }
}
```

**Add Sound to Different Elements:**
```javascript
// Example: Hover sounds for navigation
navItems.forEach(item => {
    item.addEventListener('mouseenter', playHoverSound);
});

// Example: Error sound for failed transitions
catch (error) {
    playErrorSound();
    console.error('Transition failed:', error);
}
```

**Disable All Sounds:**
```javascript
// Set sound variables to null
buttonSound = null;
hoverSound = null;
```

### Sound File Requirements

- **Format**: WAV, MP3, or OGG for maximum compatibility
- **Duration**: Keep under 2 seconds for UI feedback
- **Size**: Optimize files to under 100KB for fast loading
- **Volume**: Record at consistent levels, adjust via code

---

## CSS Structure & Responsive Design

### CSS Custom Properties (Variables)

```css
:root {
    --secondary-bg: #0F282D;
    --main-bg: #183948;
    --menu-bar: #09181F;
    --secondary: #166470;
    --accent: #3EC1C9;
    --text-overlay-bg: rgba(15, 40, 45, 0.8);
}
```

**Benefits:**
- Centralized color management
- Easy theme switching
- Consistent branding across components

### Layout System

**Desktop Layout (All Heights):**
- 10% Navigation strip (left)
- 30% Content strip (center-left)  
- 60% Background animation (right)

**Height-Based Breakpoints:**
```css
@media (max-height: 600px) {
    /* Compact spacing for landscape mobile */
}

@media (max-height: 500px) {
    /* Extra compact for very short screens */
}
```

**Why Height Instead of Width:**
- Better landscape detection on mobile devices
- Preserves layout integrity across orientations
- More intuitive responsive behavior

### Text Color Management

```css
.main-title {
    color: white !important;
}

.description {
    color: rgba(255, 255, 255, 0.9) !important;
}

.highlight {
    color: var(--accent) !important;
}
```

**Using `!important`:**
- Prevents specificity conflicts during development
- Ensures text remains visible against dark backgrounds
- Override when necessary for special cases

### Animation and Transitions

```css
.content-strip {
    transition: opacity 0.3s ease;
}

.content-strip.fade-out {
    opacity: 0;
}
```

All transitions use a consistent 300ms timing for professional feel.

---

## Adding New Features

### Adding a New State

1. **Add State Definition:**
```javascript
const states = {
    // ... existing states
    6: {
        title: "New State Title",
        descriptions: [
            "First paragraph about the new state",
            "Second paragraph with <span class='highlight'>highlighted</span> content"
        ],
        image: "assets/images/state6-static.webp"
    }
};
```

2. **Create Required Assets:**
- `assets/images/state6-static.webp` (static image)
- `assets/animations/X-to-6.webm` (transitions to new state)
- `assets/animations/6-to-X.webm` (transitions from new state)

3. **Add Navigation Button:**
```html
<button class="nav-item" data-state="6">
    <svg class="nav-icon" viewBox="0 0 24 24">
        <!-- Your icon SVG path -->
    </svg>
    <span class="nav-text">New State</span>
</button>
```

4. **Update Animation Mapping:**
```javascript
const animations = {
    // ... existing animations
    "5-6": "assets/animations/5to6.webm",
    "6-5": "assets/animations/6to5.webm"
};
```

### Adding Interactive Elements

**Example: Clickable Hotspots:**
```javascript
// Add to state definition
3: {
    title: "Interactive State",
    descriptions: [...],
    image: "assets/images/state3-static.webp",
    hotspots: [
        { x: 45, y: 60, action: "showPopup", data: "vacuum-chamber-info" }
    ]
}

// Add hotspot handling
function createHotspots(stateId) {
    const state = states[stateId];
    if (state.hotspots) {
        state.hotspots.forEach(spot => {
            // Create clickable overlay elements
        });
    }
}
```

### Adding New Sound Events

```javascript
// Add new sound preloading
function preloadSounds() {
    buttonSound = new Audio('assets/sound/buttonSFX.wav');
    transitionSound = new Audio('assets/sound/transition.wav');
    hoverSound = new Audio('assets/sound/hover.wav');
}

// Add to relevant event handlers
item.addEventListener('mouseenter', () => {
    playHoverSound();
});
```

---

## Troubleshooting & Common Issues

### Animation Playback Issues

**Problem:** Video animations don't play or appear corrupted

**Solutions:**
1. **Check file format:** Ensure `.webm` format with VP9 codec
2. **Verify file paths:** Use relative paths without leading slashes
3. **Check file size:** Large files may timeout on slow connections
4. **Browser compatibility:** Test in multiple browsers

```javascript
// Debug animation loading
stateAnimation.onerror = (e) => {
    console.error('Animation failed to load:', e);
    console.log('Attempted path:', animationPath);
    // Check if file exists and is accessible
};
```

### State Transition Failures

**Problem:** Clicking navigation doesn't change states

**Debugging Steps:**
1. **Check console for errors**
2. **Verify isTransitioning flag:** May be stuck in locked state
3. **Validate state definitions:** Ensure target state exists
4. **Test animation paths:** Check if required animation files exist

```javascript
// Add debugging to transition function
function transitionToState(targetState) {
    console.log(`Attempting transition: ${currentState} → ${targetState}`);
    console.log('isTransitioning:', isTransitioning);
    console.log('Target state exists:', !!states[targetState]);
    
    // ... rest of function
}
```

### CSS Layout Issues

**Problem:** Layout breaks on certain screen sizes

**Solutions:**
1. **Check breakpoint logic:** Verify height-based media queries
2. **Test viewport units:** VW/VH may behave unexpectedly
3. **Validate CSS custom properties:** Ensure variables are defined

```css
/* Debug layout with visible borders */
.sidebar, .content-strip {
    border: 2px solid red !important;
}
```

### Sound System Problems

**Problem:** Audio effects don't play

**Debugging:**
1. **Check browser audio policy:** Modern browsers require user interaction
2. **Verify file paths and formats**
3. **Test in different browsers**

```javascript
// Test audio support
function testAudioSupport() {
    const audio = new Audio();
    const canPlayWAV = audio.canPlayType('audio/wav');
    const canPlayMP3 = audio.canPlayType('audio/mpeg');
    console.log('WAV support:', canPlayWAV);
    console.log('MP3 support:', canPlayMP3);
}
```

### Memory and Performance Issues

**Problem:** Application becomes slow or unresponsive

**Solutions:**
1. **Check animation preloading:** May be loading too many files
2. **Monitor memory usage:** Large video files can cause issues
3. **Optimize image sizes:** WebP compression helps

```javascript
// Monitor memory usage
function checkMemoryUsage() {
    if (performance.memory) {
        console.log('Memory usage:', {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
            total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
        });
    }
}
```

### Common Error Messages

**"Failed to load animation"**
- Check file path spelling and case sensitivity
- Verify file exists and is accessible
- Ensure proper file permissions

**"Cannot read property of undefined"**
- State definition missing or malformed
- DOM element not found (check IDs)
- Animation path not defined

**"The play() request was interrupted"**
- Browser autoplay policy blocking audio
- Multiple sounds trying to play simultaneously
- Audio file format not supported

---

## Performance Optimization

### Asset Optimization

**Images:**
- Use WebP format for better compression
- Optimize for target resolution (1920x1080)
- Consider progressive loading for large files

**Videos:**
- VP9 codec in WebM container for best compression
- Target bitrate: 2-4 Mbps for 1080p content
- Keep transitions under 2 seconds when possible

**Audio:**
- Use compressed formats (MP3 or OGG)
- Normalize audio levels
- Keep files under 100KB

### Preloading Strategy

```javascript
// Prioritized preloading
function preloadAnimations() {
    const priority = ['1-2', '2-1', '1-5', '5-1'];  // Most common transitions
    const secondary = ['2-3', '3-2', '3-1'];        // Less frequent
    
    // Load priority animations first
    priority.forEach(preloadAnimation);
    
    // Load secondary animations after delay
    setTimeout(() => {
        secondary.forEach(preloadAnimation);
    }, 2000);
}
```

### Memory Management

```javascript
// Clean up unused video elements
function cleanupVideos() {
    const unusedVideos = document.querySelectorAll('video[src=""]');
    unusedVideos.forEach(video => {
        video.src = '';
        video.load();
    });
}
```

---

## Browser Compatibility

### Supported Browsers

**Fully Supported:**
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

**Limited Support:**
- Internet Explorer 11 (degraded experience)

### Feature Detection

```javascript
// Check for required features
function checkBrowserSupport() {
    const support = {
        video: !!document.createElement('video').canPlayType,
        audio: !!window.Audio,
        webp: checkWebPSupport(),
        customProperties: CSS.supports('color', 'var(--test)')
    };
    
    console.log('Browser support:', support);
    return support;
}

function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}
```

### Fallback Strategies

```javascript
// Graceful degradation for unsupported features
if (!checkBrowserSupport().video) {
    // Fallback to static images only
    console.warn('Video not supported, using static transitions');
    // Implement instant state switching
}

if (!checkBrowserSupport().audio) {
    // Disable sound effects
    buttonSound = null;
    console.warn('Audio not supported, disabling sound effects');
}
```

---

## Deployment Notes

### Vercel Configuration

Create `vercel.json` for optimal deployment:

```json
{
  "headers": [
    {
      "source": "/assets/animations/(.*)",
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

### Production Checklist

- [ ] All asset paths use relative URLs
- [ ] Images optimized and properly sized
- [ ] Sound effects tested across browsers
- [ ] Responsive design verified on target devices
- [ ] Error handling tested with missing assets
- [ ] Performance tested on slow connections

---

## Contact & Support

For questions about this implementation or to report issues:

1. Check the console for error messages
2. Verify all asset files are present and accessible
3. Test in multiple browsers to isolate compatibility issues
4. Check network tab for failed resource loads

Remember: The application is designed to fail gracefully. If animations don't load, static images should still provide a usable experience.