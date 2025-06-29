import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { EventDocument, EventService } from '../../services/event.service';
import { delay, retry } from 'rxjs/operators';

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
  eventName = 'Mostra de Ballet Primavera 2025';
  eventCTA = '';
  buttonText = 'Inscreva-se agora!';
  eventDescription =
    'Entre no centro das atenções e mostre seu talento em nossa próxima apresentação de ballet! Esta é sua chance de brilhar no palco, se apresentando para seus amigos e família. Junte-se a nós para uma experiência inesquecível.';

  ngOnInit(): void {
    this.loadActiveEvent();
  }

  private loadActiveEvent(): void {
    this.eventService
      .getActiveEvent()
      .pipe(
        delay(100), // Small delay to ensure Firebase is initialized
        retry(3), // Retry up to 3 times if there's an error
      )
      .subscribe({
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
          console.error('Error loading active event after retries:', err);
        },
      });
  }
}
