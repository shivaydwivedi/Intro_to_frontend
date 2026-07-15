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

const starterWeatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast"
};

// TODO: Select the form, input, status, result, dashboard, unit, refresh, and geolocation elements.
// TODO: Create state for the selected location, current units, latest weather data, and request ids.
// TODO: Validate searches: trim text, reject empty input, require 2 characters, and cap at 100.
// TODO: Build geocoding URLs with URLSearchParams using name, count=5, and language=en.
// TODO: Fetch geocoding JSON, check response.ok, and distinguish no results from API errors.
// TODO: Render location choices as native buttons with enough region and country context.
// TODO: Build forecast URLs with coordinates, current fields, daily fields, forecast_days=5, timezone=auto, and units.
// TODO: Fetch and validate weather JSON without assuming every field is present.
// TODO: Render current weather with textContent and readable missing-data fallbacks.
// TODO: Render the five-day forecast from matching daily arrays.
// TODO: Add unit switching that refetches the selected location without mixing units.
// TODO: Add refresh behavior that preserves the last successful dashboard if refresh fails.
// TODO: Add geolocation only after the Use My Location button is pressed.
// TODO: Use AbortController and request ids so old responses cannot replace newer results.
// TODO: Add loading, empty, offline, permission-denied, no-results, and retry states.
