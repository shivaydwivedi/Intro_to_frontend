# Project 10: GitHub Profile Finder

Build an accessible GitHub profile explorer with vanilla JavaScript, the Fetch API, and the public GitHub REST API.

## Overview

This final project brings together form validation, multiple related API requests, error handling, rate-limit awareness, filtering, sorting, pagination, safe rendering, and responsive interface design. The app requests only public GitHub data and does not use authentication tokens.

## Learning Objectives

- Fetch public data from the GitHub REST API.
- Use `async` and `await` with structured error handling.
- Send recommended REST request headers.
- Validate exact GitHub usernames before searching.
- Handle profile and repository requests separately.
- Parse rate-limit headers.
- Cancel obsolete requests with `AbortController`.
- Prevent stale responses from replacing newer results.
- Render remote text safely with DOM methods and `textContent`.
- Filter, sort, and paginate repository data without mutating canonical data.
- Format dates, counts, and URLs for a readable interface.

## Prerequisites

- Semantic HTML and accessible forms
- CSS Grid and responsive layout basics
- JavaScript arrays, objects, functions, and events
- Fetch API, promises, and `try`/`catch`
- Basic understanding of HTTP status codes

## Features

- Search for an exact GitHub username.
- Display public profile details.
- Fetch public repositories.
- Filter loaded repositories by name or description.
- Filter by repository language.
- Sort by recently updated, most stars, most forks, or name.
- Paginate repository cards six at a time.
- Load another GitHub repository API page when needed.
- Refresh the current profile.
- Handle loading, empty, not-found, offline, rate-limit, partial-success, and generic-error states.
- Attribute data to GitHub and explain API limitations.

## Endpoints Used

Profile:

```text
https://api.github.com/users/{username}
```

Public repositories:

```text
https://api.github.com/users/{username}/repos
```

Repository requests use documented query parameters including `type=owner`, `sort=updated`, `direction=desc`, `per_page=30`, and `page`.

## API Headers and Version

The solution uses the currently documented REST API version from GitHub Docs:

```text
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2026-03-10
```

No `Authorization` header is used. Never place a GitHub token in frontend code, HTML, localStorage, README examples, or repository history.

## Username Validation

The form:

- trims surrounding whitespace;
- removes one leading `@` deliberately;
- rejects empty input;
- limits usernames to 39 characters;
- allows letters, digits, and hyphens;
- rejects leading or trailing hyphens;
- rejects consecutive hyphens.

Client-side validation is helpful, but the GitHub API remains authoritative.

## Profile Fields

The solution displays public fields when available:

- avatar;
- display name with username fallback;
- login;
- account type;
- biography;
- location;
- company;
- website/blog when it has a safe URL;
- GitHub profile link;
- account creation date;
- public repositories;
- followers;
- following;
- public gists.

Missing nullable values use restrained fallback text. Private data is not displayed.

## Repository Fields

Each repository card shows:

- repository name;
- description or fallback text;
- language or `Not specified`;
- stars;
- forks;
- open issues;
- fork and archive status as text;
- last updated date;
- GitHub repository link;
- homepage link only when the API returns a safe HTTP or HTTPS URL.

## Multi-Request Flow

1. Validate the username.
2. Abort any older profile or repository request.
3. Fetch the profile.
4. Render profile data after success.
5. Fetch repository API page 1.
6. Render repository controls and cards.
7. Load another repository API page only when pagination needs more loaded data.

If the profile request succeeds but repositories fail, the profile remains visible and the repository section shows its own retry error.

## Filtering, Sorting, and Pagination

Repository search filters currently loaded repositories by name or description. The language filter is built from loaded repository languages and includes `Not specified` when relevant. Filters combine with sorting.

The app displays six repository cards per UI page. It requests 30 repositories per GitHub API page and fetches another API page only when the learner advances past the currently loaded UI pages and the GitHub `Link` header indicates a next page exists.

Filtering applies only to repositories currently loaded from the API.

## Loading, Empty, Partial-Success, and Error States

The app has states for:

- initial empty view;
- loading profile;
- loading repositories;
- successful profile and repositories;
- successful profile with repository failure;
- username not found;
- account with no public repositories;
- filtered repository empty state;
- offline or network failure;
- GitHub rate limit;
- generic API error.

Messages are user-friendly and do not expose raw exception details.

