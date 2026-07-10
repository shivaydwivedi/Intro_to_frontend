# Project 02: Recipe Page

Build a clean, readable recipe article with semantic HTML and beginner-friendly CSS.

## Overview

This project focuses on structuring longer content. You will practice headings, sections, lists, recipe metadata, figures, captions, readable typography, spacing, responsive images, and simple print styles.

## Final Result

The completed page presents a vegetarian Creamy Tomato Pasta recipe with prep details, ingredients, numbered instructions, substitutions, serving ideas, storage guidance, a nutrition disclaimer, and a short cooking tip.

No JavaScript is needed for this project.

## Learning Objectives

- Use semantic HTML landmarks and sections.
- Create a logical heading hierarchy.
- Group recipe metadata so it is easy to scan.
- Use unordered lists for ingredients and related notes.
- Use an ordered list for recipe instructions.
- Add a figure with an accessible local visual and caption.
- Style longer content with readable line lengths and spacing.
- Create a responsive layout that works on mobile and desktop.
- Add simple print CSS for a printable recipe.

## Prerequisites

- Basic HTML elements and attributes
- Basic CSS selectors
- The CSS box model
- How to open an HTML file in a browser

## Requirements

Your recipe page should include:

- Recipe title
- Short introduction
- Recipe image or accessible local visual
- Preparation time
- Cooking time
- Total time
- Number of servings
- Difficulty level
- Dietary label
- Ingredients
- Numbered instructions
- Optional substitutions
- Serving suggestions
- Storage guidance
- Nutrition disclaimer
- Short recipe note or tip

Use only HTML and CSS. Do not add JavaScript, frameworks, external fonts, icon libraries, build tools, or network-dependent assets.

## Content and Layout Requirements

- Keep the recipe vegetarian and suitable for a broad audience.
- Use realistic measurements and coherent instructions.
- Keep health and nutrition claims modest.
- Use a single-column layout on small screens.
- Use a wider layout on desktop when it helps readability.
- Keep text comfortable to read at larger viewport widths.
- Include print styles that preserve the recipe title, metadata, ingredients, and instructions.

## Accessibility Requirements

- Use a descriptive page title.
- Include `lang="en"` on the `html` element.
- Use landmarks such as `header`, `main`, and `footer`.
- Keep headings in a logical order.
- Provide meaningful alternative text for the recipe visual.
- Use a caption when it adds useful context.
- Keep color contrast readable.
- Do not rely on color alone.
- Write understandable measurement labels.
- Add visible focus styles for links.
- Support increased text size without clipping content.

## Suggested Workflow

1. Open `starter/index.html` and read the TODO comments.
2. Review the provided recipe content.
3. Improve the HTML structure with meaningful sections and lists.
4. Open `starter/css/style.css`.
5. Add base typography, spacing, and page colors.
6. Style the metadata, ingredients, and instructions.
7. Add responsive layout rules.
8. Add simple print styles.
9. Test the page at narrow and wide viewport widths.
10. Compare your work with the `solution/` folder only after you have tried the challenge.

## Opening the Project

To work on the challenge, open:

```text
projects/02-recipe-page/starter/index.html
```

To review the completed reference, open:

```text
projects/02-recipe-page/solution/index.html
```

## Project Structure

```text
projects/02-recipe-page/
+-- README.md
+-- starter/
|   +-- index.html
|   +-- css/
|   |   +-- style.css
|   +-- assets/
|       +-- creamy-tomato-pasta.svg
+-- solution/
    +-- index.html
    +-- css/
    |   +-- style.css
    +-- assets/
        +-- creamy-tomato-pasta.svg
```

`preview.png` may be added after a real screenshot of the completed solution is captured.

## Manual Testing Checklist

- The page opens without JavaScript.
- The local recipe visual loads.
- The page does not depend on network resources.
- The heading order is logical.
- Ingredients use a list.
- Instructions use an ordered list.
- The page is readable at 320px wide.
- There is no horizontal scrolling on narrow screens.
- If you add links, they can be focused with the keyboard.
- If you add links, focus styles are visible.
- Text remains readable at 200% zoom.

## Print Testing Checklist

- Open the browser print preview.
- Confirm the recipe title appears.
- Confirm metadata, ingredients, and instructions remain visible.
- Confirm text prints in readable black and white.
- Confirm decorative backgrounds and shadows are removed.
- Confirm sections do not clip obvious content.

## Bonus Challenges

- Add another vegetarian recipe using the same structure.
- Add a recipe category label.
- Add a dark color scheme with CSS custom properties.
- Improve the print layout.
- Plan how unit conversion could work in a future JavaScript project.

Do not implement JavaScript unit conversion for this project.

## Helpful Links

- [MDN: HTML sections and outlines](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section)
- [MDN: Heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
- [MDN: Figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [MDN: Ordered lists](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
- [MDN: Styling lists](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Styling_lists)
- [MDN: Printing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing)

## Solution Guidance

Try to finish the starter version before opening the solution. The solution is one reference, not the only correct answer. Your version should be semantic, readable, responsive, accessible, and printable.
