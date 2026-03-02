import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environments';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produits-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './produit-boutique.html',
})
export class ProduitsBoutiqueComponent implements OnInit {
  BASE_URL = environment.apiUrl;

  produits: any[] = [];
  boutiques: any[] = [];
  categories: any[] = [];

  page = 1;
  limit = 10;
  totalPages = 1;

  // Filters
  filterBoutique: string = '';
  filterCategorie: string = '';
  filterDescription: string = '';

  loading = true;
  message = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getBoutiques();
    this.getCategories();
    this.getProduits();
  }

  getBoutiques(): void {
    this.http.get<any>(`${this.BASE_URL}/boutique`).subscribe({
      next: (res) => this.boutiques = res,
      error: (err) => console.error(err)
    });
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
}