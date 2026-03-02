import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminComponent } from './pages/admin/admin';
import { BoutiqueComponent } from './pages/boutique/boutique';
import { AcheteurComponent } from './pages/acheteur/acheteur';
import { AvisBoutiqueComponent } from './pages/avis/avis-boutique/avis-boutique';
import { AvisProduitComponent } from './pages/avis/avis-produit/avis-produit';
import { PromotionComponent } from './pages/promotion/promotion/promotion';
import { ApplyPromotionComponent } from './pages/promotion/apply-promotion/apply-promotion';
import { AnnoncesComponent } from './pages/annonces/annonces.component';
import { LoyerComponent } from './pages/loyer/loyer.component';
import { DemandesComponent } from './pages/demandes/demandes.component';
import { FacturesComponent } from './pages/factures/factures.component';
import { FacturerComponent } from './pages/factures/facturer/facturer.component';
import { ProduitsBoutiqueComponent } from './pages/produits/produit-boutique/produit-boutique';
import { BoutiqueAcheteur } from './pages/boutique/boutique-acheteur/boutique-acheteur';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'boutique', component: BoutiqueComponent },
  { path: 'acheteur', component: AcheteurComponent },
  {path: 'boutique/avis/:id', component: AvisBoutiqueComponent},
  {path: 'boutique/avis-produit/:id', component: AvisProduitComponent},
  {path: 'promotion', component: PromotionComponent},
  {path: 'apply-promotion', component: ApplyPromotionComponent},
  { path: 'annonces', component: AnnoncesComponent },
  { path: 'loyer', component: LoyerComponent },
  { path: 'factures', component: FacturesComponent },
  { path: 'facturer', component: FacturerComponent },
  { path: 'produit_b', component: ProduitsBoutiqueComponent },
  { path: 'boutique_a', component: BoutiqueAcheteur },
  { path: 'demandes', component: DemandesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];