import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Doctor, DoctorService } from '../../../core/services/doctor.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  // For filtering
  filterText: string = '';
  filteredDoctors: Doctor[] = [];

  // For sorting
  sortField: string = 'name';
  sortAscending: boolean = true;
  constructor(
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.filteredDoctors = [...this.doctors];
        this.filterDoctors();
        this.isLoading = false;
        this.cdr.markForCheck(); // Trigger change detection
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.cdr.markForCheck(); // Trigger change detection
      },
    });
  }

  filterDoctors() {
    if (this.filterText) {
      this.filteredDoctors = this.doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    } else {
      this.filteredDoctors = [...this.doctors];
    }
    this.sortDoctors(this.sortField, false); // Keep the current sorting
  }

  sortDoctors(field: string, toggleDirection: boolean = true) {
    if (toggleDirection) {
      if (this.sortField === field) {
        this.sortAscending = !this.sortAscending;
      } else {
        this.sortField = field;
        this.sortAscending = true;
      }
    }
    this.filteredDoctors.sort((a, b) => {
      const compareA = (a as any)[field]?.toString().toLowerCase() || '';
      const compareB = (b as any)[field]?.toString().toLowerCase() || '';
      if (compareA < compareB) return this.sortAscending ? -1 : 1;
      if (compareA > compareB) return this.sortAscending ? 1 : -1;
      return 0;
    });
    this.cdr.markForCheck(); // Trigger change detection
  }

  deleteDoctor(id: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          this.doctors = this.doctors.filter((doctor) => doctor.id !== id);
          this.filterDoctors(); // Reapply filtering and sorting
          this.cdr.markForCheck(); // Trigger change detection
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.cdr.markForCheck(); // Trigger change detection
        },
      });
    }
  }
}
