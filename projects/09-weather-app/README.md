# Project 09: Weather App

Build an accessible live weather dashboard with vanilla JavaScript, the Fetch API, browser geolocation, and Open-Meteo.

## Overview

This project teaches how a city name becomes coordinates, how coordinates become forecast data, and how a user interface should handle loading, empty, success, and error states while network requests are in flight. The app uses public Open-Meteo APIs, does not require an API key, and does not store user coordinates.

## Learning Objectives

- Build request URLs with `URLSearchParams`.
- Fetch JSON with `async` and `await`.
- Check `response.ok` and handle API failures.
- Search locations with a geocoding API.
- Fetch weather data from selected coordinates.
- Use `AbortController` to cancel outdated requests.
- Prevent stale responses from replacing newer results.
- Interpret WMO weather codes as readable text.
- Format dates, times, temperatures, wind, and precipitation values.
- Support metric and imperial units without mixing labels.
- Handle geolocation permission states responsibly.

## Prerequisites

- Semantic HTML and accessible forms
- CSS Grid and responsive layout basics
- JavaScript functions, objects, arrays, and DOM methods
- Promises, `fetch`, and basic error handling
- Browser developer tools and the network panel

## Feature Requirements

- Search for a city or place.
- Show up to five matching locations.
- Let the user choose the intended result.
- Fetch current forecast conditions for selected coordinates.
- Show a five-day daily forecast.
- Switch between metric and imperial units.
- Refresh the selected location.
- Request browser location only after the user presses Use My Location.
- Handle loading, empty, no-results, success, offline, geolocation, and API-error states.
- Attribute all weather data to Open-Meteo.

## Open-Meteo Attribution

Weather data and geocoding results come from [Open-Meteo](https://open-meteo.com/). Open-Meteo does not require an API key for this beginner project. Weather values are forecast/model data, not observations from a physical station at the exact searched address. API availability and usage terms are outside this repository's control, so review the current Open-Meteo terms before using the idea in production.

## APIs and Endpoints

Geocoding endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search
```

Forecast endpoint:

```text
https://api.open-meteo.com/v1/forecast
```

The geocoding request uses `name`, `count=5`, and `language=en`. The forecast request uses `latitude`, `longitude`, `current`, `daily`, `timezone=auto`, `forecast_days=5`, and unit parameters.

## Request Flow

1. The learner submits a city or place name.
2. The app validates and trims the search text.
3. The geocoding API returns matching locations.
4. The learner selects one result.
5. The app requests forecast data for that result's latitude and longitude.
6. The current conditions and five-day forecast are rendered.

## Requested Weather Fields

Current fields:

- `temperature_2m`
- `apparent_temperature`
- `relative_humidity_2m`
- `precipitation`
- `weather_code`
- `wind_speed_10m`
- `is_day`

Daily fields:

- `weather_code`
- `temperature_2m_max`
- `temperature_2m_min`
- `precipitation_probability_max`
- `sunrise`
- `sunset`

## Weather-Code Interpretation

The solution maps WMO weather codes from Open-Meteo to readable descriptions such as Clear sky, Partly cloudy, Fog, Drizzle, Rain, Snow, Showers, Thunderstorm, and Unknown conditions. Unknown or missing codes use a safe fallback instead of crashing.

## Unit Behavior

The solution requests metric data by default. When the learner changes units, it makes a new forecast request using Open-Meteo unit parameters:

- Metric: Celsius, kilometers per hour, millimeters
- Imperial: Fahrenheit, miles per hour, inches

The app does not manually convert weather values when the API can return the requested units.

## Loading, Empty, and Error States

The interface includes:

- Initial empty state before any request
- Searching state for location lookups
- No-results state for unmatched searches
- Location-choice state for ambiguous searches
- Loading-weather state for selected coordinates
- Refreshing state that keeps the last successful dashboard visible
- Offline state
- Geolocation permission and availability errors
- API or network error with retry when useful

## AbortController and Stale Requests

New searches cancel older search requests. New weather requests cancel older weather requests. Each request also receives an incrementing id so an old response cannot update the page after a newer request has started.

## Geolocation Permission Behavior

The app never asks for location on page load. The browser permission prompt appears only after Use My Location is pressed. If permission is denied, unavailable, timed out, or unsupported, the app explains the problem and invites the learner to search manually. Coordinates are not stored.

## API and Network Limitations

Live weather requires an internet connection. API outages, browser permission settings, captive portals, or blocked network access can prevent results from loading. The app shows user-friendly messages instead of raw exceptions.

## Accessibility Requirements

- Use one clear `h1` and logical headings.
- Use a real search form with explicit labels.
- Associate validation text with the input.
- Use native buttons and radio controls.
- Keep weather descriptions available as text.
- Use a concise status live region, not a live dashboard.
- Provide visible focus states.
- Avoid color-only status.
- Keep keyboard focus predictable after results and errors.
- Do not automatically request geolocation.

## Suggested Workflow

1. Open `starter/index.html`.
2. Read the endpoint constants in `starter/js/app.js`.
3. Write validation for the search form.
4. Build geocoding URLs with `URLSearchParams`.
5. Fetch and render location choices.
6. Store the selected location in state.
7. Build forecast URLs from coordinates and units.
8. Render current conditions and forecast cards.
9. Add unit switching and refresh behavior.
10. Add geolocation, aborts, stale-response guards, and error states.

## Opening the Project

To work on the challenge, open:

```text
projects/09-weather-app/starter/index.html
```

To review the completed reference, open:

```text
projects/09-weather-app/solution/index.html
```

## Project Structure

```text
projects/09-weather-app/
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

- Empty search shows validation.
- One-character search shows validation.
- London returns multiple selectable results.
- Bengaluru loads current weather and five forecast cards.
- A search with spaces or non-ASCII characters is encoded correctly.
- A no-result search shows a no-locations state.
- Rapid searches do not show stale results.
- Selecting a result fetches weather.
- Refresh updates the selected location.
- Metric and imperial unit switching update every label consistently.

## Network-Failure Checklist

- Offline state appears when the browser is offline.
- API errors show a useful message.
- Refresh failure preserves the last successful dashboard.
- Retry uses the most recent meaningful action.
- Raw API objects and exception text are not shown to users.

## API-Response Edge-Case Checklist

- Missing current values show `Not available`.
- Missing daily arrays do not crash the forecast list.
- Unknown weather codes show Unknown conditions.
- Missing optional location fields do not leave awkward punctuation.
- Fewer than five daily rows render only usable rows.

## Keyboard and Responsive Testing Checklist

- Search, location selection, unit switching, refresh, retry, and geolocation are reachable by keyboard.
- Focus moves to location results or the weather heading after major updates.
- At 320px, controls stack and no horizontal overflow appears.
- Around 768px, the layout uses space cleanly.
- At 1280px, the dashboard remains readable.
- At 200% zoom, content remains usable.

## Bonus Challenges

- Recent searches
- Saved locations
- Hourly forecast
- Air-quality data
- Offline caching
- Weather charts
- Automated tests
- Service-worker support

Do not implement these optional challenges today.

## Helpful Links

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

## Solution Guidance

Try the starter before opening the solution. A strong solution keeps request state, selected location, units, and displayed data synchronized while treating remote data as optional and potentially incomplete.
