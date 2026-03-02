import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environments';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produits-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './produit-boutique.html',
})
export class ProduitsBoutiqueComponent implements OnInit {
  BASE_URL = environment.apiUrl;
  
  userId: string | null = localStorage.getItem('userId');
  produits: any[] = [];
  boutiques: any[] = [];
  categories: any[] = [];
  favorisIds: string[] = [];

  page = 1;
  limit = 10;
  totalPages = 1;

  // Filters
  filterBoutique: string = '';
  filterCategorie: string = '';
  filterDescription: string = '';
  
  loading = true;
  message = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.getBoutiques();
    this.getCategories();
    this.getProduits();
    this.getFavoris();
  }

  getBoutiques(): void {
    this.http.get<any>(`${this.BASE_URL}/boutique`).subscribe({
      next: (res) => this.boutiques = res,
      error: (err) => console.error(err)
    });
  }

  allerAvisProduit(produitBoutiqueId: string): void {
    if (!this.userId) {
      this.message = "Vous devez être connecté pour laisser un avis";
      return;
    }

    // On passe l'ID du produit boutique dans l'URL
    this.router.navigate(['/avis-produit', produitBoutiqueId]);
  }

  getCategories(): void {
    // Supposons que tu aies un endpoint GET /categories
    this.http.get<any>(`${this.BASE_URL}/categorie/p`).subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error(err)
    });
  }

  getProduits(): void {
    this.loading = true;

    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('limit', this.limit.toString());

    if (this.filterBoutique) params = params.set('id_boutique', this.filterBoutique);
    if (this.filterCategorie) params = params.set('categorie', this.filterCategorie);
    if (this.filterDescription) params = params.set('description', this.filterDescription);

    this.http.get<any>(`${this.BASE_URL}/produitBoutique`, { params }).subscribe({
      next: (res) => {
        this.produits = res.produits;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.message = err.error?.message || 'Erreur serveur';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.getProduits();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getProduits();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getProduits();
    }
  }

  getFavoris(): void {
    if (!this.userId) return;

    this.http.get<any[]>(`${this.BASE_URL}/favoris/utilisateur/${this.userId}`)
      .subscribe({
        next: (res) => {
          // On stocke seulement les IDs des produits
          this.favorisIds = res.map(f => f.id_produit_boutique._id);
        },
        error: (err) => console.error(err)
      });
  }

  isFavori(produitId: string): boolean {
    return this.favorisIds.includes(produitId);
  }


  toggleFavori(produitBoutiqueId: string): void {
    if (!this.userId) {
      this.message = "Utilisateur non connecté";
      return;
    }

    this.http.post(`${this.BASE_URL}/favoris/toggle`, {
      id_utilisateur_client: this.userId,
      id_produit_boutique: produitBoutiqueId
    }).subscribe({
      next: () => {

        if (this.isFavori(produitBoutiqueId)) {
          this.favorisIds = this.favorisIds.filter(id => id !== produitBoutiqueId);
        } else {
          this.favorisIds.push(produitBoutiqueId);
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}