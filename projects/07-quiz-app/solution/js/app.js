const questions = [
  {
    question: "Which element should wrap the main unique content of a page?",
    choices: ["header", "main", "aside", "footer"],
    correctAnswer: 1,
    explanation: "The main element identifies the primary content that is unique to the page.",
    category: "Semantic HTML"
  },
  {
    question: "What should a visible label do for a form input?",
    choices: ["Decorate the page", "Describe the input's purpose", "Replace validation", "Hide helper text"],
    correctAnswer: 1,
    explanation: "A label gives the input an accessible name and helps users understand what information belongs there.",
    category: "Accessibility"
  },
  {
    question: "Which selector targets every paragraph inside an article?",
    choices: ["article p", "article + p", ".article", "#article"],
    correctAnswer: 0,
    explanation: "The descendant selector article p targets paragraph elements that are inside an article element.",
    category: "CSS Selectors"
  },
  {
    question: "In the box model, what does padding do?",
    choices: ["Adds space outside the border", "Adds space between content and border", "Changes the document title", "Creates a new flex row"],
    correctAnswer: 1,
    explanation: "Padding creates space between an element's content and its border.",
    category: "Box Model"
  },
  {
    question: "Which Flexbox property places items on the main axis?",
    choices: ["align-items", "justify-content", "grid-template-columns", "text-decoration"],
    correctAnswer: 1,
    explanation: "justify-content distributes flex items along the main axis.",
    category: "Flexbox"
  },
  {
    question: "Which CSS feature is designed for two-dimensional rows and columns?",
    choices: ["CSS Grid", "inline styles", "border-radius", "font-weight"],
    correctAnswer: 0,
    explanation: "CSS Grid is designed for layout across rows and columns.",
    category: "CSS Grid"
  },
  {
    question: "What is a common mobile-first CSS approach?",
    choices: ["Write small-screen styles first", "Disable the viewport meta tag", "Use fixed widths everywhere", "Hide all navigation links"],
    correctAnswer: 0,
    explanation: "Mobile-first CSS starts with small-screen styles and adds larger layouts with media queries.",
    category: "Responsive Design"
  },
  {
    question: "Which keyword should you prefer for a variable that will not be reassigned?",
    choices: ["var", "const", "switch", "await"],
    correctAnswer: 1,
    explanation: "const communicates that the variable binding should not be reassigned.",
    category: "JavaScript Variables"
  },
  {
    question: "Which method registers a click handler without inline JavaScript?",
    choices: ["addEventListener", "document.write", "alert", "innerHTML"],
    correctAnswer: 0,
    explanation: "addEventListener registers event handlers while keeping behavior in JavaScript files.",
    category: "DOM Events"
  },
  {
    question: "Which property is safest for updating plain text in the DOM?",
    choices: ["textContent", "innerHTML", "document.write", "eval"],
    correctAnswer: 0,
    explanation: "textContent updates text without parsing it as HTML.",
    category: "Safe DOM Updates"
  }
];

const startScreen = document.querySelector("#start-screen");
const questionScreen = document.querySelector("#question-screen");
const resultsScreen = document.querySelector("#results-screen");
const reviewScreen = document.querySelector("#review-screen");
const screenHeading = document.querySelector("#screen-heading");
const screenKicker = document.querySelector("#screen-kicker");
const screenTitle = document.querySelector("#screen-title");
const startButton = document.querySelector("#start-button");
const answerForm = document.querySelector("#answer-form");
const answerFieldset = document.querySelector("#answer-fieldset");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const scoreText = document.querySelector("#score-text");
const categoryLabel = document.querySelector("#category-label");
const questionText = document.querySelector("#question-text");
const choiceList = document.querySelector("#choice-list");
const validationMessage = document.querySelector("#validation-message");
const submitButton = document.querySelector("#submit-button");
const nextButton = document.querySelector("#next-button");
const feedbackPanel = document.querySelector("#feedback-panel");
const feedbackMessage = document.querySelector("#feedback-message");
const correctAnswerMessage = document.querySelector("#correct-answer-message");
const explanationMessage = document.querySelector("#explanation-message");
const finalScore = document.querySelector("#final-score");
const performanceMessage = document.querySelector("#performance-message");
const categorySummary = document.querySelector("#category-summary");
const reviewButton = document.querySelector("#review-button");
const restartButton = document.querySelector("#restart-button");
const reviewList = document.querySelector("#review-list");
const returnResultsButton = document.querySelector("#return-results-button");
const restartReviewButton = document.querySelector("#restart-review-button");
const statusMessage = document.querySelector("#status-message");

