// planner.js: Interactive Academic Planner
// Demonstrates: arrays & functions, DOM manipulation, event handling,
// dynamic content updates, and simple client-side persistence.

(function () {
  'use strict';

  var STORAGE_KEY = 'cedric-portfolio-tasks';

  /** @type {Array<{id:string, title:string, due:string, priority:string, done:boolean}>} */
  var tasks = [];

  var form        = document.getElementById('taskForm');
  var titleInput  = document.getElementById('taskTitle');
  var dueInput    = document.getElementById('taskDue');
  var priorityInput = document.getElementById('taskPriority');
  var listEl      = document.getElementById('taskList');
  var emptyEl     = document.getElementById('emptyState');
  var statTotal   = document.getElementById('statTotal');
  var statOpen    = document.getElementById('statOpen');
  var statDone    = document.getElementById('statDone');

  if (!form) return; // planner.js loaded on a page without the planner, bail safely

  function loadTasks() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : seedTasks();
    } catch (e) {
      tasks = seedTasks();
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      // storage unavailable (e.g. private browsing), fail silently, app still works in-memory
    }
  }

  function seedTasks() {
    return [
      { id: makeId(), title: 'Submit COS 106 term project', due: '', priority: 'high', done: false },
      { id: makeId(), title: 'Review C programming lab notes', due: '', priority: 'medium', done: true }
    ];
  }

  function makeId() {
    return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatDue(dateStr) {
    if (!dateStr) return 'No due date';
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    var opts = { day: 'numeric', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-GB', opts);
  }

  function addTask(title, due, priority) {
    tasks.unshift({ id: makeId(), title: title, due: due, priority: priority, done: false });
    persistAndRender();
  }

  function toggleTask(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (task) task.done = !task.done;
    persistAndRender();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    persistAndRender();
  }

  function persistAndRender() {
    saveTasks();
    render();
  }

  function render() {
    listEl.innerHTML = '';

    if (tasks.length === 0) {
      emptyEl.style.display = 'block';
    } else {
      emptyEl.style.display = 'none';
      tasks.forEach(function (task) {
        listEl.appendChild(buildTaskRow(task));
      });
    }

    var total = tasks.length;
    var done = tasks.filter(function (t) { return t.done; }).length;
    statTotal.textContent = total;
    statDone.textContent = done;
    statOpen.textContent = total - done;
  }

  function buildTaskRow(task) {
    var row = document.createElement('div');
    row.className = 'task-item' + (task.done ? ' done' : '');
    row.setAttribute('data-id', task.id);

    var check = document.createElement('button');
    check.type = 'button';
    check.className = 'task-check';
    check.setAttribute('aria-label', task.done ? 'Mark task as not completed' : 'Mark task as completed');
    check.textContent = task.done ? '✓' : '';
    check.addEventListener('click', function () { toggleTask(task.id); });

    var mid = document.createElement('div');
    var titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = task.title;
    var dueEl = document.createElement('div');
    dueEl.className = 'task-due';
    dueEl.textContent = formatDue(task.due);
    mid.appendChild(titleEl);
    mid.appendChild(dueEl);

    var priority = document.createElement('span');
    priority.className = 'task-priority pr-' + task.priority;
    priority.textContent = task.priority;

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'task-delete';
    del.setAttribute('aria-label', 'Delete task: ' + task.title);
    del.innerHTML = '&times;';
    del.addEventListener('click', function () { deleteTask(task.id); });

    row.appendChild(check);
    row.appendChild(mid);
    row.appendChild(priority);
    row.appendChild(del);
    return row;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      return;
    }
    addTask(title, dueInput.value, priorityInput.value);
    form.reset();
    priorityInput.value = 'medium';
    titleInput.focus();
  });

  loadTasks();
  render();
})();
