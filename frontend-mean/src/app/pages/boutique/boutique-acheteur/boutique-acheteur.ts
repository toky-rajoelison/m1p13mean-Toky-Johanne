import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BoutiquePAcheteur } from "../boutique-p-acheteur/boutique-p-acheteur";

@Component({
  selector: 'app-boutique-acheteur',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BoutiquePAcheteur],
  templateUrl: './boutique-acheteur.html',
  styleUrls: ['./boutique-acheteur.css']
})
export class BoutiqueAcheteur implements OnInit {
  BASE_URL = environment.apiUrl;

  boutiques: any[] = [];
  selectedBoutique: any = null;
  isModalOpen: boolean = false;


  page = 1;
  limit = 10;
  totalPages = 1;

  loading = true;
  message = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  

  ngOnInit(): void {
    this.getBoutiques();
  }

  getBoutiques(): void {
    this.loading = true;

    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('limit', this.limit.toString());

    this.http.get<any>(`${this.BASE_URL}/boutique`, { params }).subscribe({
      next: (res) => {
        this.boutiques = res.boutiques || res; // selon le format API
        this.totalPages = res.totalPages || 1;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.message = err.error?.message || 'Erreur serveur';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  selectBoutique(boutique: any): void {
    this.selectedBoutique = boutique;
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getBoutiques();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getBoutiques();
    }
  }

  openModal(boutique: any) {
    this.selectedBoutique = boutique;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedBoutique = null;
  }
}