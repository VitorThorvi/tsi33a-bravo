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
  private eventStatisticsCollection = collection(
    this.firestore,
    'event-statistics',
  );

  getEventStats(): Observable<IEventStatisticsWithId[]> {
    return collectionData(this.eventStatisticsCollection, {
      idField: 'id',
    }) as Observable<IEventStatisticsWithId[]>;
  }

  getEventStatsByEventName(
    eventName: string,
  ): Observable<IEventStatisticsWithId[]> {
    const q = query(
      this.eventStatisticsCollection,
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
    const eventStatsData = {
      ...eventStats,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(this.eventStatisticsCollection, eventStatsData);
    return docRef.id;
  }

  async updateEventStats(
    id: string,
    eventStats: Partial<IEventStatistics>,
  ): Promise<void> {
    const eventStatDoc = doc(this.firestore, `event-statistics/${id}`);
    const updateData = {
      ...eventStats,
      updatedAt: new Date(),
    };
    await updateDoc(eventStatDoc, updateData);
  }

  async deleteEventStats(id: string): Promise<void> {
    const eventStatDoc = doc(this.firestore, `event-statistics/${id}`);
    await deleteDoc(eventStatDoc);
  }
}
