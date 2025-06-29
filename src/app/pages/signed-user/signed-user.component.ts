import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FaqComponent } from '../../components/faq/faq.component';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { TabNavComponent } from '../../components/tab-nav/tab-nav.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { EventDocument, EventService } from '../../services/event.service';

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
  activeEvent: EventDocument | null = null;
  loading = true;
  error: string | null = null;
  private eventService = inject(EventService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.loadActiveEvent();
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
