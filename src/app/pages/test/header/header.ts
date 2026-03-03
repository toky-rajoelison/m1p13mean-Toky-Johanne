import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {

  userName: string | null = null;
  userRole: string | null = null;

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    this.userRole = localStorage.getItem('userRole');
  }

}