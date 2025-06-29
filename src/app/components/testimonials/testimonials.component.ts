import { Component, Input } from '@angular/core';

export interface Testimonial {
  quote: string;
  author: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  @Input() title = 'Eventos anteriores';
  @Input() testimonial: Testimonial = {
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusms.',
    author: 'Sarah Miller',
    backgroundImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJV-B1LUpFetQwIM9hctvmLiXirLA7jicHAiY4UO07S3kSQZLKl2DUiBNpFdMzHv7w7h2TAtSCGkfTgSZJVAmnIWu46XylcV5MiDaO_n_TlL4MSm4Zi5jQ5Yy3CIyXQ37TFF3afl7Jq0B2jaDODGqwS7Ur3Pfdbr8Tk8PDs_DreqBC_hBYsuDEue-z-bRNk10FBnPmlQXgfrC_4zXW2-ccOVDX95qt7m2dTTGY-lCcd865tmNv21aTIkzMfTrSLUkPDa6tW_g3Dw',
  };
}
