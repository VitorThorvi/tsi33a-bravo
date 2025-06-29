import { Component } from '@angular/core';
import { EventListComponent } from '../../components/event-list/event-list.component';

@Component({
  selector: 'app-manage-events',
  imports: [EventListComponent],
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss',
})
export class ManageEventsComponent {}
