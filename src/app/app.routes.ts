import { Routes } from '@angular/router';
import { SignedUserComponent } from './pages/signed-user/signed-user.component';

export const routes: Routes = [
  {
    path: '',
    component: SignedUserComponent,
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
