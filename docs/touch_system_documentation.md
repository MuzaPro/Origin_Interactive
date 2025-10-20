
# Touch System Documentation

## Overview
This document describes the implementation of the interactive touch system for the Quantum Source interactive experience. The system allows users to navigate between states by clicking/tapping on the screen while preventing unwanted video player behaviors.

## Problem Statement
Several issues were addressed during development:

- **Video Player UI**: On iOS devices, WebM videos were displaying player controls and entering fullscreen mode
- **Unwanted Interactions**: Users could double-click to trigger fullscreen or right-click to access context menus
- **Navigation Intuition**: Users expected to be able to tap/click on visuals to navigate between states
- **Visual Alignment**: Transition animations and static images needed perfect alignment

## Solutions Implemented

### 1. Preventing Video Player UI
To prevent native video controls and fullscreen behavior, especially on iOS:

```html
<video class="state-animation" 
       id="stateAnimation"
       preload="auto"
       muted
       playsinline
       webkit-playsinline
       disablePictureInPicture>
    <source src="" type="video/webm">
</video>
```

Key attributes:
- `playsinline` and `webkit-playsinline` prevent iOS from forcing fullscreen
- `disablePictureInPicture` prevents picture-in-picture mode
- Removed `controls` attribute entirely (better than `controls="false"`)

### 2. Blocking Unwanted Interactions
Added event handlers to prevent unwanted interactions with the video and image elements:

```javascript
const elements = [stateVisual, stateAnimation];
const events = ['dblclick', 'contextmenu', 'mousedown', 'touchstart'];

elements.forEach(element => {
    if (element) {
        events.forEach(event => {
            element.addEventListener(event, e => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, { passive: false });
        });
    }
});
```

Added CSS to make video elements non-interactive:

```css
.state-visual,
.state-animation {
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
}
```

### 3. Implementing Touch Navigation
Created a transparent overlay to capture clicks/taps and manage navigation:

```html
<div class="background-container">
    <div id="clickCaptureLayer" class="click-capture-layer"></div>
    <!-- Other elements (video, image) -->
</div>
```

Styled the overlay to be interactive while letting other elements display:

```css
.click-capture-layer {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 10 !important;
    cursor: pointer !important;
    pointer-events: auto !important;
}
```

Added a click handler to navigate between states:

```javascript
function setupBackgroundClickNavigation() {
    const clickCaptureLayer = document.getElementById('clickCaptureLayer');

    if (clickCaptureLayer) {
        clickCaptureLayer.addEventListener('click', (e) => {
            // Define the navigation sequence
            const nextState = {
                1: 2,
                2: 3,
                3: 1,
                5: 1
            };

            // Get the next state based on current state
            const targetState = nextState[currentState];

            // If not transitioning and there's a valid next state
            if (!isTransitioning && targetState && states[targetState]) {
                // Play button sound for consistent feedback
                playButtonSound();

                // Transition to the next state
                transitionToState(targetState);
            }
        });
    }
}
```

### 4. Fixing Visual Alignment Issues
Ensured perfect alignment between static images and video animations using CSS:

```css
/* FINAL OVERRIDE FOR ALL MEDIA QUERIES */
.state-visual,
.state-animation {
    position: absolute !important;
    left: 0 !important;
    width: 100% !important;
}

/* Desktop and landscape mode */
@media (min-width: 769px), (max-width: 768px) and (orientation: landscape) {
    .state-visual,
    .state-animation {
        top: 0 !important;
        height: 100% !important; 
        max-height: none !important;
        object-fit: cover !important;
        object-position: center !important;
    }
}

/* Portrait mode */
@media (max-width: 768px) and (orientation: portrait) {
    .state-visual,
    .state-animation {
        top: 0 !important;
        height: auto !important;
        max-height: 60vh !important;
        object-fit: contain !important;
        object-position: center top !important;
    }
}
```

This ensured:
- Full-screen coverage in landscape/desktop modes
- Full visual display without cropping in portrait mode
- Consistent positioning between static images and animations

## Best Practices Established
- **Video Handling on iOS**: Always use `playsinline` and other attributes to control video behavior
- **Touch Layer Pattern**: Use a dedicated transparent layer for capturing touch events
- **CSS Override Pattern**: Use `!important` in limited cases to ensure consistent styling
- **Defensive Programming**: Always check if elements exist before adding event listeners
- **Responsive Design**: Handle both portrait and landscape modes appropriately

## Future Considerations
- **Performance Optimization**: Monitor for any performance issues with video playback
- **Accessibility**: Consider adding keyboard navigation options
- **Animation Preloading**: Explore additional techniques to improve transition smoothness
