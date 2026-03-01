import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-acheteur',
  standalone: true,
  imports: [CommonModule, RouterModule], // for *ngIf, routerLink etc.
  templateUrl: './acheteur.html', // moved from inline
  styleUrls: ['./acheteur.css']   // optional, can create a CSS file
})
export class AcheteurComponent {
  userName = localStorage.getItem('userName') || '';
  userRole = localStorage.getItem('userRole') || '';
}