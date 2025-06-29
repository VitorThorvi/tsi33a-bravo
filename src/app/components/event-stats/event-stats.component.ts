import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EventStatsService,
  IEventStatisticsWithId,
} from '../../services/event-stats.service';
import { EventDocument, EventService } from '../../services/event.service';

export interface DisplayStat {
  id: string;
  name: string;
  value: string;
}

@Component({
  selector: 'app-event-stats',
  imports: [CommonModule],
  templateUrl: './event-stats.component.html',
  styleUrl: './event-stats.component.scss',
})
export class EventStatsComponent implements OnInit {
  eventStats: DisplayStat[] = [];
  activeEvent: EventDocument | null = null;
  loading = true;
  error: string | null = null;
  private eventStatsService = inject(EventStatsService);
  private eventService = inject(EventService);

  ngOnInit(): void {
    this.loadEventStats();
    this.loadActiveEvent();
  }

  private loadEventStats(): void {
    this.eventStatsService.getEventStats().subscribe({
      next: (stats) => {
        this.eventStats = this.transformStatsForDisplay(stats);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar estatísticas do evento';
        this.loading = false;
        console.error('Error loading event stats:', err);
      },
    });
  }

  private loadActiveEvent(): void {
    this.eventService.getActiveEvent().subscribe({
      next: (event) => {
        this.activeEvent = event;
      },
      error: (err) => {
        console.error('Error loading active event:', err);
      },
    });
  }

  private transformStatsForDisplay(
    stats: IEventStatisticsWithId[],
  ): DisplayStat[] {
    const displayStats: DisplayStat[] = [];

    stats.forEach((stat, index) => {
      // Transform each statistic into display format
      displayStats.push(
        {
          id: `${stat.id || index}-sales`,
          name: 'Vendas Totais',
          value: `R$ ${stat.totalSales.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })}`,
        },
        {
          id: `${stat.id || index}-tickets`,
          name: 'Ingressos Vendidos',
          value: stat.totalTicketsSold.toString(),
        },
        {
          id: `${stat.id || index}-participation`,
          name: 'Taxa de Participação',
          value: `${stat.participantRated}%`,
        },
      );
    });

    return displayStats;
  }
}