let currentQuestionIndex = 0;
let score = 0;
let recordedAnswers = [];
let showingFeedback = false;

function hideAllScreens() {
  startScreen.hidden = true;
  questionScreen.hidden = true;
  resultsScreen.hidden = true;
  reviewScreen.hidden = true;
}

function focusScreenHeading() {
  screenHeading.focus();
}

function setScreenHeading(kicker, title) {
  screenKicker.textContent = kicker;
  screenTitle.textContent = title;
}

function renderStartScreen() {
  hideAllScreens();
  startScreen.hidden = false;
  setScreenHeading("Start", "Ready to test your frontend basics?");
  statusMessage.textContent = "Quiz has not started yet.";
  focusScreenHeading();
}

function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

function createChoice(question, choice, index) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  const text = document.createElement("span");

  input.type = "radio";
  input.name = "answer";
  input.value = String(index);
  input.id = "choice-" + index;
  text.textContent = choice;
  label.setAttribute("for", input.id);
  label.append(input, text);
  return label;
}

function renderQuestion() {
  const question = getCurrentQuestion();
  hideAllScreens();
  questionScreen.hidden = false;
  showingFeedback = false;

  setScreenHeading("Question", "Choose the best answer.");
  progressText.textContent = "Question " + (currentQuestionIndex + 1) + " of " + questions.length;
  progressBar.value = currentQuestionIndex + 1;
  progressBar.max = questions.length;
  progressBar.textContent = progressText.textContent;
  scoreText.textContent = "Score: " + score;
  categoryLabel.textContent = question.category;
  questionText.textContent = question.question;
  validationMessage.textContent = "";
  choiceList.textContent = "";

  question.choices.forEach((choice, index) => {
    choiceList.append(createChoice(question, choice, index));
  });

  answerFieldset.disabled = false;
  submitButton.hidden = false;
  submitButton.disabled = false;
  nextButton.hidden = true;
  nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question";
  feedbackPanel.hidden = true;
  feedbackPanel.classList.remove("is-correct", "is-incorrect");
  statusMessage.textContent = "Question " + (currentQuestionIndex + 1) + " is ready.";
  focusScreenHeading();
}

function getSelectedAnswerIndex() {
  const selectedAnswer = answerForm.querySelector("input[name='answer']:checked");
  return selectedAnswer ? Number(selectedAnswer.value) : null;
}

function recordAnswer(selectedIndex) {
  const question = getCurrentQuestion();
  const isCorrect = selectedIndex === question.correctAnswer;

  recordedAnswers[currentQuestionIndex] = {
    selectedIndex,
    isCorrect
  };

  if (isCorrect) {
    score += 1;
  }

  return isCorrect;
}

function markChoices(selectedIndex) {
  const question = getCurrentQuestion();
  const labels = choiceList.querySelectorAll("label");

  labels.forEach((label, index) => {
    if (index === question.correctAnswer) {
      label.classList.add("is-correct");
    }

    if (index === selectedIndex && index !== question.correctAnswer) {
      label.classList.add("is-incorrect");
    }
  });
}

function renderFeedback(selectedIndex, isCorrect) {
  const question = getCurrentQuestion();

  showingFeedback = true;
  answerFieldset.disabled = true;
  submitButton.hidden = true;
  nextButton.hidden = false;
  feedbackPanel.hidden = false;
  feedbackPanel.classList.toggle("is-correct", isCorrect);
  feedbackPanel.classList.toggle("is-incorrect", !isCorrect);
  feedbackMessage.textContent = isCorrect ? "Correct. Nice work." : "Incorrect. Review the correct answer below.";
  correctAnswerMessage.textContent = isCorrect ? "Your answer was correct." : "Correct answer: " + question.choices[question.correctAnswer];
  explanationMessage.textContent = question.explanation;
  scoreText.textContent = "Score: " + score;
  statusMessage.textContent = isCorrect ? "Answer submitted: correct." : "Answer submitted: incorrect.";
  markChoices(selectedIndex);
}

function handleSubmitAnswer(event) {
  event.preventDefault();

  if (showingFeedback) {
    return;
  }

  const selectedIndex = getSelectedAnswerIndex();

  if (selectedIndex === null) {
    validationMessage.textContent = "Choose an answer before submitting.";
    statusMessage.textContent = "Answer not submitted. Choose one option first.";
    return;
  }

  validationMessage.textContent = "";
  const isCorrect = recordAnswer(selectedIndex);
  renderFeedback(selectedIndex, isCorrect);
}

