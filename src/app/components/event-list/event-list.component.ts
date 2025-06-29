import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDocument, EventService } from '../../services/event.service';
import { EventEditModalComponent } from './modal/event-edit-modal/event-edit-modal.component';
import { EventCreateModalComponent } from './modal/event-create-modal/event-create-modal.component';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, MatDialogModule, PrimaryButtonComponent, RouterLink],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit {
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);

  events: EventDocument[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar eventos';
        this.loading = false;
        console.error('Error loading events:', err);
      },
    });
  }

  onEventClick(event: EventDocument): void {
    const dialogRef = this.dialog.open(EventEditModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated' || result === 'deleted') {
        this.loadEvents(); // Reload events after update or delete
      }
    });
  }

  isActiveEvent(event: EventDocument): boolean {
    return event.isActive;
  }

  onCreateEvent(): void {
    const dialogRef = this.dialog.open(EventCreateModalComponent, {
      width: '600px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'created') {
        this.loadEvents(); // Reload events after creation
      }
    });
  }
}
