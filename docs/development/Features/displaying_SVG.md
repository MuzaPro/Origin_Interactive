# SVG Content Integration Guide

## Overview
The state machine supports displaying SVG vector graphics within content areas on both desktop and mobile layouts. SVGs are dynamically loaded and displayed with smooth fade transitions between states.

## Implementation

### State Definition
States can optionally include an `svg` property alongside their other properties:

```javascript
1: {
    title: "Modular Quantum Computing",
    descriptions: [...],
    image: "assets/images/state1.webp",
    svg: "assets/vector_graphics/stitching.svg"  // Optional SVG
}
```

### Current Usage
- **State 1 (Scalable Architecture)**: Uses `stitching.svg`
- **State 4 (The Science)**: Uses `q-logic-gates.svg`
- **States 2 & 3**: No SVG graphics

### SVG Placement
SVGs appear between `description2` and `description3`:
1. Title
2. Description 1
3. Description 2
4. **→ SVG Container ←** (if state has SVG)
5. Description 3 (if exists)

## Technical Implementation

### HTML Structure
Both desktop and mobile layouts have dedicated SVG containers:

```html
<!-- Desktop -->
<div class="content-area" id="contentArea">
    <h1 class="main-title" id="mainTitle">...</h1>
    <p class="description" id="description1">...</p>
    <p class="description" id="description2">...</p>
    <div class="svg-container" id="svgContainer"></div>
    <p class="description" id="description3"></p>
</div>

<!-- Mobile -->
<div class="mobile-content-strip" id="mobileContentArea">
    <h1 class="main-title" id="mobileMainTitle">...</h1>
    <p class="description" id="mobileDescription1">...</p>
    <p class="description" id="mobileDescription2">...</p>
    <div class="svg-container" id="mobileSvgContainer"></div>
    <p class="description" id="mobileDescription3"></p>
</div>
```

### JavaScript Functions

#### `loadSVG(svgPath, container)`
Handles loading and displaying SVG content with proper transitions.

**Key features:**
- Checks if container already has content
- If yes, fades out old SVG before loading new one (200ms)
- Fetches new SVG via fetch API
- Injects SVG content directly into container
- Fades in new SVG (500ms)

**Critical fix:** The function now properly handles transitions between two states that both have SVGs by fading out the old content first.

```javascript
async function loadSVG(svgPath, container) {
    if (!svgPath || !container) return;
    
    try {
        // If container already has content, fade it out first
        if (container.innerHTML.trim()) {
            container.style.transition = 'opacity 0.2s ease-out';
            container.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Fetch and load the new SVG
        const response = await fetch(svgPath);
        const svgContent = await response.text();
        container.innerHTML = svgContent;
        
        // Fade in the new SVG
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.5s ease-in';
        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });
    } catch (error) {
        console.warn(`Failed to load SVG: ${svgPath}`, error);
        container.innerHTML = '';
    }
}
```

#### `clearSVG(container)`
Removes SVG content with fade-out animation.

```javascript
function clearSVG(container) {
    if (!container) return;
    
    container.style.transition = 'opacity 0.3s ease-out';
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 300);
}
```

#### `updateContent(stateId)`
Called during state transitions to update all content including SVGs.

**Desktop/Landscape handling:**
```javascript
if (state.svg && svgContainer) {
    loadSVG(state.svg, svgContainer);
} else if (svgContainer) {
    clearSVG(svgContainer);
}
```

**Mobile Portrait handling:**
```javascript
if (state.svg && mobileSvgContainer) {
    loadSVG(state.svg, mobileSvgContainer);
} else if (mobileSvgContainer) {
    clearSVG(mobileSvgContainer);
}
```

### Compound Transition Support

**Critical:** Compound transitions (e.g., 1→3→4) must call `updateContent()` at the end to ensure SVGs are properly loaded.

```javascript
// In performCompoundTransition()
const finalState = states[toState];
if (finalState) {
    if (finalState.image) {
        stateVisual.src = finalState.image;
    } else if (finalState.loopingVideo) {
        // Setup looping video...
    }
    // IMPORTANT: Always update content to ensure SVG is loaded
    updateContent(toState);
}
```

**Why this matters:**
- Without this, SVGs won't update when transitioning between two states with different SVGs
- Example: State 1 (stitching.svg) → State 4 (q-logic-gates.svg)
- The compound path goes through State 3, but final state needs explicit content update

## CSS Styling

### Container Styles
```css
.svg-container {
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    opacity: 0;  /* Initially hidden */
    transition: opacity 0.5s ease-in;
    width: 100%;
}
```

### SVG Responsive Sizing
```css
.svg-container svg {
    width: 100% !important;
    height: auto !important;
    max-height: 300px;
    min-height: 200px;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    display: block;
    margin: 0 auto;
}
```

