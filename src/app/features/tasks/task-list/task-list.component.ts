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
  filteredTasks: Task[] = [];
  isLoading = true;
  errorMessage = '';
  filter = 'all';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  
  applyFilter(): void {
    if (this.filter === 'completed') {
      this.filteredTasks = this.tasks.filter((task) => task.completed);
    } else if (this.filter === 'incomplete') {
      this.filteredTasks = this.tasks.filter((task) => !task.completed);
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  setFilter(filter: string): void {
    this.filter = filter;
    this.applyFilter();
  }

  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
    this.taskService.toggleTaskCompletion(task).subscribe({
      next: (updatedTask) => {
        // Optionally handle success feedback here, e.g., showing a success message
      },
      error: (error) => {
        this.errorMessage = error.message;
        task.completed = !task.completed; // Revert change if the update fails
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
