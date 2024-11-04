import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, catchError, shareReplay } from 'rxjs';
export interface Doctor {
  id: number;
  name: string;
  username: string;
  email: string;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  private doctorsCache$: Observable<Doctor[]> | null = null;

  getDoctors(): Observable<Doctor[]> {
    if (!this.doctorsCache$) {
      this.doctorsCache$ = this.http
        .get<Doctor[]>(this.apiUrl)
        .pipe(shareReplay(1), catchError(this.handleError));
    }
    return this.doctorsCache$;
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http
      .get<Doctor>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addDoctor(doctor: Doctor): Observable<Doctor> {
    // Simulate adding a doctor
    return this.http
      .post<Doctor>(this.apiUrl, doctor)
      .pipe(catchError(this.handleError));
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    // Simulate updating a doctor
    return this.http
      .put<Doctor>(`${this.apiUrl}/${doctor.id}`, doctor)
      .pipe(catchError(this.handleError));
  }

  deleteDoctor(id: number): Observable<void> {
    // Simulate deleting a doctor
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // You can customize the error handling here
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('An error occurred while fetching data.')
    );
  }
}
