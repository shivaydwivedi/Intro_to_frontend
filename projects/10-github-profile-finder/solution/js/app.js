const githubApiBase = "https://api.github.com";
const githubApiVersion = "2026-03-10";
const reposPerApiPage = 30;
const reposPerUiPage = 6;

const profileForm = document.querySelector("#profile-form");
const usernameInput = document.querySelector("#username-input");
const usernameError = document.querySelector("#username-error");
const searchButton = document.querySelector("#search-button");
const refreshButton = document.querySelector("#refresh-button");
const appStatus = document.querySelector("#app-status");
const rateSummary = document.querySelector("#rate-summary");
const profileTitle = document.querySelector("#profile-title");
const profileContainer = document.querySelector("#profile-container");
const repositoriesTitle = document.querySelector("#repositories-title");
const repoSummary = document.querySelector("#repo-summary");
const repoSearch = document.querySelector("#repo-search");
const languageFilter = document.querySelector("#language-filter");
const sortSelect = document.querySelector("#sort-select");
const loadMoreButton = document.querySelector("#load-more-button");
const repoError = document.querySelector("#repo-error");
const repoList = document.querySelector("#repo-list");
const pagination = document.querySelector("#pagination");

let currentUsername = "";
let currentProfile = null;
let repositories = [];
let repoApiPage = 0;
let hasNextApiPage = false;
let repoSearchText = "";
let selectedLanguage = "all";
let selectedSort = "updated";
let currentUiPage = 1;
let latestRateLimit = null;
let activeProfileController = null;
let activeRepoController = null;
let activeRequestId = 0;
let isLoadingProfile = false;
let isLoadingRepos = false;

function validateUsername(value) {
  let username = value.trim();

  if (username.startsWith("@")) {
    username = username.slice(1).trim();
  }

  if (username.length === 0) {
    return { username, message: "Enter a GitHub username." };
  }

  if (username.length > 39) {
    return { username, message: "GitHub usernames can be at most 39 characters." };
  }

  if (!/^[A-Za-z0-9-]+$/.test(username)) {
    return { username, message: "Use only letters, numbers, and hyphens." };
  }

  if (username.startsWith("-") || username.endsWith("-")) {
    return { username, message: "Usernames cannot start or end with a hyphen." };
  }

  if (username.includes("--")) {
    return { username, message: "Use single hyphens only." };
  }

  return { username, message: "" };
}

function setUsernameError(message) {
  usernameError.textContent = message;
  usernameInput.setAttribute("aria-invalid", String(message !== ""));
}

function setStatus(message, type = "info") {
  appStatus.textContent = message;
  appStatus.classList.toggle("error-state", type === "error");
}

function setBusy() {
  const busy = isLoadingProfile || isLoadingRepos;
  searchButton.disabled = busy;
  refreshButton.disabled = busy || !currentProfile;
  repoSearch.disabled = !currentProfile || repositories.length === 0;
  languageFilter.disabled = !currentProfile || repositories.length === 0;
  sortSelect.disabled = !currentProfile || repositories.length === 0;
  loadMoreButton.disabled = busy || !currentProfile || !hasNextApiPage;
}

function clearElement(element) {
  element.textContent = "";
}

function createText(tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  return element;
}

function buildProfileUrl(username) {
  return githubApiBase + "/users/" + encodeURIComponent(username);
}

function buildReposUrl(username, page) {
  const params = new URLSearchParams({
    type: "owner",
    sort: "updated",
    direction: "desc",
    per_page: String(reposPerApiPage),
    page: String(page)
  });

  return githubApiBase + "/users/" + encodeURIComponent(username) + "/repos?" + params.toString();
}

function parseRateLimit(headers) {
  const reset = headers.get("x-ratelimit-reset");
  return {
    limit: headers.get("x-ratelimit-limit"),
    remaining: headers.get("x-ratelimit-remaining"),
    used: headers.get("x-ratelimit-used"),
    reset,
    retryAfter: headers.get("retry-after"),
    resetDate: reset ? new Date(Number(reset) * 1000) : null
  };
}

