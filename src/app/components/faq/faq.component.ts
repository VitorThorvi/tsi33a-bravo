import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqItem, FaqService } from '../../services/faq.service';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  private faqService = inject(FaqService);
  faqItems: FaqItem[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadFaqItems();
  }

  private loadFaqItems(): void {
    this.faqService.getFaqItems().subscribe({
      next: (items) => {
        this.faqItems = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load FAQ items';
        this.loading = false;
        console.error('Error loading FAQ items:', err);
      },
    });
  }
}
