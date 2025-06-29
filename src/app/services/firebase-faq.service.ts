import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FaqDocument extends FaqItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseFaqService {
  private firestore = inject(Firestore);

  private get faqCollection() {
    return collection(this.firestore, 'faq');
  }

  createFaqItem(
    faqData: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<string | null> {
    const faqDocumentData = {
      ...faqData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(addDoc(this.faqCollection, faqDocumentData)).pipe(
      map((docRef) => docRef.id),
      catchError((error) => {
        console.error('Error creating FAQ item:', error);
        return of(null);
      }),
    );
  }

  getFaqItem(faqId: string): Observable<FaqDocument | null> {
    const faqDoc = doc(this.firestore, 'faq', faqId);

    return from(getDoc(faqDoc)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Omit<FaqDocument, 'id'>;
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
      catchError((error) => {
        console.error('Error getting FAQ item:', error);
        return of(null);
      }),
    );
  }

  getFaqItems(): Observable<FaqDocument[]> {
    return from(getDocs(this.faqCollection)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<FaqDocument, 'id'>;
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
      catchError((error) => {
        console.error('Error getting FAQ items:', error);
        return of([]);
      }),
    );
  }

  updateFaqItem(
    faqId: string,
    faqData: Partial<Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Observable<boolean> {
    const faqDoc = doc(this.firestore, 'faq', faqId);
    const updateData = {
      ...faqData,
      updatedAt: new Date(),
    };

    return from(updateDoc(faqDoc, updateData)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error updating FAQ item:', error);
        return of(false);
      }),
    );
  }

  deleteFaqItem(faqId: string): Observable<boolean> {
    const faqDoc = doc(this.firestore, 'faq', faqId);

    return from(deleteDoc(faqDoc)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error deleting FAQ item:', error);
        return of(false);
      }),
    );
  }
}
