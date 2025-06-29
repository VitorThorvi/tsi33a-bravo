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

export interface PricingOption {
  id?: string;
  name: string;
  price: number;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PricingDocument extends PricingOption {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FirebasePricingService {
  private firestore = inject(Firestore);

  private get pricingCollection() {
    return collection(this.firestore, 'pricing');
  }

  createPricingOption(
    pricingData: Omit<PricingOption, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<string | null> {
    const pricingDocumentData = {
      ...pricingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(addDoc(this.pricingCollection, pricingDocumentData)).pipe(
      map((docRef) => docRef.id),
      catchError((error) => {
        console.error('Error creating pricing option:', error);
        return of(null);
      }),
    );
  }

  getPricingOption(pricingId: string): Observable<PricingDocument | null> {
    const pricingDoc = doc(this.firestore, 'pricing', pricingId);

    return from(getDoc(pricingDoc)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Omit<PricingDocument, 'id'>;
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
        console.error('Error getting pricing option:', error);
        return of(null);
      }),
    );
  }

  getPricingOptions(): Observable<PricingDocument[]> {
    return from(getDocs(this.pricingCollection)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<PricingDocument, 'id'>;
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
        console.error('Error getting pricing options:', error);
        return of([]);
      }),
    );
  }

  updatePricingOption(
    pricingId: string,
    pricingData: Partial<Omit<PricingOption, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Observable<boolean> {
    const pricingDoc = doc(this.firestore, 'pricing', pricingId);
    const updateData = {
      ...pricingData,
      updatedAt: new Date(),
    };

    return from(updateDoc(pricingDoc, updateData)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error updating pricing option:', error);
        return of(false);
      }),
    );
  }

  deletePricingOption(pricingId: string): Observable<boolean> {
    const pricingDoc = doc(this.firestore, 'pricing', pricingId);

    return from(deleteDoc(pricingDoc)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error deleting pricing option:', error);
        return of(false);
      }),
    );
  }
}
