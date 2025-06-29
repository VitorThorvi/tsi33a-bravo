import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ContactUsQuestionSubmission,
  FirebaseContactUsQuestionService,
} from '../../services/firebase-contact.service';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  error: string | null = null;
  private fb = inject(FormBuilder);
  private firebaseContactUsQuestionService = inject(
    FirebaseContactUsQuestionService,
  );

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

      const submission: ContactUsQuestionSubmission = {
        email: this.contactForm.value.email,
        question: this.contactForm.value.question,
      };

      this.firebaseContactUsQuestionService
        .submitContactUsQuestion(submission)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.isSubmitted = true;
            this.contactForm.reset();
            console.log('Question submitted successfully:', response);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.error = 'Falha ao enviar sua pergunta. Tente novamente.';
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
