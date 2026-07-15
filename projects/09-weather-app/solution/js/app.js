const geocodingEndpoint = "https://geocoding-api.open-meteo.com/v1/search";
const forecastEndpoint = "https://api.open-meteo.com/v1/forecast";

const currentFields = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "is_day"
];

const dailyFields = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "sunrise",
  "sunset"
];

const unitSettings = {
  metric: {
    label: "Metric",
    temperatureUnit: "celsius",
    windSpeedUnit: "kmh",
    precipitationUnit: "mm",
    temperatureLabel: "C",
    windLabel: "km/h",
    precipitationLabel: "mm"
  },
  imperial: {
    label: "Imperial",
    temperatureUnit: "fahrenheit",
    windSpeedUnit: "mph",
    precipitationUnit: "inch",
    temperatureLabel: "F",
    windLabel: "mph",
    precipitationLabel: "in"
  }
};

const weatherCodeDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#location-search");
const searchError = document.querySelector("#search-error");
const searchButton = document.querySelector("#search-button");
const locationButton = document.querySelector("#location-button");
const unitInputs = document.querySelectorAll("input[name='units']");
const appStatus = document.querySelector("#app-status");
const resultsTitle = document.querySelector("#results-title");
const resultsSummary = document.querySelector("#results-summary");
const locationResults = document.querySelector("#location-results");
const weatherTitle = document.querySelector("#weather-title");
const weatherSubtitle = document.querySelector("#weather-subtitle");
const refreshButton = document.querySelector("#refresh-button");
const currentWeather = document.querySelector("#current-weather");
const forecastList = document.querySelector("#forecast-list");

let selectedLocation = null;
let currentUnits = "metric";
let latestWeather = null;
let lastWeatherErrorAction = null;
let searchController = null;
let weatherController = null;
let searchRequestId = 0;
let weatherRequestId = 0;

function validateSearch(value) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { value: trimmed, message: "Enter a city or place." };
  }

  if (trimmed.length < 2) {
    return { value: trimmed, message: "Enter at least two characters." };
  }

  if (trimmed.length > 100) {
    return { value: trimmed, message: "Search must be 100 characters or fewer." };
  }

  return { value: trimmed, message: "" };
}

function setSearchError(message) {
  searchError.textContent = message;
  searchInput.setAttribute("aria-invalid", String(message !== ""));
}

function setBusy(isBusy) {
  searchButton.disabled = isBusy;
  locationButton.disabled = isBusy;
  unitInputs.forEach((input) => {
    input.disabled = isBusy;
  });
  refreshButton.disabled = isBusy || !selectedLocation;
}

function setStatus(message, type = "info") {
  appStatus.textContent = message;
  appStatus.classList.toggle("error-state", type === "error");
}

function clearElement(element) {
  element.textContent = "";
}

function createParagraph(text, className = "") {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  if (className) {
    paragraph.className = className;
  }
  return paragraph;
}

function formatLocationName(location) {
  if (!location) {
    return "Selected location";
  }

  return location.name || "Selected location";
}

function formatLocationContext(location) {
  if (!location) {
    return "";
  }

  const parts = [location.admin1, location.country].filter(Boolean);
  return parts.join(", ");
}

function formatCoordinates(location) {
  if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
    return "";
  }

  return location.latitude.toFixed(2) + ", " + location.longitude.toFixed(2);
}

function buildGeocodingUrl(query) {
  const params = new URLSearchParams({
    name: query,
    count: "5",
    language: "en",
    format: "json"
  });

  return geocodingEndpoint + "?" + params.toString();
}

function buildForecastUrl(location, units) {
  const settings = unitSettings[units];
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: currentFields.join(","),
    daily: dailyFields.join(","),
    timezone: "auto",
    forecast_days: "5",
    temperature_unit: settings.temperatureUnit,
    wind_speed_unit: settings.windSpeedUnit,
    precipitation_unit: settings.precipitationUnit
  });

  return forecastEndpoint + "?" + params.toString();
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Request failed.");
  }

  return response.json();
}

function isAbortError(error) {
  return error && error.name === "AbortError";
}

function isOffline() {
  return window.navigator && window.navigator.onLine === false;
}

function interpretWeatherCode(code) {
  if (code === null || code === undefined || code === "") {
    return "Unknown conditions";
  }

  return weatherCodeDescriptions[Number(code)] || "Unknown conditions";
}

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(Number(value))) {
    return "Not available";
  }

  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(Number(value));
}

