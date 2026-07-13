const form = document.querySelector("#tip-form");
const currencyInput = document.querySelector("#currency-input");
const billInput = document.querySelector("#bill-input");
const customTipInput = document.querySelector("#custom-tip-input");
const peopleInput = document.querySelector("#people-input");
const roundInput = document.querySelector("#round-input");
const tipRadios = document.querySelectorAll("input[name='tip']");
const billError = document.querySelector("#bill-error");
const customTipError = document.querySelector("#custom-tip-error");
const peopleError = document.querySelector("#people-error");
const validationSummary = document.querySelector("#validation-summary");
const statusMessage = document.querySelector("#status-message");
const selectedTipResult = document.querySelector("#selected-tip-result");
const tipResult = document.querySelector("#tip-result");
const totalResult = document.querySelector("#total-result");
const billPersonResult = document.querySelector("#bill-person-result");
const tipPersonResult = document.querySelector("#tip-person-result");
const totalPersonResult = document.querySelector("#total-person-result");
const roundingResult = document.querySelector("#rounding-result");
const adjustedTotalResult = document.querySelector("#adjusted-total-result");
const explanationResult = document.querySelector("#explanation-result");

const maximumBill = 10000000;
const maximumPeople = 100;
const waitingText = "Waiting for a valid calculation.";
const emptyResult = "-";

let selectedPresetTip = 10;
let lastCalculation = null;

function hasTwoOrFewerDecimals(value) {
  return /^-?\d+(\.\d{1,2})?$/.test(value);
}

function hasWholeNumberFormat(value) {
  return /^\d+$/.test(value);
}

function parseNumber(value) {
  return Number(value.trim());
}

function formatPercent(value) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 }) + "%";
}

