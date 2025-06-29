import { Routes } from '@angular/router';
import { SignedUserComponent } from './pages/signed-user/signed-user.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ManageEventsComponent } from './pages/manage-events/manage-events.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { adminGuard, authGuard } from './guards/auth.guard';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'signed',
    component: SignedUserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'signed/:userId',
    component: SignedUserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/manage-events',
    component: ManageEventsComponent,
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
