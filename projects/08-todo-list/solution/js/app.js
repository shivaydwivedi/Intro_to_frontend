const storageKey = "frontend-beginner-projects.todo-list.v1";
const priorities = ["low", "medium", "high"];
const statusFilters = ["all", "active", "completed"];
const sortModes = ["newest", "oldest", "due-date", "priority"];
const priorityRank = { high: 0, medium: 1, low: 2 };

const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const priorityInput = document.querySelector("#task-priority");
const dueDateInput = document.querySelector("#task-due-date");
const titleError = document.querySelector("#title-error");
const statusFilter = document.querySelector("#status-filter");
const priorityFilter = document.querySelector("#priority-filter");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const clearFiltersButton = document.querySelector("#clear-filters-button");
const clearCompletedButton = document.querySelector("#clear-completed-button");
const activeFilters = document.querySelector("#active-filters");
const countsSummary = document.querySelector("#counts-summary");
const statusMessage = document.querySelector("#status-message");
const undoArea = document.querySelector("#undo-area");
const emptyState = document.querySelector("#empty-state");
const taskList = document.querySelector("#task-list");

let tasks = [];
let view = {
  status: "all",
  priority: "all",
  search: "",
  sort: "newest"
};
let editingTaskId = "";
let undoData = null;

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

function getNow() {
  return new Date().toISOString();
}

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function isIsoDateString(value) {
  if (value === "") {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parts = value.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.getFullYear() === parts[0]
    && date.getMonth() === parts[1] - 1
    && date.getDate() === parts[2];
}

function isValidTask(task) {
  return task
    && typeof task.id === "string"
    && typeof task.title === "string"
    && task.title.trim().length >= 2
    && task.title.trim().length <= 100
    && typeof task.completed === "boolean"
    && priorities.includes(task.priority)
    && typeof task.dueDate === "string"
    && isIsoDateString(task.dueDate)
    && typeof task.createdAt === "string"
    && typeof task.updatedAt === "string";
}

function sanitizeTask(task) {
  return {
    id: task.id,
    title: task.title.trim(),
    completed: task.completed,
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

function loadState() {
  try {
    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return;
    }

    const parsed = JSON.parse(saved);

    if (!parsed || !Array.isArray(parsed.tasks) || !parsed.view) {
      throw new Error("Saved data shape is not supported.");
    }

    const sanitizedTasks = parsed.tasks.filter(isValidTask).map(sanitizeTask);

    if (sanitizedTasks.length !== parsed.tasks.length) {
      throw new Error("One or more saved tasks were invalid.");
    }

    tasks = sanitizedTasks;
    view = {
      status: statusFilters.includes(parsed.view.status) ? parsed.view.status : "all",
      priority: parsed.view.priority === "all" || priorities.includes(parsed.view.priority) ? parsed.view.priority : "all",
      search: typeof parsed.view.search === "string" ? parsed.view.search : "",
      sort: sortModes.includes(parsed.view.sort) ? parsed.view.sort : "newest"
    };
  } catch (error) {
    tasks = [];
    view = { status: "all", priority: "all", search: "", sort: "newest" };
    statusMessage.textContent = "Saved tasks could not be used, so the app started with a safe empty list.";
  }
}

function saveState() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ tasks, view }));
  } catch (error) {
    statusMessage.textContent = "Changes are visible, but they could not be saved in this browser.";
  }
}

function validateTitle(value) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return "Enter a task title.";
  }

  if (trimmed.length < 2) {
    return "Task title must be at least 2 characters.";
  }

  if (trimmed.length > 100) {
    return "Task title must be 100 characters or fewer.";
  }

  return "";
}

function setTitleError(message) {
  titleError.textContent = message;
  titleInput.setAttribute("aria-invalid", String(message !== ""));
}

