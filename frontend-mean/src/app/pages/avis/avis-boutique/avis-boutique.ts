import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avis-boutique',
  standalone: true,
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './avis-boutique.html',
  styleUrls: ['./avis-boutique.css']
})
export class AvisBoutiqueComponent {
  avis: any[] = [];
  idBoutique: string = '';

  private BASE_URL = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.idBoutique = this.route.snapshot.paramMap.get('id')!;
    this.chargerAvis();
  }

  chargerAvis(): void {
    console.log('Chargement des avis pour la boutique :', this.idBoutique);

    if (!this.idBoutique) {
      console.log('❌ Aucun ID de boutique disponible');
      return;
    }

    console.log('📡 Appel API pour récupérer les avis en cours...');

    this.http.get<any>(`${this.BASE_URL}/boutique/avis/${this.idBoutique}`)
      .subscribe({
        next: (data) => {
          console.log('Réponse reçue du serveur :', data);
          this.avis = data.avis;
          console.log('Avis stockés dans le composant :', this.avis);
          this.cd.detectChanges(); // 🔥 Forcer la détection des changements
        },
        error: (err) => {
          console.error('Erreur lors du chargement des avis :', err);
          this.cd.detectChanges(); // 🔥 Pour s'assurer que l'UI reflète l'erreur si besoin
        }
      });

    console.log('📡 Done calling API pour les avis');
  }
}