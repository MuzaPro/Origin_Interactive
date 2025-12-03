# Header Integration Guide

This directory contains the standalone header component for the Quantum Source website.

## Files
- `header.html`: The HTML structure of the header.
- `header.css`: The styles for the header (desktop and mobile).
- `header.js`: The JavaScript for interaction logic (dropdowns, mobile menu, search).
- `qs-logo.png`: The logo image used in the header.

## Integration Instructions

1.  **Copy Files**: Copy the entire `header/` directory to your project.

2.  **Include CSS**: Add the following link to the `<head>` of your page:
    ```html
    <link rel="stylesheet" href="header/header.css">
    ```

2.  **Include Fonts**: Ensure the following fonts are loaded (if not already):
    ```html
    <link href="https://fonts.googleapis.com/" rel="preconnect">
    <link href="https://fonts.gstatic.com/" rel="preconnect" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript"></script>
    <script type="text/javascript">
        WebFont.load({
            google: {
                families: ["Varela Round:400","Overpass:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic"]
            }
        });
    </script>
    ```

3.  **Insert HTML**: Copy the content of `header.html` (excluding `<html>`, `<head>`, `<body>` tags) and paste it at the top of your page `<body>`.
    - Specifically, copy everything from `<div data-animation="default" ...>` to the end of that `div`.
    - **Important**: Ensure the logo image path in the HTML (`src="qs-logo.png"`) is updated to point to the correct location relative to your page (e.g., `src="header/qs-logo.png"`).

4.  **Include JS**: Add the script at the end of your `<body>`:
    ```html
    <script src="header/header.js"></script>
    ```

## Features
- **Responsive Design**: Automatically switches to a hamburger menu on mobile devices (< 991px).
- **Dropdowns**: Hover-activated on desktop, click-activated on mobile.
- **Search Box**: Toggles visibility on click.
- **Standalone**: Does not require Webflow's `webflow.js`.

## Customization
- **Links**: Update the `href` attributes in the HTML to point to the correct pages in your new environment.
- **Search Functionality**: The search box currently redirects to the Webflow search page (`https://webs-stellar-site-9d0609.webflow.io/search`). For a static site or a different backend, you will need to implement your own search logic or integrate a third-party search service (like Algolia or Google Custom Search). You can modify the `SearchSite` function in `header.js` to change this behavior.
