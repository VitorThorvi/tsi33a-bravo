import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';

export interface ContactUsQuestionSubmission {
  id?: string;
  email: string;
  question: string;
  submittedAt?: string;
  answered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactUsQuestionDocument extends ContactUsQuestionSubmission {
  id: string;
  submittedAt: string;
  answered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseContactUsQuestionService {
  private firestore = inject(Firestore);

  submitContactUsQuestion(
    submission: Omit<
      ContactUsQuestionSubmission,
      'id' | 'createdAt' | 'updatedAt'
    >,
  ): Observable<ContactUsQuestionDocument | null> {
    const submissionWithTimestamp = {
      ...submission,
      submittedAt: submission.submittedAt || new Date().toISOString(),
      answered: submission.answered ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(
      addDoc(this.getContactUsQuestionsCollection(), submissionWithTimestamp),
    ).pipe(
      map((docRef) => ({
        id: docRef.id,
        ...submissionWithTimestamp,
      })),
      catchError(() => {
        return of(null);
      }),
    );
  }

  getContactUsQuestion(
    contactUsQuestionId: string,
  ): Observable<ContactUsQuestionDocument | null> {
    const contactUsQuestionDoc = doc(
      this.firestore,
      'contact-us-questions',
      contactUsQuestionId,
    );

    return from(getDoc(contactUsQuestionDoc)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Omit<
            ContactUsQuestionDocument,
            'id'
          >;
          return {
            id: docSnapshot.id,
            ...data,
            createdAt:
              data.createdAt instanceof Date
                ? data.createdAt
                : new Date(data.createdAt),
            updatedAt:
              data.updatedAt instanceof Date
                ? data.updatedAt
                : new Date(data.updatedAt),
          };
        }
        return null;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }

  getAllContactUsQuestions(): Observable<ContactUsQuestionDocument[]> {
    return from(getDocs(this.getContactUsQuestionsCollection())).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<ContactUsQuestionDocument, 'id'>;
          return {
            id: doc.id,
            ...data,
            createdAt:
              data.createdAt instanceof Date
                ? data.createdAt
                : new Date(data.createdAt),
            updatedAt:
              data.updatedAt instanceof Date
                ? data.updatedAt
                : new Date(data.updatedAt),
          };
        });
      }),
      catchError(() => {
        return of([]);
      }),
    );
  }

  getUnansweredContactUsQuestions(): Observable<ContactUsQuestionDocument[]> {
    const unansweredQuery = query(
      this.getContactUsQuestionsCollection(),
      where('answered', '==', false),
    );

    return from(getDocs(unansweredQuery)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<ContactUsQuestionDocument, 'id'>;
          return {
            id: doc.id,
            ...data,
            createdAt:
              data.createdAt instanceof Date
                ? data.createdAt
                : new Date(data.createdAt),
            updatedAt:
              data.updatedAt instanceof Date
                ? data.updatedAt
                : new Date(data.updatedAt),
          };
        });
      }),
      catchError(() => {
        return of([]);
      }),
    );
  }

  markContactUsQuestionAsAnswered(
    contactUsQuestionId: string,
  ): Observable<boolean> {
    const contactUsQuestionDoc = doc(
      this.firestore,
      'contact-us-questions',
      contactUsQuestionId,
    );
    const updateData = {
      answered: true,
      updatedAt: new Date(),
    };

    return from(updateDoc(contactUsQuestionDoc, updateData)).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      }),
    );
  }

  updateContactUsQuestion(
    contactUsQuestionId: string,
    contactUsQuestionData: Partial<
      Omit<ContactUsQuestionSubmission, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ): Observable<boolean> {
    const contactUsQuestionDoc = doc(
      this.firestore,
      'contact-us-questions',
      contactUsQuestionId,
    );
    const updateData = {
      ...contactUsQuestionData,
      updatedAt: new Date(),
    };

    return from(updateDoc(contactUsQuestionDoc, updateData)).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      }),
    );
  }

  deleteContactUsQuestion(contactUsQuestionId: string): Observable<boolean> {
    const contactUsQuestionDoc = doc(
      this.firestore,
      'contact-us-questions',
      contactUsQuestionId,
    );

    return from(deleteDoc(contactUsQuestionDoc)).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      }),
    );
  }

  private getContactUsQuestionsCollection() {
    return collection(this.firestore, 'contact-us-questions');
  }
}