function updateRateSummary(rateLimit) {
  latestRateLimit = rateLimit || latestRateLimit;

  if (!latestRateLimit || latestRateLimit.limit === null || latestRateLimit.remaining === null) {
    rateSummary.textContent = "GitHub API request limit details are not available for this response.";
    return;
  }

  const resetText = latestRateLimit.resetDate && !Number.isNaN(latestRateLimit.resetDate.getTime())
    ? " Resets around " + formatDateTime(latestRateLimit.resetDate.toISOString(), { hour: "numeric", minute: "2-digit" }) + "."
    : "";
  rateSummary.textContent = "GitHub API requests remaining: " + latestRateLimit.remaining + " of " + latestRateLimit.limit + "." + resetText;
}

function parseLinkHeader(linkHeader) {
  if (!linkHeader) {
    return { next: false };
  }

  return {
    next: linkHeader.split(",").some((part) => part.includes('rel="next"'))
  };
}

class GitHubHttpError extends Error {
  constructor(response, rateLimit, message) {
    super(message);
    this.name = "GitHubHttpError";
    this.status = response.status;
    this.rateLimit = rateLimit;
  }
}

async function fetchGitHubJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": githubApiVersion
    }
  });
  const rateLimit = parseRateLimit(response.headers);
  const links = parseLinkHeader(response.headers.get("link"));

  if (!response.ok) {
    throw new GitHubHttpError(response, rateLimit, "GitHub request failed.");
  }

  const data = await response.json();
  return { data, rateLimit, links };
}

function isAbortError(error) {
  return error && error.name === "AbortError";
}

function isOffline() {
  return window.navigator && window.navigator.onLine === false;
}

function isRateLimitError(error) {
  return error instanceof GitHubHttpError
    && (error.status === 429 || (error.status === 403 && error.rateLimit && error.rateLimit.remaining === "0"));
}

function getErrorMessage(error, username) {
  if (isOffline()) {
    return "You appear to be offline. Check your connection and try again.";
  }

  if (error instanceof GitHubHttpError && error.status === 404) {
    return "No GitHub account was found for " + username + ".";
  }

  if (isRateLimitError(error)) {
    const resetDate = error.rateLimit && error.rateLimit.resetDate;
    const resetText = resetDate && !Number.isNaN(resetDate.getTime())
      ? " Try again after " + formatDateTime(resetDate.toISOString(), { hour: "numeric", minute: "2-digit" }) + "."
      : " Try again later.";
    return "GitHub's request limit has been reached." + resetText;
  }

  if (error instanceof GitHubHttpError && error.status === 403) {
    return "GitHub refused this request. It may be forbidden or temporarily limited.";
  }

  return "We could not load this profile. Please try again.";
}

function safeExternalUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  const candidate = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed) ? trimmed : "https://" + trimmed;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function formatFallback(value) {
  return value ? String(value) : "Not provided";
}

function formatDateTime(value, options = { year: "numeric", month: "short", day: "numeric" }) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function formatNumber(value) {
  if (!Number.isFinite(Number(value))) {
    return "0";
  }

  return new Intl.NumberFormat().format(Number(value));
}

function renderInitialState() {
  profileContainer.replaceChildren(createText("p", "No profile loaded yet. Only public GitHub data is displayed, and no token is used.", "empty-state"));
  repoSummary.textContent = "Repositories will appear after a profile loads.";
  clearElement(repoList);
  clearElement(repoError);
  clearElement(pagination);
  setBusy();
}

function renderProfile(profile) {
  currentProfile = profile;
  const card = document.createElement("article");
  const avatar = document.createElement("img");
  const identity = document.createElement("div");
  const name = createText("h3", profile.name || profile.login || "GitHub profile", "profile-name");
  const username = createText("p", "@" + formatFallback(profile.login), "username");
  const bio = createText("p", profile.bio || "No biography provided.", "muted");
  const links = document.createElement("div");
  const details = document.createElement("dl");
  const stats = document.createElement("dl");

  card.className = "profile-card";
  avatar.className = "profile-avatar";
  avatar.src = safeExternalUrl(profile.avatar_url) || "";
  avatar.alt = "Avatar for " + (profile.login || "GitHub profile");
  identity.className = "profile-identity";
  links.className = "profile-links";
  details.className = "profile-details";
  stats.className = "stat-list";

  addExternalLink(links, "Open GitHub profile", safeExternalUrl(profile.html_url));
  addExternalLink(links, "Open website", safeExternalUrl(profile.blog));
  appendDetail(details, "Type", formatFallback(profile.type));
  appendDetail(details, "Company", formatFallback(profile.company));
  appendDetail(details, "Location", formatFallback(profile.location));
  appendDetail(details, "Joined", formatDateTime(profile.created_at));
  appendStat(stats, "Public repos", profile.public_repos);
  appendStat(stats, "Followers", profile.followers);
  appendStat(stats, "Following", profile.following);
  appendStat(stats, "Public gists", profile.public_gists);

  identity.append(name, username, bio, links, details, stats);
  card.append(avatar, identity);
  profileContainer.replaceChildren(card);
  refreshButton.disabled = false;
  profileTitle.focus();
}

