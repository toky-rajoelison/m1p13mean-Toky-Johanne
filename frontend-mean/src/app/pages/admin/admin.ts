import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// <a routerLink="/loyer" class="btn btn-success">Gestion Loyer</a>
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Welcome, {{ userName }} ({{ userRole }})</h2>
    <div class="admin-links">
      <a routerLink="/annonces" class="btn btn-primary">Voir les annonces</a>
      
      <a routerLink="/factures" class="btn btn-info">Factures</a>
      <a routerLink="/demandes" class="btn btn-warning">Voir les demandes</a>
    </div>
  `,
  styles: [`
    .admin-links { margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap; }
    .btn { padding: 10px 20px; text-decoration: none; color: white; border-radius: 5px; display: inline-block; }
    .btn-primary { background-color: #007bff; }
    .btn-success { background-color: #28a745; }
    .btn-info { background-color: #17a2b8; }
    .btn-warning { background-color: #ffc107; color: #000; }
  `]
})
export class AdminComponent {
  userName = localStorage.getItem('userName') || '';
  userRole = localStorage.getItem('userRole') || '';
}