import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CtaComponent } from '../cta/cta.component';

@Component({
  selector: 'app-hero',
  imports: [MatButtonModule, MatCardModule, CtaComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  @Input() eventName = '';
  @Input() eventCTA = '';
  @Input() buttonText = '';
  @Input() eventDescription = '';
}
