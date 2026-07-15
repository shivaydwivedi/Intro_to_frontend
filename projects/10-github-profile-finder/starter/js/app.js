const githubApiBase = "https://api.github.com";
const githubApiVersion = "2026-03-10";
const reposPerApiPage = 30;
const reposPerUiPage = 6;

const exampleState = {
  currentUsername: "",
  profile: null,
  repositories: [],
  apiPage: 1,
  hasNextApiPage: false,
  repoSearch: "",
  language: "all",
  sort: "updated",
  uiPage: 1
};

// TODO: Select the search form, profile container, repository controls, status, and pagination elements.
// TODO: Validate usernames: trim, handle one leading @, reject invalid characters, hyphen edges, and consecutive hyphens.
// TODO: Build profile and repository URLs with URLSearchParams for repository query parameters.
// TODO: Fetch GitHub JSON with Accept and X-GitHub-Api-Version headers, but no Authorization header.
// TODO: Check response.ok, parse rate-limit headers, and handle 404, 403, 429, offline, and generic errors.
// TODO: Use AbortController and request ids so older responses cannot replace newer searches.
// TODO: Render profile fields safely with textContent and safe external links.
// TODO: Render repositories from canonical loaded data without mutating the original array.
// TODO: Build language filters from loaded repositories.
// TODO: Add repository search, language filtering, sorting, and six-card UI pagination.
// TODO: Load another repository API page only when the user needs more loaded results.
// TODO: Add refresh and retry behavior while preserving successful profile data when repository loading fails.
