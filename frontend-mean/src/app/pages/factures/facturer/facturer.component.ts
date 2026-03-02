import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-facturer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './facturer.component.html',
})
export class FacturerComponent implements OnInit {
  private BASE_URL = environment.apiUrl;

  boutiques: any[] = [];
  typesCharges: any[] = [];

  // Form fields
  selectedBoutique: string = '';
  selectedTypeCharge: string = '';
  selectedCategorie: string = 'FIXE';
  montant: number = 0;
  description: string = '';
  mois: number = new Date().getMonth() + 1; // current month
  annee: number = new Date().getFullYear(); // current year
  statut: string = 'EN_ATTENTE';
  date_echeance: string = '';

  message: string = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBoutiques();
    this.getTypesCharges();
  }

  getBoutiques(): void {
    this.http.get<any>(`${this.BASE_URL}/boutique`).subscribe({
      next: (res) => this.boutiques = res,
      error: (err) => console.error(err)
    });
  }

  getTypesCharges(): void {
    this.http.get<any>(`${this.BASE_URL}/typeCharges`).subscribe({
      next: (res) => this.typesCharges = res,
      error: (err) => console.error(err)
    });
  }

  

  creerFacture(): void {
    if (!this.selectedBoutique || !this.selectedTypeCharge || !this.montant || !this.mois || !this.annee || !this.date_echeance) {
        this.message = "Tous les champs obligatoires doivent être remplis";
        return;
    }

    this.loading = true;

    const factureData = {
        id_utilisateur: localStorage.getItem('userId'), // or from auth service
        id_boutique: this.selectedBoutique,
        id_type_charge: this.selectedTypeCharge,
        categorie: this.selectedCategorie,
        montant: this.montant,
        description: this.description,
        // date_facturation: new Date(),
        mois: this.mois,
        annee: this.annee,
        statut: this.statut,
        date_echeance: this.date_echeance
    };

    console.log("📤 Facture Data being sent:", factureData); // <--- ADD THIS LINE

    this.http.post<any>(`${this.BASE_URL}/factures`, factureData).subscribe({
        next: (res) => {
        alert('Facture créée avec succès !');
        this.router.navigate(['/factures']);
        },
        error: (err) => {
        console.error(err);
        this.message = err.error?.message || 'Erreur serveur';
        this.loading = false;
        this.cd.detectChanges();
        }
    });

    }
}