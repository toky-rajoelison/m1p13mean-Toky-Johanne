import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './boutique.html',
  styleUrls: ['./boutique.css']
})
export class BoutiqueComponent implements OnInit {

  private BASE_URL = environment.apiUrl;

  userName: string | null = localStorage.getItem('userName');
  userRole: string | null = localStorage.getItem('userRole');
  userId: string | null = localStorage.getItem('userId');

  boutique: any = null;
  produits: any[] = [];
  boutiques: any[] = [];

  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private cd: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadBoutiqueData();
  }

  voirAvis() {
    const boutiqueId = this.boutique._id; // adapte selon ton code
    this.router.navigate(['/boutique/avis', boutiqueId]);
  }

  VoirAvisProduit(idProduitBoutique: string) {
    if (!idProduitBoutique) {
      console.error("❌ Aucun ID produit fourni");
      return;
    }
    console.log("🛎 Voir avis pour le produit ID:", idProduitBoutique);
    this.router.navigate(['/boutique/avis-produit', idProduitBoutique]);
  }

  getMyBoutique(userId: string) {
    return this.http.get(`${this.BASE_URL}/boutique/me/${userId}`);
  }

  getBoutiques(): void {
    this.http.get<any>(`${this.BASE_URL}/boutique`).subscribe({
      next: (res) => this.boutiques = res,
      error: (err) => console.error(err)
    });
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
    
    this.getMyBoutique(this.userId).subscribe({
      next: (res: any) => {
        localStorage.setItem("boutiqueId", res.boutique._id);
        this.boutique = res.boutique;
        this.produits = res.produits;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur serveur";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
    console.log("📡 Done calling API ");
  }
}