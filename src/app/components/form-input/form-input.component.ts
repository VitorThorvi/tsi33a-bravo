import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent {
  @Input() control: FormControl = new FormControl();
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() inputId = `form-input-${Math.random().toString(36).slice(2)}`;

  readonly Validators = Validators;
}
