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
  
    service.addNotification('Test error', 'error');
  
    // Check that the notification was added
    expect(notificationsLength).toBe(1);
  
    // Wait for the notification to auto-remove (5 seconds in the service)
    tick(5000);
  
    // Check that the notification was removed
    expect(notificationsLength).toBe(0);
  }));
});
