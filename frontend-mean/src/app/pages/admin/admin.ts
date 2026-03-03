import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environments';

import { SidebarComponent } from '../test/sidebar/sidebar';
import { HeaderComponent } from '../test/header/header';
import { FooterComponent } from '../test/footer/footer';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})

export class AdminComponent implements OnInit {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private BASE_URL = environment.apiUrl;

  userId: string | null = localStorage.getItem('userId');
  userName: string | null = localStorage.getItem('userName');
  userRole: string | null = localStorage.getItem('userRole');

  // Factures arrays
  facturesRetard: any[] = [];
  facturesToday: any[] = [];

  loadingRetard: boolean = true;
  loadingToday: boolean = true;
  messageRetard: string = '';
  messageToday: string = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getFacturesRetard();
    this.getFacturesToday();
  }

  // -------------------------
  // Get factures en retard
  // -------------------------
  getFacturesRetard(): void {
    this.loadingRetard = true;
    this.http.get<any>(`${this.BASE_URL}/factures/retard`, {
      params: { userId: this.userId! }
    }).subscribe({
      next: res => {
        this.facturesRetard = res.factures;
        this.loadingRetard = false;
        this.cd.detectChanges();
      },
      error: err => {
        console.error('Error loading factures retard:', err);
        this.messageRetard = err.error?.message || 'Erreur serveur';
        this.loadingRetard = false;
      }
    });
  }

  // -------------------------
  // Get factures payées today
  // -------------------------
  getFacturesToday(): void {
    this.loadingToday = true;
    this.http.get<any>(`${this.BASE_URL}/factures/today`).subscribe({
      next: res => {
        this.facturesToday = res.factures;
        this.loadingToday = false;
        this.cd.detectChanges();
      },
      error: err => {
        console.error('Error loading factures today:', err);
        this.messageToday = err.error?.message || 'Erreur serveur';
        this.loadingToday = false;
      }
    });
  }

  get isAdminCentre(): boolean {
    return this.userRole === 'ADMIN_CENTRE';
  }
}