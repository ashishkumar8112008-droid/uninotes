// Core State Management
let state = {
    weekStartDate: '', // Format YYYY-MM-DD
    focus: '',
    priorities: [],
    habits: [],
    tasks: {}, // Keyed by date YYYY-MM-DD
    weeklyNotes: '',
    theme: 'theme-pastel-white'
};

const HABIT_COLORS = [
    'var(--habit-teal)',
    'var(--habit-coral)',
    'var(--habit-lime)',
    'var(--habit-pink)',
    'var(--habit-yellow)',
    'var(--habit-lavender)'
];

// Helper: Get Monday of the week for a given date object
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
    return new Date(d.setDate(diff));
}

// Helper: Format date to YYYY-MM-DD
function formatDateISO(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Helper: Format date for title (e.g. "June 22, 2026")
function formatDateTitle(dateStr) {
    const parts = dateStr.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Helper: Format date for daily card subheadings (e.g., "Jun 22")
function formatDateShort(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper: Add days to a date string and return date object
function addDays(dateStr, days) {
    const parts = dateStr.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    date.setDate(date.getDate() + days);
    return date;
}

// Initial default state population (first run only)
function populateDefaultState(mondayISO) {
    state.weekStartDate = mondayISO;
    state.focus = "Stay consistent with daily habits and keep notes organized.";
    
    state.priorities = [
        { text: "Complete academic reading assignment 📚", completed: false },
        { text: "Work out at least 3 times 🏃‍♂️", completed: false },
        { text: "Organize digital notes folder 📁", completed: true },
        { text: "Practice coding problem-solving 💻", completed: false },
        { text: "Call home / catch up with family 📞", completed: false }
    ];

    state.habits = [
        { id: 'h1', text: 'Read 30 minutes', checks: [true, false, true, false, false, false, false], color: HABIT_COLORS[0] },
        { id: 'h2', text: 'Sleep 8 hours', checks: [true, true, true, false, false, false, false], color: HABIT_COLORS[1] },
        { id: 'h3', text: 'Exercise 1 hour', checks: [false, true, false, false, false, false, false], color: HABIT_COLORS[2] },
        { id: 'h4', text: 'Meditate 15 minutes', checks: [true, false, false, false, false, false, false], color: HABIT_COLORS[3] },
        { id: 'h5', text: 'Learn daily concepts', checks: [true, true, true, false, false, false, false], color: HABIT_COLORS[4] }
    ];

    // Populating sample tasks for current week
    const mon = mondayISO;
    const wed = formatDateISO(addDays(mondayISO, 2));
    const fri = formatDateISO(addDays(mondayISO, 4));
    const sat = formatDateISO(addDays(mondayISO, 5));

    state.tasks[mon] = [
        { id: 't1', text: 'Define planner design aesthetic 🎨', completed: true },
        { id: 't2', text: 'Add styling code variables ⚙️', completed: false }
    ];
    state.tasks[wed] = [
        { id: 't3', text: 'Review mid-week progress tracker 📊', completed: false }
    ];
    state.tasks[fri] = [
        { id: 't4', text: 'Draft weekend study topics 📝', completed: false },
        { id: 't5', text: 'Clean up desk stationery workspace ✨', completed: true }
    ];
    state.tasks[sat] = [
        { id: 't6', text: 'Grocery shopping & meal prep 🛒', completed: false }
    ];

    state.weeklyNotes = "This week is focused on getting our planner project off the ground. Don't forget to test print layout settings!";
    state.theme = 'theme-pastel-white';
}

// Load state from local storage or set defaults
function loadState() {
    const saved = localStorage.getItem('uninotes_planner_state');
    const today = new Date();
    const mondayISO = formatDateISO(getMonday(today));

    if (saved) {
        try {
            state = JSON.parse(saved);
            // If the week picker was cleared or unselected, default to current week
            if (!state.weekStartDate) {
                state.weekStartDate = mondayISO;
            }
        } catch (e) {
            console.error("Error parsing local storage", e);
            populateDefaultState(mondayISO);
        }
    } else {
        populateDefaultState(mondayISO);
    }
}

// Save current state to local storage
function saveState() {
    localStorage.setItem('uninotes_planner_state', JSON.stringify(state));
}

// Core Render Function
function render() {
    // 1. Sync Title and Picker
    document.getElementById('week-picker').value = state.weekStartDate;
    document.getElementById('planner-week-title').textContent = `Week of ${formatDateTitle(state.weekStartDate)}`;
    
    // Apply Theme
    document.body.className = state.theme;
    document.getElementById('theme-selector').value = state.theme;

    // 2. Focus Area Note
    document.getElementById('focus-textarea').value = state.focus || '';

    // 3. Priorities list
    const prioritiesContainer = document.getElementById('priorities-list');
    prioritiesContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const item = state.priorities[i] || { text: '', completed: false };
        const row = document.createElement('div');
        row.className = 'priority-row';
        row.innerHTML = `
            <div class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox" id="priority-chk-${i}" ${item.completed ? 'checked' : ''}>
            </div>
            <input type="text" class="task-edit-input ${item.completed ? 'completed' : ''}" style="border-bottom:none;" id="priority-txt-${i}" value="${escapeHtml(item.text)}" placeholder="Priority item ${i+1}...">
        `;
        prioritiesContainer.appendChild(row);

        // Bind priority events
        const chk = document.getElementById(`priority-chk-${i}`);
        const txt = document.getElementById(`priority-txt-${i}`);

        chk.addEventListener('change', () => {
            if (!state.priorities[i]) state.priorities[i] = { text: '', completed: false };
            state.priorities[i].completed = chk.checked;
            if (chk.checked) {
                txt.classList.add('completed');
            } else {
                txt.classList.remove('completed');
            }
            saveState();
        });

        txt.addEventListener('input', () => {
            if (!state.priorities[i]) state.priorities[i] = { text: '', completed: false };
            state.priorities[i].text = txt.value;
            saveState();
        });
    }

    // 4. Habits Tracker Grid
    const habitsTbody = document.getElementById('habits-tbody');
    habitsTbody.innerHTML = '';
    state.habits.forEach((habit, hIndex) => {
        const row = document.createElement('tr');
        
        // Progress Calculation
        const doneCount = habit.checks.filter(Boolean).length;
        const progressPct = Math.round((doneCount / 7) * 100);

        let dayCheckboxesHTML = '';
        for (let d = 0; d < 7; d++) {
            dayCheckboxesHTML += `
                <td>
                    <input type="checkbox" class="habit-checkbox" 
                           style="--habit-color: ${habit.color || 'var(--border-color)'}"
                           data-habit-index="${hIndex}" 
                           data-day-index="${d}" 
                           ${habit.checks[d] ? 'checked' : ''}>
                </td>
            `;
        }

        row.innerHTML = `
            <td class="col-habit">
                <span>${escapeHtml(habit.text)}</span>
                <button class="btn-delete-habit" data-habit-index="${hIndex}" title="Delete Habit">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
            ${dayCheckboxesHTML}
            <td class="col-progress">
                <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-end;">
                    <span>${progressPct}%</span>
                    <div class="habit-progress-bar-bg" style="width: 50px; --habit-color: ${habit.color || 'var(--border-color)'}">
                        <div class="habit-progress-fill" style="width: ${progressPct}%;"></div>
                    </div>
                </div>
            </td>
        `;
        habitsTbody.appendChild(row);
    });

    // 5. Daily Cards (Monday to Sunday)
    const dailyGrid = document.getElementById('daily-planner-grid');
    dailyGrid.innerHTML = '';
    const daysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const daysClass = ['day-mon', 'day-tue', 'day-wed', 'day-thu', 'day-fri', 'day-sat', 'day-sun'];

    for (let d = 0; d < 7; d++) {
        // Calculate dynamic dates relative to selected Monday
        // Monday index is 0, Tuesday index is 1, ..., Sunday index is 6
        const dayDate = addDays(state.weekStartDate, d);
        const dayISO = formatDateISO(dayDate);
        const dayFormatted = formatDateShort(dayDate);

        const card = document.createElement('div');
        card.className = `daily-card ${daysClass[d]}`;
        card.id = `card-${dayISO}`;

        // Get tasks
        const tasksList = state.tasks[dayISO] || [];
        const completedCount = tasksList.filter(t => t.completed).length;
        const totalCount = tasksList.length;
        const completePct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        // SVG Circular Ring calculation
        // Circumference for r=15 is ~94.2
        const strokeOffset = totalCount > 0 ? (94.2 - (completePct / 100) * 94.2) : 94.2;

        card.innerHTML = `
            <div class="daily-card-header">
                <div class="day-header-title">
                    <span class="day-name">${daysName[d]}</span>
                    <span class="day-date">${dayFormatted}</span>
                </div>
                <div class="progress-ring-container" title="${completePct}% Completed">
                    <svg class="progress-ring" width="36" height="36">
                        <circle class="progress-ring-circle-bg" stroke-width="2" fill="transparent" r="15" cx="18" cy="18"/>
                        <circle class="progress-ring-circle" stroke-width="2" fill="transparent" r="15" cx="18" cy="18" 
                                stroke-dasharray="94.2" stroke-dashoffset="${strokeOffset}"/>
                    </svg>
                    <span class="progress-percentage">${completePct}%</span>
                </div>
            </div>
            <div class="daily-card-content">
                <ul class="tasks-list" id="tasks-list-${dayISO}">
                    ${renderTasks(tasksList, dayISO)}
                </ul>
                <div class="add-task-row no-print">
                    <input type="text" class="add-task-input" placeholder="+ Add a task..." id="add-input-${dayISO}">
                    <button class="btn-add-task" data-day="${dayISO}">+</button>
                </div>
            </div>
        `;
        dailyGrid.appendChild(card);
    }

    // 6. Notes Card (8th card to complete the rectangular design)
    const notesCard = document.createElement('div');
    notesCard.className = `daily-card notes-card-element`;
    notesCard.innerHTML = `
        <div class="daily-card-header">
            <div class="day-header-title">
                <span class="day-name">Weekly Review</span>
                <span class="day-date">Notes & Scribbles</span>
            </div>
            <span style="font-size: 16px;">📝</span>
        </div>
        <div class="daily-card-content" style="padding: 0;">
            <textarea class="notes-card-textarea" id="weekly-notes-textarea" placeholder="Reflect on your week, track next week's ideas, or outline reminders here..."></textarea>
        </div>
    `;
    dailyGrid.appendChild(notesCard);

    // Bind Notes textarea
    const notesTextarea = document.getElementById('weekly-notes-textarea');
    notesTextarea.value = state.weeklyNotes || '';
    notesTextarea.addEventListener('input', () => {
        state.weeklyNotes = notesTextarea.value;
        saveState();
    });
}

// Sub-render: Tasks elements
function renderTasks(tasks, dayISO) {
    if (tasks.length === 0) {
        return `<li class="task-item" style="justify-content: center; color: var(--text-secondary); font-style: italic; font-size: 11px; opacity:0.6; user-select:none;">No plans added yet</li>`;
    }

    return tasks.map((task) => `
        <li class="task-item ${task.completed ? 'completed' : ''}" id="task-item-${task.id}">
            <div class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox task-chk" data-day="${dayISO}" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
            </div>
            <span class="task-text" data-day="${dayISO}" data-id="${task.id}">${escapeHtml(task.text)}</span>
            <div class="task-actions no-print">
                <button class="btn-task-action edit task-btn-edit" data-day="${dayISO}" data-id="${task.id}" title="Edit task">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button class="btn-task-action delete task-btn-delete" data-day="${dayISO}" data-id="${task.id}" title="Delete task">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </div>
        </li>
    `).join('');
}

// Inline Escaping
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Global Event Listeners setup
function setupEvents() {
    // Week Picker change
    document.getElementById('week-picker').addEventListener('change', (e) => {
        if (e.target.value) {
            const pickedDate = new Date(e.target.value);
            state.weekStartDate = formatDateISO(getMonday(pickedDate));
            saveState();
            render();
        }
    });

    // Theme selector change
    document.getElementById('theme-selector').addEventListener('change', (e) => {
        state.theme = e.target.value;
        document.body.className = state.theme;
        saveState();
    });

    // Focus Textarea saving
    document.getElementById('focus-textarea').addEventListener('input', (e) => {
        state.focus = e.target.value;
        saveState();
    });

    // Clear Week
    document.getElementById('btn-clear').addEventListener('click', () => {
        const confirmClear = confirm("Are you sure you want to clear all tasks for this week? Your priorities, focus, and habits will remain intact.");
        if (confirmClear) {
            // Remove tasks for dates of the current week
            for (let d = 0; d < 7; d++) {
                const dayISO = formatDateISO(addDays(state.weekStartDate, d));
                delete state.tasks[dayISO];
            }
            state.weeklyNotes = '';
            saveState();
            render();
        }
    });

    // Print Planner Action
    document.getElementById('btn-print').addEventListener('click', () => {
        window.print();
    });

    // Habit Checker Toggling
    document.getElementById('habits-tbody').addEventListener('change', (e) => {
        if (e.target.classList.contains('habit-checkbox')) {
            const habitIndex = parseInt(e.target.getAttribute('data-habit-index'));
            const dayIndex = parseInt(e.target.getAttribute('data-day-index'));
            state.habits[habitIndex].checks[dayIndex] = e.target.checked;
            saveState();
            render();
        }
    });

    // Habit Add Button
    document.getElementById('btn-add-habit').addEventListener('click', () => {
        addCustomHabit();
    });

    document.getElementById('new-habit-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addCustomHabit();
        }
    });

    // Habit Delete Action
    document.getElementById('habits-tbody').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete-habit');
        if (deleteBtn) {
            const habitIndex = parseInt(deleteBtn.getAttribute('data-habit-index'));
            if (confirm(`Do you want to delete the habit "${state.habits[habitIndex].text}"?`)) {
                state.habits.splice(habitIndex, 1);
                saveState();
                render();
            }
        }
    });

    // Daily Cards checklist event handling via delegation
    const dailyGrid = document.getElementById('daily-planner-grid');
    
    // 1. Task checkbox toggling
    dailyGrid.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-chk')) {
            const day = e.target.getAttribute('data-day');
            const id = e.target.getAttribute('data-id');
            const dayTasks = state.tasks[day] || [];
            const task = dayTasks.find(t => t.id === id);
            if (task) {
                task.completed = e.target.checked;
                saveState();
                render(); // Reload to update circular rings
            }
        }
    });

    // 2. Task actions clicking (edit/delete)
    dailyGrid.addEventListener('click', (e) => {
        // Delete button clicked
        const deleteBtn = e.target.closest('.task-btn-delete');
        if (deleteBtn) {
            const day = deleteBtn.getAttribute('data-day');
            const id = deleteBtn.getAttribute('data-id');
            state.tasks[day] = (state.tasks[day] || []).filter(t => t.id !== id);
            saveState();
            render();
            return;
        }

        // Add task triggers on button click (fallback if they click plus instead of enter)
        const addBtn = e.target.closest('.btn-add-task');
        if (addBtn) {
            const day = addBtn.getAttribute('data-day');
            submitNewTask(day);
            return;
        }

        // Edit button clicked
        const editBtn = e.target.closest('.task-btn-edit');
        if (editBtn) {
            const day = editBtn.getAttribute('data-day');
            const id = editBtn.getAttribute('data-id');
            triggerInlineEdit(day, id);
        }
    });

    // 3. Double click on task text trigger editing
    dailyGrid.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('task-text')) {
            const day = e.target.getAttribute('data-day');
            const id = e.target.getAttribute('data-id');
            triggerInlineEdit(day, id);
        }
    });

    // 4. Handle hitting Enter key in add-task inputs
    dailyGrid.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('add-task-input') && e.key === 'Enter') {
            const day = e.target.id.replace('add-input-', '');
            submitNewTask(day);
        }
    });
}

