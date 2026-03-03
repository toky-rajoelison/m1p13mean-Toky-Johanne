import { Component, Input, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-boutique-p-a',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutique-p-acheteur.html',
})
export class BoutiquePAcheteur implements OnInit, OnChanges {
  @Input() selectedBoutiqueId: string | null = null;

  BASE_URL = environment.apiUrl;
  produits: any[] = [];
  categories: any[] = [];

  page = 1;
  limit = 10;
  totalPages = 1;

  filterCategorie: string = '';
  filterDescription: string = '';

  loading = true;
  message = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getCategories();
    if (this.selectedBoutiqueId) this.getProduits();
  }

  ngOnChanges(): void {
    if (this.selectedBoutiqueId) {
      this.page = 1;
      this.getProduits();
    }
  }

  getCategories(): void {
    // Endpoint pour récupérer les catégories
    this.http.get<any>(`${this.BASE_URL}/categorie/p`).subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error(err)
    });
  }

  getProduits(): void {
    if (!this.selectedBoutiqueId) return;

    this.loading = true;

    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('limit', this.limit.toString())
      .set('id_boutique', this.selectedBoutiqueId);

    if (this.filterCategorie) params = params.set('categorie', this.filterCategorie);
    if (this.filterDescription) params = params.set('description', this.filterDescription);

    this.http.get<any>(`${this.BASE_URL}/produitBoutique`, { params }).subscribe({
      next: (res) => {
        this.produits = res.produits || [];
        this.totalPages = res.totalPages || 1;
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