import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  limit,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

export interface CtaContent {
  id?: string;
  eventName: string;
  h1Text: string;
  pText: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CtaService {
  private firestore = inject(Firestore);

  getCtaContent(): Observable<CtaContent> {
    // Get the first CTA content item (assuming there's only one active CTA)
    const q = query(this.getCtaCollection(), limit(1));
    return (
      collectionData(q, { idField: 'id' }) as Observable<CtaContent[]>
    ).pipe(map((items: CtaContent[]) => items[0]));
  }

  getCtaContents(): Observable<CtaContent[]> {
    return collectionData(this.getCtaCollection(), {
      idField: 'id',
    }) as Observable<CtaContent[]>;
  }

  getCtaContentById(id: string): Observable<CtaContent> {
    const ctaDoc = doc(this.firestore, `cta/${id}`);
    return docData(ctaDoc, { idField: 'id' }) as Observable<CtaContent>;
  }

  async addCtaContent(
    ctaContent: Omit<CtaContent, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    try {
      const ctaData = {
        ...ctaContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(this.getCtaCollection(), ctaData);
      return docRef.id;
    } catch {
      throw new Error('Failed to create CTA content');
    }
  }

  async updateCtaContent(
    id: string,
    ctaContent: Partial<Omit<CtaContent, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    try {
      const ctaDoc = doc(this.firestore, `cta/${id}`);
      const updateData = {
        ...ctaContent,
        updatedAt: new Date(),
      };
      await updateDoc(ctaDoc, updateData);
    } catch {
      throw new Error('Failed to update CTA content');
    }
  }

  async deleteCtaContent(id: string): Promise<void> {
    try {
      const ctaDoc = doc(this.firestore, `cta/${id}`);
      await deleteDoc(ctaDoc);
    } catch {
      throw new Error('Failed to delete CTA content');
    }
  }

  private getCtaCollection() {
    return collection(this.firestore, 'cta');
  }
}
