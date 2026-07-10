# Accessibility Checklist

Use this checklist for every project before marking it Complete.

## Structure

- Use one clear `h1` per page.
- Keep headings in a logical order.
- Use semantic elements such as `header`, `main`, `section`, `article`, `nav`, and `footer` when appropriate.
- Use lists, buttons, links, labels, and form controls for their intended purposes.

## Keyboard Support

- All interactive elements can be reached with the keyboard.
- Focus order follows the visual layout.
- Custom interactions support expected keys such as Enter, Space, Escape, or arrow keys when applicable.
- No keyboard trap is introduced.

## Focus and Visual States

- Focus states are clearly visible.
- Hover, focus, active, disabled, success, and error states are distinguishable.
- Important state is not communicated by color alone.

## Text and Media

- Text has sufficient contrast against its background.
- Images that communicate information have useful `alt` text.
- Decorative images use empty `alt=""`.
- Link text describes the destination or action.

## Forms

- Every input has a visible label or an accessible name.
- Error messages explain how to fix the issue.
- Required fields are clearly identified.
- Validation does not rely only on color.

## Motion

- Animations and transitions are subtle.
- Motion respects `prefers-reduced-motion`.
- Essential information is not available only through animation.

## Responsive Behavior

- Content remains readable on small screens.
- Controls are large enough to use comfortably.
- Text does not overlap or become clipped.
- Horizontal scrolling is avoided unless it is intentional for a specific component.
