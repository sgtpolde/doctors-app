import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Doctor, DoctorService } from '../../../core/services/doctor.service';
import { Task, TaskService } from '../../../core/services/task.service';
import { NotificationService } from '../../../core/services/notification.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DoctorDetailsComponent implements OnInit {
  doctor: Doctor = { id: 0, name: '', username: '', email: '' };
  tasks: Task[] = [];
  errorMessages: string = '';

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private taskService: TaskService,
    private notificationService: NotificationService 
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.doctorService
      .getDoctorById(id)
      .pipe(
        catchError((error) => {
          this.errorMessages = 'Error loading doctor details';
          this.notificationService.addNotification('Error loading doctor details', 'error');
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.doctor = data;
          this.notificationService.addNotification('Doctor details loaded successfully', 'success');
        }
      });

    this.taskService
      .getTasksByDoctorId(id)
      .pipe(
        catchError((error) => {
          this.errorMessages = 'Failed to load tasks';
          this.notificationService.addNotification('Failed to load tasks', 'error');
          return of([]);
        })
      )
      .subscribe((data) => {
        if (data.length > 0) {
          this.tasks = data;
          this.notificationService.addNotification('Tasks loaded successfully', 'success');
        }
      });
  }

  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe(
      () => {
        const message = task.completed ? 'Task marked as completed' : 'Task marked as incomplete';
        this.notificationService.addNotification(message, 'success');
      },
      (error) => {
        console.error('Failed to update task', error);
        this.notificationService.addNotification('Failed to update task status', 'error');
      }
    );
  }

  hasCompletedTasks(): boolean {
    return this.tasks.some((task) => task.completed);
  }
}
