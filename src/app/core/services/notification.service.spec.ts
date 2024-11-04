import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should add and remove notifications', fakeAsync(() => {
    let notificationsLength = 0;
    service.notifications$.subscribe((notifications) => {
      notificationsLength = notifications.length;
    });
  
    service.showError('Test error');
    tick(0); // Process the addition
  
    expect(notificationsLength).toBe(1);
  
    tick(6000); // Wait for the notification to auto-remove
  
    expect(notificationsLength).toBe(0);
  }));
  
});