function appendDetail(list, label, value) {
  const wrapper = document.createElement("div");
  const term = createText("dt", label);
  const description = createText("dd", value);
  wrapper.append(term, description);
  list.append(wrapper);
}

function appendStat(list, label, value) {
  const wrapper = document.createElement("div");
  const term = createText("dt", label);
  const description = createText("dd", formatNumber(value));
  wrapper.className = "stat-card";
  wrapper.append(term, description);
  list.append(wrapper);
}

function addExternalLink(container, label, href) {
  if (!href) {
    return;
  }

  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  container.append(link);
}

function resetRepositoryState() {
  repositories = [];
  repoApiPage = 0;
  hasNextApiPage = false;
  repoSearchText = "";
  selectedLanguage = "all";
  selectedSort = "updated";
  currentUiPage = 1;
  repoSearch.value = "";
  languageFilter.value = "all";
  sortSelect.value = "updated";
  clearElement(repoList);
  clearElement(repoError);
  clearElement(pagination);
}

async function searchProfile(username, isRefresh = false) {
  if (activeProfileController) {
    activeProfileController.abort();
  }

  if (activeRepoController) {
    activeRepoController.abort();
  }

  const requestId = ++activeRequestId;
  activeProfileController = new AbortController();
  isLoadingProfile = true;
  setBusy();
  setStatus(isRefresh ? "Refreshing GitHub profile..." : "Loading GitHub profile...");
  clearElement(repoError);

  if (!isRefresh) {
    currentProfile = null;
    currentUsername = username;
    resetRepositoryState();
    profileContainer.replaceChildren(createText("p", "Loading profile data...", "empty-state"));
    repoSummary.textContent = "Repositories will load after the profile request succeeds.";
  }

  try {
    if (isOffline()) {
      throw new Error("offline");
    }

    const result = await fetchGitHubJson(buildProfileUrl(username), activeProfileController.signal);

    if (requestId !== activeRequestId) {
      return;
    }

    updateRateSummary(result.rateLimit);
    currentUsername = result.data.login || username;
    renderProfile(result.data);
    setStatus("Profile loaded for " + currentUsername + ".");
    if (!isRefresh) {
      resetRepositoryState();
    }
    await loadRepositoryPage(1, requestId);
  } catch (error) {
    if (isAbortError(error) || requestId !== activeRequestId) {
      return;
    }

    const message = getErrorMessage(error, username);
    if (error instanceof GitHubHttpError) {
      updateRateSummary(error.rateLimit);
    }

    if (!isRefresh || !currentProfile) {
      profileContainer.replaceChildren(renderError(message, () => searchProfile(username, false)));
      resetRepositoryState();
      repoSummary.textContent = "No repositories loaded.";
    } else {
      profileContainer.prepend(renderError(message, () => searchProfile(currentUsername, true), true));
    }

    setStatus(message, "error");
    profileTitle.focus();
  } finally {
    if (requestId === activeRequestId) {
      isLoadingProfile = false;
      setBusy();
    }
  }
}