function handleNextQuestion() {
  if (currentQuestionIndex === questions.length - 1) {
    renderResults();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
}

function getPerformanceMessage(percentageScore) {
  if (percentageScore === 100) {
    return "Perfect score - excellent work!";
  }

  if (percentageScore >= 80) {
    return "Great job - you have a strong grasp of the fundamentals.";
  }

  if (percentageScore >= 50) {
    return "Nice work - your frontend foundations are growing.";
  }

  return "Good start - review the explanations and try again.";
}

function getCategoryResults() {
  const results = {};

  questions.forEach((question, index) => {
    if (!results[question.category]) {
      results[question.category] = { correct: 0, total: 0 };
    }

    results[question.category].total += 1;

    if (recordedAnswers[index] && recordedAnswers[index].isCorrect) {
      results[question.category].correct += 1;
    }
  });

  return results;
}

function renderCategorySummary() {
  const results = getCategoryResults();
  categorySummary.textContent = "";

  Object.keys(results).forEach((category) => {
    const item = document.createElement("li");
    const result = results[category];
    item.textContent = category + ": " + result.correct + " of " + result.total + " correct.";
    categorySummary.append(item);
  });
}

function renderResults() {
  const percentageScore = Math.round(score / questions.length * 100);

  hideAllScreens();
  resultsScreen.hidden = false;
  setScreenHeading("Results", "Quiz complete.");
  finalScore.textContent = "Score: " + score + " of " + questions.length + " (" + percentageScore + "%)";
  performanceMessage.textContent = getPerformanceMessage(percentageScore);
  renderCategorySummary();
  statusMessage.textContent = "Quiz complete. Final score is " + score + " of " + questions.length + ".";
  focusScreenHeading();
}

function getReviewAnswerText(answer, question) {
  if (!answer) {
    return "Not answered";
  }

  return question.choices[answer.selectedIndex];
}

function createReviewCard(question, index) {
  const answer = recordedAnswers[index];
  const card = document.createElement("article");
  const title = document.createElement("h3");
  const status = document.createElement("p");
  const userAnswer = document.createElement("p");
  const correctAnswer = document.createElement("p");
  const explanation = document.createElement("p");

  card.className = "review-card";
  card.classList.add(answer && answer.isCorrect ? "is-correct" : "is-incorrect");
  title.textContent = "Question " + (index + 1) + ": " + question.question;
  status.textContent = answer && answer.isCorrect ? "Status: Correct" : "Status: Incorrect";
  userAnswer.textContent = "Your answer: " + getReviewAnswerText(answer, question);
  correctAnswer.textContent = "Correct answer: " + question.choices[question.correctAnswer];
  explanation.textContent = "Explanation: " + question.explanation;

  card.append(title, status, userAnswer, correctAnswer, explanation);
  return card;
}

function renderReview() {
  hideAllScreens();
  reviewScreen.hidden = false;
  setScreenHeading("Review", "Review every answer.");
  reviewList.textContent = "";

  questions.forEach((question, index) => {
    reviewList.append(createReviewCard(question, index));
  });

  statusMessage.textContent = "Reviewing all answers.";
  focusScreenHeading();
}

function clearCompletedAttemptDisplay() {
  finalScore.textContent = "Score: 0 of " + questions.length;
  performanceMessage.textContent = "";
  categorySummary.textContent = "";
  reviewList.textContent = "";
  progressText.textContent = "Question 1 of " + questions.length;
  progressBar.value = 1;
  progressBar.max = questions.length;
  progressBar.textContent = progressText.textContent;
  scoreText.textContent = "Score: 0";
  feedbackMessage.textContent = "";
  correctAnswerMessage.textContent = "";
  explanationMessage.textContent = "";
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  recordedAnswers = [];
  showingFeedback = false;
  validationMessage.textContent = "";
  clearCompletedAttemptDisplay();
  renderStartScreen();
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  recordedAnswers = [];
  showingFeedback = false;
  renderQuestion();
}

startButton.addEventListener("click", startQuiz);
answerForm.addEventListener("submit", handleSubmitAnswer);
nextButton.addEventListener("click", handleNextQuestion);
reviewButton.addEventListener("click", renderReview);
returnResultsButton.addEventListener("click", renderResults);
restartButton.addEventListener("click", restartQuiz);
restartReviewButton.addEventListener("click", restartQuiz);

renderStartScreen();
