import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { EventDocument, EventService } from '../../services/event.service';

@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    HeroComponent,
    FooterComponent,
    TestimonialsComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  private eventService = inject(EventService);

  activeEvent: EventDocument | null = null;
  loading = true;
  error: string | null = null;

  // Default values in case no active event is found
  eventName = 'Angular Bravo Conference';
  eventCTA = 'Register Now';
  buttonText = 'Register Now';
  eventDescription =
    'Join us for an amazing Angular conference with expert speakers and networking opportunities.';

  ngOnInit(): void {
    this.loadActiveEvent();
  }

  private loadActiveEvent(): void {
    this.eventService.getActiveEvent().subscribe({
      next: (event) => {
        if (event) {
          this.activeEvent = event;
          this.eventName = event.eventName;
          this.eventCTA = event.eventCTA;
          this.eventDescription = event.eventDescription;
        }
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