function formatDate(dateString) {
  if (!dateString) {
    return "No due date";
  }

  const parts = dateString.split("-").map(Number);
  const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
  return localDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getTaskStatus(task) {
  if (task.completed) {
    return "Completed";
  }

  if (!task.dueDate) {
    return "Active";
  }

  const today = getTodayString();

  if (task.dueDate < today) {
    return "Overdue";
  }

  if (task.dueDate === today) {
    return "Due today";
  }

  return "Active";
}

function plural(count, word) {
  return count + " " + word + (count === 1 ? "" : "s");
}

function getVisibleTasks() {
  const search = view.search.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    const statusMatches = view.status === "all"
      || (view.status === "active" && !task.completed)
      || (view.status === "completed" && task.completed);
    const priorityMatches = view.priority === "all" || task.priority === view.priority;
    const searchMatches = search === "" || task.title.toLowerCase().includes(search);
    return statusMatches && priorityMatches && searchMatches;
  });

  return filtered.slice().sort((a, b) => {
    if (view.sort === "oldest") {
      return a.createdAt.localeCompare(b.createdAt);
    }

    if (view.sort === "due-date") {
      if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }

      if (a.dueDate && !b.dueDate) {
        return -1;
      }

      if (!a.dueDate && b.dueDate) {
        return 1;
      }

      return a.createdAt.localeCompare(b.createdAt);
    }

    if (view.sort === "priority") {
      const priorityDifference = priorityRank[a.priority] - priorityRank[b.priority];
      return priorityDifference || a.createdAt.localeCompare(b.createdAt);
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

function syncControls() {
  statusFilter.value = view.status;
  priorityFilter.value = view.priority;
  searchInput.value = view.search;
  sortSelect.value = view.sort;
}

function renderCounts(visibleCount) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;
  countsSummary.textContent = plural(total, "task") + ", " + plural(active, "active task") + ", " + plural(completed, "completed task") + ", " + plural(visibleCount, "visible task") + ".";
  clearCompletedButton.disabled = completed === 0;
}

function renderActiveFilters() {
  const statusText = view.status === "all" ? "All tasks" : view.status[0].toUpperCase() + view.status.slice(1) + " tasks";
  const priorityText = view.priority === "all" ? "all priorities" : view.priority + " priority";
  const searchText = view.search.trim() === "" ? "no search" : "search: " + view.search.trim();
  activeFilters.textContent = "Active filters: " + statusText + ", " + priorityText + ", " + searchText + ".";
}

function renderEmptyState(visibleTasks) {
  if (tasks.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = "No tasks yet. Add one above.";
    return;
  }

  if (visibleTasks.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = "Tasks exist, but none match the current filters. Use Clear Filters to show all tasks.";
    return;
  }

  emptyState.hidden = true;
}

function renderUndo() {
  undoArea.textContent = "";

  if (!undoData) {
    return;
  }

  const text = document.createElement("span");
  const button = document.createElement("button");
  text.textContent = undoData.message + " ";
  button.type = "button";
  button.className = "secondary-button";
  button.dataset.action = "undo";
  button.textContent = "Undo";
  undoArea.append(text, button);
}

function createBadge(text, className) {
  const badge = document.createElement("span");
  badge.className = "badge " + className;
  badge.textContent = text;
  return badge;
}

function createTaskView(task) {
  const item = document.createElement("li");
  const card = document.createElement("article");
  const titleRow = document.createElement("div");
  const checkbox = document.createElement("input");
  const title = document.createElement("span");
  const meta = document.createElement("div");
  const actions = document.createElement("div");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const status = getTaskStatus(task);

  item.dataset.taskId = task.id;
  card.className = "task-card";
  card.classList.toggle("is-completed", task.completed);
  titleRow.className = "task-title-row";
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.dataset.action = "toggle";
  checkbox.setAttribute("aria-label", "Mark " + task.title + (task.completed ? " active" : " complete"));
  title.className = "task-title";
  title.textContent = task.title;
  titleRow.append(checkbox, title);

  meta.className = "task-meta";
  meta.append(
    createBadge("Priority: " + task.priority, "priority-" + task.priority),
    createBadge("Due: " + formatDate(task.dueDate), ""),
    createBadge("Status: " + status, "status-" + status.toLowerCase().replace(" ", "-"))
  );

  actions.className = "task-actions";
  editButton.type = "button";
  editButton.className = "secondary-button";
  editButton.dataset.action = "edit";
  editButton.textContent = "Edit";
  deleteButton.type = "button";
  deleteButton.className = "danger-button";
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Delete";
  actions.append(editButton, deleteButton);

  card.append(titleRow, meta, actions);
  item.append(card);
  return item;
}

function createEditForm(task) {
  const item = document.createElement("li");
  const form = document.createElement("form");
  const titleField = document.createElement("div");
  const titleLabel = document.createElement("label");
  const titleInputEdit = document.createElement("input");
  const error = document.createElement("p");
  const row = document.createElement("div");
  const priorityField = document.createElement("div");
  const priorityLabel = document.createElement("label");
  const prioritySelect = document.createElement("select");
  const dueField = document.createElement("div");
  const dueLabel = document.createElement("label");
  const dueInput = document.createElement("input");
  const actions = document.createElement("div");
  const saveButton = document.createElement("button");
  const cancelButton = document.createElement("button");

  item.dataset.taskId = task.id;
  form.className = "task-card edit-form";
  form.dataset.action = "save-edit";
  titleField.className = "field";
  titleLabel.textContent = "Edit title";
  titleLabel.setAttribute("for", "edit-title-" + task.id);
  titleInputEdit.id = "edit-title-" + task.id;
  titleInputEdit.name = "title";
  titleInputEdit.value = task.title;
  titleInputEdit.maxLength = 100;
  titleInputEdit.setAttribute("aria-describedby", "edit-error-" + task.id);
  error.id = "edit-error-" + task.id;
  error.className = "field-error";
  titleField.append(titleLabel, titleInputEdit, error);

  row.className = "field-row";
  priorityField.className = "field";
  priorityLabel.textContent = "Priority";
  priorityLabel.setAttribute("for", "edit-priority-" + task.id);
  prioritySelect.id = "edit-priority-" + task.id;
  prioritySelect.name = "priority";
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority[0].toUpperCase() + priority.slice(1);
    option.selected = priority === task.priority;
    prioritySelect.append(option);
  });
  priorityField.append(priorityLabel, prioritySelect);

  dueField.className = "field";
  dueLabel.textContent = "Due date";
  dueLabel.setAttribute("for", "edit-due-" + task.id);
  dueInput.id = "edit-due-" + task.id;
  dueInput.name = "dueDate";
  dueInput.type = "date";
  dueInput.value = task.dueDate;
  dueField.append(dueLabel, dueInput);
  row.append(priorityField, dueField);

  actions.className = "task-actions";
  saveButton.type = "submit";
  saveButton.textContent = "Save";
  cancelButton.type = "button";
  cancelButton.className = "secondary-button";
  cancelButton.dataset.action = "cancel-edit";
  cancelButton.textContent = "Cancel";
  actions.append(saveButton, cancelButton);
  form.append(titleField, row, actions);
  item.append(form);
  return item;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.textContent = "";

  visibleTasks.forEach((task) => {
    taskList.append(editingTaskId === task.id ? createEditForm(task) : createTaskView(task));
  });

  renderCounts(visibleTasks.length);
  renderActiveFilters();
  renderEmptyState(visibleTasks);
  renderUndo();
  syncControls();
}

