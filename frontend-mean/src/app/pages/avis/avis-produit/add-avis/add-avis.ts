import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-avis-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-avis.html'
})
export class AddAvisProduitComponent implements OnInit {
  BASE_URL = environment.apiUrl;
  userId: string | null = localStorage.getItem('userId');

  produitId: string = '';
  note: number | null = null;
  commentaire: string = '';
  message: string = '';
  hasIt = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.produitId = this.route.snapshot.paramMap.get('idProduitBoutique') || '';
  }

  hasAlreadyAvis(produitId: string, avisList: any[]): boolean {
    return avisList.some(a => a.id_acheteur === this.userId && a.id_produit_boutique === produitId);
  }

  envoyerAvis(): void {
    if (!this.userId || !this.produitId || !this.note) {
      this.message = "Veuillez remplir tous les champs obligatoires";
      this.cd.detectChanges(); // 🔹 déclenche l’update immédiat
      return;
    }

    const body = {
      note: Number(this.note),
      commentaire: this.commentaire || '',
      id_acheteur: this.userId,
      id_produit_boutique: this.produitId
    };

    this.http.post(`${this.BASE_URL}/avisProduit`, body).subscribe({
      next: () => {
        this.message = "Avis envoyé avec succès !";
        this.cd.detectChanges(); // 🔹 update immédiat du message
        setTimeout(() => this.router.navigate(['/produit-b']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.message = err.error?.message || "Erreur lors de l'envoi de l'avis";
        this.cd.detectChanges(); // 🔹 update immédiat du message
      }
    });
  }
}