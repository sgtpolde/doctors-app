import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Doctor, DoctorService } from '../../../core/services/doctor.service';
import { Task, TaskService } from '../../../core/services/task.service';



@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DoctorDetailsComponent implements OnInit {
  doctor!: Doctor;
  tasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctorService.getDoctorById(id).subscribe((data) => {
      this.doctor = data;
    });
    this.taskService.getTasksByDoctorId(id).subscribe((data) => {
      this.tasks = data;
    });
  }
}
