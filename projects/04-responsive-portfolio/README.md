# Project 04: Responsive Portfolio

Build a responsive single-page portfolio for a fictional frontend developer using semantic HTML, CSS Grid, Flexbox, and mobile-first CSS.

## Overview

This project combines the HTML and CSS skills from Projects 01-03 and introduces more deliberate responsive design. You will practice page landmarks, internal navigation, reusable cards, CSS Grid, responsive images, contact links, and print styles.

## Final Result

The completed page presents Maya Chen, a fictional junior frontend developer in Bengaluru, India. The portfolio includes an introduction, about section, grouped skills, selected project cards, a short learning journey, honest contact links, and a footer.

No JavaScript is needed for this project.

## Learning Objectives

- Build semantic page structure with landmarks.
- Create accessible navigation with internal anchors.
- Use mobile-first responsive CSS.
- Use CSS Grid for project cards and larger page layouts.
- Use Flexbox for navigation, links, tags, and small alignment tasks.
- Use CSS custom properties for repeated values.
- Create responsive local SVG visuals.
- Add hover and keyboard-focus states.
- Write honest demonstration links and contact information.
- Add simple print styles.

## Prerequisites

- Semantic HTML basics
- CSS selectors and the box model
- Introductory Flexbox
- Basic understanding of responsive design

## Required Page Sections

- Skip link
- Header
- Accessible primary navigation
- Hero/introduction
- About
- Skills
- Selected projects
- Experience or learning journey
- Contact
- Footer

## Layout and Responsive Requirements

- Start with a single-column mobile layout.
- Use Grid for selected project cards.
- Use larger multi-column layouts where space permits.
- Make navigation wrap honestly without a fake hamburger menu.
- Keep images flexible and prevent horizontal overflow.
- Verify at narrow mobile, tablet, and desktop widths.

## Accessibility Requirements

- Use a descriptive page title and `lang="en"`.
- Include a skip link.
- Use semantic landmarks and logical headings.
- Provide meaningful alternative text for informative visuals.
- Hide decorative visuals where appropriate.
- Use meaningful link text.
- Keep focus indicators visible.
- Do not rely on color alone.
- Avoid unnecessary ARIA.
- Respect reduced-motion preferences if smooth scrolling is used.

## Local Asset Explanation

All visuals are local SVG files created for this project. They are fictional illustrations, not photographs or real product screenshots.

## Fictional Content Disclaimer

Maya Chen, the portfolio content, project links, and profile links are fictional demonstration content. The email uses `example.com`, and external profile links use reserved `example.com` paths so they do not impersonate real accounts.

## Suggested Workflow

1. Open `starter/index.html` and read the TODO comments.
2. Review the page sections and anchor links.
3. Open `starter/css/style.css`.
4. Add CSS custom properties for colors, spacing, and shadows.
5. Style the header, navigation, hero, and links.
6. Use Grid for project cards.
7. Add responsive media queries for tablet and desktop layouts.
8. Add focus states and print styles.
9. Test at 320px, around 768px, and desktop widths.
10. Compare with the `solution/` folder only after attempting the challenge.

## Opening the Project

To work on the challenge, open:

```text
projects/04-responsive-portfolio/starter/index.html
```

To review the completed reference, open:

```text
projects/04-responsive-portfolio/solution/index.html
```

## Project Structure

```text
projects/04-responsive-portfolio/
+-- README.md
+-- starter/
|   +-- index.html
|   +-- css/
|   |   +-- style.css
|   +-- assets/
|       +-- maya-portrait.svg
|       +-- project-profile-card.svg
|       +-- project-recipe-page.svg
|       +-- project-focusflow.svg
+-- solution/
    +-- index.html
    +-- css/
    |   +-- style.css
    +-- assets/
        +-- maya-portrait.svg
        +-- project-profile-card.svg
        +-- project-recipe-page.svg
        +-- project-focusflow.svg
```

`preview.png` may be added after a real screenshot of the completed solution is captured.

## Manual Testing Checklist

- The page opens without JavaScript.
- Header navigation links move to the correct sections.
- The skip link appears when focused.
- Local SVG visuals load.
- Local project links work and unavailable code-link notes are clearly labeled.
- Contact links are honest and accessible.
- FAQ-like disclosure or form behavior is not implied.
- There is no horizontal scrolling.
- Focus styles are visible.

## Responsive Testing Checklist

- At 320px, content stacks in one column and links are not cramped.
- Around 768px, cards begin using available width cleanly.
- At 1024px or wider, hero/about/project layouts use Grid effectively.
- Images scale without overflowing.
- Headings wrap cleanly.

## Print Testing Checklist

- Navigation and decorative visuals are hidden.
- Main content, projects, and contact information remain visible.
- Shadows and colored backgrounds are removed.
- Link destinations are shown where useful.

## Bonus Challenges

- Add a dark color scheme.
- Add another project card.
- Create a multi-page version.
- Connect real project links.
- Add a downloadable resume.
- Add JavaScript navigation in a later exercise.

Do not implement these optional challenges today.

## Helpful Links

- [MDN: Main landmark](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main)
- [MDN: Navigation element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
- [MDN: CSS Grid layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids)
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox)
- [MDN: Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [MDN: Printing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing)

## Solution Guidance

Try to finish the starter before opening the solution. Your version should be semantic, responsive, accessible, readable, and honest about fictional content.
