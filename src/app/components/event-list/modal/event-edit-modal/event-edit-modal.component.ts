import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  EventDocument,
  EventService,
} from '../../../../services/event.service';
import { PrimaryButtonComponent } from '../../../primary-button/primary-button.component';
import { FormInputComponent } from '../../../form-input/form-input.component';
import { IEventProps } from '../../../../model/event/IEventProps';

@Component({
  selector: 'app-event-edit-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    PrimaryButtonComponent,
    FormInputComponent,
  ],
  templateUrl: './event-edit-modal.component.html',
  styleUrl: './event-edit-modal.component.scss',
})
export class EventEditModalComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private dialogRef = inject(MatDialogRef<EventEditModalComponent>);
  public data = inject<{ event: EventDocument }>(MAT_DIALOG_DATA);

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
      eventName: [
        this.data.event.eventName,
        [Validators.required, Validators.minLength(3)],
      ],
      eventDescription: [
        this.data.event.eventDescription,
        [Validators.required, Validators.minLength(10)],
      ],
      eventCTA: [this.data.event.eventCTA, [Validators.required]],
      eventVideoUrl: [
        this.data.event.eventVideoUrl,
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      eventImageUrl: [
        this.data.event.eventImageUrl,
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      isActive: [this.data.event.isActive, [Validators.required]],
    });
  }

  onSave(): void {
    if (this.eventForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      const formValue = this.eventForm.value;

      // If this event is being set to active, we need to handle the active event switching
      if (formValue.isActive && !this.data.event.isActive) {
        this.handleActiveEventUpdate(formValue);
      } else {
        this.updateEvent(formValue);
      }
    }
  }

  private handleActiveEventUpdate(eventData: Partial<IEventProps>): void {
    // First, get the current active event and deactivate it
    this.eventService.getActiveEvent().subscribe({
      next: (activeEvent) => {
        if (activeEvent && activeEvent.id !== this.data.event.id) {
          // Deactivate the current active event
          // first
          this.eventService
            .updateEvent(activeEvent.id, { isActive: false })
            .subscribe({
              next: (deactivateSuccess) => {
                if (deactivateSuccess) {
                  // Now update this
                  // event as active
                  this.updateEvent(eventData);
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
          // No other active event or this is
          // already the active event, just
          // update
          this.updateEvent(eventData);
        }
      },
      error: (err) => {
        this.error = 'Erro ao verificar evento ativo atual';
        this.isLoading = false;
        console.error('Error checking current active event:', err);
      },
    });
  }

  private updateEvent(eventData: Partial<IEventProps>): void {
    this.eventService.updateEvent(this.data.event.id, eventData).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = 'Evento atualizado com sucesso!';
          setTimeout(() => {
            this.dialogRef.close('updated');
          }, 1500);
        } else {
          this.error = 'Falha ao atualizar evento';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao atualizar evento';
        this.isLoading = false;
        console.error('Error updating event:', err);
      },
    });
  }

  onDelete(): void {
    if (
      confirm(
        'Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.',
      )
    ) {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      this.eventService.deleteEvent(this.data.event.id).subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = 'Evento excluído com sucesso!';
            setTimeout(() => {
              this.dialogRef.close('deleted');
            }, 1500);
          } else {
            this.error = 'Falha ao excluir evento';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erro ao excluir evento';
          this.isLoading = false;
          console.error('Error deleting event:', err);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
