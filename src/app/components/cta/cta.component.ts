import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss'],
  imports: [PrimaryButtonComponent],
})
export class CtaComponent {
  private router = inject(Router);

  @Input() eventName = '';
  @Input() h1Text = '';
  @Input() h2Text = '';
  @Input() pText = '';
  @Input() buttonText = '';
  @Input() routeTo = '';

  onButtonClick(): void {
    if (this.routeTo) {
      this.router.navigate([this.routeTo]);
    }
  }
}
