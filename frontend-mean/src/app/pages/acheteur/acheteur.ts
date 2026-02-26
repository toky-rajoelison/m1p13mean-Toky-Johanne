import { Component } from '@angular/core';

@Component({
  selector: 'app-acheteur',
  standalone: true,
  imports: [],
  template: `
    <h2>Welcome, {{ userName }} ({{ userRole }})</h2>
  `
})
export class AcheteurComponent {
  userName = localStorage.getItem('userName') || '';
  userRole = localStorage.getItem('userRole') || '';
}