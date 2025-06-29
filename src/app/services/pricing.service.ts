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
  private pricingCollection = collection(this.firestore, 'pricing');

  getPricingOptions(): Observable<PricingOption[]> {
    return collectionData(this.pricingCollection, {
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
    const pricingData = {
      ...pricingOption,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(this.pricingCollection, pricingData);
    return docRef.id;
  }

  async updatePricingOption(
    id: string,
    pricingOption: Partial<
      Omit<PricingOption, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<void> {
    const pricingDoc = doc(this.firestore, `pricing/${id}`);
    const updateData = {
      ...pricingOption,
      updatedAt: new Date(),
    };
    await updateDoc(pricingDoc, updateData);
  }

  async deletePricingOption(id: string): Promise<void> {
    const pricingDoc = doc(this.firestore, `pricing/${id}`);
    await deleteDoc(pricingDoc);
  }
}
