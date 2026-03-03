import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../test/sidebar/sidebar';
import { HeaderComponent } from '../test/header/header';
import { FooterComponent } from '../test/footer/footer';

@Component({
  selector: 'app-acheteur',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, FooterComponent], // for *ngIf, routerLink etc.
  templateUrl: './acheteur.html',
  styleUrls: ['./acheteur.css']
})
export class AcheteurComponent {

  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  userName = localStorage.getItem('userName') || '';
  userRole = localStorage.getItem('userRole') || '';
}