import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adminBoutique.html',
  styleUrls: ['./adminBoutique.css']
})
export class LoginBoutiqueComponent {
  email: string = 'johndoe@gmail.com';
  mot_de_passe: string = 'john';
  message: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin() {
    console.log('🔥 Login lancé');
    console.log('📧 Email:', this.email);
    console.log('🔑 Mot de passe:', this.mot_de_passe);

    this.message = ''; // clear old messages

    this.authService.login({ email: this.email, mot_de_passe:this.mot_de_passe }).subscribe({
      next: (res) => {
        console.log('✅ Réponse login reçue:', res);

        this.message = res.message || 'Login successful';
        this.cdr.detectChanges();
        console.log('💬 Message mis à jour:', this.message);

        if (!res.user) {
          console.error('❌ Pas de user renvoyé par le backend !');
          return;
        }

        const role = res.user.role;
        const name = res.user.nom;
        const id = res.user.id;

        console.log('🆔 userId:', id);
        console.log('👤 userName:', name);
        console.log('🎭 userRole:', role);

        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', id);

        console.log('💾 LocalStorage mis à jour');

        // Redirect based on role
        if (role === 'ADMIN_CENTRE') {
          console.log('➡️ Redirection vers /admin');
          this.router.navigate(['/admin']);
        }
        else if (role === 'ADMIN_BOUTIQUE') {
          console.log('➡️ Redirection vers /boutique');
          this.router.navigate(['/boutique']);
        }
        else if (role === 'ACHETEUR') {
          console.log('➡️ Redirection vers /acheteur');
          this.router.navigate(['/acheteur']);
        } else {
          console.warn('⚠️ Role inconnu, pas de redirection');
        }
      },
      error: (err) => {
        console.log('💥 Erreur login:', err);
        this.message = err.error?.message || 'Server error';
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('🏁 Observable login terminé');
      }
    });
  }
}