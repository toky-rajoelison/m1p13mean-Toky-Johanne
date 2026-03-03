
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { LogoutButtonComponent } from '../../logout/logout-button.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule,LogoutButtonComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})

export class SidebarComponent implements OnInit {
  
  @Input() sidebarCollapsed = false;

  userRole: string | null = null;

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
  }

  get dashboardLink(): string {
    if (this.userRole === 'ADMIN_CENTRE') return '/admin';
    if (this.userRole === 'ADMIN_BOUTIQUE') return '/boutique';
    if (this.userRole === 'ACHETEUR') return '/acheteur';
    return '/';
  }

}
