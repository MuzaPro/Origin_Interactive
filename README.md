# Origin Interactive Experience

A state-driven web application showcasing Quantum Source's photonic quantum computing technology through an immersive visual experience.

## Quick Reference

| File | Purpose |
|------|---------|
| `index.html` | HTML structure and content containers |
| `style.css` | Styling, responsive layouts, animations |
| `script.js` | State machine, transitions, interactions |
| `assets/images/` | Static state backgrounds (WebP) |
| `assets/animations/` | Transition videos (WebM) |
| `assets/vector_graphics/` | SVG diagrams |
| `assets/sound/` | Audio effects |
| `assets/ui-icons/` | Navigation icons |

## States Overview

| State | Button Label | Content Focus |
|-------|--------------|---------------|
| 1 | Scalable Architecture | Modular quantum computing overview |
| 2 | The Building Block | ORIGIN unit introduction |
| 3 | Inside the System | Photonics chip and atom trapping |
| 4 | The Science | Cavity QED and deterministic entanglement |

## Layout Modes

The application detects three layout modes automatically:

- **Desktop**: Width > 768px → Sidebar with nav + content on left, visual on right
- **Mobile Portrait**: Width ≤ 768px, portrait → Top nav bar, visual below, content strip at bottom
- **Mobile Landscape**: Width ≤ 1024px, landscape → Narrow sidebar, content strip, visual on right

## Getting Started

### Local Development

```bash
# Serve with Python
python3 -m http.server 8080

# Or with Node.js
npx serve .
```

Then open `http://localhost:8080` in your browser.

### Deployment

The app is fully static. Deploy to any web host:

```bash
# Vercel
vercel

# Netlify
netlify deploy

# Or upload files to any static host
```

## Documentation

| Document | Contents |
|----------|----------|
| [TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md) | Architecture, state machine, CSS structure, feature implementations |
| [CONTENT_GUIDE.md](CONTENT_GUIDE.md) | How to update text, images, SVGs, and add new states |

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+ (primary target for Apple devices)
- Edge 79+
- iOS Safari 14+
- Chrome Mobile

## Key Features

- **State Machine Navigation**: 4 states with animated transitions
- **Responsive Design**: Optimized for desktop Safari and iPhone
- **Touch Navigation**: Tap background to advance through states
- **WebM Transitions**: Smooth pre-rendered animations
- **SVG Diagrams**: Vector graphics for states 1 and 4
- **Looping Video**: State 4 has continuous background animation
- **Audio Feedback**: Button click sounds (muted by default in production)

## Asset Requirements

### Images
- Format: WebP
- Resolution: 1920×1080 recommended
- Location: `assets/images/stateX.webp`

### Transition Videos
- Format: WebM (VP9 codec)
- Duration: 2-3 seconds
- Naming: `XtoY.webm` (e.g., `1to2.webm`)
- Location: `assets/animations/`

### SVG Graphics
- Must include `viewBox` attribute for proper scaling
- Must include `preserveAspectRatio="xMidYMid meet"`
- Location: `assets/vector_graphics/`

---

*Built by Muza Productions for Quantum Source*