function formatTemperature(value, units) {
  if (!Number.isFinite(Number(value))) {
    return "Not available";
  }

  return formatNumber(value) + " deg " + unitSettings[units].temperatureLabel;
}

function formatWind(value, units) {
  if (!Number.isFinite(Number(value))) {
    return "Not available";
  }

  return formatNumber(value) + " " + unitSettings[units].windLabel;
}

function formatPrecipitation(value, units) {
  if (!Number.isFinite(Number(value))) {
    return "Not available";
  }

  const digits = units === "imperial" ? 2 : 1;
  return formatNumber(value, digits) + " " + unitSettings[units].precipitationLabel;
}

function formatPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "Not available";
  }

  return formatNumber(value) + "%";
}

function formatDateTime(value, options) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function formatForecastDate(value) {
  return formatDateTime(value + "T12:00", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function normalizeLocations(data) {
  if (!data || !Array.isArray(data.results)) {
    return [];
  }

  return data.results
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .map((item) => ({
      id: String(item.id || item.name + "-" + item.latitude + "-" + item.longitude),
      name: typeof item.name === "string" ? item.name : "Unnamed location",
      admin1: typeof item.admin1 === "string" ? item.admin1 : "",
      country: typeof item.country === "string" ? item.country : "",
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: typeof item.timezone === "string" ? item.timezone : ""
    }));
}

function renderInitialState() {
  resultsSummary.textContent = "Matching places will appear here.";
  clearElement(locationResults);
  weatherSubtitle.textContent = "No location selected yet.";
  currentWeather.replaceChildren(createParagraph("Choose a location to see current forecast conditions.", "empty-state"));
  clearElement(forecastList);
}

function renderNoResults(query) {
  resultsSummary.textContent = "No locations found for " + query + ". Try a different spelling or nearby city.";
  clearElement(locationResults);
  resultsTitle.focus();
}

function renderError(message, retryHandler) {
  const wrapper = document.createElement("div");
  const paragraph = createParagraph(message, "error-state");
  wrapper.append(paragraph);

  if (retryHandler) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Retry";
    button.addEventListener("click", retryHandler);
    wrapper.append(button);
  }

  return wrapper;
}

function renderLocationResults(locations) {
  resultsSummary.textContent = locations.length + " matching " + (locations.length === 1 ? "place" : "places") + " found. Choose the intended location.";
  clearElement(locationResults);

  locations.forEach((location) => {
    const button = document.createElement("button");
    const name = document.createElement("span");
    const context = document.createElement("span");
    const coordinates = formatCoordinates(location);
    const contextParts = [formatLocationContext(location), coordinates ? "Coordinates " + coordinates : ""].filter(Boolean);

    button.type = "button";
    button.className = "result-card";
    button.dataset.locationId = location.id;
    name.className = "result-name";
    name.textContent = formatLocationName(location);
    context.className = "result-context";
    context.textContent = contextParts.join(" | ") || "Location details unavailable";
    button.append(name, context);
    button.addEventListener("click", () => selectLocation(location));
    locationResults.append(button);
  });

  resultsTitle.focus();
}

function renderWeather(weatherData, location, units, isUpdating = false) {
  latestWeather = weatherData;
  const current = weatherData && weatherData.current ? weatherData.current : {};
  const daily = weatherData && weatherData.daily ? weatherData.daily : {};
  const locationContext = formatLocationContext(location);
  const currentTime = formatDateTime(current.time, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
  const condition = interpretWeatherCode(current.weather_code);
  const daylight = current.is_day === 1 ? "Daylight" : current.is_day === 0 ? "Night" : "Not available";

  weatherSubtitle.textContent = [formatLocationName(location), locationContext].filter(Boolean).join(", ");
  clearElement(currentWeather);

  if (isUpdating) {
    currentWeather.append(createParagraph("Updating weather data. The last successful forecast remains visible.", "updating-note"));
  }

  const summary = document.createElement("div");
  const temperature = document.createElement("p");
  const conditionText = document.createElement("p");
  const meta = document.createElement("p");

  summary.className = "current-summary";
  temperature.className = "temperature";
  temperature.textContent = formatTemperature(current.temperature_2m, units);
  conditionText.className = "condition-text";
  conditionText.textContent = condition;
  meta.className = "meta-text";
  meta.textContent = "Forecast conditions for " + currentTime + ". Selected units: " + unitSettings[units].label + ".";
  summary.append(temperature, conditionText, meta);

  const details = document.createElement("dl");
  details.className = "detail-grid";
  appendDetail(details, "Feels like", formatTemperature(current.apparent_temperature, units));
  appendDetail(details, "Humidity", formatPercent(current.relative_humidity_2m));
  appendDetail(details, "Precipitation", formatPrecipitation(current.precipitation, units));
  appendDetail(details, "Wind speed", formatWind(current.wind_speed_10m, units));
  appendDetail(details, "Day or night", daylight);
  appendDetail(details, "Last updated", formatDateTime(new Date().toISOString(), {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }));

  currentWeather.append(summary, details);
  renderForecast(daily, units);
  refreshButton.disabled = false;
}

function appendDetail(list, label, value) {
  const card = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  card.className = "detail-card";
  term.textContent = label;
  description.textContent = value;
  card.append(term, description);
  list.append(card);
}

function getForecastRows(daily) {
  const times = Array.isArray(daily.time) ? daily.time : [];

  return times.slice(0, 5).map((time, index) => ({
    time,
    code: Array.isArray(daily.weather_code) ? daily.weather_code[index] : undefined,
    max: Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max[index] : undefined,
    min: Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min[index] : undefined,
    precipitation: Array.isArray(daily.precipitation_probability_max) ? daily.precipitation_probability_max[index] : undefined,
    sunrise: Array.isArray(daily.sunrise) ? daily.sunrise[index] : "",
    sunset: Array.isArray(daily.sunset) ? daily.sunset[index] : ""
  }));
}

function renderForecast(daily, units) {
  clearElement(forecastList);
  const rows = getForecastRows(daily);

  if (rows.length === 0) {
    const item = document.createElement("li");
    item.append(createParagraph("Forecast data is not available for this response.", "empty-state"));
    forecastList.append(item);
    return;
  }

  rows.forEach((row) => {
    const item = document.createElement("li");
    const card = document.createElement("article");
    const heading = document.createElement("h4");
    const condition = document.createElement("p");
    const details = document.createElement("dl");

    card.className = "forecast-card";
    heading.textContent = formatForecastDate(row.time);
    condition.textContent = interpretWeatherCode(row.code);
    appendForecastDetail(details, "High", formatTemperature(row.max, units));
    appendForecastDetail(details, "Low", formatTemperature(row.min, units));
    appendForecastDetail(details, "Precipitation", formatPercent(row.precipitation));
    appendForecastDetail(details, "Sunrise", formatDateTime(row.sunrise, { hour: "numeric", minute: "2-digit" }));
    appendForecastDetail(details, "Sunset", formatDateTime(row.sunset, { hour: "numeric", minute: "2-digit" }));
    card.append(heading, condition, details);
    item.append(card);
    forecastList.append(item);
  });
}

function appendForecastDetail(list, label, value) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value;
  row.append(term, description);
  list.append(row);
}

async function searchLocations(query) {
  if (searchController) {
    searchController.abort();
  }

  const requestId = ++searchRequestId;
  searchController = new AbortController();
  clearElement(locationResults);
  resultsSummary.textContent = "Searching for matching places...";
  setStatus("Searching for locations...");
  setBusy(true);

  try {
    if (isOffline()) {
      throw new Error("offline");
    }

    const data = await fetchJson(buildGeocodingUrl(query), searchController.signal);

    if (requestId !== searchRequestId) {
      return;
    }

    const locations = normalizeLocations(data);

    if (locations.length === 0) {
      renderNoResults(query);
      setStatus("No matching locations were found.");
      return;
    }

    renderLocationResults(locations);
    setStatus("Choose one of the matching locations.");
  } catch (error) {
    if (isAbortError(error)) {
      return;
    }

    if (requestId !== searchRequestId) {
      return;
    }

    const message = isOffline()
      ? "You appear to be offline. Connect to the internet and try again."
      : "We could not load matching locations. Check your connection and try again.";
    resultsSummary.textContent = "";
    locationResults.replaceChildren(renderError(message, () => searchLocations(query)));
    setStatus(message, "error");
    resultsTitle.focus();
  } finally {
    if (requestId === searchRequestId) {
      setBusy(false);
    }
  }
}

async function selectLocation(location) {
  selectedLocation = location;
  lastWeatherErrorAction = () => fetchWeatherForLocation(location, currentUnits, "load");
  await fetchWeatherForLocation(location, currentUnits, "load");
}

async function fetchWeatherForLocation(location, units, mode, previousUnits = "") {
  if (weatherController) {
    weatherController.abort();
  }

  const requestId = ++weatherRequestId;
  weatherController = new AbortController();
  const hasPreviousWeather = Boolean(latestWeather);

  setBusy(true);
  setStatus(mode === "refresh" ? "Refreshing weather data..." : "Loading weather data...");
  weatherSubtitle.textContent = "Loading forecast conditions for " + formatLocationName(location) + "...";

  if ((mode === "refresh" || mode === "units") && latestWeather) {
    renderWeather(latestWeather, location, previousUnits || units, true);
  } else {
    currentWeather.replaceChildren(createParagraph("Loading weather data...", "empty-state"));
    clearElement(forecastList);
  }

  try {
    if (isOffline()) {
      throw new Error("offline");
    }

    const data = await fetchJson(buildForecastUrl(location, units), weatherController.signal);

    if (requestId !== weatherRequestId) {
      return;
    }

    renderWeather(data, location, units);
    setStatus("Weather data loaded for " + formatLocationName(location) + ".");
    weatherTitle.focus();
  } catch (error) {
    if (isAbortError(error)) {
      return;
    }

    if (requestId !== weatherRequestId) {
      return;
    }

    const message = isOffline()
      ? "You appear to be offline. The last successful forecast is preserved if available."
      : "We could not load weather data. Check your connection and try again.";
    lastWeatherErrorAction = () => fetchWeatherForLocation(location, units, mode);

    if (hasPreviousWeather && latestWeather && (mode === "refresh" || mode === "units")) {
      const displayUnits = mode === "units" && previousUnits ? previousUnits : units;

      if (mode === "units" && previousUnits) {
        currentUnits = previousUnits;
        unitInputs.forEach((input) => {
          input.checked = input.value === previousUnits;
        });
      }

      renderWeather(latestWeather, location, displayUnits);
      currentWeather.prepend(renderError(message, lastWeatherErrorAction));
    } else {
      currentWeather.replaceChildren(renderError(message, lastWeatherErrorAction));
      clearElement(forecastList);
    }

    setStatus(message, "error");
    weatherTitle.focus();
  } finally {
    if (requestId === weatherRequestId) {
      setBusy(false);
    }
  }
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const validation = validateSearch(searchInput.value);

  if (validation.message) {
    setSearchError(validation.message);
    searchInput.focus();
    return;
  }

  setSearchError("");
  searchInput.value = validation.value;
  searchLocations(validation.value);
}

function handleUnitChange(event) {
  const nextUnits = event.target.value;

  if (!unitSettings[nextUnits] || nextUnits === currentUnits) {
    return;
  }

  const previousUnits = currentUnits;
  currentUnits = nextUnits;

  if (selectedLocation) {
    fetchWeatherForLocation(selectedLocation, currentUnits, "units", previousUnits);
  }
}

function handleRefresh() {
  if (!selectedLocation) {
    return;
  }

  lastWeatherErrorAction = () => fetchWeatherForLocation(selectedLocation, currentUnits, "refresh");
  fetchWeatherForLocation(selectedLocation, currentUnits, "refresh");
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("unsupported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    });
  });
}

