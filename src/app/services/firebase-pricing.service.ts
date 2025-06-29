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

  createPricingOption(
    pricingData: Omit<PricingOption, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<string | null> {
    const pricingDocumentData = {
      ...pricingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(addDoc(this.getPricingCollection(), pricingDocumentData)).pipe(
      map((docRef) => docRef.id),
      catchError(() => {
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
      catchError(() => {
        return of(null);
      }),
    );
  }

  getPricingOptions(): Observable<PricingDocument[]> {
    return from(getDocs(this.getPricingCollection())).pipe(
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
      catchError(() => {
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
      catchError(() => {
        return of(false);
      }),
    );
  }

  deletePricingOption(pricingId: string): Observable<boolean> {
    const pricingDoc = doc(this.firestore, 'pricing', pricingId);

    return from(deleteDoc(pricingDoc)).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      }),
    );
  }

  private getPricingCollection() {
    return collection(this.firestore, 'pricing');
  }
}