function updateAndRender(message, shouldSave = true) {
  if (shouldSave) {
    saveState();
  }

  if (message) {
    statusMessage.textContent = message;
  }

  renderTasks();
}

function handleAddTask(event) {
  event.preventDefault();
  const message = validateTitle(titleInput.value);

  if (message) {
    setTitleError(message);
    titleInput.focus();
    return;
  }

  const now = getNow();
  const task = {
    id: createId(),
    title: titleInput.value.trim(),
    completed: false,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    createdAt: now,
    updatedAt: now
  };

  tasks.unshift(task);
  undoData = null;
  setTitleError("");
  taskForm.reset();
  priorityInput.value = "medium";
  updateAndRender("Added task: " + task.title + ".");
  titleInput.focus();
}

function findTask(id) {
  return tasks.find((task) => task.id === id);
}

function handleToggle(task) {
  task.completed = !task.completed;
  task.updatedAt = getNow();
  editingTaskId = "";
  updateAndRender((task.completed ? "Completed " : "Marked active: ") + task.title + ".");
}

function handleEdit(task) {
  editingTaskId = task.id;
  undoData = null;
  renderTasks();
  const editInput = document.querySelector("#edit-title-" + task.id);
  if (editInput) {
    editInput.focus();
    editInput.select();
  }
}

function handleDelete(task) {
  const index = tasks.findIndex((item) => item.id === task.id);
  tasks.splice(index, 1);
  editingTaskId = "";
  undoData = {
    type: "delete",
    items: [{ task, index }],
    message: "Deleted " + task.title + "."
  };
  updateAndRender("Deleted " + task.title + ". Use Undo to restore it.");
}

