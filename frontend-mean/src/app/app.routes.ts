import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './components/register/register';
import { AdminComponent } from './pages/admin/admin';
import { BoutiqueComponent } from './pages/boutique/boutique';
import { AcheteurComponent } from './pages/acheteur/acheteur';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'boutique', component: BoutiqueComponent },
  { path: 'acheteur', component: AcheteurComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];