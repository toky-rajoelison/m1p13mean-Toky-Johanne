import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loyer',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './loyer.component.html',
  styleUrls: ['./loyer.component.css']
})
export class LoyerComponent implements OnInit {
  private BASE_URL = environment.apiUrl;

  userId: string | null = localStorage.getItem('userId');
  userRole: string | null = localStorage.getItem('userRole');

  boutiques: any[] = [];
  loading: boolean = true;
  message: string = '';

  selectedBoutique: any = null;
  history: any[] = [];

  // For payment form
  showPayForm: boolean = false;
  nextMonth: number = 0;
  nextYear: number = 0;
  amountToPay: number = 0;
  paymentDescription: string = '';

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.message = 'Utilisateur non identifié';
      this.loading = false;
      return;
    }
    this.loadBoutiques();
  }

  // Load boutiques and status
  loadBoutiques() {
    this.loading = true;
    this.http.get<any[]>(`${this.BASE_URL}/loyer/status`, { params: { userId: this.userId! } })
      .subscribe({
        next: (res) => {
          this.boutiques = res;
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erreur récupération boutiques:', err);
          this.message = err.error?.message || 'Erreur serveur';
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  // Show history modal for a boutique
  showHistory(boutique: any) {
    this.selectedBoutique = boutique.boutique;
    this.history = [];
    this.http.get<any[]>(`${this.BASE_URL}/loyer/history/${boutique.boutique._id}`)
      .subscribe({
        next: (res) => {
          this.history = res;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erreur récupération historique:', err);
        }
      });
  }

  // Prepare the next payment
  preparePayment() {
    if (!this.selectedBoutique) return;
    // Calculate next month/year based on last payment
    if (this.history.length === 0) {
      const now = new Date();
      this.nextMonth = now.getMonth() + 1; // JS month 0-11
      this.nextYear = now.getFullYear();
    } else {
      const last = this.history[0]; // last payment sorted by year/month desc
      this.nextMonth = last.month === 12 ? 1 : last.month + 1;
      this.nextYear = last.month === 12 ? last.year + 1 : last.year;
    }

    // Get amount from loyer_emplacement
    this.http.get<any[]>(`${this.BASE_URL}/loyer_emplacement`, { params: { emplacement: this.selectedBoutique.emplacement.toString() } })
      .subscribe({
        next: (res) => {
          // Find the latest loyer before the 1st of the month being paid
          const today = new Date(this.nextYear, this.nextMonth - 1, 1);
          const latest = res.filter(l => new Date(l.date_debut) <= today)
                            .sort((a,b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime())[0];
          this.amountToPay = latest?.montant || 0;
          this.showPayForm = true;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erreur récupération loyer:', err);
        }
      });
  }

  // Make payment
  payLoyer() {
    if (!this.selectedBoutique) return;

    this.http.post<any>(`${this.BASE_URL}/loyer/pay`, {
      id_boutique: this.selectedBoutique._id,
      id_utilisateur_centre: this.userId,
      month: this.nextMonth,
      year: this.nextYear,
      amount: this.amountToPay,
      description: this.paymentDescription
    }).subscribe({
      next: (res) => {
        this.message = 'Paiement effectué !';
        this.showPayForm = false;
        this.paymentDescription = '';
        this.loadBoutiques();
        this.showHistory(this.selectedBoutique);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur paiement:', err);
        this.message = err.error?.message || 'Erreur serveur';
      }
    });
  }
}