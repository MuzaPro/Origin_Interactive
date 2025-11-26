# Content Guide

How to update text, images, SVGs, and manage states in the Origin Interactive Experience.

---

## Table of Contents

1. [Updating Text Content](#updating-text-content)
2. [Updating Images](#updating-images)
3. [Managing SVG Graphics](#managing-svg-graphics)
4. [Managing Transition Animations](#managing-transition-animations)
5. [Adding Looping Video Backgrounds](#adding-looping-video-backgrounds)
6. [Adding External Video Links](#adding-external-video-links)
7. [Adding a New State](#adding-a-new-state)
8. [Navigation Button Labels](#navigation-button-labels)

---

## Updating Text Content

### Location

All text content is defined in `script.js` in the `states` object (near the top of the file).

### Structure

```javascript
const states = {
    1: {
        title: "Modular Quantum Computing",
        descriptions: [
            "First paragraph text...",
            "Second paragraph with <span class='highlight'>highlighted text</span>...",
            "Optional third paragraph (appears after SVG if state has one)..."
        ],
        image: "assets/images/state1.webp"
    }
};
```

### How to Update

1. Open `script.js`
2. Find the state number you want to edit
3. Modify the `title` or `descriptions` array
4. Save and refresh browser

### Text Formatting

You can use HTML within description strings:

```javascript
descriptions: [
    // Highlight text in accent color
    "This is <span class='highlight'>highlighted</span> text.",
    
    // Line breaks (but paragraphs are preferred)
    "First line.<br>Second line.",
    
    // Bold text
    "This is <strong>bold</strong> text.",
    
    // Em dashes (use actual character)
    "Quantum computing—the next frontier."
]
```

### Current Content Reference

| State | Title | Descriptions |
|-------|-------|--------------|
| 1 | Modular Quantum Computing | 2 paragraphs about scalable architecture |
| 2 | Introducing ORIGIN | 3 paragraphs about the ORIGIN unit |
| 3 | Photonics Chip at the Core | 2 paragraphs about the chip and atoms |
| 4 | Deterministic Entanglement | 3 paragraphs about Cavity QED |

---

## Updating Images

### Location

Static background images are stored in `assets/images/`

### File Requirements

| Property | Requirement |
|----------|-------------|
| Format | WebP (preferred) or JPEG |
| Resolution | 1920×1080 recommended |
| Naming | `state1.webp`, `state2.webp`, etc. |

### How to Update

1. Create/export new image at 1920×1080
2. Convert to WebP for optimal compression:
   ```bash
   cwebp -q 85 input.jpg -o state1.webp
   ```
3. Place in `assets/images/`
4. Update path in `script.js` if filename changed:
   ```javascript
   1: {
       image: "assets/images/state1.webp"  // Update this path
   }
   ```

### Image Optimization Tips

- Target file size: 50-150KB per image
- Use WebP for best compression/quality ratio
- Ensure consistent aspect ratio across all states
- Test on both light and dark displays

---

## Managing SVG Graphics

### Location

SVG files are stored in `assets/vector_graphics/`

### Current Usage

| State | SVG File | Description |
|-------|----------|-------------|
| 1 | `stitching.svg` | Photonic cluster diagram |
| 4 | `q-logic-gates.svg` | Quantum logic gates diagram |
| 2, 3 | None | No SVG graphics |

### Adding SVG to a State

1. Place SVG file in `assets/vector_graphics/`
2. Add `svg` property to state definition:
   ```javascript
   2: {
       title: "Introducing ORIGIN",
       descriptions: [...],
       image: "assets/images/state2.webp",
       svg: "assets/vector_graphics/your-diagram.svg"  // Add this
   }
   ```

### Removing SVG from a State

Delete the `svg` property from the state definition:

```javascript
1: {
    title: "Modular Quantum Computing",
    descriptions: [...],
    image: "assets/images/state1.webp"
    // svg property removed
}
```

### SVG File Requirements

**CRITICAL:** SVGs must include `viewBox` and `preserveAspectRatio` attributes for proper responsive scaling.

**Correct SVG opening tag:**
```xml
<svg width="597" height="324" 
     viewBox="0 0 597 324" 
     preserveAspectRatio="xMidYMid meet"
     xmlns="http://www.w3.org/2000/svg">
```

**Fixing an SVG that crops incorrectly:**

1. Open the SVG file in a text editor
2. Find the opening `<svg>` tag
3. Note the `width` and `height` values
4. Add `viewBox="0 0 [width] [height]"`
5. Add `preserveAspectRatio="xMidYMid meet"`

### SVG Styling Guidelines

- Use light colors (white, light gray, accent cyan `#3EC1C9`)
- Keep file size under 100KB
- Remove unnecessary metadata with SVGO
- Test visibility against dark background

---

## Managing Transition Animations

### Location

Transition videos are stored in `assets/animations/`

### File Naming Convention

`[fromState]to[toState].webm`

Examples:
- `1to2.webm` - Transition from state 1 to state 2
- `2to1.webm` - Reverse transition from state 2 to state 1

### Current Transitions

| File | Transition |
|------|------------|
| `1to2.webm` | State 1 → State 2 |
| `2to1.webm` | State 2 → State 1 |
| `2to3.webm` | State 2 → State 3 |
| `3to2.webm` | State 3 → State 2 |
| `1to3.webm` | State 1 → State 3 |
| `3to1.webm` | State 3 → State 1 |

### Adding a New Transition

1. Render transition video (2-3 seconds, 1920×1080)
2. Export as WebM with VP9 codec
3. Place in `assets/animations/`
4. Add to `animations` object in `script.js`:
   ```javascript
   const animations = {
       // Existing transitions...
       "3-4": "assets/animations/3to4.webm",
       "4-3": "assets/animations/4to3.webm"
   };
   ```

### Video Export Settings

| Property | Recommendation |
|----------|----------------|
| Format | WebM |
| Codec | VP9 |
| Resolution | 1920×1080 |
| Bitrate | 2-4 Mbps |
| Duration | 2-3 seconds |
| Audio | None (videos are muted) |

### Missing Transitions

If no animation exists for a transition, the app performs an instant image swap (no animation).

---

## Adding Looping Video Backgrounds

State 4 demonstrates this feature with a continuously looping video.

### How to Add

1. Create seamless looping video
2. Export as WebM (VP9 codec)
3. Place in `assets/animations/`
4. Add `loopingVideo` property to state:

```javascript
4: {
    title: "State Title",
    descriptions: [...],
    loopingVideo: "assets/animations/YourLoop.webm"
    // Note: No 'image' property needed if using loopingVideo
}
```

### Looping Video Requirements

| Property | Requirement |
|----------|-------------|
| Format | WebM (VP9) |
| Duration | 3-10 seconds for smooth perception |
| Loop Point | First and last frames must match seamlessly |
| File Size | Under 10MB recommended |
| Audio | Not needed (always muted) |

### Adding Fallback Image

For browsers that don't support video:

```javascript
4: {
    title: "State Title",
    descriptions: [...],
    loopingVideo: "assets/animations/YourLoop.webm",
    image: "assets/images/state4-fallback.webp"  // Optional fallback
}
```

---

## Adding External Video Links

State 2 demonstrates this feature with a YouTube link.

### How to Add

Add `videoUrl` property to state definition:

```javascript
2: {
    title: "Introducing ORIGIN",
    descriptions: [...],
    image: "assets/images/state2.webp",
    videoUrl: "https://youtu.be/-pp3bKn8Fg8"  // Add this
}
```

This displays a "Watch Full Explainer Video" button that opens the link in a new tab.

### How to Remove

Delete the `videoUrl` property from the state definition.

---

## Adding a New State

### Step 1: Define the State

Add new entry to `states` object in `script.js`:

```javascript
const states = {
    // Existing states 1-4...
    
    5: {
        title: "New State Title",
        descriptions: [
            "First paragraph...",
            "Second paragraph..."
        ],
        image: "assets/images/state5.webp"
    }
};
```

### Step 2: Add Required Assets

- Static image: `assets/images/state5.webp`
- Transition animations (optional): `assets/animations/4to5.webm`, `assets/animations/5to4.webm`

### Step 3: Add Navigation Button

In `index.html`, add button to both desktop sidebar and mobile nav bar:

**Desktop sidebar (inside `.nav-menu`):**
```html
<button class="nav-item" data-state="5" data-mobile-text="NewLabel">
    <img src="assets/ui-icons/nav-bar/icon.svg" class="nav-icon" alt="Icon">
    <span class="nav-text">Full Button Label</span>
</button>
```

**Mobile nav bar (inside `.mobile-nav-bar`):**
```html
<button class="nav-item" data-state="5" data-mobile-text="NewLabel">
    <img src="assets/ui-icons/nav-bar/icon.svg" class="nav-icon" alt="Icon">
    <span class="nav-text">Full Button Label</span>
</button>
```

### Step 4: Update Touch Navigation Sequence

In `script.js`, find the `setupBackgroundClickNavigation` function and update the sequence:

```javascript
const nextState = {
    1: 2,
    2: 3,
    3: 4,
    4: 5,  // Updated
    5: 1   // New - loops back to start
};
```

### Step 5: Add Transition Animations (Optional)

If you have transition videos:

```javascript
const animations = {
    // Existing...
    "4-5": "assets/animations/4to5.webm",
    "5-4": "assets/animations/5to4.webm"
};
```

### Step 6: Test

1. Navigate to new state via button
2. Navigate via touch/click on background
3. Test transitions to/from all other states
4. Test on desktop and mobile layouts

---

## Navigation Button Labels

### Desktop Labels (Full Text)

Defined in HTML and JavaScript. Full labels appear on desktop/landscape.

Current labels:
- State 1: "Scalable Architecture"
- State 2: "The Building Block"
- State 3: "Inside the System"
- State 4: "The Science"

### Mobile Labels (Short Text)

Defined via `data-mobile-text` attribute. Short labels appear on mobile portrait.

Current labels:
- State 1: "Architecture"
- State 2: "Origin"
- State 3: "System"
- State 4: "Science"

### How to Change Labels

**In `index.html`:**

Update both locations (desktop sidebar and mobile nav bar):

```html
<button class="nav-item" data-state="1" data-mobile-text="NewShort">
    <span class="nav-text">New Full Label</span>
</button>
```

**In `script.js`:**

Update the `fullTexts` object in `updateNavButtonText()`:

```javascript
const fullTexts = {
    '1': 'New Full Label',
    '2': 'The Building Block',
    '3': 'Inside the System',
    '4': 'The Science'
};
```

---

## Quick Reference: State Properties

```javascript
{
    // REQUIRED
    title: "string",           // Main heading
    descriptions: ["array"],   // 1-3 paragraphs (HTML allowed)
    image: "path/to/image",    // Required unless loopingVideo is set
    
    // OPTIONAL
    svg: "path/to/svg",        // Appears between desc 2 and 3
    videoUrl: "https://...",   // Shows "Watch Video" button
    loopingVideo: "path/to/video"  // Replaces static image with loop
}
```

---

## Deployment Checklist

Before deploying content updates:

- [ ] All text content reviewed for typos
- [ ] All image paths are correct (case-sensitive)
- [ ] Images are optimized (WebP, appropriate size)
- [ ] SVGs have viewBox and preserveAspectRatio
- [ ] Transitions tested in all directions
- [ ] Desktop layout tested
- [ ] Mobile portrait layout tested
- [ ] Mobile landscape layout tested
- [ ] No JavaScript errors in console
