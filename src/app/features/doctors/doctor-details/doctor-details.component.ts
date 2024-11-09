import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Doctor, DoctorService } from '../../../core/services/doctor.service';
import { Task, TaskService } from '../../../core/services/task.service';
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
  doctor: Doctor = { id: 0, name: '', username: '', email: '' };;
  tasks: Task[] = [];
  errorMessages: string = '';

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.doctorService.getDoctorById(id)
      .pipe(
        catchError((error) => {
          this.errorMessages = 'Error loading doctor details';
          return of(null); // Return a null value or empty observable to prevent further errors
        })
      )
      .subscribe((data) => {
        if (data) this.doctor = data;
      });

    this.taskService.getTasksByDoctorId(id)
      .pipe(
        catchError((error) => {
          this.errorMessages = 'Failed to load tasks';
          return of([]); // Return an empty array if tasks cannot be loaded
        })
      )
      .subscribe((data) => {
        if (data) this.tasks = data;
      });
  }
}
