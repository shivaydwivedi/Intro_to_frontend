# Project 08: To-do List

Build an accessible task manager with vanilla JavaScript, semantic HTML, responsive CSS, and `localStorage`.

## Overview

This project teaches arrays, objects, state management, CRUD behavior, event delegation, filtering, sorting, persistence, and safe recovery from invalid stored data. The app runs fully in the browser without frameworks, dependencies, external APIs, authentication, or a backend.

## Learning Objectives

- Represent tasks as objects in an array.
- Add, display, edit, complete, delete, and restore tasks.
- Render a list from application state.
- Validate form input with JavaScript.
- Use event delegation for list actions.
- Combine filters, search, and sorting.
- Persist tasks and view preferences with `localStorage`.
- Recover safely from corrupted saved data.
- Keep storage, state, and the interface synchronized.

## Prerequisites

- HTML forms and labels
- CSS layout basics
- JavaScript arrays, objects, functions, and events
- Basic DOM creation with `createElement` and `textContent`
- Basic understanding of `localStorage`

## Feature Requirements

- Add a task with title, priority, and optional due date
- Show all tasks in a semantic list
- Mark tasks complete or active
- Edit title, priority, and due date
- Delete a single task with undo
- Clear completed tasks with undo
- Filter by All, Active, or Completed
- Filter by priority
- Search by title
- Sort by newest, oldest, due date, or priority
- Show total, active, completed, and visible counts
- Persist tasks and view preferences
- Recover from invalid saved data

## Task Data Model

Each task is stored as an object:

```js
{
  id: "stable-id",
  title: "Task title",
  completed: false,
  priority: "medium",
  dueDate: "2026-07-13",
  createdAt: "2026-07-13T10:30:00.000Z",
  updatedAt: "2026-07-13T10:30:00.000Z"
}
```

Priority must be `low`, `medium`, or `high`. `dueDate` is either a `YYYY-MM-DD` string or an empty string.

## CRUD Behavior

- Create: validate the title, then add a new task object.
- Read: render the current filtered and sorted task list.
- Update: toggle completion or save edits to task fields.
- Delete: remove one task and offer a temporary Undo action.

## Validation Rules

- Title is required.
- Leading and trailing whitespace is trimmed.
- Whitespace-only titles are rejected.
- Title must be at least 2 characters.
- Title must be 100 characters or fewer.
- Internal spacing is preserved.
- Priority defaults to Medium.
- Due date is optional.

## Filtering and Sorting Rules

Filters combine. For example, Active + High priority + search text shows only active high-priority tasks whose titles match the search.

Sort options:

- Newest first: newest `createdAt` first
- Oldest first: oldest `createdAt` first
- Due date: earliest due date first, undated tasks after dated tasks
- Priority: High, then Medium, then Low

Sorting uses a copied array for display and does not mutate the canonical task array.

## Completion, Editing, Deletion, and Undo

Completed tasks remain readable and are not labeled overdue. Editing is inline, only one task can be edited at a time, and Cancel restores the unchanged task. Delete and Clear Completed each provide one temporary Undo opportunity. A new delete or clear-completed action replaces the previous undo opportunity.

## Date Status Behavior

- Past due date + active task: Overdue
- Current local date + active task: Due today
- Future due date + active task: Active
- Completed task: Completed

Date comparisons use local `YYYY-MM-DD` strings to avoid date-only UTC surprises.

## localStorage

Storage key:

```text
frontend-beginner-projects.todo-list.v1
```

The app stores a single structured object containing tasks and view preferences. It does not store editing state, undo state, sensitive data, or anything outside the current browser.

## Corrupted-Storage Recovery

The solution catches read, parse, validation, and write errors. If saved data cannot be used, it falls back to an empty task list and default filters, then shows a restrained recovery message instead of crashing.

## Privacy Limitation

Tasks stay in the current browser through `localStorage`. They are not synchronized across devices and are not sent to a server.

## Accessibility Requirements

- Use a descriptive document title and `lang="en"`.
- Use semantic landmarks and one clear `h1`.
- Use real forms and explicit labels.
- Connect helper and error text with `aria-describedby`.
- Use a semantic task list.
- Use labeled completion checkboxes.
- Use native buttons.
- Provide visible focus styles.
- Announce concise operation results through a polite status region.
- Do not put the whole task list in a live region.
- Keep priority and date states understandable without color alone.

## Suggested Workflow

1. Open `starter/index.html` and inspect the form and controls.
2. Read the task-object shape in `starter/js/app.js`.
3. Add state for tasks, filters, sorting, editing, and undo.
4. Write validation helpers.
5. Create task objects.
6. Render tasks with DOM methods and `textContent`.
7. Add completion, edit, delete, undo, and clear-completed behavior.
8. Add filtering, searching, sorting, and counts.
9. Add localStorage loading, saving, and recovery.
10. Test edge cases before comparing with the solution.

## Opening the Project

To work on the challenge, open:

```text
projects/08-todo-list/starter/index.html
```

To review the completed reference, open:

```text
projects/08-todo-list/solution/index.html
```

## Project Structure

```text
projects/08-todo-list/
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

## Manual Functional Testing Checklist

- Add a valid task.
- Reject empty and whitespace-only titles.
- Reject titles longer than 100 characters.
- Add low, medium, and high priority tasks.
- Add tasks with and without due dates.
- Mark tasks complete and active.
- Edit and save each editable field.
- Cancel an edit without changing the task.
- Delete a task and undo it.
- Clear completed tasks and undo.
- Clear filters.
- Try every sort option.

## Persistence Testing Checklist

- Add tasks, reload, and confirm they return.
- Change filters and sorting, reload, and confirm preferences return.
- Store corrupted JSON under the storage key and confirm the app recovers.
- Store valid JSON with invalid task data and confirm the app recovers safely.

## Edge-Case Checklist

- Task title containing HTML-like text displays as text only.
- Incomplete past-due tasks show Overdue.
- Today's incomplete due date shows Due today.
- Completed past-due tasks show Completed.
- Clearing completed with none available shows a clear status message.
- Filtering with no matches shows a Clear Filters action.

## Keyboard and Responsive Testing Checklist

- Add, edit, save, cancel, delete, undo, and clear completed are reachable by keyboard.
- Focus moves predictably after add, edit, save, cancel, delete, and undo.
- At 320px, controls stack and long titles wrap.
- Around 768px, filters use space cleanly.
- At 1280px, form, filters, and tasks remain readable.
- At 200% zoom, text and controls remain usable.

## Bonus Challenges

- Add task categories or tags.
- Add drag-and-drop ordering.
- Add recurring tasks.
- Add import and export.
- Add multiple task lists.
- Add dark mode.
- Add automated tests.
- Add cloud synchronization.

Do not implement these optional challenges today.

## Helpful Links

- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [MDN: addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN: Event delegation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
- [MDN: createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [MDN: textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [MDN: input date](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date)

## Solution Guidance

Try the starter before opening the solution. The finished app should keep state, storage, and the interface synchronized while rendering all task titles as text, not HTML.
