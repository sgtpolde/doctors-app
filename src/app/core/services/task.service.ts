import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

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

  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(this.apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  updateTask(task: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${task.id}`, task)
      .pipe(catchError(this.handleError));
  }

  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  toggleTaskCompletion(task: Task): Observable<Task> {
    const updatedTask = { ...task, completed: !task.completed };
    return this.updateTask(updatedTask);
  }
  

  private handleError(error: any) {
    // You can customize the error handling here
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('An error occurred while fetching data.')
    );
  }
}
