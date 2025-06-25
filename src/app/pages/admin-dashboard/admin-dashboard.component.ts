import { Component } from '@angular/core';
import { EventStatsComponent } from '../../components/event-stats/event-stats.component';
import { TabNavComponent } from '../../components/tab-nav/tab-nav.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [EventStatsComponent, TabNavComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {}
