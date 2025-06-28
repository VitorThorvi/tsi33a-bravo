import { Component, Input } from '@angular/core';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss'],
  imports: [PrimaryButtonComponent],
})
export class CtaComponent {
  @Input() eventName = '';
  @Input() h1Text = '';
  @Input() h2Text = '';
  @Input() pText = '';
  @Input() buttonText = '';
}