async function loadRepositoryPage(page, requestId = activeRequestId) {
  if (!currentUsername) {
    return;
  }

  if (activeRepoController) {
    activeRepoController.abort();
  }

  activeRepoController = new AbortController();
  isLoadingRepos = true;
  setBusy();
  repoSummary.textContent = page === 1 ? "Loading repositories..." : "Loading more repositories...";

  try {
    if (isOffline()) {
      throw new Error("offline");
    }

    const result = await fetchGitHubJson(buildReposUrl(currentUsername, page), activeRepoController.signal);

    if (requestId !== activeRequestId) {
      return;
    }

    updateRateSummary(result.rateLimit);
    repositories = page === 1 ? result.data.slice() : repositories.concat(result.data);
    repoApiPage = page;
    hasNextApiPage = result.links.next;
    renderRepositoryControls();
    renderRepositories();
    repositoriesTitle.focus();
  } catch (error) {
    if (isAbortError(error) || requestId !== activeRequestId) {
      return;
    }

    const message = getErrorMessage(error, currentUsername);
    if (error instanceof GitHubHttpError) {
      updateRateSummary(error.rateLimit);
    }

    repoError.replaceChildren(renderError("Profile loaded, but repositories could not be loaded. " + message, () => loadRepositoryPage(page)));
    repoSummary.textContent = repositories.length > 0
      ? "Showing previously loaded repositories."
      : "No repositories are available from this request.";
    renderRepositories();
    setStatus("Profile loaded with a repository error.", "error");
    repositoriesTitle.focus();
  } finally {
    if (requestId === activeRequestId) {
      isLoadingRepos = false;
      setBusy();
    }
  }
}

function renderError(message, retryHandler, compact = false) {
  const wrapper = document.createElement("div");
  const paragraph = createText("p", message, compact ? "partial-state" : "error-state");
  wrapper.append(paragraph);

  if (retryHandler && !message.includes("request limit has been reached")) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Retry";
    button.addEventListener("click", retryHandler);
    wrapper.append(button);
  }

  return wrapper;
}

function renderRepositoryControls() {
  const languages = new Set();
  let hasNoLanguage = false;

  repositories.forEach((repo) => {
    if (repo.language) {
      languages.add(repo.language);
    } else {
      hasNoLanguage = true;
    }
  });

  clearElement(languageFilter);
  languageFilter.append(createOption("all", "All languages"));
  [...languages].sort((a, b) => a.localeCompare(b)).forEach((language) => {
    languageFilter.append(createOption(language, language));
  });

  if (hasNoLanguage) {
    languageFilter.append(createOption("__none", "Not specified"));
  }

  languageFilter.value = selectedLanguage;
  setBusy();
}

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function getFilteredRepositories() {
  const search = repoSearchText.trim().toLowerCase();

  return repositories
    .filter((repo) => {
      const language = repo.language || "";
      const languageMatches = selectedLanguage === "all"
        || (selectedLanguage === "__none" && !language)
        || language === selectedLanguage;
      const searchMatches = search === ""
        || String(repo.name || "").toLowerCase().includes(search)
        || String(repo.description || "").toLowerCase().includes(search);
      return languageMatches && searchMatches;
    })
    .slice()
    .sort(sortRepositories);
}

function sortRepositories(a, b) {
  if (selectedSort === "stars") {
    return (b.stargazers_count || 0) - (a.stargazers_count || 0)
      || String(a.name || "").localeCompare(String(b.name || ""));
  }

  if (selectedSort === "forks") {
    return (b.forks_count || 0) - (a.forks_count || 0)
      || String(a.name || "").localeCompare(String(b.name || ""));
  }

  if (selectedSort === "name") {
    return String(a.name || "").localeCompare(String(b.name || ""));
  }

  return String(b.updated_at || "").localeCompare(String(a.updated_at || ""))
    || String(a.name || "").localeCompare(String(b.name || ""));
}

function renderRepositories() {
  clearElement(repoList);
  clearElement(pagination);

  if (!currentProfile) {
    repoSummary.textContent = "Repositories will appear after a profile loads.";
    setBusy();
    return;
  }

  if (repositories.length === 0) {
    repoSummary.textContent = "This account has no loaded public repositories.";
    setBusy();
    return;
  }

  const filtered = getFilteredRepositories();
  const totalPages = Math.max(1, Math.ceil(filtered.length / reposPerUiPage));
  currentUiPage = Math.min(currentUiPage, totalPages);
  const startIndex = (currentUiPage - 1) * reposPerUiPage;
  const pageItems = filtered.slice(startIndex, startIndex + reposPerUiPage);

  repoSummary.textContent = "Showing " + pageItems.length + " of " + filtered.length + " matching loaded repositories. " + repositories.length + " repositories loaded from GitHub.";

  if (filtered.length === 0) {
    repoList.append(createEmptyListItem("No loaded repositories match the current search and language filter."));
    renderPagination(0, 0);
    setBusy();
    return;
  }

  pageItems.forEach((repo) => {
    repoList.append(createRepositoryCard(repo));
  });

  renderPagination(filtered.length, totalPages);
  setBusy();
}

