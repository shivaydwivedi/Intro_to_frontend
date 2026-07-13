# Project 05: Counter App

Build an accessible counter app with vanilla JavaScript, semantic HTML, and responsive CSS.

## Overview

This project introduces JavaScript state, DOM selection, event listeners, text updates, input validation, and disabled button states. You will build a small interactive app without frameworks, build tools, browser storage, or external dependencies.

## Final Result

The completed app lets a user increase, decrease, and reset a count within active minimum and maximum limits. It also lets the user change the step size and apply new limits while preserving valid state and explaining what happened.

## Learning Objectives

- Link an external JavaScript file with `defer`.
- Select DOM elements.
- Store changing app state in variables.
- Write helper functions and event handlers.
- Respond to click and input events.
- Update text with `textContent`.
- Use conditions to prevent invalid state changes.
- Validate number inputs with JavaScript and native attributes.
- Use native buttons for keyboard-accessible controls.
- Keep HTML, CSS, and JavaScript responsibilities separate.

## Prerequisites

- Basic HTML and CSS
- How to open an HTML file in a browser
- Basic JavaScript variables and functions
- Basic understanding of browser developer tools

## Required Features

- Application title and short description
- Current count display
- Decrease, Reset, and Increase buttons
- Step-size number input
- Minimum-bound number input
- Maximum-bound number input
- Apply limits button
- Status message
- Concise usage instructions

## Default State

- Count: `0`
- Step size: `1`
- Minimum: `-10`
- Maximum: `10`

## Behavior Rules

- Increase adds the active step only when the full step stays within the maximum.
- Decrease subtracts the active step only when the full step stays within the minimum.
- Reset returns to `0` when zero is inside the active range.
- If zero is outside the active range, reset moves to the nearest valid boundary.
- Increase and Decrease are disabled when the next full step would cross a boundary.
- Boundary, normal, and validation states are explained through visible text.
- Invalid input never changes the last valid state.

## Step-Size Validation

The step input should:

- Accept positive whole numbers only.
- Reject empty, zero, negative, decimal, and nonnumeric values.
- Preserve the last valid step when invalid text is entered.
- Show a clear validation message near the input.

## Limit Validation

The limit inputs should:

- Accept whole numbers.
- Require minimum to be strictly less than maximum.
- Reject empty, decimal, nonnumeric, equal, and reversed limits.
- Preserve the last valid limits when validation fails.
- Clamp the current count into the new range when valid limits are applied.
- Report any clamping through the status message.

## Accessibility Requirements

- Use a descriptive page title and `lang="en"`.
- Use semantic landmarks and a logical heading order.
- Associate every input with a visible label.
- Connect helper and validation text with `aria-describedby`.
- Use native buttons and real `disabled` states.
- Provide clear visible focus styles.
- Do not rely on color alone for state.
- Use a polite status region for meaningful updates.
- Avoid focus stealing and unnecessary ARIA.
- Keep controls large enough for touch.

## Suggested Workflow

1. Open `starter/index.html` and review the interface.
2. Read the TODO comments in `starter/js/app.js`.
3. Select the required DOM elements.
4. Add state variables for count, step, minimum, and maximum.
5. Write validation helpers for whole numbers and positive whole numbers.
6. Create a render function that updates count text, labels, messages, and disabled buttons.
7. Add event listeners for Increase, Decrease, Reset, step changes, and Apply limits.
8. Test normal changes, invalid inputs, boundaries, and reset behavior.
9. Compare with the `solution/` folder only after attempting the challenge.

## State and DOM Updates

Think of the JavaScript as two connected parts:

- State is the app memory: the current count, step, minimum, and maximum.
- The DOM is what the user sees: the number, labels, messages, and button states.

When the user does something, update the state first. Then call one render function to synchronize the page with the latest valid state.

## Opening the Project

To work on the challenge, open:

```text
projects/05-counter-app/starter/index.html
```

To review the completed reference, open:

```text
projects/05-counter-app/solution/index.html
```

## Project Structure

```text
projects/05-counter-app/
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

## Manual Functional Testing Checklist

- The page loads without console errors.
- The default count is `0`, step is `1`, minimum is `-10`, and maximum is `10`.
- Increase and Decrease change the count by the active step.
- Reset returns to zero when zero is in range.
- Reset moves to the nearest boundary when zero is outside the range.
- Increase and Decrease stop before crossing limits.
- Disabled buttons use the actual `disabled` state.
- Boundary and normal status messages are understandable.

## Keyboard and Responsive Testing Checklist

- All controls can be reached with Tab.
- Buttons can be activated with keyboard controls.
- Focus states are visible.
- At 320px, controls stack or wrap without horizontal scrolling.
- Around 768px, settings and controls use available space cleanly.
- Text remains readable at 200% zoom.

## Edge-Case Checklist

- Empty step input is rejected.
- Step value `0` is rejected.
- Negative step values are rejected.
- Decimal step values are rejected.
- Empty limit inputs are rejected.
- Equal limits are rejected.
- Reversed limits are rejected.
- Decimal limits are rejected.
- Nonnumeric input is rejected.
- Applying valid limits clamps the count when needed.
- Button disabled states update after count, step, or limit changes.

## Bonus Challenges

- Add keyboard shortcuts.
- Add count history.
- Add custom presets.
- Persist settings with browser storage.
- Add undo behavior.
- Add subtle transitions that respect reduced-motion preferences.

Do not implement these optional challenges today.

## Helpful Links

- [MDN: script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
- [MDN: Document querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
- [MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [MDN: button element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- [MDN: input number](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- [MDN: aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)

## Solution Guidance

Try the starter first. The solution is one readable reference implementation, not the only correct answer. Your app should keep valid state, update the interface consistently, and explain invalid input clearly.
