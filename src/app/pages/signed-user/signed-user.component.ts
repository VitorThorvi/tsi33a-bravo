import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { TabNavComponent } from '../../components/tab-nav/tab-nav.component';

@Component({
  selector: 'app-signed-user',
  imports: [
    HeroComponent,
    FaqComponent,
    ContactUsComponent,
    PricingComponent,
    TabNavComponent,
  ],
  templateUrl: './signed-user.component.html',
  styleUrl: './signed-user.component.scss',
})
export class SignedUserComponent {}