function getGeolocationMessage(error) {
  if (error && error.message === "unsupported") {
    return "Geolocation is not supported in this browser. Search for your city instead.";
  }

  if (error && error.code === 1) {
    return "Location permission was denied. Search for your city instead.";
  }

  if (error && error.code === 2) {
    return "Your location was unavailable. Search for your city instead.";
  }

  if (error && error.code === 3) {
    return "Location request timed out. Search for your city instead.";
  }

  return "We could not get your location. Search for your city instead.";
}

async function handleUseLocation() {
  setSearchError("");
  setBusy(true);
  setStatus("Requesting your browser location...");

  try {
    const position = await getCurrentPosition();
    const location = {
      id: "browser-location",
      name: "Your current location",
      admin1: "",
      country: "",
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timezone: ""
    };
    selectedLocation = location;
    resultsSummary.textContent = "Using coordinates from your browser permission response.";
    clearElement(locationResults);
    await fetchWeatherForLocation(location, currentUnits, "load");
  } catch (error) {
    const message = getGeolocationMessage(error);
    setStatus(message, "error");
    resultsSummary.textContent = message;
    clearElement(locationResults);
    resultsTitle.focus();
  } finally {
    setBusy(false);
  }
}

window.addEventListener("offline", () => {
  setStatus("You appear to be offline. Existing weather data may be out of date.", "error");
});

window.addEventListener("online", () => {
  setStatus("You are back online. Refresh or search to load current forecast data.");
});

searchForm.addEventListener("submit", handleSearchSubmit);
refreshButton.addEventListener("click", handleRefresh);
locationButton.addEventListener("click", handleUseLocation);
unitInputs.forEach((input) => {
  input.addEventListener("change", handleUnitChange);
});

renderInitialState();
