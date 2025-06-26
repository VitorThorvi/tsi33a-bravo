import { Component, Input } from '@angular/core';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss'],
  imports: [PrimaryButtonComponent],
})
export class CtaComponent {
  @Input() h1Text = 'Default H1 Text';
  @Input() h2Text = 'Default H2 Text';
  @Input() pText = 'Default Paragraph Text';
  @Input() buttonText = 'Default Button Text';
}
