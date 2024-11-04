import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Doctor, DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class DoctorFormComponent implements OnInit {
  doctor: Doctor = {
    id: 0,
    name: '',
    username: '',
    email: '',
  };
  isEditMode: boolean = false;
  errorMessage: string = '';

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      const id = Number(idParam);
      this.doctorService.getDoctorById(id).subscribe({
        next: (data) => (this.doctor = data),
        error: (error) => (this.errorMessage = error.message),
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.doctorService.updateDoctor(this.doctor).subscribe({
        next: () => this.router.navigate(['/doctors']),
        error: (error) => (this.errorMessage = error.message),
      });
    } else {
      this.doctorService.addDoctor(this.doctor).subscribe({
        next: () => this.router.navigate(['/doctors']),
        error: (error) => (this.errorMessage = error.message),
      });
    }
  }
}
