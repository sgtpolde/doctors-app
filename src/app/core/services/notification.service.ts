// notification.service.ts
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
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private currentId = 0;

  addNotification(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ): void {
    const notification: Notification = {
      id: ++this.currentId,
      message,
      type,
    };
    const notifications = [
      ...this.notificationsSubject.getValue(),
      notification,
    ];
    this.notificationsSubject.next(notifications);

    // Remove the notification automatically after a few seconds
    setTimeout(() => this.removeNotification(notification.id), 5000);
  }

  removeNotification(id: number): void {
    const notifications = this.notificationsSubject
      .getValue()
      .filter((notification) => notification.id !== id);
    this.notificationsSubject.next(notifications);
  }
}
