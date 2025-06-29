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

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private firestore = inject(Firestore);
  private faqCollection = collection(this.firestore, 'faq');

  getFaqItems(): Observable<FaqItem[]> {
    return collectionData(this.faqCollection, { idField: 'id' }) as Observable<
      FaqItem[]
    >;
  }

  getFaqItem(id: string): Observable<FaqItem> {
    const faqDoc = doc(this.firestore, `faq/${id}`);
    return docData(faqDoc, { idField: 'id' }) as Observable<FaqItem>;
  }

  async addFaqItem(
    faqItem: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    const faqData = {
      ...faqItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(this.faqCollection, faqData);
    return docRef.id;
  }

  async updateFaqItem(
    id: string,
    faqItem: Partial<Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    const faqDoc = doc(this.firestore, `faq/${id}`);
    const updateData = {
      ...faqItem,
      updatedAt: new Date(),
    };
    await updateDoc(faqDoc, updateData);
  }

  async deleteFaqItem(id: string): Promise<void> {
    const faqDoc = doc(this.firestore, `faq/${id}`);
    await deleteDoc(faqDoc);
  }
}
