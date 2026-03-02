import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-avis-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-avis.html'
})
export class AddAvisBoutiqueComponent implements OnInit {
  BASE_URL = environment.apiUrl;
  userId: string | null = localStorage.getItem('userId');

  boutiqueId: string = '';
  note: number | null = null;
  commentaire: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.boutiqueId = this.route.snapshot.paramMap.get('idBoutique') || '';
  }

  envoyerAvis(): void {
    if (!this.userId || !this.boutiqueId || !this.note) {
      this.message = "Veuillez remplir tous les champs obligatoires";
      return;
    }

    const body = {
      note: this.note,
      commentaire: this.commentaire,
      id_acheteur: this.userId,
      id_boutique: this.boutiqueId
    };

    this.http.post(`${this.BASE_URL}/avis-boutique`, body).subscribe({
      next: () => {
        this.message = "Avis envoyé avec succès !";
        // Optionnel : redirection vers la page des boutiques
        setTimeout(() => this.router.navigate(['/boutiques']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.message = err.error?.message || "Erreur lors de l'envoi de l'avis";
      }
    });
  }
}