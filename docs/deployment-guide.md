# Deployment Guide

Most projects in this repository are static sites. They can be deployed with any static hosting service that supports HTML, CSS, JavaScript, and assets.

## Before Deploying

Check that:

- The project works by opening `index.html` in a browser.
- All local links use the correct relative paths.
- Images and assets load correctly.
- The page works at small, medium, and large viewport widths.
- Keyboard navigation and focus states are usable.
- Any API keys or private values are not committed.

## GitHub Pages

GitHub Pages is a good option for beginner projects.

General steps:

1. Push the repository to GitHub.
2. Open the repository settings.
3. Find the Pages settings.
4. Choose the branch and folder GitHub should publish.
5. Save the settings and wait for the site URL to become available.

For individual project folders, confirm that asset paths are relative to the project folder.

## Static Hosting Services

Static projects can also be deployed to services such as Netlify, Vercel, Cloudflare Pages, or similar hosts.

Use a simple static-site setup. Do not add a build command unless a future project explicitly requires one.

## After Deploying

- Open the deployed URL.
- Test the main user flow.
- Check the browser console for errors.
- Test at least one narrow viewport and one wide viewport.
- Update the project README with the live URL when appropriate.
