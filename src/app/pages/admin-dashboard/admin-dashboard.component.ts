import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventStatsComponent } from '../../components/event-stats/event-stats.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [EventStatsComponent, PrimaryButtonComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  get hasAdminPrivileges() {
    return this.authService.hasAdminPrivileges();
  }

  navigateToManageEvents(): void {
    if (this.hasAdminPrivileges) {
      this.router.navigate(['/admin/manage-events']);
    }
  }
}
