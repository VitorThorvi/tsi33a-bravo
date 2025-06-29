import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [
    CommonModule,
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
  private authService = inject(AuthService);
  private router = inject(Router);

  signInForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  get emailControl() {
    return this.signInForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.signInForm.get('password') as FormControl;
  }

  get isLoading() {
    return this.authService.isLoading();
  }

  private redirectBasedOnRole(): void {
    if (this.authService.hasAdminPrivileges()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/signed']);
    }
  }

  onSubmit() {
    if (this.signInForm.valid && !this.isLoading) {
      this.errorMessage = null;
      this.successMessage = null;

      const { email, password } = this.signInForm.value;

      this.authService.signInWithEmail(email, password).subscribe({
        next: (result) => {
          if (result.success) {
            this.successMessage = result.message;
            // Navigate based on user role
            setTimeout(() => {
              this.redirectBasedOnRole();
            }, 1000);
          } else {
            this.errorMessage = result.message;
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro inesperado. Tente novamente.';
          console.error('Sign in error:', error);
        },
      });
    }
  }

  onGoogleSignIn() {
    if (!this.isLoading) {
      this.errorMessage = null;
      this.successMessage = null;

      this.authService.signInWithGoogle().subscribe({
        next: (result) => {
          if (result.success) {
            this.successMessage = result.message;
            // Navigate based on user role
            setTimeout(() => {
              this.redirectBasedOnRole();
            }, 1000);
          } else {
            this.errorMessage = result.message;
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro inesperado. Tente novamente.';
          console.error('Google sign in error:', error);
        },
      });
    }
  }
}
