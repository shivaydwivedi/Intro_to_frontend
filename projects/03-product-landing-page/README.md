# Project 03: Product Landing Page

Build a responsive product landing page for a fictional productivity tool using semantic HTML and CSS.

## Overview

This project focuses on reusable page sections, accessible navigation, internal anchor links, Flexbox layouts, calls to action, cards, CSS custom properties, and a simple HTML form.

## Final Result

The completed page markets FocusFlow, a fictional focus timer and distraction-reduction tool for students, learners, and independent professionals. It is a static marketing page only; it does not include a real timer, account system, checkout flow, backend, or authentication.

## Learning Objectives

- Build semantic page landmarks.
- Create accessible navigation with internal anchor links.
- Use a skip link for keyboard users.
- Use Flexbox for hero content, card groups, pricing, and form layout.
- Create reusable section, card, and button classes.
- Use CSS custom properties for repeated design values.
- Add hover and visible keyboard focus states.
- Build responsive navigation without JavaScript.
- Structure a simple email form with native validation attributes.
- Use native `details` and `summary` elements for an FAQ.

## Prerequisites

- Basic semantic HTML
- Basic CSS selectors
- The CSS box model
- Introductory Flexbox
- How to open an HTML file in a browser

## Project Requirements

The page should include:

- Skip link
- Site header
- Brand name or simple local logo treatment
- Accessible primary navigation
- Hero section
- Primary and secondary calls to action
- Product visual or local illustration
- Benefits or features section
- How it works section
- Fictional testimonial section
- Fictional pricing section with Free, Focus, and Flow plans
- FAQ using native disclosure elements
- Newsletter or early-access form
- Footer navigation
- Copyright information

Use only HTML and CSS. Do not add JavaScript, frameworks, CSS libraries, icon libraries, build tools, external fonts, external images, or real integrations.

## Section-by-Section Requirements

- Header: include the FocusFlow brand and navigation links to page sections.
- Hero: explain the product clearly and link to pricing and early access.
- Features: describe practical benefits without unsupported statistics.
- How it works: show a simple three-step process.
- Testimonials: use fictional names and modest language.
- Pricing: show three fictional demonstration plans and link calls to action to the early-access section.
- FAQ: use `details` and `summary`.
- Form: include an email label, email input, autocomplete, required validation, submit button, and honest privacy copy.
- Footer: include internal navigation and copyright text.

## Accessibility Requirements

- Use a descriptive page title.
- Include `lang="en"` on the `html` element.
- Add a skip link.
- Use semantic landmarks.
- Keep a logical heading order.
- Use meaningful link and button text.
- Associate the email label with the input.
- Keep color contrast readable.
- Do not rely on color alone.
- Add visible focus indicators.
- Keep interactive targets touch-friendly.
- Treat decorative images correctly.
- Support increased text size without clipping content.
- Avoid unnecessary ARIA.

## Responsive Behavior Expectations

- Navigation should wrap naturally on narrow screens.
- Hero content should remain readable at 320px wide.
- Cards should stack on small screens and use rows or columns when space permits.
- The form should be usable on small screens.
- There should be no horizontal scrolling.

## Suggested Workflow

1. Open `starter/index.html` and read the TODO comments.
2. Check the page sections and internal anchor links.
3. Open `starter/css/style.css`.
4. Add custom properties for colors, spacing, radius, and shadows.
5. Style the header and navigation.
6. Build the hero layout and button styles.
7. Use Flexbox for feature cards, steps, pricing, and the form.
8. Add responsive rules for narrow screens.
9. Add focus states and test keyboard navigation.
10. Compare your work with the `solution/` folder only after you have tried the challenge.

## Opening the Project

To work on the challenge, open:

```text
projects/03-product-landing-page/starter/index.html
```

To review the completed reference, open:

```text
projects/03-product-landing-page/solution/index.html
```

## Project Structure

```text
projects/03-product-landing-page/
+-- README.md
+-- starter/
|   +-- index.html
|   +-- css/
|   |   +-- style.css
|   +-- assets/
|       +-- focusflow-product.svg
+-- solution/
    +-- index.html
    +-- css/
    |   +-- style.css
    +-- assets/
        +-- focusflow-product.svg
```

`preview.png` may be added after a real screenshot of the completed solution is captured.

## Manual Testing Checklist

- The page opens without JavaScript.
- Header navigation links move to the correct sections.
- The skip link appears when focused.
- The local product visual loads.
- The page has no network-dependent assets.
- The page remains readable at 320px wide.
- There is no horizontal scrolling.
- Cards wrap or stack cleanly.
- FAQ items open and close with mouse and keyboard.
- The email input uses native browser validation.
- Text remains readable at 200% zoom.

## Form Limitation

The early-access form is demonstration-only. It uses native HTML validation, but there is no backend and no submitted email is stored. Do not claim that signup succeeds unless a future project adds real form handling.

## Bonus Challenges

- Add another fictional pricing option.
- Add a dark color scheme with CSS custom properties.
- Add one more fictional testimonial.
- Improve print styles.
- Add real form handling in a future JavaScript project.

Do not implement these optional challenges today.

## Helpful Links

- [MDN: HTML landmarks](https://developer.mozilla.org/en-US/blog/aria-accessibility-html-landmark-roles/)
- [MDN: Navigation section element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox)
- [MDN: CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [MDN: details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [MDN: Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)

## Solution Guidance

Try to finish the starter version before opening the solution. The solution is one reference implementation, not the only correct answer. Your page should be semantic, accessible, responsive, honest about limitations, and readable without JavaScript.
