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

  getFaqItems(): Observable<FaqItem[]> {
    return collectionData(this.getFaqCollection(), {
      idField: 'id',
    }) as Observable<FaqItem[]>;
  }

  getFaqItem(id: string): Observable<FaqItem> {
    const faqDoc = doc(this.firestore, `faq/${id}`);
    return docData(faqDoc, { idField: 'id' }) as Observable<FaqItem>;
  }

  async addFaqItem(
    faqItem: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    try {
      const faqData = {
        ...faqItem,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(this.getFaqCollection(), faqData);
      return docRef.id;
    } catch {
      throw new Error('Failed to create FAQ item');
    }
  }

  async updateFaqItem(
    id: string,
    faqItem: Partial<Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    try {
      const faqDoc = doc(this.firestore, `faq/${id}`);
      const updateData = {
        ...faqItem,
        updatedAt: new Date(),
      };
      await updateDoc(faqDoc, updateData);
    } catch {
      throw new Error('Failed to update FAQ item');
    }
  }

  async deleteFaqItem(id: string): Promise<void> {
    try {
      const faqDoc = doc(this.firestore, `faq/${id}`);
      await deleteDoc(faqDoc);
    } catch {
      throw new Error('Failed to delete FAQ item');
    }
  }

  private getFaqCollection() {
    return collection(this.firestore, 'faq');
  }
}
