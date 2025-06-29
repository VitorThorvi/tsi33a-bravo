import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  imports: [],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
})
export class PrimaryButtonComponent {
  @Input() buttonText = 'Primary Button';
  @Input() isDisabled = false;
  @Input() fullWidth = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    if (!this.isDisabled) {
      this.buttonClick.emit();
    }
  }
}
