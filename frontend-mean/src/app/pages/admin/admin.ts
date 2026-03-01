import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ make sure this is imported
import { RouterModule } from '@angular/router'; // ✅ for routerLink in your template

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ add CommonModule and RouterModule
  template: `
    <h2>Welcome, {{ userName }} ({{ userRole }})</h2>

    <!-- Link to annonces page -->
    <div class="admin-links">
      <a routerLink="/annonces" class="btn btn-primary">
        Voir les annonces
      </a>
    </div>
  `
})
export class AdminComponent {
  userName = localStorage.getItem('userName') || '';
  userRole = localStorage.getItem('userRole') || '';
}