function createEmptyListItem(message) {
  const item = document.createElement("li");
  item.append(createText("p", message, "empty-state"));
  return item;
}

function createRepositoryCard(repo) {
  const item = document.createElement("li");
  const card = document.createElement("article");
  const title = createText("h3", repo.name || "Unnamed repository", "repo-name");
  const description = createText("p", repo.description || "No description provided.", "muted");
  const meta = createText("p", "Language: " + (repo.language || "Not specified") + " | Stars: " + formatNumber(repo.stargazers_count) + " | Forks: " + formatNumber(repo.forks_count) + " | Open issues: " + formatNumber(repo.open_issues_count), "repo-meta");
  const updated = createText("p", "Updated " + formatDateTime(repo.updated_at), "muted");
  const flags = document.createElement("p");
  const actions = document.createElement("div");

  card.className = "repo-card";
  flags.className = "repo-flags";
  actions.className = "repo-actions";

  if (repo.fork) {
    flags.append(createText("span", "Fork"));
  }

  if (repo.archived) {
    flags.append(createText("span", "Archived", "is-archived"));
  }

  if (!repo.fork && !repo.archived) {
    flags.append(createText("span", "Source repository"));
  }

  addExternalLink(actions, "Open repository", safeExternalUrl(repo.html_url));
  addExternalLink(actions, "Open homepage", safeExternalUrl(repo.homepage));
  card.append(title, description, meta, updated, flags, actions);
  item.append(card);
  return item;
}

function renderPagination(totalItems, totalPages) {
  if (totalItems === 0) {
    return;
  }

  const previousButton = document.createElement("button");
  const nextButton = document.createElement("button");
  const pageText = createText("span", "Page " + currentUiPage + " of " + totalPages);

  previousButton.type = "button";
  previousButton.textContent = "Previous";
  previousButton.disabled = currentUiPage === 1;
  previousButton.addEventListener("click", () => {
    currentUiPage -= 1;
    renderRepositories();
  });

  nextButton.type = "button";
  nextButton.textContent = "Next";
  nextButton.disabled = currentUiPage >= totalPages && !hasNextApiPage;
  nextButton.addEventListener("click", async () => {
    if (currentUiPage < totalPages) {
      currentUiPage += 1;
      renderRepositories();
      return;
    }

    if (hasNextApiPage) {
      await loadRepositoryPage(repoApiPage + 1);
      currentUiPage += 1;
      renderRepositories();
    }
  });

  pagination.append(previousButton, pageText, nextButton);
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const validation = validateUsername(usernameInput.value);

  if (validation.message) {
    setUsernameError(validation.message);
    usernameInput.focus();
    return;
  }

  setUsernameError("");
  usernameInput.value = validation.username;
  searchProfile(validation.username, false);
}

function handleRefresh() {
  if (!currentUsername) {
    return;
  }

  searchProfile(currentUsername, true);
}

function handleRepositoryFilters() {
  repoSearchText = repoSearch.value;
  selectedLanguage = languageFilter.value;
  selectedSort = sortSelect.value;
  currentUiPage = 1;
  renderRepositories();
}

window.addEventListener("offline", () => {
  setStatus("You appear to be offline. Existing loaded data may be stale.", "error");
});

window.addEventListener("online", () => {
  setStatus("You are back online. Search or refresh to load current GitHub data.");
});

profileForm.addEventListener("submit", handleProfileSubmit);
refreshButton.addEventListener("click", handleRefresh);
repoSearch.addEventListener("input", handleRepositoryFilters);
languageFilter.addEventListener("change", handleRepositoryFilters);
sortSelect.addEventListener("change", handleRepositoryFilters);
loadMoreButton.addEventListener("click", () => {
  if (hasNextApiPage) {
    loadRepositoryPage(repoApiPage + 1);
  }
});

renderInitialState();
