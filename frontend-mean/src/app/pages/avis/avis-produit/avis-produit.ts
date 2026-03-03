import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../test/sidebar/sidebar';
import { HeaderComponent } from '../../test/header/header';
import { FooterComponent } from '../../test/footer/footer';

@Component({
  selector: 'app-avis-produit',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './avis-produit.html',
  styleUrls: ['./avis-produit.css']
})
export class AvisProduitComponent {
  // imports: [CommonModule, HttpClientModule, SidebarComponent, HeaderComponent, FooterComponent],
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  avis: any[] = [];
  idProduitBoutique: string = '';
  total: number = 0;
  moyenne: number = 0;

  private BASE_URL = environment.apiUrl;

  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.idProduitBoutique = this.route.snapshot.paramMap.get('id')!;
    this.chargerAvis();
  }

  chargerAvis(): void {

    console.log("=======================================");
    console.log("🔥 Chargement des avis PRODUIT");
    console.log("📦 ID Produit :", this.idProduitBoutique);

    if (!this.idProduitBoutique) {
      console.log("❌ Aucun ID produit disponible");
      this.errorMessage = "ID produit manquant";
      this.loading = false;
      return;
    }

    console.log("📡 Appel API en cours...");

    this.http.get<any>(`${this.BASE_URL}/boutique/avis-produit/${this.idProduitBoutique}`)
      .subscribe({
        next: (data) => {
          console.log("✅ Réponse serveur :", data);

          this.avis = data.avis;
          this.total = data.total;
          this.moyenne = data.moyenne;

          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error("💥 Erreur chargement avis produit :", err);
          this.errorMessage = err.error?.message || "Erreur serveur";
          this.loading = false;
          this.cd.detectChanges();
        }
      });

    console.log("📡 Done calling API");
  }
}