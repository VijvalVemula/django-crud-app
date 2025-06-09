from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView, task_list

urlpatterns = [
    path("api/tasks/", TaskListCreateView.as_view(), name="task-list-create"),
    path("api/tasks/<int:pk>/", TaskRetrieveUpdateDestroyView.as_view(), name="task-detail"),
    path("", task_list, name="task-list"),
]