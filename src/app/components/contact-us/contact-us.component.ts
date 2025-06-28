import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ContactService,
  ContactSubmission,
} from '../../services/contact.service';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  error: string | null = null;

  constructor() {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      question: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;

      const submission: ContactSubmission = {
        email: this.contactForm.value.email,
        question: this.contactForm.value.question,
      };

      this.contactService.submitQuestion(submission).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.isSubmitted = true;
          this.contactForm.reset();
          console.log('Question submitted successfully:', response);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.error = 'Failed to submit your question. Please try again.';
          console.error('Error submitting question:', err);
        },
      });
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.error = null;
    this.contactForm.reset();
  }
}