### Mobile Adjustments
```css
/* Mobile portrait */
@media (max-width: 768px) {
    .svg-container svg {
        max-height: 220px;
        min-height: 150px;
    }
}

/* Landscape mode */
@media (max-width: 1024px) and (orientation: landscape) {
    .svg-container svg {
        max-height: 180px;
        min-height: 120px;
    }
}
```

## Adding New SVG Graphics

### Step-by-Step Guide

1. **Prepare the SVG file:**
   ```
   - Place in: assets/vector_graphics/
   - File format: .svg
   - Optimize: Use SVGO or similar tool to reduce file size
   - Test: Ensure SVG renders correctly in browsers
   ```

2. **Update state definition:**
   ```javascript
   {
       title: "Your State Title",
       descriptions: [...],
       image: "assets/images/stateX.webp",
       svg: "assets/vector_graphics/your-graphic.svg"  // Add this line
   }
   ```

3. **Test transitions:**
   - Navigate to the state to verify SVG appears
   - Navigate away to verify SVG is cleared
   - Test from another state WITH SVG (critical for fade-out/in)
   - Test on mobile portrait and landscape
   - Test on desktop

### Best Practices

**SVG File Preparation:**
- Remove unnecessary metadata and comments
- Use relative units when possible
- Ensure viewBox is set correctly
- Test contrast against dark background (our theme)
- Keep file size under 100KB for performance

**Color Considerations:**
- Our theme uses dark backgrounds
- Light colors work best for visibility
- Accent color: `#3EC1C9` (var(--accent))
- Consider using CSS filters if needed

**Size Guidelines:**
- Desktop: max-height 300px
- Mobile: max-height 220px
- Landscape: max-height 180px
- Always test on actual devices

## Common Issues and Solutions

### Issue: SVG doesn't update when switching between states with SVGs

**Cause:** Old SVG content not cleared before loading new one.

**Solution:** The `loadSVG()` function now checks for existing content and fades it out first:
```javascript
if (container.innerHTML.trim()) {
    container.style.transition = 'opacity 0.2s ease-out';
    container.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 200));
}
```

### Issue: SVG missing after compound transition

**Cause:** `updateContent()` not called at end of compound transition.

**Solution:** Ensure `performCompoundTransition()` always calls `updateContent(toState)`:
```javascript
// Always update content to ensure SVG is loaded
updateContent(toState);
```

### Issue: SVG appears too large or too small

**Cause:** SVG viewBox or CSS sizing issues.

**Solution:**
- Check SVG viewBox attribute
- Verify CSS max-height/min-height constraints
- Test responsive breakpoints
- Use browser dev tools to inspect actual dimensions

### Issue: SVG colors don't match design

**Cause:** SVG fill/stroke colors not optimized for dark theme.

**Solution:**
- Edit SVG fill attributes
- Use CSS filters if needed
- Consider CSS variables for dynamic theming

## Performance Considerations

**Loading Strategy:**
- SVGs are fetched on-demand (not preloaded)
- Small file sizes mean fast loading
- Browser caching helps with repeated views

**Optimization Tips:**
- Minimize SVG file size (use SVGO)
- Remove unnecessary paths and groups
- Simplify complex shapes where possible
- Test on mobile networks

**Memory Management:**
- Old SVG content is removed from DOM
- No memory leaks from accumulating SVG elements
- Proper cleanup in `clearSVG()` function

## Layout Mode Handling

The system detects three layout modes:
1. **Desktop** (width > 768px)
2. **Portrait** (width ≤ 768px, portrait orientation)
3. **Landscape** (width ≤ 1024px, landscape orientation)

Each mode has its own SVG container:
- Desktop/Landscape: `svgContainer`
- Portrait: `mobileSvgContainer`

**Important:** When adding SVG handling code, ensure both containers are updated:
```javascript
// Desktop/landscape
if (state.svg && svgContainer) {
    loadSVG(state.svg, svgContainer);
} else if (svgContainer) {
    clearSVG(svgContainer);
}

// Mobile portrait
if (state.svg && mobileSvgContainer) {
    loadSVG(state.svg, mobileSvgContainer);
} else if (mobileSvgContainer) {
    clearSVG(mobileSvgContainer);
}
```

## Debugging Tips

**Console Logging:**
Add logging to track SVG loading:
```javascript
console.log(`Loading SVG: ${svgPath}`);
console.log(`Container has content: ${!!container.innerHTML.trim()}`);
```

**Browser DevTools:**
- Inspect SVG container element
- Check network tab for SVG file requests
- Monitor opacity transitions
- Verify innerHTML content

**Common Checks:**
- ✓ SVG file path is correct
- ✓ SVG file exists at specified location
- ✓ Container element exists in DOM
- ✓ Transitions complete before new content loads
- ✓ `updateContent()` called for all transition types

## Future Enhancements

Potential improvements to consider:
- Preload SVGs for faster transitions
- SVG animation support (SMIL or CSS)
- Dynamic SVG color theming
- SVG sprite sheets for better performance
- Progressive SVG loading for large files
- Lazy loading for off-screen content
