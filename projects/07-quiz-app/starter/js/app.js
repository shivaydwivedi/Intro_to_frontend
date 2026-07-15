const questions = [
  {
    question: "Which element should wrap the main unique content of a page?",
    choices: ["header", "main", "aside", "footer"],
    correctAnswer: 1,
    explanation: "The main element identifies the primary content of the page.",
    category: "Semantic HTML"
  },
  {
    question: "What should a visible label do for a form input?",
    choices: ["Decorate the page", "Describe the input's purpose", "Replace validation", "Hide helper text"],
    correctAnswer: 1,
    explanation: "A label gives the input an accessible name and helps everyone understand what to enter.",
    category: "Accessibility"
  },
  {
    question: "Which selector targets every paragraph inside an article?",
    choices: ["article p", "article + p", ".article", "#article"],
    correctAnswer: 0,
    explanation: "The descendant selector article p targets paragraph elements inside an article.",
    category: "CSS Selectors"
  }
];

// TODO: Add the remaining questions until the quiz has exactly 10.
// TODO: Select the screen containers, buttons, progress elements, answer form, messages, and review list.
// TODO: Add state variables for current question index, score, submitted answers, and feedback mode.
// TODO: Render the start screen first.
// TODO: Render the active question from the questions array.
// TODO: Validate that one radio answer is selected before scoring.
// TODO: Record each submitted answer once and prevent double scoring.
// TODO: Render feedback, results, category summaries, review mode, and restart behavior.
// TODO: Register event listeners and call the initial render function.
