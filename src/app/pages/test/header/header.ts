import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {

  userName: string | null = null;
  userRole: string | null = null;

  showNotifications = false;
  notifications: any[] = [];

  private BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    this.userRole = localStorage.getItem('userRole');

    this.fetchNotifications();
  }

  fetchNotifications(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const params = new HttpParams().set('userId', userId);

    this.http.get<any>(`${this.BASE_URL}/notifications`, { params })
      .subscribe({
        next: res => {
          // assume res is an array of notifications with read info
          this.notifications = res.map((n: any) => ({
            _id: n._id,
            message: n.message,
            read: n.read,
            created_at: new Date(n.created_at),
            type: n.type,
            event: n.event,
            time: this.formatTime(n.created_at)
          }));
        },
        error: err => {
          console.error('Failed to load notifications:', err);
        }
      });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // mark unread notifications as read
      this.notifications.forEach(notif => {
        if (!notif.read) {
          this.http.post(`${this.BASE_URL}/notifications/${notif._id}/read`, { userId })
            .subscribe({
              next: () => notif.read = true,
              error: err => console.error('Failed to mark notification read', err)
            });
        }
      });
    }
  }

  hasUnread(): boolean {
    return this.notifications.some(n => !n.read);
  }

  formatTime(date: string | Date): string {
    const d = new Date(date);
    const diff = (new Date().getTime() - d.getTime()) / 1000; // seconds
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  }
}