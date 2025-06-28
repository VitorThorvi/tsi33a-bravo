import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventStat {
  id: number;
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventStatsService {
  private apiUrl = 'http://localhost:3000/event-stats';
  private http = inject(HttpClient);

  getEventStats(): Observable<EventStat[]> {
    return this.http.get<EventStat[]>(this.apiUrl);
  }
}
