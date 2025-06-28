import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private apiUrl = 'http://localhost:3000/faq';
  private http = inject(HttpClient);

  getFaqItems(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(this.apiUrl);
  }
}
