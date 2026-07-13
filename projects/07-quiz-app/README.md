# Project 07: Quiz App

Build an accessible multiple-choice frontend knowledge quiz with vanilla JavaScript, semantic HTML, and responsive CSS.

## Overview

This project introduces arrays, objects, application state, rendering changing content, answer validation, scoring, progress, feedback, results, review mode, and restart behavior. You will build a complete interactive quiz without frameworks, dependencies, browser storage, external APIs, or build tools.

## Learning Objectives

- Store question data in an array of objects.
- Track application state with variables.
- Select DOM elements.
- Render changing screens.
- Use radio buttons, fieldsets, and legends.
- Validate that an answer was selected.
- Score submitted answers exactly once.
- Display progress and feedback.
- Calculate final score and percentage.
- Build an answer review screen.
- Restart an application cleanly.

## Prerequisites

- Semantic HTML basics
- CSS layout fundamentals
- JavaScript variables, arrays, objects, functions, and conditionals
- Basic DOM selection and event listeners

## Feature Requirements

- Start screen with quiz description and Start Quiz button
- 10 beginner-level frontend questions
- Four answer choices per question
- One correct answer per question
- Question category and progress display
- Native `<progress>` element
- Answer validation message
- Correct/incorrect feedback and explanation
- Final results with score, percentage, and performance message
- Category-level summary
- Answer review screen
- Restart behavior

## Application State

The solution uses these distinct screens:

- Start screen
- Active question
- Answer feedback
- Final results
- Answer review

State variables track the current question index, score, whether feedback is being shown, and the user's recorded answers.

## Question Object Structure

Each question object uses this shape:

```js
{
  question: "Question text",
  choices: ["Choice A", "Choice B", "Choice C", "Choice D"],
  correctAnswer: 0,
  explanation: "Short explanation.",
  category: "Semantic HTML"
}
```

`correctAnswer` is a zero-based index that points to the correct item in `choices`.

## Scoring Rules

- Each question is worth one point.
- A submitted answer is recorded once.
- Correct answers increase the score by one.
- A question cannot be scored twice.
- The final percentage is `score / 10 * 100`.

## Progress Behavior

The app shows text such as `Question 3 of 10` and a native progress bar. Progress updates only when the displayed question changes.

## Feedback Behavior

After submission, the app disables the answer choices, shows whether the selected answer was correct, displays the correct answer when needed, and provides a concise explanation. It does not automatically advance.

## Results and Review Requirements

The results screen shows the final score, percentage, encouraging message, and category summary. Review mode lists every question, the user's answer, the correct answer, correctness, and explanation.

## Restart Behavior

Restart returns to the start screen, resets score, question index, recorded answers, validation messages, feedback, and progress. The next attempt should behave like a fresh quiz.

## Accessibility Expectations

- Use a descriptive page title and `lang="en"`.
- Use semantic landmarks and one clear `h1`.
- Use native buttons and radio inputs.
- Use `fieldset` and `legend` for answers.
- Associate labels with radio choices.
- Provide visible focus styles.
- Do not rely on color alone for feedback.
- Use polite status messages for feedback and validation.
- Move focus deliberately when screens change.
- Avoid unnecessary ARIA and excessive announcements.

## Suggested Workflow

1. Open `starter/index.html` and review the screen containers.
2. Read the question data shape in `starter/js/app.js`.
3. Add state variables for question index, score, and recorded answers.
4. Render the start screen.
5. Render one question from the data array.
6. Validate selected answers.
7. Record answers and update score.
8. Render feedback and progress.
9. Render results and category summaries.
10. Add review and restart behavior.

## Opening the Project

To work on the challenge, open:

```text
projects/07-quiz-app/starter/index.html
```

To review the completed reference, open:

```text
projects/07-quiz-app/solution/index.html
```

## Project Structure

```text
projects/07-quiz-app/
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

## Manual Testing Checklist

- The first question is hidden until Start Quiz is selected.
- Submitting with no selected answer shows validation.
- Correct answers increase the score once.
- Incorrect answers show the correct answer and explanation.
- Next Question advances one question.
- Finish Quiz shows final results after question 10.
- Category summaries add up to 10 questions.
- Review Answers shows all questions.
- Return to Results works.
- Restart clears prior state.

## Scoring and Edge-Case Checklist

- Complete all questions correctly and verify 10 out of 10.
- Complete all questions incorrectly and verify 0 out of 10.
- Try to submit the same question twice.
- Restart midway through a quiz.
- Start a second attempt and confirm no previous answers leak.
- Confirm unanswered review entries would show `Not answered`.

## Keyboard and Responsive Testing Checklist

- Start, submit, next, finish, review, return, and restart can be reached by keyboard.
- Radio choices can be selected with keyboard input.
- Focus visibly moves to the active screen heading.
- At 320px, answer choices and buttons do not overflow.
- At 200% zoom, text remains readable and controls remain usable.

## Bonus Challenges

- Randomize question order.
- Randomize answer order.
- Add difficulty levels.
- Store best score with `localStorage`.
- Add a timer.
- Import question sets from JSON.
- Create automated tests.

Do not implement these optional challenges today.

## Helpful Links

- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Object basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_basics)
- [MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: fieldset element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset)
- [MDN: input radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio)
- [MDN: progress element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress)
- [MDN: textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

## Solution Guidance

Try the starter before opening the solution. A strong solution should keep state and the displayed UI synchronized, avoid double scoring, and make every state change understandable.
