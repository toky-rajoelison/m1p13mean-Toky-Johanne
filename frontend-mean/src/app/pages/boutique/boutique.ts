import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boutique.html',
  styleUrls: ['./boutique.css']
})
export class BoutiqueComponent implements OnInit {

  userName: string | null = localStorage.getItem('userName');
  userRole: string | null = localStorage.getItem('userRole');
  userId: string | null = localStorage.getItem('userId');

  boutique: any = null;
  produits: any[] = [];

  loading: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBoutiqueData();
  }

  loadBoutiqueData(): void {
    console.log("🔥 loadBoutiqueData appelé");
    console.log("🆔 userId:", this.userId);

    if (!this.userId) {
      console.log("❌ Pas de userId");
      this.errorMessage = "Utilisateur non identifié";
      this.loading = false;
      return;
    }

    console.log("📡 Appel API en cours...");

    this.authService.getMyBoutique(this.userId).subscribe({
      next: (res: any) => {
        this.boutique = res.boutique;
        this.produits = res.produits;
        this.loading = false;
        this.cd.detectChanges(); // ⚡️ important
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur serveur";
        this.loading = false;
        this.cd.detectChanges(); // ⚡️ important
      }
    });
  }
}