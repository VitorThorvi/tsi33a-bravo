import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SecondaryButtonComponent } from '../secondary-button/secondary-button.component';

@Component({
  selector: 'app-user-info-header',
  imports: [CommonModule, SecondaryButtonComponent],
  templateUrl: './user-info-header.component.html',
  styleUrl: './user-info-header.component.scss',
})
export class UserInfoHeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get currentUser() {
    return this.authService.currentUser();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get hasAdminPrivileges() {
    return this.authService.hasAdminPrivileges();
  }

  onSignOut(): void {
    this.authService.signOut().subscribe({
      next: (result) => {
        if (result.success) {
          console.log('Logout successful');
          // Navigation is handled by the auth service
        }
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }

  navigateToAdmin(): void {
    if (this.hasAdminPrivileges) {
      this.router.navigate(['/admin']);
    }
  }
}
