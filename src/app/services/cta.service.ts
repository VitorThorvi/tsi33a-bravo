import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CtaContent {
  id: number;
  eventName: string;
  h1Text: string;
  pText: string;
}

@Injectable({
  providedIn: 'root',
})
export class CtaService {
  private apiUrl = 'http://localhost:3000/cta';
  private http = inject(HttpClient);

  getCtaContent(): Observable<CtaContent> {
    return this.http.get<CtaContent>(this.apiUrl);
  }
}
