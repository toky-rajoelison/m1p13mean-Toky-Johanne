import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  template: `
    <h2>Welcome, {{ userName }} ({{ userRole }})</h2>
  `
})
export class AdminComponent {
  userName = localStorage.getItem('userName') || '';
  userRole = localStorage.getItem('userRole') || '';
}