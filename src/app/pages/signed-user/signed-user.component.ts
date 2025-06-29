import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FaqComponent } from '../../components/faq/faq.component';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { TabNavComponent } from '../../components/tab-nav/tab-nav.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { EventDocument, EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signed-user',
  imports: [
    CommonModule,
    FaqComponent,
    ContactUsComponent,
    PricingComponent,
    TabNavComponent,
    CtaComponent,
  ],
  templateUrl: './signed-user.component.html',
  styleUrl: './signed-user.component.scss',
})
export class SignedUserComponent implements OnInit {
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeEvent: EventDocument | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadActiveEvent();
  }

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

  private loadActiveEvent(): void {
    this.eventService.getActiveEvent().subscribe({
      next: (event) => {
        this.activeEvent = event;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar dados do evento';
        this.loading = false;
        console.error('Error loading active event:', err);
      },
    });
  }
}