function formatMoney(value, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

function getCheckedPresetTip() {
  const checkedRadio = document.querySelector("input[name='tip']:checked");
  return Number(checkedRadio.value);
}

function getActiveTipPercent() {
  const customValue = customTipInput.value.trim();

  if (customValue === "") {
    return selectedPresetTip;
  }

  return parseNumber(customValue);
}

function validateBill() {
  const value = billInput.value.trim();

  if (value === "") {
    return "Enter a bill amount.";
  }

  const numberValue = parseNumber(value);

  if (!Number.isFinite(numberValue)) {
    return "Bill amount must be numeric.";
  }

  if (!hasTwoOrFewerDecimals(value)) {
    return "Bill amount can use at most two decimal places.";
  }

  if (numberValue <= 0) {
    return "Bill amount must be greater than zero.";
  }

  if (numberValue > maximumBill) {
    return "Bill amount must be 10,000,000 or less.";
  }

  return "";
}

function validatePeople() {
  const value = peopleInput.value.trim();

  if (value === "") {
    return "Enter the number of people.";
  }

  if (!hasWholeNumberFormat(value)) {
    return "People must be a whole number.";
  }

  const numberValue = parseNumber(value);

  if (numberValue < 1) {
    return "People must be at least 1.";
  }

  if (numberValue > maximumPeople) {
    return "People must be 100 or less.";
  }

  return "";
}

function validateCustomTip() {
  const value = customTipInput.value.trim();

  if (value === "") {
    return "";
  }

  const numberValue = parseNumber(value);

  if (!Number.isFinite(numberValue)) {
    return "Custom tip must be numeric.";
  }

  if (!hasTwoOrFewerDecimals(value)) {
    return "Custom tip can use at most two decimal places.";
  }

  if (numberValue < 0) {
    return "Custom tip cannot be below 0%.";
  }

  if (numberValue > 100) {
    return "Custom tip cannot be above 100%.";
  }

  return "";
}

function calculateTip(values) {
  const tipAmount = values.bill * values.tipPercent / 100;
  const totalAmount = values.bill + tipAmount;
  const billPerPerson = values.bill / values.people;
  const tipPerPerson = tipAmount / values.people;
  const totalPerPerson = totalAmount / values.people;
  const roundedTotalPerPerson = values.shouldRound ? Math.ceil(totalPerPerson) : totalPerPerson;
  const adjustedGroupTotal = values.shouldRound ? roundedTotalPerPerson * values.people : totalAmount;
  const roundingAmount = values.shouldRound ? adjustedGroupTotal - totalAmount : 0;

  return {
    tipAmount,
    totalAmount,
    billPerPerson,
    tipPerPerson,
    totalPerPerson,
    roundedTotalPerPerson,
    adjustedGroupTotal,
    roundingAmount
  };
}

function setFieldError(input, messageElement, message) {
  input.setAttribute("aria-invalid", String(message !== ""));
  messageElement.textContent = message;
}

function clearValidation() {
  setFieldError(billInput, billError, "");
  setFieldError(customTipInput, customTipError, "");
  setFieldError(peopleInput, peopleError, "");
  validationSummary.textContent = "";
  statusMessage.classList.remove("is-error");
}

function showWaitingResults() {
  selectedTipResult.textContent = formatPercent(selectedPresetTip);
  tipResult.textContent = emptyResult;
  totalResult.textContent = emptyResult;
  billPersonResult.textContent = emptyResult;
  tipPersonResult.textContent = emptyResult;
  totalPersonResult.textContent = emptyResult;
  roundingResult.textContent = emptyResult;
  adjustedTotalResult.textContent = emptyResult;
  explanationResult.textContent = "Enter valid values and calculate to see how the total is split.";
}

function renderResults(values, totals) {
  const currency = values.currency;

  selectedTipResult.textContent = formatPercent(values.tipPercent);
  tipResult.textContent = formatMoney(totals.tipAmount, currency);
  totalResult.textContent = formatMoney(totals.totalAmount, currency);
  billPersonResult.textContent = formatMoney(totals.billPerPerson, currency);
  tipPersonResult.textContent = formatMoney(totals.tipPerPerson, currency);
  totalPersonResult.textContent = formatMoney(totals.roundedTotalPerPerson, currency);
  roundingResult.textContent = values.shouldRound ? formatMoney(totals.roundingAmount, currency) : formatMoney(0, currency);
  adjustedTotalResult.textContent = values.shouldRound ? formatMoney(totals.adjustedGroupTotal, currency) : formatMoney(totals.totalAmount, currency);

  if (values.shouldRound) {
    explanationResult.textContent = "The original total is " + formatMoney(totals.totalAmount, currency) + ". Rounding uses Math.ceil on the per-person total and labels the extra " + formatMoney(totals.roundingAmount, currency) + " as a rounding adjustment.";
  } else {
    explanationResult.textContent = "Tip and total are split evenly across " + values.people + " " + (values.people === 1 ? "person" : "people") + ". Currency changes only affect display formatting.";
  }
}

function showInvalidState(messages) {
  validationSummary.textContent = "Please fix " + messages.length + " " + (messages.length === 1 ? "field" : "fields") + " before calculating.";
  statusMessage.textContent = "Calculation not updated because the form has invalid values.";
  statusMessage.classList.add("is-error");
  lastCalculation = null;
  showWaitingResults();
}

function buildValidValues() {
  return {
    currency: currencyInput.value,
    bill: parseNumber(billInput.value),
    tipPercent: getActiveTipPercent(),
    people: parseNumber(peopleInput.value),
    shouldRound: roundInput.checked
  };
}

function validateForm() {
  const messages = [];
  const billMessage = validateBill();
  const customTipMessage = validateCustomTip();
  const peopleMessage = validatePeople();

  setFieldError(billInput, billError, billMessage);
  setFieldError(customTipInput, customTipError, customTipMessage);
  setFieldError(peopleInput, peopleError, peopleMessage);

  if (billMessage !== "") {
    messages.push(billMessage);
  }

  if (customTipMessage !== "") {
    messages.push(customTipMessage);
  }

  if (peopleMessage !== "") {
    messages.push(peopleMessage);
  }

  return messages;
}

function handleSubmit(event) {
  event.preventDefault();

  const messages = validateForm();

  if (messages.length > 0) {
    showInvalidState(messages);
    const firstInvalidField = form.querySelector("[aria-invalid='true']");
    firstInvalidField.focus();
    return;
  }

  clearValidation();
  const values = buildValidValues();
  const totals = calculateTip(values);
  lastCalculation = { values, totals };

  renderResults(values, totals);
  statusMessage.textContent = "Calculation complete for " + formatPercent(values.tipPercent) + " tip.";
}

function handlePresetChange(event) {
  selectedPresetTip = Number(event.target.value);
  customTipInput.value = "";
  customTipInput.setAttribute("aria-invalid", "false");
  customTipError.textContent = "";
  selectedTipResult.textContent = formatPercent(selectedPresetTip);
}

function handleCustomTipInput() {
  if (customTipInput.value.trim() === "") {
    customTipInput.setAttribute("aria-invalid", "false");
    customTipError.textContent = "";
    selectedTipResult.textContent = formatPercent(selectedPresetTip);
    return;
  }

  const message = validateCustomTip();
  setFieldError(customTipInput, customTipError, message);

  if (message === "") {
    selectedTipResult.textContent = formatPercent(parseNumber(customTipInput.value));
  }
}

function handleCurrencyChange() {
  if (!lastCalculation) {
    return;
  }

  lastCalculation.values.currency = currencyInput.value;
  renderResults(lastCalculation.values, lastCalculation.totals);
  statusMessage.textContent = "Currency formatting updated. No exchange-rate conversion was performed.";
}

function handleReset() {
  window.setTimeout(() => {
    selectedPresetTip = 10;
    lastCalculation = null;
    clearValidation();
    statusMessage.textContent = waitingText;
    currencyInput.value = "INR";
    showWaitingResults();
    billInput.focus();
  }, 0);
}

tipRadios.forEach((radio) => {
  radio.addEventListener("change", handlePresetChange);
});

form.addEventListener("submit", handleSubmit);
form.addEventListener("reset", handleReset);
customTipInput.addEventListener("input", handleCustomTipInput);
customTipInput.addEventListener("change", handleCustomTipInput);
currencyInput.addEventListener("change", handleCurrencyChange);

clearValidation();
showWaitingResults();
