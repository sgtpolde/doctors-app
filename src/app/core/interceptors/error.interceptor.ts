import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle specific status codes
        let errorMessage = 'An unknown error occurred.';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Network error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad request.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please log in.';
              // Optionally, handle redirection or token refresh
              break;
            case 403:
              errorMessage = 'Forbidden. You do not have permission.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 500:
              errorMessage = 'Internal server error.';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }
        console.error('HTTP Error:', error);

        // Display the error using the notification service
        this.notificationService.showError(errorMessage);

        // Pass the error to the caller
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
