import { Routes } from '@angular/router';
import { SignedUserComponent } from './pages/signed-user/signed-user.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'signed',
    component: SignedUserComponent,
  },
  {
    path: 'signed/:userId',
    component: SignedUserComponent,
  },
];
