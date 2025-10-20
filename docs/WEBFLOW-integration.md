## Option 1: Embed as Custom Code Block (Recommended for Beginners)

This is the easiest approach and will work well for your interactive experience.

### Step 1: Prepare Your Assets

First, you'll need to host your assets (images, videos, audio) somewhere accessible:

**Option A: Use a CDN service like:**

- Cloudinary (free tier available)
- AWS S3 + CloudFront
- Netlify (free hosting)

**Option B: Upload to Webflow Assets (Limited)**

- Webflow allows some asset uploads, but has size limits

### Step 2: Create a Dedicated Page in Webflow

1. In Webflow Designer, create a new page (e.g., "quantum-experience")
2. Add a **Custom Code** component to the page
3. Set the page to full width/height

### Step 3: Modify Your Code for Webflow



### Step 4: Upload Assets and Update URLs

1. **Upload your assets** to a CDN service
2. **Replace all the placeholder URLs** in the code above:
   - Replace `https://your-cdn-url.com/assets/images/` with your actual image URLs
   - Replace `https://your-cdn-url.com/assets/animations/` with your actual video URLs  
   - Replace `https://your-cdn-url.com/assets/sound/` with your actual audio URLs

### Step 5: Add Google Fonts to Webflow

In Webflow Designer:

1. Go to Project Settings → Custom Code
2. Add this to the `<head>` section:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

---

## Option 2: iframe Embed (Simplest)

If you want the quickest solution:

1. **Host your complete app** on Netlify, Vercel, or GitHub Pages
2. **In Webflow**, add an Embed component with:

```html
<iframe 
    src="https://your-quantum-app.netlify.app" 
    width="100%" 
    height="100vh" 
    frameborder="0"
    style="position: fixed; top: 0; left: 0; z-index: 9999;">
</iframe>
```

**Pros:** Super simple, no code changes needed
**Cons:** Less integration with your Webflow site

---

## Option 3: Modal/Overlay Integration

For a more integrated feel, you can trigger the experience as an overlay:

1. **Add a button** to your Webflow page
2. **Set the button's custom attribute**: `onclick="launchQuantumExperience()"`
3. **Use the code from Option 1** but initially hidden
4. **The experience launches** when the button is clicked

---

## Asset Hosting Recommendations

### For Free Hosting:

**Netlify** (Recommended for beginners):

1. Create account at netlify.com
2. Drag & drop your assets folder
3. Copy the URLs
4. Update your code

### For CDN (Better Performance):

**Cloudinary**:

1. Sign up for free account
2. Upload images/videos through their interface
3. Use their optimized URLs
4. Automatic format conversion (WebP, etc.)

---

## Important Webflow-Specific Notes:

1. **Class Name Conflicts**: I've prefixed all CSS classes with `qe-` to avoid conflicts with Webflow's classes
2. **z-index Issues**: The experience uses `z-index: 9999` to appear above Webflow content
3. **Responsive Design**: The mobile breakpoints should work with Webflow's responsive system
4. **Custom Code Limits**: Webflow has limits on custom code size, so you might need to host the JavaScript externally for very large projects

---

## Testing Checklist:

- [ ] Upload a few assets first to test URLs work
- [ ] Test on Webflow's preview mode
- [ ] Check mobile responsiveness
- [ ] Verify animations load properly
- [ ] Test the close button functionality
