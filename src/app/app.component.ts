import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BaseUiComponent } from './base-ui/base-ui.component';
import { UserInfoHeaderComponent } from './components/user-info-header/user-info-header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    BaseUiComponent,
    UserInfoHeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tsi33a-angular-bravo';
  private authService = inject(AuthService);

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
