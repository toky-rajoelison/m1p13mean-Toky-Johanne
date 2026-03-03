import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

import { SidebarComponent } from '../test/sidebar/sidebar';
import { HeaderComponent } from '../test/header/header';
import { FooterComponent } from '../test/footer/footer';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.css']
})
export class DemandesComponent implements OnInit {


  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }


  private BASE_URL = environment.apiUrl;

  userId: string | null = localStorage.getItem('userId');
  userName: string | null = localStorage.getItem('userName');
  userRole: string | null = localStorage.getItem('userRole');

  demandes: any[] = [];

  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;

  // create demande
  nouvelleDescription: string = '';

  // comments
  nouveauCommentaire: { [key: string]: string } = {};

  message: string = '';
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.message = "User not authenticated";
      this.loading = false;
      return;
    }
    this.getDemandes();
  }

  // ======================
  // GET DEMANDES
  // ======================
  getDemandes(): void {
    this.loading = true;

    this.http.get<any>(`${this.BASE_URL}/demandes`, {
      params: {
        userId: this.userId!,
        page: this.page.toString(),
        limit: this.limit.toString()
      }
    }).subscribe({
      next: (res) => {
        this.demandes = res.demandes;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading demandes:', err);
        this.message = err.error?.message || 'Server error';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // ======================
  // CREATE DEMANDE (ADMIN_BOUTIQUE ONLY)
  // ======================
  creerDemande(): void {
    if (!this.nouvelleDescription.trim()) {
      this.message = "Description cannot be empty";
      return;
    }

    this.http.post<any>(`${this.BASE_URL}/demandes`, {
      description: this.nouvelleDescription,
      id_utilisateur: this.userId
    }).subscribe({
      next: () => {
        this.message = 'Demande sent successfully';
        this.nouvelleDescription = '';
        this.getDemandes();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error creating demande:', err);
        this.message = err.error?.message || 'Server error';
        this.cd.detectChanges();
      }
    });
  }

  // ======================
  // ADD COMMENT
  // ======================
  ajouterCommentaire(id_demande: string): void {
    const contenu = this.nouveauCommentaire[id_demande];

    if (!contenu || !contenu.trim()) return;

    this.http.post<any>(`${this.BASE_URL}/demandes/commentaire`, {
      id_demande,
      id_utilisateur: this.userId,
      commentaire: contenu
    }).subscribe({
      next: () => {
        this.nouveauCommentaire[id_demande] = '';
        this.getDemandes();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.message = err.error?.message || 'Server error';
        this.cd.detectChanges();
      }
    });
  }

  // ======================
  // PAGINATION
  // ======================
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getDemandes();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getDemandes();
    }
  }
}