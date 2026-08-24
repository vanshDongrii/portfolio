// ---------------------------------------------
// To-Do List App
// Client-side CRUD + localStorage persistence + filtering
// State-driven: the array below is the single source of truth,
// the DOM is just a render of it.
// ---------------------------------------------
(function () {
  var form = document.getElementById('todo-form');
  if (!form) return; // not on this page

  var input = document.getElementById('todo-input');
  var formError = document.getElementById('todo-form-error');
  var list = document.getElementById('todo-list');
  var emptyMessage = document.getElementById('todo-empty');
  var countEl = document.getElementById('todo-count');
  var clearCompletedBtn = document.getElementById('todo-clear-completed');
  var filterButtons = Array.from(document.querySelectorAll('.todo-filter'));

  var STORAGE_KEY = 'todo-app:tasks';
  var currentFilter = 'all'; // 'all' | 'active' | 'completed'
  var tasks = [];

  // ---------- Persistence ----------

  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Basic shape validation so corrupted/old data doesn't crash the app
      return parsed.filter(function (t) {
        return t && typeof t.id === 'string' && typeof t.text === 'string';
      });
    } catch (err) {
      console.error('Could not read saved tasks:', err);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Could not save tasks:', err);
    }
  }

  // ---------- Helpers ----------

  function makeId() {
    return 't-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function getFilteredTasks() {
    if (currentFilter === 'active') return tasks.filter(function (t) { return !t.completed; });
    if (currentFilter === 'completed') return tasks.filter(function (t) { return t.completed; });
    return tasks;
  }

  // ---------- CRUD operations ----------

  function addTask(text) {
    var trimmed = text.trim();
    if (!trimmed) {
      formError.textContent = 'Enter a task before adding it.';
      return false;
    }
    if (trimmed.length > 200) {
      formError.textContent = 'Keep tasks under 200 characters.';
      return false;
    }
    formError.textContent = '';
    tasks.unshift({
      id: makeId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    });
    saveTasks();
    render();
    return true;
  }

  function updateTaskText(id, newText) {
    var trimmed = newText.trim();
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    if (!trimmed) {
      // Empty edit = delete, matches common to-do UX
      deleteTask(id);
      return;
    }
    task.text = trimmed;
    saveTasks();
    render();
  }

  function toggleTask(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(function (t) { return !t.completed; });
    saveTasks();
    render();
  }

  // ---------- Rendering (dynamic DOM creation, no innerHTML for user text) ----------

  function createTaskElement(task) {
    var li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' is-completed' : '');
    li.setAttribute('data-id', task.id);

    var checkbox = document.createElement('button');
    checkbox.type = 'button';
    checkbox.className = 'todo-check';
    checkbox.setAttribute('data-action', 'toggle');
    checkbox.setAttribute('aria-pressed', String(task.completed));
    checkbox.setAttribute('aria-label', task.completed
      ? 'Mark "' + task.text + '" as active'
      : 'Mark "' + task.text + '" as completed');

    var textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = task.text;
    textSpan.setAttribute('data-action', 'edit');
    textSpan.setAttribute('tabindex', '0');
    textSpan.setAttribute('title', 'Double-click to edit');

    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'todo-delete';
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('aria-label', 'Delete "' + task.text + '"');
    deleteBtn.textContent = '×';

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    return li;
  }

  function startEditing(li, task) {
    var textSpan = li.querySelector('.todo-text');
    if (!textSpan || li.querySelector('.todo-edit-input')) return;

    var editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'todo-edit-input';
    editInput.value = task.text;
    editInput.maxLength = 200;
    editInput.setAttribute('aria-label', 'Edit task text');

    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    function commit() {
      updateTaskText(task.id, editInput.value);
    }

    var committed = false;
    editInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        committed = true;
        commit();
      } else if (e.key === 'Escape') {
        committed = true;
        render(); // discard edit
      }
    });
    editInput.addEventListener('blur', function () {
      if (!committed) {
        committed = true;
        commit();
      }
    });
  }

  function render() {
    var filtered = getFilteredTasks();

    // Clear and rebuild — simplest correct approach for a list this size,
    // and keeps rendering a pure function of state.
    list.innerHTML = '';
    var fragment = document.createDocumentFragment();
    filtered.forEach(function (task) {
      fragment.appendChild(createTaskElement(task));
    });
    list.appendChild(fragment);

    emptyMessage.hidden = filtered.length !== 0;

    var activeCount = tasks.filter(function (t) { return !t.completed; }).length;
    countEl.textContent = activeCount + ' ' + (activeCount === 1 ? 'task' : 'tasks') + ' left';

    var hasCompleted = tasks.some(function (t) { return t.completed; });
    clearCompletedBtn.hidden = !hasCompleted;
  }

  // ---------- Event listeners (delegated) ----------

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var added = addTask(input.value);
    if (added) {
      input.value = '';
      input.focus();
    }
  });

  // Single delegated listener for toggle / delete on the whole list,
  // instead of attaching a listener to every task item.
  list.addEventListener('click', function (e) {
    var actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    var li = e.target.closest('.todo-item');
    if (!li) return;
    var id = li.getAttribute('data-id');
    var action = actionEl.getAttribute('data-action');

    if (action === 'toggle') {
      toggleTask(id);
    } else if (action === 'delete') {
      deleteTask(id);
    }
  });

  // Double-click (or Enter while focused) on task text to edit in place
  list.addEventListener('dblclick', function (e) {
    var textSpan = e.target.closest('[data-action="edit"]');
    if (!textSpan) return;
    var li = e.target.closest('.todo-item');
    var id = li.getAttribute('data-id');
    var task = tasks.find(function (t) { return t.id === id; });
    if (task) startEditing(li, task);
  });

  list.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var textSpan = e.target.closest('[data-action="edit"]');
    if (!textSpan) return;
    var li = e.target.closest('.todo-item');
    var id = li.getAttribute('data-id');
    var task = tasks.find(function (t) { return t.id === id; });
    if (task) startEditing(li, task);
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentFilter = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) {
        var isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      render();
    });
  });

  // ---------- Init ----------

  tasks = loadTasks();
  render();
})();
