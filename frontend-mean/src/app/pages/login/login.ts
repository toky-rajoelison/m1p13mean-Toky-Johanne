import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  mot_de_passe: string = '';
  message: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // 👈 inject ChangeDetectorRef
  ) {}

  onLogin() {
    this.message = ''; // clear old messages

    this.authService.login({ email: this.email, mot_de_passe:this.mot_de_passe }).subscribe({
      next: (res) => {
        this.message = res.message || 'Login successful';
        this.cdr.detectChanges(); // 👈 force Angular to update the view

        const role = res.user.role;
        const name = res.user.nom;

        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);

        // Redirect based on role
        if (role === 'ADMIN') this.router.navigate(['/admin']);
        else if (role === 'BOUTIQUE') this.router.navigate(['/boutique']);
        else if (role === 'ACHETEUR') this.router.navigate(['/acheteur']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Server error';
        this.cdr.detectChanges(); // 👈 also force update on error
        console.log('Login error', err);
      }
    });
  }
}