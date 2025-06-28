import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PricingOption {
  id: number;
  name: string;
  price: number;
  features: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  private apiUrl = 'http://localhost:3000/pricing';
  private http = inject(HttpClient);

  getPricingOptions(): Observable<PricingOption[]> {
    return this.http.get<PricingOption[]>(this.apiUrl);
  }
}
