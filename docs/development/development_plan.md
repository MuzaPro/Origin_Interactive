# Devloper's notes

## Next order of business:

* Fix the formatting in the text content (padding and font sizes) 

* create clear documentation

* Webflow integration guide

* a clear README file

* Add pop up windows - documentation and chip sections




## New Code Organization system


### JavaScript Organization
Split your JavaScript into multiple files based on functionality:
js/
├── core.js         // Core initialization, state machine definition
├── navigation.js   // Navigation logic and state transitions  
├── interaction.js  // Touch/click handling and UI interactions
├── media.js        // Video/audio playback and handling
├── responsive.js   // Layout detection and responsive adjustments
└── main.js         // Entry point that imports and initializes everything


Use ES modules to connect them:

// In main.js
import { initCore, states } from './core.js';
import { setupNavigation } from './navigation.js';
import { setupInteractions } from './interaction.js';
// etc.

document.addEventListener('DOMContentLoaded', () => {
    initCore();
    setupNavigation();
    setupInteractions();
    // etc.
});


### CSS Organization
Split your CSS into logical files:


css/
├── reset.css       // CSS reset/normalization
├── variables.css   // CSS variables and theming
├── base.css        // Base element styling
├── layout.css      // Main layout structures
├── components.css  // UI components like buttons, nav items
├── animations.css  // Animation-specific styles
├── responsive.css  // Media queries and responsive adjustments
└── main.css        // Imports all the above

You can either:

1. Link each file separately in your HTML
2. Use @import in your main.css (less efficient)
3. Use a build tool to concatenate them


### Build System Recommendation
For a project of this complexity, consider adding a simple build system:

Vite - Very simple to set up, great for modern web projects
Parcel - Zero configuration bundler, excellent for projects like yours
This would allow you to write modular code while still delivering optimized, bundled files to production.

### Implementation Strategy
Start with the CSS - easiest to split without breaking functionality
Move to JavaScript - extract one module at a time, starting with the most self-contained
Test thoroughly after each change
Consider adding a build system once the basic refactoring is complete
This approach will make your codebase much more maintainable while keeping the refactoring process manageable.



## complete


* deploy on vercel free tier (the project is already on github, I already used vercel before and have an account)

* adjust the menu width to be around 25% of the screen instead of a third

* make it mobile friendly (at least in landscape mode) - we need all the text to be a bit smaller, and we need the menu items to be a lot less spaced on mobile. I've attached a screen shot of the iphone 14 pro max setting in chrome's 'inspect' mode. the menu, home and sound buttons at the buttom left are currently overlapping the content. we should make these buttons smaller in both desktop and mobile.

* sound effect to button click  assets\sound\KEDR Audio - Computer Sounds - Interface Squeak Blip Button Choosing Electronic.wav


