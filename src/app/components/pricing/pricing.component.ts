import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingOption, PricingService } from '../../services/pricing.service';
import { SecondaryButtonComponent } from '../secondary-button/secondary-button.component';

@Component({
  selector: 'app-pricing',
  imports: [CommonModule, SecondaryButtonComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent implements OnInit {
  private pricingService = inject(PricingService);
  pricingOptions: PricingOption[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadPricingOptions();
  }

  private loadPricingOptions(): void {
    this.pricingService.getPricingOptions().subscribe({
      next: (options) => {
        this.pricingOptions = options;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load pricing options';
        this.loading = false;
        console.error('Error loading pricing options:', err);
      },
    });
  }
}
