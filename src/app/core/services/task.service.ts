import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  getTasksByDoctorId(doctorId: number): Observable<Task[]> {
    return this.http.get<Task[]>(
      `https://jsonplaceholder.typicode.com/users/${doctorId}/todos`
    );
  }
}
