import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true, // important for standalone component
  imports: [CommonModule, FormsModule], // needed for ngIf and ngModela
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user: any = {}; 
  message: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: () => this.message = 'User registered successfully!',
      error: (err) => this.message = 'Error: ' + (err.error?.message || err.message)
    });
  }
}