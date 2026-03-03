import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environments';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from '../test/sidebar/sidebar';
import { HeaderComponent } from '../test/header/header';
import { FooterComponent } from '../test/footer/footer';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './factures.component.html',
})
export class FacturesComponent implements OnInit {

  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private BASE_URL = environment.apiUrl;

  userId: string | null = localStorage.getItem('userId');
  userRole: string | null = localStorage.getItem('userRole');

  factures: any[] = [];
  typesCharges: any[] = [];
  boutiques: any[] = [];

  page = 1;
  limit = 10;
  totalPages = 1;

  // Filters
  filterCategorie: string = '';
  filterTypeCharge: string = '';
  filterMois: number | null = null;
  filterAnnee: number | null = null;

  // Dropdown options
  months = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
  ];
  categories = ['FIXE', 'VARIABLE', 'PONCTUEL'];

  message: string = '';
  loading = true;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTypesCharges();
    if (this.isAdminCentre) this.getBoutiques();
    this.getFactures();
  }

  get isAdminCentre(): boolean {
    return this.userRole === 'ADMIN_CENTRE';
  }

  getTypesCharges(): void {
    this.http.get<any>(`${this.BASE_URL}/typeCharges`).subscribe({
      next: (res) => this.typesCharges = res,
      error: (err) => console.error(err)
    });
  }

  getBoutiques(): void {
    this.http.get<any>(`${this.BASE_URL}/boutique`).subscribe({
      next: (res) => this.boutiques = res,
      error: (err) => console.error(err)
    });
  }

  getFactures(): void {
    this.loading = true;
    let params = new HttpParams()
      .set('userId', this.userId!)
      .set('page', this.page.toString())
      .set('limit', this.limit.toString());

    if (this.filterCategorie) params = params.set('categorie', this.filterCategorie);
    if (this.filterTypeCharge) params = params.set('id_type_charge', this.filterTypeCharge);
    if (this.filterMois) params = params.set('mois', this.filterMois);
    if (this.filterAnnee) params = params.set('annee', this.filterAnnee);

    this.http.get<any>(`${this.BASE_URL}/factures`, { params }).subscribe({
      next: (res) => {
        this.factures = res.factures;

        // Calculate totalPages if backend provides totalItems instead of totalPages
        if (res.totalPages) {
          this.totalPages = res.totalPages;
        } else if (res.totalItems) {
          this.totalPages = Math.ceil(res.totalItems / this.limit);
        } else {
          this.totalPages = 1; // fallback
        }

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
    this.page = 1; // reset to first page on filter change
    this.getFactures();
  }

  payerFacture(factureId: string): void {
    if (!confirm('Voulez-vous confirmer le paiement ?')) return;

    this.http.post<any>(`${this.BASE_URL}/factures/payer/${factureId}`, { id_utilisateur: this.userId })
      .subscribe({
        next: (res) => {
          alert('Facture payée !');
          this.getFactures();
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Erreur serveur');
        }
      });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getFactures();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getFactures();
    }
  }
}