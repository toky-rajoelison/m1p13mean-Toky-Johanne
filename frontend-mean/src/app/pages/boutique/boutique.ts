import { Component } from '@angular/core';

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [],
  template: `
    <h2>Welcome, {{ userName }} ({{ userRole }})</h2>
  `
})
export class BoutiqueComponent {
  userName = localStorage.getItem('userName') || '';
  userRole = localStorage.getItem('userRole') || '';
}