import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

import { SidebarComponent } from '../test/sidebar/sidebar';
import { HeaderComponent } from '../test/header/header';
import { FooterComponent } from '../test/footer/footer';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule,FormsModule,SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css']
})
export class AnnoncesComponent implements OnInit {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private BASE_URL = environment.apiUrl;

  userId: string | null = localStorage.getItem('userId');
  userName: string | null = localStorage.getItem('userName');
  userRole: string | null = localStorage.getItem('userRole');

  annonces: any[] = [];
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;

  // Form for new announcement
  nouveauContenu: string = '';
  nouveauTarget: string = 'PUBLIC';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.message = "Utilisateur non identifié";
      this.loading = false;
      return;
    }
    this.getAnnonces();
  }

  getAnnonces(): void {
    this.loading = true;
    this.http.get<any>(`${this.BASE_URL}/annonces`, {
      params: {
        userId: this.userId!,
        page: this.page.toString(),
        limit: this.limit.toString()
      }
    }).subscribe({
      next: (res) => {
        this.annonces = res.annonces;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur récupération annonces:', err);
        this.message = err.error?.message || 'Erreur serveur';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  creerAnnonce(): void {
  if (!this.nouveauContenu.trim()) {
    this.message = "Le contenu ne peut pas être vide";
    this.messageType = 'error';
    return;
  }

  this.http.post<any>(`${this.BASE_URL}/annonces`, {
    contenu: this.nouveauContenu,
    target: this.nouveauTarget,
    id_utilisateur: this.userId
  }).subscribe({
    next: (res) => {
      this.message = res.message || 'Annonce créée !';  // <-- use API message
      this.messageType = 'success';
      this.nouveauContenu = '';
      this.getAnnonces();
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Erreur création annonce:', err);
      this.message = err.error?.message || 'Erreur serveur';
      this.messageType = 'error';
      this.cd.detectChanges();
    }
  });
}

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getAnnonces();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getAnnonces();
    }
  }
}