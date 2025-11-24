# Looping Animation Feature

## Overview
The state machine supports looping video animations as an alternative to static images for background visuals. This feature allows continuous playback of video content that loops seamlessly while a user is viewing a particular state.

## Implementation

### State Definition
States can now use either a static `image` or a `loopingVideo` property:

```javascript
// Static image (traditional approach)
1: {
    title: "State Title",
    descriptions: [...],
    image: "assets/images/state1.webp"
}

// Looping video (new feature)
4: {
    title: "Deterministic Entanglement",
    descriptions: [...],
    loopingVideo: "assets/animations/Resonators.webm"
}
```

### Current Usage
- **State 4 (The Science)**: Uses `Resonators.webm` as a continuously looping background animation

### Technical Details

#### Video Configuration
When a looping video is displayed:
- `loop` attribute is set to `true`
- `muted` attribute is set to `true` (required for autoplay)
- Video plays automatically when entering the state
- Video continues playing until user navigates away

#### Transition Behavior

**Entering a looping video state:**
1. Static image layer fades out (`opacity: 0`)
2. Video element source is set to the looping video file
3. Video element fades in with smooth transition (`opacity: 1`)
4. Video begins playing with `loop: true`
5. Video continues playing indefinitely

**Exiting a looping video state:**
1. Looping video pauses
2. `loop` attribute is set to `false`
3. Video element fades out
4. Static image layer is restored for the target state
5. Video element is reset for next use

#### Code Locations

**State definition:**
- File: `script.js`
- Location: `states` object (lines 4-44)

**Instant transition handling:**
- File: `script.js`
- Function: `instantTransition()` (lines ~592-660)
- Handles direct transitions to/from looping video states

**Transition animation handling:**
- File: `script.js`
- Function: `updateToTargetImage()` within `playTransitionAnimation()` (lines ~758-861)
- Handles looping video display after transition animations complete

## Adding New Looping Videos

### Steps to Add
1. **Prepare the video file:**
   - Format: WebM (recommended for web compatibility)
   - Place in: `assets/animations/`
   - Ensure video loops seamlessly (first and last frames should match)

2. **Update state definition:**
```javascript
{
    title: "Your State Title",
    descriptions: [...],
    loopingVideo: "assets/animations/your-video.webm",
    svg: "optional-svg-path.svg" // Optional, can be combined
}
```

3. **Test transitions:**
   - Navigate to the state to verify looping works
   - Navigate away to verify cleanup works
   - Test all transition paths (direct and compound)

### Best Practices

**Video Specifications:**
- Resolution: Match other state visuals (1920px width recommended)
- Duration: 3-10 seconds for optimal loop perception
- Bitrate: Balance quality vs file size (2-5 Mbps recommended)
- Audio: Not required (video is always muted)

**Seamless Looping:**
- Ensure visual continuity between end and start frames
- Use crossfade or motion design that naturally loops
- Avoid abrupt cuts or jarring transitions

**Performance:**
- Keep file size reasonable (<10MB recommended)
- Test on mobile devices for performance
- Consider lazy loading for multiple looping videos

## Browser Compatibility

The looping video feature uses standard HTML5 video APIs:
- ✅ Chrome/Edge (WebM native support)
- ✅ Firefox (WebM native support)
- ✅ Safari (WebM support via MSE)
- ✅ Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Fallback Behavior

If a looping video fails to load or play:
- Console warning is logged
- Video element remains hidden
- Static image layer can be used as fallback (add `image` property alongside `loopingVideo`)

```javascript
// Example with fallback
4: {
    title: "State Title",
    descriptions: [...],
    loopingVideo: "assets/animations/video.webm",
    image: "assets/images/fallback.webp" // Optional fallback
}
```

## Troubleshooting

**Video doesn't play:**
- Check browser console for errors
- Verify file path is correct
- Ensure video file is properly encoded as WebM
- Check that video is muted (required for autoplay)

**Video doesn't loop smoothly:**
- Review video editing for seamless loop points
- Check video duration (too short may appear jarring)
- Verify `loop` attribute is being set correctly

**Performance issues:**
- Reduce video file size/bitrate
- Check video resolution matches viewport
- Test on target devices (especially mobile)

**Transition issues:**
- Verify both `instantTransition()` and `updateToTargetImage()` handle the state
- Check console logs for transition flow
- Ensure opacity and display properties are correctly managed

## Future Enhancements

Potential improvements to consider:
- Preloading looping videos (similar to transition videos)
- Multiple looping videos per state with crossfade
- Conditional looping based on user interaction time
- Quality adaptation based on device/connection
- Pause/resume on visibility change (tab switching)
