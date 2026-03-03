import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  template: `
    <a (click)="logout()" class="nav-item logout-item">
      <i class="fa-solid fa-right-from-bracket"></i>
      <span>Logout</span>
    </a>
  `,
  styles: [`
    .logout-item {
      cursor: pointer;
    }
      
    .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    border-radius: 8px;
  }
  `]
})
export class LogoutButtonComponent {
  private BASE_URL = environment.apiUrl;

  constructor(private authService: AuthService,private http: HttpClient, private router: Router) {}

  logout() {
    console.log('🚪 Logout lancé');

    this.authService.logout().subscribe({
      next: (res) => {
        console.log('✅ Réponse logout reçue:', res);

        // Remove all relevant keys from localStorage
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        console.log('💾 LocalStorage vidé');

        // Redirect to login page
        console.log('➡️ Redirection vers /login');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('💥 Erreur logout:', err);
        alert(err.error?.message || 'Logout failed. Try again.');
      },
      complete: () => {
        console.log('🏁 Observable logout terminé');
      }
    });
  }
}