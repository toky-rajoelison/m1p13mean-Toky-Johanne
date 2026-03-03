import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favoris.html',
  styleUrls: ['./favoris.css'],
})
export class FavorisComponent implements OnInit {

  BASE_URL = environment.apiUrl;

  userId: string | null = localStorage.getItem('userId');

  favoris: any[] = [];
  loading = true;
  message = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getFavoris();
  }

  getFavoris(): void {

    if (!this.userId) {
      this.message = "Utilisateur non connecté";
      this.loading = false;
      return;
    }

    this.http.get<any[]>(`${this.BASE_URL}/favoris/utilisateur/${this.userId}`)
      .subscribe({
        next: (res) => {
          // On récupère directement les produit_boutique
          this.favoris = res.map(f => f.id_produit_boutique);
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.message = "Erreur lors du chargement des favoris";
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  removeFavori(produitBoutiqueId: string): void {

    if (!this.userId) return;

    this.http.post(`${this.BASE_URL}/favoris/toggle`, {
      id_utilisateur_client: this.userId,
      id_produit_boutique: produitBoutiqueId
    }).subscribe({
      next: () => {
        this.favoris = this.favoris.filter(p => p._id !== produitBoutiqueId);
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

}