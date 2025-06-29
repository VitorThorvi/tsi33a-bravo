import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../../../services/event.service';
import { PrimaryButtonComponent } from '../../../primary-button/primary-button.component';
import { FormInputComponent } from '../../../form-input/form-input.component';
import { IEventProps } from '../../../../model/event/IEventProps';

@Component({
  selector: 'app-event-create-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    PrimaryButtonComponent,
    FormInputComponent,
  ],
  templateUrl: './event-create-modal.component.html',
  styleUrl: './event-create-modal.component.scss',
})
export class EventCreateModalComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private dialogRef = inject(MatDialogRef<EventCreateModalComponent>);

  eventForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  get eventNameControl(): FormControl {
    return this.eventForm.get('eventName') as FormControl;
  }

  get eventDescriptionControl(): FormControl {
    return this.eventForm.get('eventDescription') as FormControl;
  }

  get eventCTAControl(): FormControl {
    return this.eventForm.get('eventCTA') as FormControl;
  }

  get eventVideoUrlControl(): FormControl {
    return this.eventForm.get('eventVideoUrl') as FormControl;
  }

  get eventImageUrlControl(): FormControl {
    return this.eventForm.get('eventImageUrl') as FormControl;
  }

  constructor() {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      eventDescription: ['', [Validators.required, Validators.minLength(10)]],
      eventCTA: ['', [Validators.required]],
      eventVideoUrl: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      eventImageUrl: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      isActive: [false, [Validators.required]],
    });
  }

  onCreate(): void {
    if (this.eventForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      const formValue = this.eventForm.value as IEventProps;

      // If this event should be active, we need to handle the active event switching
      if (formValue.isActive) {
        this.handleActiveEventCreation(formValue);
      } else {
        this.createEvent(formValue);
      }
    }
  }

  private handleActiveEventCreation(eventData: IEventProps): void {
    // First, get the current active event and deactivate it
    this.eventService.getActiveEvent().subscribe({
      next: (activeEvent) => {
        if (activeEvent) {
          // Deactivate the current active event
          // first
          this.eventService
            .updateEvent(activeEvent.id, { isActive: false })
            .subscribe({
              next: (deactivateSuccess) => {
                if (deactivateSuccess) {
                  // Now create the
                  // new event as
                  // active
                  this.createEvent(eventData);
                } else {
                  this.error = 'Falha ao desativar evento ativo atual';
                  this.isLoading = false;
                }
              },
              error: (err) => {
                this.error = 'Erro ao desativar evento ativo atual';
                this.isLoading = false;
                console.error('Error deactivating current active event:', err);
              },
            });
        } else {
          // No active event, just create the new
          // one
          this.createEvent(eventData);
        }
      },
      error: (err) => {
        this.error = 'Erro ao verificar evento ativo atual';
        this.isLoading = false;
        console.error('Error checking current active event:', err);
      },
    });
  }

  private createEvent(eventData: IEventProps): void {
    this.eventService.createEvent(eventData).subscribe({
      next: (eventId) => {
        if (eventId) {
          this.successMessage = 'Evento criado com sucesso!';
          setTimeout(() => {
            this.dialogRef.close('created');
          }, 1500);
        } else {
          this.error = 'Falha ao criar evento';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao criar evento';
        this.isLoading = false;
        console.error('Error creating event:', err);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
