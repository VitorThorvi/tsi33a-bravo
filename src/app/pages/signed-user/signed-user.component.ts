import { Component } from '@angular/core';
import { FaqComponent } from '../../components/faq/faq.component';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { TabNavComponent } from '../../components/tab-nav/tab-nav.component';
import { CtaComponent } from '../../components/cta/cta.component';

@Component({
  selector: 'app-signed-user',
  imports: [
    FaqComponent,
    ContactUsComponent,
    PricingComponent,
    TabNavComponent,
    CtaComponent,
  ],
  templateUrl: './signed-user.component.html',
  styleUrl: './signed-user.component.scss',
})
export class SignedUserComponent {}
