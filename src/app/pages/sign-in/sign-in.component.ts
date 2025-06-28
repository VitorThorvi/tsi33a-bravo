import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';

@Component({
  selector: 'app-sign-in',
  imports: [
    FooterComponent,
    FormInputComponent,
    PrimaryButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true,
})
export class SignInComponent {
  private fb = inject(FormBuilder);
  signInForm: FormGroup;

  constructor() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailControl() {
    return this.signInForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.signInForm.get('password') as FormControl;
  }

  onSubmit() {
    if (this.signInForm.valid) {
      console.log('Form Submitted!', this.signInForm.value);
    }
  }
}
