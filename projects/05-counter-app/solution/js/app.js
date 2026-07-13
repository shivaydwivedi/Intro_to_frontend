const countValue = document.querySelector("#count-value");
const countState = document.querySelector("#count-state");
const countPanel = document.querySelector("#count-panel");
const decreaseButton = document.querySelector("#decrease-button");
const resetButton = document.querySelector("#reset-button");
const increaseButton = document.querySelector("#increase-button");
const stepInput = document.querySelector("#step-input");
const minimumInput = document.querySelector("#minimum-input");
const maximumInput = document.querySelector("#maximum-input");
const applyLimitsButton = document.querySelector("#apply-limits-button");
const stepMessage = document.querySelector("#step-message");
const limitMessage = document.querySelector("#limit-message");
const statusMessage = document.querySelector("#status-message");

let count = 0;
let step = 1;
let minimum = -10;
let maximum = 10;
let currentStatus = "Count is ready. Current range is -10 to 10.";
let statusIsWarning = false;

function isWholeNumber(value) {
  return value !== "" && Number.isInteger(Number(value));
}

function isPositiveWholeNumber(value) {
  return isWholeNumber(value) && Number(value) > 0;
}

function clamp(value, lowerLimit, upperLimit) {
  return Math.min(Math.max(value, lowerLimit), upperLimit);
}

function getCountStateText() {
  if (count === minimum) {
    return "Minimum reached";
  }

  if (count === maximum) {
    return "Maximum reached";
  }

  if (count > 0) {
    return "Positive value";
  }

  if (count < 0) {
    return "Negative value";
  }

  return "Zero";
}

function updateCountPanelState() {
  countPanel.classList.remove("is-positive", "is-negative", "is-minimum", "is-maximum");

  if (count === minimum) {
    countPanel.classList.add("is-minimum");
  } else if (count === maximum) {
    countPanel.classList.add("is-maximum");
  } else if (count > 0) {
    countPanel.classList.add("is-positive");
  } else if (count < 0) {
    countPanel.classList.add("is-negative");
  }
}

function render() {
  countValue.textContent = String(count);
  countState.textContent = getCountStateText();
  decreaseButton.disabled = count - step < minimum;
  increaseButton.disabled = count + step > maximum;
  statusMessage.textContent = currentStatus;
  statusMessage.classList.toggle("is-warning", statusIsWarning);
  updateCountPanelState();
}

function setStatus(message, isWarning = false) {
  currentStatus = message;
  statusIsWarning = isWarning;
}

function showStepMessage(message, isError) {
  stepMessage.textContent = message;
  stepMessage.classList.toggle("is-error", isError);
  stepMessage.classList.toggle("is-success", !isError && message !== "");
  stepInput.setAttribute("aria-invalid", String(isError));
}

function showLimitMessage(message, isError) {
  limitMessage.textContent = message;
  limitMessage.classList.toggle("is-error", isError);
  limitMessage.classList.toggle("is-success", !isError && message !== "");
  minimumInput.setAttribute("aria-invalid", String(isError));
  maximumInput.setAttribute("aria-invalid", String(isError));
}

function handleStepChange() {
  const nextStepValue = stepInput.value.trim();

  if (!isPositiveWholeNumber(nextStepValue)) {
    showStepMessage("Step must be a positive whole number. Last valid step is still " + step + ".", true);
    setStatus("Step was not changed because the value is invalid.", true);
    render();
    return;
  }

  step = Number(nextStepValue);
  showStepMessage("Step updated to " + step + ".", false);
  setStatus("Step updated. Count is still " + count + " within " + minimum + " to " + maximum + ".");
  render();
}

function handleIncrease() {
  if (count + step > maximum) {
    setStatus("Increase is unavailable because the next full step would go above " + maximum + ".", true);
    render();
    return;
  }

  count += step;
  setStatus(count === maximum ? "Maximum reached at " + maximum + "." : "Count increased by " + step + ".");
  render();
}

function handleDecrease() {
  if (count - step < minimum) {
    setStatus("Decrease is unavailable because the next full step would go below " + minimum + ".", true);
    render();
    return;
  }

  count -= step;
  setStatus(count === minimum ? "Minimum reached at " + minimum + "." : "Count decreased by " + step + ".");
  render();
}

function handleReset() {
  const resetValue = clamp(0, minimum, maximum);
  count = resetValue;

  if (resetValue === 0) {
    setStatus("Count reset to zero.");
  } else {
    setStatus("Zero is outside the active range, so count reset to " + resetValue + ".", true);
  }

  render();
}

function handleApplyLimits() {
  const nextMinimumValue = minimumInput.value.trim();
  const nextMaximumValue = maximumInput.value.trim();

  if (!isWholeNumber(nextMinimumValue) || !isWholeNumber(nextMaximumValue)) {
    showLimitMessage("Minimum and maximum must both be whole numbers. Current limits are still " + minimum + " to " + maximum + ".", true);
    setStatus("Limits were not changed because one or both values are invalid.", true);
    render();
    return;
  }

  const nextMinimum = Number(nextMinimumValue);
  const nextMaximum = Number(nextMaximumValue);

  if (nextMinimum >= nextMaximum) {
    showLimitMessage("Minimum must be less than maximum. Current limits are still " + minimum + " to " + maximum + ".", true);
    setStatus("Limits were not changed because the range is not valid.", true);
    render();
    return;
  }

  minimum = nextMinimum;
  maximum = nextMaximum;

  const previousCount = count;
  count = clamp(count, minimum, maximum);

  if (count !== previousCount) {
    setStatus("Limits applied. Count was clamped from " + previousCount + " to " + count + ".");
  } else {
    setStatus("Limits applied. Count remains " + count + " within " + minimum + " to " + maximum + ".");
  }

  showLimitMessage("Active range is now " + minimum + " to " + maximum + ".", false);
  render();
}

increaseButton.addEventListener("click", handleIncrease);
decreaseButton.addEventListener("click", handleDecrease);
resetButton.addEventListener("click", handleReset);
stepInput.addEventListener("input", handleStepChange);
applyLimitsButton.addEventListener("click", handleApplyLimits);

showStepMessage("", false);
showLimitMessage("", false);
render();
