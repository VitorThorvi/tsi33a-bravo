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
import { Observable } from 'rxjs';

export interface PricingOption {
  id?: string;
  name: string;
  price: number;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  private firestore = inject(Firestore);

  getPricingOptions(): Observable<PricingOption[]> {
    return collectionData(this.getPricingCollection(), {
      idField: 'id',
    }) as Observable<PricingOption[]>;
  }

  getPricingOption(id: string): Observable<PricingOption> {
    const pricingDoc = doc(this.firestore, `pricing/${id}`);
    return docData(pricingDoc, { idField: 'id' }) as Observable<PricingOption>;
  }

  async addPricingOption(
    pricingOption: Omit<PricingOption, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    try {
      const pricingData = {
        ...pricingOption,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(this.getPricingCollection(), pricingData);
      return docRef.id;
    } catch {
      throw new Error('Failed to create pricing option');
    }
  }

  async updatePricingOption(
    id: string,
    pricingOption: Partial<
      Omit<PricingOption, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<void> {
    try {
      const pricingDoc = doc(this.firestore, `pricing/${id}`);
      const updateData = {
        ...pricingOption,
        updatedAt: new Date(),
      };
      await updateDoc(pricingDoc, updateData);
    } catch {
      throw new Error('Failed to update pricing option');
    }
  }

  async deletePricingOption(id: string): Promise<void> {
    try {
      const pricingDoc = doc(this.firestore, `pricing/${id}`);
      await deleteDoc(pricingDoc);
    } catch {
      throw new Error('Failed to delete pricing option');
    }
  }

  private getPricingCollection() {
    return collection(this.firestore, 'pricing');
  }
}
