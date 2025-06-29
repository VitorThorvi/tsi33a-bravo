import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  UpdateData,
  updateDoc,
} from '@angular/fire/firestore';
import { from } from 'rxjs';
import { FormInputComponent } from '../form-input/form-input.component';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

export interface FirebaseFormField {
  labelName: string;
  placeholder: string;
  fieldName: string;
  type?: string;
  required?: boolean;
}

export interface FirebaseFormSubmissionResult {
  success: boolean;
  documentId?: string;
  error?: string;
}

@Component({
  selector: 'app-firebase-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './firebase-form.component.html',
  styleUrl: './firebase-form.component.scss',
})
export class FirebaseFormComponent implements OnInit {
  private firestore = inject(Firestore);
  private formBuilder = inject(FormBuilder);

  @Input() collectionName = '';
  @Input() isUpdate = false;
  @Input() documentId = '';
  @Input() numberOfInputs = 0;
  @Input() formFields: FirebaseFormField[] = [];
  @Input() submitButtonText = 'Submit';
  @Input() isLoading = false;

  @Output() formSubmitted = new EventEmitter<FirebaseFormSubmissionResult>();
  @Output() formDataChanged = new EventEmitter<Record<string, unknown>>();

  firebaseForm: FormGroup = this.formBuilder.group({});
  submissionError: string | null = null;
  submissionSuccess: string | null = null;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const formControls: Record<string, unknown> = {};

    this.formFields.forEach((field) => {
      const validators = field.required ? [Validators.required] : [];
      if (field.type === 'email') {
        validators.push(Validators.email);
      }
      formControls[field.fieldName] = ['', validators];
    });

    this.firebaseForm = this.formBuilder.group(formControls);

    // Emit form data changes
    this.firebaseForm.valueChanges.subscribe((value) => {
      this.formDataChanged.emit(value);
    });
  }

  onSubmit(): void {
    if (this.firebaseForm.invalid) {
      this.firebaseForm.markAllAsTouched();
      return;
    }

    this.submissionError = null;
    this.submissionSuccess = null;

    const formData = this.firebaseForm.value;
    const dataWithTimestamp = {
      ...formData,
      updatedAt: new Date(),
      ...(this.isUpdate ? {} : { createdAt: new Date() }),
    };

    if (this.isUpdate && this.documentId) {
      this.updateDocument(dataWithTimestamp);
    } else {
      this.createDocument(dataWithTimestamp);
    }
  }

  private createDocument(data: Record<string, unknown>): void {
    const collectionRef = collection(this.firestore, this.collectionName);

    from(addDoc(collectionRef, data)).subscribe({
      next: (docRef) => {
        this.submissionSuccess = 'Document created successfully!';
        this.firebaseForm.reset();
        this.formSubmitted.emit({
          success: true,
          documentId: docRef.id,
        });
      },
      error: (error) => {
        console.error('Error creating document:', error);
        this.submissionError = 'Failed to create document. Please try again.';
        this.formSubmitted.emit({
          success: false,
          error: error.message,
        });
      },
    });
  }

  private updateDocument(data: Record<string, unknown>): void {
    const docRef = doc(this.firestore, this.collectionName, this.documentId);

    // Type cast to UpdateData to satisfy Firestore's type requirements
    const updateData = data as UpdateData<Record<string, unknown>>;

    from(updateDoc(docRef, updateData)).subscribe({
      next: () => {
        this.submissionSuccess = 'Document updated successfully!';
        this.formSubmitted.emit({
          success: true,
          documentId: this.documentId,
        });
      },
      error: (error) => {
        console.error('Error updating document:', error);
        this.submissionError = 'Failed to update document. Please try again.';
        this.formSubmitted.emit({
          success: false,
          error: error.message,
        });
      },
    });
  }

  getFormControl(fieldName: string): FormControl {
    return this.firebaseForm.get(fieldName) as FormControl;
  }
}