// Function to register custom habit
function addCustomHabit() {
    const input = document.getElementById('new-habit-input');
    const text = input.value.trim();
    if (text) {
        // Choose color from colors array sequentially
        const colorIdx = state.habits.length % HABIT_COLORS.length;
        const color = HABIT_COLORS[colorIdx];
        state.habits.push({
            id: 'h_' + Date.now(),
            text: text,
            checks: [false, false, false, false, false, false, false],
            color: color
        });
        input.value = '';
        saveState();
        render();
    }
}

// Task CRUD details
function submitNewTask(day) {
    const input = document.getElementById(`add-input-${day}`);
    const text = input.value.trim();
    if (text) {
        if (!state.tasks[day]) {
            state.tasks[day] = [];
        }
        state.tasks[day].push({
            id: 't_' + Date.now() + Math.random().toString(36).substr(2, 5),
            text: text,
            completed: false
        });
        input.value = '';
        saveState();
        render();
    }
}

// Inline edit swap
function triggerInlineEdit(day, id) {
    const taskItem = document.getElementById(`task-item-${id}`);
    if (!taskItem) return;

    const taskTextSpan = taskItem.querySelector('.task-text');
    const originalText = taskTextSpan.textContent;

    // Replace span with an input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = originalText;

    // Hide text and buttons
    taskTextSpan.style.display = 'none';
    const actions = taskItem.querySelector('.task-actions');
    if (actions) actions.style.display = 'none';

    // Insert input
    taskItem.insertBefore(input, taskTextSpan.nextSibling);
    input.focus();

    // Finish edit events
    const finishEdit = (cancel = false) => {
        if (!input.parentNode) return; // Already removed
        
        const newText = input.value.trim();
        if (!cancel && newText && newText !== originalText) {
            const dayTasks = state.tasks[day] || [];
            const task = dayTasks.find(t => t.id === id);
            if (task) {
                task.text = newText;
                saveState();
            }
        }
        
        // Remove input and restore visibility
        input.remove();
        taskTextSpan.style.display = '';
        if (actions) actions.style.display = '';
        
        render();
    };

    input.addEventListener('blur', () => finishEdit());
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            finishEdit();
        } else if (e.key === 'Escape') {
            finishEdit(true);
        }
    });
}

// Initialization on load
window.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupEvents();
    render();
});
