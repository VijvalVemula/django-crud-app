document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    function fetchTasks() {
        // Only fetch if task-list is empty (no server-rendered tasks)
        if (taskList.children.length === 0 || taskList.children[0].textContent === 'No tasks available.') {
            fetch('/api/tasks/')
                .then(response => response.json())
                .then(tasks => {
                    taskList.innerHTML = '';
                    tasks.forEach(task => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.innerHTML = `
                            <span>${task.title} - ${task.description || 'No description'}</span>
                            <div>
                                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
                            </div>
                        `;
                        taskList.appendChild(li);
                    });
                });
        }
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        fetch('/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, completed: false }),
        })
            .then(response => response.json())
            .then(() => {
                taskForm.reset();
                fetchTasks();
            });
    });

    window.deleteTask = function(id) {
        fetch(`/api/tasks/${id}/`, {
            method: 'DELETE',
        }).then(() => fetchTasks());
    };

    fetchTasks();
});