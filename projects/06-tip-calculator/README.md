# Project 06: Tip Calculator

Build an accessible tip calculator with vanilla JavaScript, semantic HTML, and responsive CSS.

## Overview

This project teaches form values, numeric validation, calculation functions, currency formatting, and DOM updates. You will build a focused calculator without frameworks, dependencies, browser storage, network requests, or a backend.

## Final Result

The completed app calculates a tip, total bill, bill per person, tip per person, and total per person. It supports INR, USD, and EUR display formatting, preset or custom tip percentages, an optional per-person rounding feature, and clear validation feedback.

## Learning Objectives

- Build accessible forms with labels, fieldsets, and legends.
- Read values from form controls.
- Convert strings to numbers safely.
- Validate required and optional numeric inputs.
- Write calculation functions.
- Handle form submission and button events.
- Format money with `Intl.NumberFormat`.
- Update result elements with `textContent`.
- Keep stale results from appearing after invalid input.
- Separate HTML, CSS, and JavaScript responsibilities.

## Prerequisites

- Basic HTML forms
- Basic CSS layout
- JavaScript variables, functions, and conditionals
- Browser developer tools

## Feature Requirements

- Application heading and concise instructions
- Bill amount input
- Preset tip radio buttons: 5%, 10%, 15%, and 20%
- Optional custom tip percentage input
- Number-of-people input
- Currency selector for INR, USD, and EUR
- Round per-person total checkbox
- Calculate and Reset buttons
- Field-specific validation messages
- Results section and calculation explanation

## Default State

- Currency: INR
- Bill amount: empty
- Selected tip: 10%
- Custom tip: empty
- Number of people: 1
- Round per-person total: off

## Formulas Used

- Tip amount = bill amount x tip percentage / 100
- Total amount = bill amount + tip amount
- Bill per person = bill amount / number of people
- Tip per person = tip amount / number of people
- Total per person = total amount / number of people

## Preset and Custom Tip Behavior

Only one preset tip can be selected at a time. Entering a valid custom tip makes the custom percentage active. Clearing the custom tip restores the currently selected preset. Invalid custom tip values prevent calculation and do not silently clamp the percentage.

## Validation Rules

- Bill amount is required, must be greater than zero, must be finite, must be no more than `10000000`, and may use up to two decimal places.
- Number of people is required, must be a positive whole number from `1` to `100`.
- Custom tip is optional, but when provided it must be between `0` and `100` with up to two decimal places.
- Invalid submissions keep the user's values, show field messages, update the validation summary, and hide stale results.

## Rounding Explanation

When Round per-person total is enabled, the app rounds the total per person upward with `Math.ceil`. It then multiplies the rounded per-person amount by the number of people to show the adjusted group total. The difference between the adjusted group total and the original total is labeled as an additional rounding amount, not as extra tip.

## Currency Display Limitation

The currency selector changes formatting only. It does not convert exchange rates. For example, changing from INR to USD keeps the same numeric bill amount and formats that number as USD.

## Accessibility Requirements

- Use a descriptive page title and `lang="en"`.
- Use a semantic `main` landmark.
- Keep one clear `h1` and a logical heading order.
- Use a real `form`.
- Use `fieldset` and `legend` for tip choices.
- Connect labels, help text, and validation messages.
- Update `aria-invalid` when validation changes.
- Use native radio buttons, checkbox, select, inputs, and buttons.
- Provide visible focus styles.
- Use a polite status region for calculation updates.
- Avoid unnecessary ARIA and focus stealing after successful calculation.

## Suggested Workflow

1. Open `starter/index.html` and review the form controls.
2. Read the TODO comments in `starter/js/app.js`.
3. Select the form, inputs, buttons, result elements, and messages.
4. Write helpers to parse and validate numbers.
5. Decide whether the active tip comes from a preset or the custom input.
6. Write calculation functions.
7. Format money using the selected currency.
8. Render validation messages and results.
9. Add submit, reset, preset, custom-tip, and currency event listeners.
10. Test the examples and edge cases before comparing with the solution.

## Opening the Project

To work on the challenge, open:

```text
projects/06-tip-calculator/starter/index.html
```

To review the completed reference, open:

```text
projects/06-tip-calculator/solution/index.html
```

## Project Structure

```text
projects/06-tip-calculator/
+-- README.md
+-- starter/
|   +-- index.html
|   +-- css/
|   |   +-- style.css
|   +-- js/
|       +-- app.js
+-- solution/
    +-- index.html
    +-- css/
    |   +-- style.css
    +-- js/
        +-- app.js
```

`preview.png` may be added after a real screenshot of the completed solution is captured.

## Functional Testing Checklist

- INR 1000, 10%, 2 people shows tip INR 100, total INR 1100, and total per person INR 550.
- USD 80, 15%, 3 people shows tip USD 12, total USD 92, and total per person about USD 30.67.
- EUR 50, 0%, 1 person shows tip EUR 0 and total EUR 50.
- INR 100, 10%, 3 people with rounding enabled shows original total INR 110, rounded per person INR 37, adjusted group total INR 111, and rounding amount INR 1.
- Changing currency after calculation updates formatting only.
- Reset restores all defaults and clears results.

## Calculation Examples

Example 1:

- Bill: INR 1,000
- Tip: 10%
- People: 2
- Tip: INR 100
- Total: INR 1,100
- Total per person: INR 550

Example 2:

- Bill: USD 80
- Tip: 15%
- People: 3
- Tip: USD 12
- Total: USD 92
- Total per person before optional rounding: approximately USD 30.67

## Edge-Case Checklist

- Empty bill
- Zero or negative bill
- Bill with more than two decimal places
- People equal to zero
- Negative people
- Decimal people
- People above 100
- Custom tip below zero
- Custom tip above 100
- Custom tip with more than two decimal places
- Empty optional custom tip
- Switching between preset and custom tip
- Clearing custom tip
- Stale results after invalid submission

## Responsive and Keyboard Testing Checklist

- All controls can be reached with Tab.
- Radio buttons and the checkbox work with keyboard input.
- Buttons can be activated from the keyboard.
- Focus states are visible.
- At 320px, the form and results stack without horizontal scrolling.
- Around 768px and wider, the form and results use available space cleanly.
- Text remains readable at 200% zoom.

## Bonus Challenges

- Split the bill using unequal shares.
- Remember preferences with `localStorage`.
- Support additional currencies.
- Copy the summary.
- Add service-quality labels.
- Add automated unit tests.

Do not implement these optional challenges today.

## Helpful Links

- [MDN: form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [MDN: fieldset element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset)
- [MDN: input number](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- [MDN: Event preventDefault](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
- [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [MDN: Math.ceil](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil)

## Solution Guidance

Try the starter before opening the solution. The finished app should validate inputs clearly, keep calculations numeric until display time, and avoid showing stale results after invalid input.