function handleUndo() {
  if (!undoData) {
    return;
  }

  undoData.items
    .slice()
    .sort((a, b) => a.index - b.index)
    .forEach((entry) => {
      tasks.splice(Math.min(entry.index, tasks.length), 0, entry.task);
    });

  const restoredCount = undoData.items.length;
  undoData = null;
  updateAndRender("Restored " + plural(restoredCount, "task") + ".");
  taskList.focus();
}

function handleSaveEdit(form, task) {
  const titleField = form.elements.title;
  const error = form.querySelector(".field-error");
  const message = validateTitle(titleField.value);

  if (message) {
    error.textContent = message;
    titleField.setAttribute("aria-invalid", "true");
    titleField.focus();
    return;
  }

  task.title = titleField.value.trim();
  task.priority = form.elements.priority.value;
  task.dueDate = form.elements.dueDate.value;
  task.updatedAt = getNow();
  editingTaskId = "";
  updateAndRender("Saved changes to " + task.title + ".");
}

function handleTaskListClick(event) {
  const actionElement = event.target.closest("[data-action]");

  if (!actionElement) {
    return;
  }

  const item = event.target.closest("li[data-task-id]");
  const action = actionElement.dataset.action;

  if (action === "undo") {
    handleUndo();
    return;
  }

  if (!item) {
    return;
  }

  const task = findTask(item.dataset.taskId);

  if (!task) {
    return;
  }

  if (action === "edit") {
    handleEdit(task);
  } else if (action === "delete") {
    handleDelete(task);
  } else if (action === "cancel-edit") {
    editingTaskId = "";
    updateAndRender("Edit canceled for " + task.title + ".", false);
  }
}

function handleTaskListChange(event) {
  const checkbox = event.target.closest("[data-action='toggle']");

  if (!checkbox) {
    return;
  }

  const item = checkbox.closest("li[data-task-id]");
  const task = findTask(item.dataset.taskId);

  if (task) {
    handleToggle(task);
  }
}

function handleTaskListSubmit(event) {
  const form = event.target.closest("[data-action='save-edit']");

  if (!form) {
    return;
  }

  event.preventDefault();
  const item = form.closest("li[data-task-id]");
  const task = findTask(item.dataset.taskId);

  if (task) {
    handleSaveEdit(form, task);
  }
}

function handleViewChange() {
  view.status = statusFilter.value;
  view.priority = priorityFilter.value;
  view.search = searchInput.value;
  view.sort = sortSelect.value;
  editingTaskId = "";
  saveState();
  renderTasks();
}

function clearFilters() {
  view = { ...view, status: "all", priority: "all", search: "", sort: "newest" };
  editingTaskId = "";
  updateAndRender("Filters cleared.");
}

function clearCompleted() {
  const completedTasks = tasks.filter((task) => task.completed);

  if (completedTasks.length === 0) {
    statusMessage.textContent = "No completed tasks to clear.";
    renderTasks();
    return;
  }

  const firstIndex = tasks.findIndex((task) => task.completed);
  const completedItems = tasks
    .map((task, index) => ({ task, index }))
    .filter((entry) => entry.task.completed);
  tasks = tasks.filter((task) => !task.completed);
  editingTaskId = "";
  undoData = {
    type: "clear-completed",
    items: completedItems,
    index: firstIndex,
    message: "Cleared " + plural(completedTasks.length, "completed task") + "."
  };
  updateAndRender("Cleared " + plural(completedTasks.length, "completed task") + ". Use Undo to restore.");
}

taskForm.addEventListener("submit", handleAddTask);
taskList.addEventListener("click", handleTaskListClick);
taskList.addEventListener("change", handleTaskListChange);
taskList.addEventListener("submit", handleTaskListSubmit);
undoArea.addEventListener("click", handleTaskListClick);
statusFilter.addEventListener("change", handleViewChange);
priorityFilter.addEventListener("change", handleViewChange);
searchInput.addEventListener("input", handleViewChange);
sortSelect.addEventListener("change", handleViewChange);
clearFiltersButton.addEventListener("click", clearFilters);
clearCompletedButton.addEventListener("click", clearCompleted);

loadState();
syncControls();
renderTasks();
