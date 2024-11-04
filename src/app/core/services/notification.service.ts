import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private notificationId = 0;

  constructor() {}

  showError(message: string): void {
    this.addNotification(message, 'error');
  }

  showSuccess(message: string): void {
    this.addNotification(message, 'success');
  }

  // Optionally, add methods for warning and info

  private addNotification(message: string, type: Notification['type']) {
    const id = this.notificationId++;
    const notification: Notification = { id, message, type };
    this.notifications.push(notification);
    this.notificationsSubject.next(this.notifications);

    // Auto-remove notification after a certain time
    setTimeout(() => {
      this.removeNotification(id);
    }, 5000); // Adjust the duration as needed
  }

  removeNotification(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notificationsSubject.next(this.notifications);
  }
}
