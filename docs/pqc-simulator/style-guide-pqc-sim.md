# W-System Quantum Computing Demo - Style Guide

## Overview
This style guide defines the consistent visual language and design patterns for the W-System Quantum Computing Demo levels. All new levels should follow these guidelines to maintain visual coherence and user experience consistency.

## Color Scheme

### Primary Color Palette
```css
:root {
    --secondary-bg: #0F282D;     /* Dark teal background for cards/panels */
    --main-bg: #183948;          /* Main background color */
    --menu-bar: #09181F;         /* Header/navigation background */
    --secondary: #166470;        /* Secondary elements, inactive buttons */
    --accent: #3EC1C9;           /* Primary accent - links, highlights, active states */
    --text-overlay-bg: rgba(15, 40, 45, 0.8);  /* Semi-transparent overlays */
    --menu-gradient: linear-gradient(90deg, #0F282D 0%, rgba(15, 40, 45, 0.8) 100%);
}
```

### Interactive Element Colors
- **Photon/Energy Elements**: `#FFC78E` (warm orange)
- **Photon Buttons**: `#FFB163` (darker orange for buttons)
- **Entanglement Elements**: `#FF6B9D` (pink/magenta)
- **Control Elements**: Use `--accent` (`#3EC1C9`)
- **Disabled States**: `#666` (neutral gray)

### Text Colors
- **Primary Text**: `white`
- **Secondary Text**: `#ccc` (light gray)
- **Accent Text**: `var(--accent)` for headings and highlights

## Typography

### Font Family
- **Primary**: `'Overpass', sans-serif`
- **Import**: `https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap`

### Font Weights and Usage
- **400 (Regular)**: Body text, descriptions
- **500 (Medium)**: Labels, secondary headings
- **600 (Semi-Bold)**: Button text, important labels
- **700 (Bold)**: Main headings, titles

### Font Sizes
- **Main Title**: `1.5rem` (header)
- **Section Headings**: `1.1rem` - `1rem`
- **Button Text**: `1rem` - `0.9rem`
- **Body Text**: `0.9rem` - `0.8rem`
- **Small Text/Captions**: `0.8rem` - `0.85rem`

## Layout Structure

### Page Layout
```css
body {
    font-family: 'Overpass', sans-serif;
    background: var(--main-bg);
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
```

### Header Structure
- **Background**: `var(--menu-bar)`
- **Padding**: `1rem 2rem`
- **Border**: `2px solid var(--secondary)` (bottom)
- **Layout**: Flexbox with space-between alignment
- **Content**: Title + description on left, navigation button on right

### Main Container
- **Layout**: `display: flex` with `gap: 2rem`
- **Padding**: `2rem`
- **Flex Distribution**: 
  - Visualization area: `flex: 2` or `flex: 2.5`
  - Control panel: `flex: 1`

## Component Styles

### Cards and Panels
```css
.panel {
    background: var(--secondary-bg);
    border-radius: 12px;
    border: 1px solid var(--secondary);
    padding: 2rem;
}
```

### Buttons

#### Primary Action Buttons
```css
.primary-button {
    background: var(--secondary);
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    color: white;
    font-family: 'Overpass', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    font-size: 1rem;
}

.primary-button:hover {
    background: var(--accent);
    transform: translateY(-2px);
}

.primary-button.active {
    background: var(--accent);
    box-shadow: 0 0 20px rgba(62, 193, 201, 0.3);
}
```

#### Photon/Energy Buttons
```css
.photon-button {
    background: #FFB163;
    /* Same structure as primary-button */
}

.photon-button:hover {
    background: #ff9f47;
    transform: translateY(-2px);
}
```

#### Navigation Buttons
```css
.nav-button {
    background: var(--secondary);
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    /* Same hover effects as primary buttons */
}
```

#### Disabled State
```css
.button:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
}
```

### Information Displays

#### Status/Info Panels
```css
.info-panel {
    background: var(--text-overlay-bg);
    border-radius: 8px;
    padding: 1rem;
    border-left: 4px solid var(--accent);
}

.info-panel h4 {
    color: var(--accent);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.info-panel p {
    color: #ccc;
    font-size: 0.8rem;
    line-height: 1.4;
}
```

