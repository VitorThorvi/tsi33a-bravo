import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FirebasePricingService,
  PricingDocument,
} from '../../services/firebase-pricing.service';
import { SecondaryButtonComponent } from '../secondary-button/secondary-button.component';
import { BrlCurrencyPipe } from '../../pipes/brl-currency.pipe';

@Component({
  selector: 'app-pricing',
  imports: [CommonModule, SecondaryButtonComponent, BrlCurrencyPipe],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent implements OnInit {
  pricingOptions: PricingDocument[] = [];
  loading = true;
  error: string | null = null;
  private firebasePricingService = inject(FirebasePricingService);

  ngOnInit(): void {
    this.loadPricingOptions();
  }

  private loadPricingOptions(): void {
    this.firebasePricingService.getPricingOptions().subscribe({
      next: (options) => {
        this.pricingOptions = options;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar opções de preços';
        this.loading = false;
        console.error('Error loading pricing options:', err);
      },
    });
  }
}
