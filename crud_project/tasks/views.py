from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# API Views
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

# TemplateView
def task_list(request):
    tasks = Task.objects.all()
    context = {
        "tasks": tasks
    }
    return render(request, "tasks/task_list.html", context)
