import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from '../../components/faq/faq.component';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { TabNavComponent } from '../../components/tab-nav/tab-nav.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { CtaContent, CtaService } from '../../services/cta.service';

@Component({
  selector: 'app-signed-user',
  imports: [
    CommonModule,
    FaqComponent,
    ContactUsComponent,
    PricingComponent,
    TabNavComponent,
    CtaComponent,
  ],
  templateUrl: './signed-user.component.html',
  styleUrl: './signed-user.component.scss',
})
export class SignedUserComponent implements OnInit {
  private ctaService = inject(CtaService);
  ctaContent: CtaContent | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCtaContent();
  }

  private loadCtaContent(): void {
    this.ctaService.getCtaContent().subscribe({
      next: (content) => {
        this.ctaContent = content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar conteúdo CTA';
        this.loading = false;
        console.error('Error loading CTA content:', err);
      },
    });
  }
}
