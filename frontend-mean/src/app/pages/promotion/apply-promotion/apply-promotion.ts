import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apply-promotion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './apply-promotion.html',
  styleUrls: ['./apply-promotion.css']
})
export class ApplyPromotionComponent {

  private BASE_URL = environment.apiUrl;

  boutiqueId: string | null = localStorage.getItem("boutiqueId");

  produits: any[] = [];
  promotions: any[] = [];

  selectedProduit: string = '';
  selectedPromotion: string = '';

  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerProduits();
    this.chargerPromotions();
  }

  chargerProduits() {
    if (!this.boutiqueId) return;

    this.http.get<any>(`${this.BASE_URL}/boutique/produits/${this.boutiqueId}`)
      .subscribe({
        next: (res) => {
          this.produits = res.produits;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error("Erreur chargement produits:", err);
        }
      });
  }

  chargerPromotions() {
    this.http.get<any>(`${this.BASE_URL}/promotion/all`)
      .subscribe({
        next: (res) => {
          this.promotions = res.promotions;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error("Erreur chargement promotions:", err);
        }
      });
  }

  appliquerPromotion() {

    if (!this.selectedProduit || !this.selectedPromotion) {
      this.errorMessage = "Veuillez sélectionner produit et promotion.";
      return;
    }

    const payload = {
      id_produit_boutique: this.selectedProduit,
      id_promotion: this.selectedPromotion
    };

    this.loading = true;

    this.http.post<any>(`${this.BASE_URL}/promotion/apply`, payload)
      .subscribe({
        next: (res) => {
          this.successMessage = "Promotion appliquée avec succès !";
          this.errorMessage = '';
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || "Erreur serveur";
          this.successMessage = '';
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }
}