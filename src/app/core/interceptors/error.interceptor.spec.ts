import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should display error notification on HTTP error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('Expected an error'),
      error: (error: Error) => {
        expect(error.message).toBe('Resource not found.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush('Error', { status: 404, statusText: 'Not Found' });

    expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Resource not found.');
  });
});
