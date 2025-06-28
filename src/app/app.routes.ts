import { Routes } from '@angular/router';
import { SignedUserComponent } from './pages/signed-user/signed-user.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
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
