import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EventStat,
  EventStatsService,
} from '../../services/event-stats.service';

@Component({
  selector: 'app-event-stats',
  imports: [CommonModule],
  templateUrl: './event-stats.component.html',
  styleUrl: './event-stats.component.scss',
})
export class EventStatsComponent implements OnInit {
  private eventStatsService = inject(EventStatsService);
  eventStats: EventStat[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadEventStats();
  }

  private loadEventStats(): void {
    this.eventStatsService.getEventStats().subscribe({
      next: (stats) => {
        this.eventStats = stats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar estatísticas do evento';
        this.loading = false;
        console.error('Error loading event stats:', err);
      },
    });
  }
}
