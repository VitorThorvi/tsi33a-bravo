import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  imports: [],
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss',
})
export class SecondaryButtonComponent {
  @Input() buttonText = 'Secondary Button';
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