## HTTP Status Handling

- `200`: render data.
- `404`: show a not-found message for profiles.
- `403` or `429`: inspect rate-limit and retry headers.
- Other non-success statuses: show a generic API error.
- Network failure or offline state: show an offline/connection message.
- Aborted requests: stay quiet.

## Rate-Limit Headers

The solution reads:

- `x-ratelimit-limit`
- `x-ratelimit-remaining`
- `x-ratelimit-used`
- `x-ratelimit-reset`
- `retry-after`

Unauthenticated public GitHub REST requests are currently documented as 60 requests per hour per originating IP address. The interface prefers actual response headers when they are present and shows the local reset time for rate-limit errors.

## AbortController and Stale Responses

Every profile search gets a request id. Older profile and repository requests are aborted. If an older response arrives after a newer request starts, it is ignored and cannot overwrite the current interface.

## Security and Privacy

This project uses only public unauthenticated GitHub REST requests. It does not use tokens, OAuth, GitHub Apps, a backend proxy, localStorage, or credentials. Private repositories and private profile information are not available. The project is educational and is not affiliated with or endorsed by GitHub.

## Accessibility Requirements

- Use one clear `h1` and logical headings.
- Use real forms, explicit labels, and field-specific validation.
- Use native buttons and selects.
- Render repositories as a semantic list.
- Give avatars meaningful alt text.
- Use safe external links with clear text.
- Keep status announcements concise.
- Do not put the whole dashboard in a live region.
- Provide visible focus styles.
- Ensure disabled pagination controls are understandable.
- Keep keyboard navigation predictable after major updates.

## Suggested Workflow

1. Open `starter/index.html`.
2. Review the endpoint constants and sample state shape.
3. Add username validation.
4. Build profile and repository URLs.
5. Add a reusable GitHub fetch helper.
6. Render profile data safely.
7. Render repository cards safely.
8. Add repository search, language filtering, sorting, and UI pagination.
9. Parse rate-limit headers and display request-limit summaries.
10. Add refresh, retry, aborts, and stale-response guards.

## Opening the Project

To work on the challenge, open:

```text
projects/10-github-profile-finder/starter/index.html
```

To review the completed reference, open:

```text
projects/10-github-profile-finder/solution/index.html
```

## Project Structure

```text
projects/10-github-profile-finder/
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

- Empty username shows validation.
- Invalid characters show validation.
- Leading, trailing, and consecutive hyphens are rejected.
- A leading `@` is handled consistently.
- `octocat` loads a profile and repositories.
- `github` loads an organization-style account without breaking wording.
- A nonexistent username shows a not-found state.
- Refresh works for the current profile.
- Profile remains visible if repository loading fails.

## Rate-Limit and Network Testing Checklist

- Rate-limit headers are summarized after successful requests.
- 403 or 429 rate-limit responses show a reset time when available.
- Offline state is understandable.
- Retry appears only when useful.
- The app does not automatically retry rate-limited requests.

## Malformed-Data Edge Cases

- Missing bio, company, location, or blog displays a fallback.
- Unsafe blog or homepage protocols are not linked.
- Missing repository language displays `Not specified`.
- Missing repository dates display `Not available`.
- Empty repository arrays show a specific empty state.

## Keyboard and Responsive Testing

- Search, refresh, retry, filters, sorting, and pagination are keyboard reachable.
- Focus moves to the profile or error heading after major updates.
- At 320px, cards and controls stack without horizontal overflow.
- At 768px, the profile and repository grid use space cleanly.
- At 1280px, the dashboard remains readable.
- At 200% zoom, text and controls remain usable.

## Bonus Challenges

- Recent searches stored locally
- Repository topic filters
- Repository-language statistics
- Organization lookup enhancements
- Followers preview
- Authenticated backend proxy
- Automated tests
- Skeleton loading states

Do not implement these optional challenges today.

## Helpful Links

- [GitHub REST API: Users](https://docs.github.com/en/rest/users/users)
- [GitHub REST API: Repositories](https://docs.github.com/en/rest/repos/repos)
- [GitHub REST API: Pagination](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
- [GitHub REST API: Rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

## Solution Guidance

Try the starter before opening the solution. A strong solution treats GitHub data as remote, optional, and rate limited while keeping the interface clear when only part of the data loads.
