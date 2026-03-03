import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../test/sidebar/sidebar';
import { HeaderComponent } from '../../test/header/header';
import { FooterComponent } from '../../test/footer/footer';

@Component({
  selector: 'app-promotion-produit',
  imports: [CommonModule, HttpClientModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './promotion-produit.html',
  styleUrl: './promotion-produit.css',
})
export class PromotionProduit {
// imports: [CommonModule, HttpClientModule, SidebarComponent, HeaderComponent, FooterComponent],
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
