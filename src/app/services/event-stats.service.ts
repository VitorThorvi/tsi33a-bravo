import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IEventStatistics } from '../model/event/IEventStatistics';

export interface IEventStatisticsWithId extends IEventStatistics {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class EventStatsService {
  private firestore = inject(Firestore);

  getEventStats(): Observable<IEventStatisticsWithId[]> {
    return collectionData(this.getEventStatisticsCollection(), {
      idField: 'id',
    }) as Observable<IEventStatisticsWithId[]>;
  }

  getEventStatsByEventName(
    eventName: string,
  ): Observable<IEventStatisticsWithId[]> {
    const q = query(
      this.getEventStatisticsCollection(),
      where('eventName', '==', eventName),
    );
    return collectionData(q, { idField: 'id' }) as Observable<
      IEventStatisticsWithId[]
    >;
  }

  getEventStat(id: string): Observable<IEventStatisticsWithId> {
    const eventStatDoc = doc(this.firestore, `event-statistics/${id}`);
    return docData(eventStatDoc, {
      idField: 'id',
    }) as Observable<IEventStatisticsWithId>;
  }

  async addEventStats(eventStats: IEventStatistics): Promise<string> {
    try {
      const eventStatsData = {
        ...eventStats,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(
        this.getEventStatisticsCollection(),
        eventStatsData,
      );
      return docRef.id;
    } catch {
      throw new Error('Failed to create event statistics');
    }
  }

  async updateEventStats(
    id: string,
    eventStats: Partial<IEventStatistics>,
  ): Promise<void> {
    try {
      const eventStatDoc = doc(this.firestore, `event-statistics/${id}`);
      const updateData = {
        ...eventStats,
        updatedAt: new Date(),
      };
      await updateDoc(eventStatDoc, updateData);
    } catch {
      throw new Error('Failed to update event statistics');
    }
  }

  async deleteEventStats(id: string): Promise<void> {
    try {
      const eventStatDoc = doc(this.firestore, `event-statistics/${id}`);
      await deleteDoc(eventStatDoc);
    } catch {
      throw new Error('Failed to delete event statistics');
    }
  }

  private getEventStatisticsCollection() {
    return collection(this.firestore, 'event-statistics');
  }
}
