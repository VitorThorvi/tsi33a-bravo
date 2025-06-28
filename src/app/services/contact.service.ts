import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactSubmission {
  id?: number;
  email: string;
  question: string;
  submittedAt?: string;
  answered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts';
  private http = inject(HttpClient);

  submitQuestion(submission: ContactSubmission): Observable<ContactSubmission> {
    const submissionWithTimestamp = {
      ...submission,
      submittedAt: new Date().toISOString(),
      answered: false,
    };
    return this.http.post<ContactSubmission>(
      this.apiUrl,
      submissionWithTimestamp,
    );
  }
}