#### Progress Indicators
```css
.progress-indicator {
    background: var(--menu-gradient);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--secondary);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--photon-color);
    width: 0%;
    transition: width 0.5s ease;
}
```

## Interactive Elements

### Visual Feedback
- **Hover Effects**: `transform: translateY(-2px)` with `transition: all 0.3s ease`
- **Active States**: Color change to `var(--accent)` + optional glow effect
- **Disabled States**: Gray background (`#666`) with `cursor: not-allowed`

### Animations

#### Pulse Animation (for active states)
```css
@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
}
```

#### Glow Effects
```css
.glow-effect {
    box-shadow: 0 0 15px rgba(62, 193, 201, 0.6);
}
```

#### Flow Animations (for pathways)
```css
@keyframes pathwayFlow {
    0% { stroke-dasharray: 0,20; }
    100% { stroke-dasharray: 20,0; }
}
```

### Physics Elements

#### Energy Levels
- **Width**: Relative to container (typically 25% in groups)
- **Height**: `3px`
- **Background**: `var(--secondary)` (inactive), `var(--accent)` (active)
- **Transition**: `all 0.3s ease`

#### Photons
- **Size**: `12px` diameter circles
- **Color**: `#FFC78E` with matching box-shadow glow
- **Animation**: Smooth transitions with `all 0.5s ease`

#### Particles/States
- **Atoms**: `80px` circles with `3px` border
- **State Indicators**: `15px` circles with pulse animation
- **Electrons**: `8px` squares rotated 45° (diamond shape)

## Spacing and Layout

### Standard Spacing Units
- **Component Gap**: `2rem`
- **Internal Padding**: `1rem` - `2rem`
- **Small Spacing**: `0.5rem`
- **Section Margins**: `1rem` - `1.5rem`

### Positioning
- **Relative Positioning**: For container elements
- **Absolute Positioning**: For overlay elements, animations
- **Z-index**: `10` for moving elements like photons

## Responsive Considerations

### Flexible Layouts
- Use flexbox for main layout structure
- Percentage-based widths for responsive elements
- `max-width` and `max-height` constraints for visual elements

### Text Scaling
- Relative units (`rem`, `em`) for scalable typography
- Consistent line-height (`1.4`) for readability

## Physics Visualization Standards

### Energy Diagrams
- **Degenerate States**: Horizontal lines at same vertical position
- **Transitions**: SVG paths with stroke animations
- **Population**: Circular indicators with pulse animations

### Network Visualizations
- **Nodes**: Circular elements with hover effects
- **Connections**: SVG lines with flow animations
- **States**: Color-coded based on quantum state

### Control Elements
- **Beams**: Gradient lines with pulse animations
- **Fields**: Semi-transparent overlays
- **Pathways**: Dashed or solid lines with directional flow

## Accessibility Notes

### Color Contrast
- Ensure sufficient contrast between text and backgrounds
- Use additional visual cues beyond color for state changes

### Interactive Feedback
- Clear hover states for all interactive elements
- Disabled states clearly distinguishable
- Loading/processing states for long operations

## Code Organization

### CSS Structure
1. **CSS Variables** (at `:root`)
2. **Reset/Base Styles**
3. **Layout Components** (header, main-container, etc.)
4. **Interactive Elements** (buttons, controls)
5. **Visual Effects** (animations, transitions)
6. **Physics-specific Styles**
7. **Responsive Adjustments**

### Naming Conventions
- Use descriptive class names: `.energy-level`, `.photon-button`, `.control-panel`
- Follow BEM methodology where appropriate
- Prefix physics-specific classes: `.quantum-state`, `.entanglement-link`

## Implementation Checklist

When creating new levels, ensure:
- [ ] Color palette matches established variables
- [ ] Typography uses Overpass font with correct weights
- [ ] Button styles follow established patterns
- [ ] Animations use consistent timing (0.3s ease for most interactions)
- [ ] Layout follows flex-based structure with standard spacing
- [ ] Physics elements use established visual conventions
- [ ] Information panels follow standard formatting
- [ ] Navigation maintains header structure and styling