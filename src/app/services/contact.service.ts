import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

export interface ContactUsQuestionSubmission {
  id?: string;
  email: string;
  question: string;
  submittedAt?: string;
  answered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ContactUsQuestionService {
  private firestore = inject(Firestore);
  private contactUsQuestionsCollection = collection(
    this.firestore,
    'contact-us-questions',
  );

  submitContactUsQuestion(
    submission: ContactUsQuestionSubmission,
  ): Observable<string> {
    const submissionWithTimestamp = {
      ...submission,
      submittedAt: new Date().toISOString(),
      answered: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return from(
      addDoc(this.contactUsQuestionsCollection, submissionWithTimestamp).then(
        (docRef) => docRef.id,
      ),
    );
  }

  getContactUsQuestions(): Observable<ContactUsQuestionSubmission[]> {
    return collectionData(this.contactUsQuestionsCollection, {
      idField: 'id',
    }) as Observable<ContactUsQuestionSubmission[]>;
  }

  getContactUsQuestion(id: string): Observable<ContactUsQuestionSubmission> {
    const contactUsQuestionDoc = doc(
      this.firestore,
      `contact-us-questions/${id}`,
    );
    return docData(contactUsQuestionDoc, {
      idField: 'id',
    }) as Observable<ContactUsQuestionSubmission>;
  }

  async updateContactUsQuestion(
    id: string,
    contactUsQuestion: Partial<ContactUsQuestionSubmission>,
  ): Promise<void> {
    const contactUsQuestionDoc = doc(
      this.firestore,
      `contact-us-questions/${id}`,
    );
    const updateData = {
      ...contactUsQuestion,
      updatedAt: new Date(),
    };
    await updateDoc(contactUsQuestionDoc, updateData);
  }

  async deleteContactUsQuestion(id: string): Promise<void> {
    const contactUsQuestionDoc = doc(
      this.firestore,
      `contact-us-questions/${id}`,
    );
    await deleteDoc(contactUsQuestionDoc);
  }
}
