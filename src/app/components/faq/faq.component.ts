import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FaqDocument,
  FirebaseFaqService,
} from '../../services/firebase-faq.service';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  faqItems: FaqDocument[] = [];
  loading = true;
  error: string | null = null;
  private firebaseFaqService = inject(FirebaseFaqService);

  ngOnInit(): void {
    this.loadFaqItems();
  }

  private loadFaqItems(): void {
    this.firebaseFaqService.getFaqItems().subscribe({
      next: (items) => {
        this.faqItems = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar itens de perguntas frequentes';
        this.loading = false;
        console.error('Error loading FAQ items:', err);
      },
    });
  }
}
