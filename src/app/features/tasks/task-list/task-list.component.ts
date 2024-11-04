import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskService } from '../../../core/services/task.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  toggleTaskCompletion(task: Task): void {
    // Update the task's completion status
    task.completed = !task.completed;
    // Optionally, send an update to the server
    this.taskService.updateTask(task).subscribe({
      next: () => {
        // Success message or further actions
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((task) => task.id !== id);
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
    }
  }
}
