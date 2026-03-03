import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],  // ✅ IMPORTANT
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}