import { Routes }              from '@angular/router';
import { SignedUserComponent } from './pages/signed-user/signed-user.component';
import { SignInComponent }     from './pages/sign-in/sign-in.component';

export const routes: Routes = [
  {
    path: '',
    component: SignInComponent
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
