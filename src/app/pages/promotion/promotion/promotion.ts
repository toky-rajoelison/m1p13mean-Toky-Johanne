import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../test/sidebar/sidebar';
import { HeaderComponent } from '../../test/header/header';
import { FooterComponent } from '../../test/footer/footer';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './promotion.html',
  styleUrls: ['./promotion.css']
})
export class PromotionComponent {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private BASE_URL = environment.apiUrl;

  nom: string = '';
  description: string = '';
  pourcentage: number = 0;
  datetime_debut: string = '';
  datetime_fin: string = '';

  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  creerPromotion(): void {

    console.log("=================================");
    console.log("🔥 Création promotion déclenchée");

    if (!this.nom || !this.pourcentage || !this.datetime_debut || !this.datetime_fin) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    const payload = {
      nom: this.nom,
      description: this.description,
      pourcentage: this.pourcentage,
      datetime_debut: this.datetime_debut,
      datetime_fin: this.datetime_fin
    };

    console.log("📤 Données envoyées :", payload);

    this.loading = true;

    this.http.post<any>(`${this.BASE_URL}/promotion/create`, payload)
      .subscribe({
        next: (res) => {
          console.log("✅ Promotion créée :", res);
          this.successMessage = "Promotion créée avec succès !";
          this.errorMessage = '';
          this.loading = false;

          // Reset form
          this.nom = '';
          this.description = '';
          this.pourcentage = 0;
          this.datetime_debut = '';
          this.datetime_fin = '';

          this.cd.detectChanges();
        },
        error: (err) => {
          console.error("💥 Erreur création promotion :", err);
          this.errorMessage = err.error?.message || "Erreur serveur";
          this.successMessage = '';
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }
}