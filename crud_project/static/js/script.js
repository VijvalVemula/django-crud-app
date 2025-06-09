document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Function to get CSRF token from cookies
    function getCsrfToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === 'csrftoken=') {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function fetchTasks() {
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

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        fetch('/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(), // Include CSRF token
            },
            body: JSON.stringify({ title, description, completed: false }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(() => {
                taskForm.reset();
                fetchTasks();
            })
            .catch(error => console.error('Error:', error));
    });

    window.deleteTask = function(id) {
        fetch(`/api/tasks/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCsrfToken(), // Include CSRF token
            },
        }).then(() => fetchTasks());
    };

    fetchTasks();
});