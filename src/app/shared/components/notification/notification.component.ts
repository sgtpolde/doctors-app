import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification, NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  closeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }

  onAnimationEnd(id: number) {
    // Handle after animation ends if needed
  }
  
}
