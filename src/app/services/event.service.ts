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
import { IEventProps } from '../model/event/IEventProps';
import { IEventStatistics } from '../model/event/IEventStatistics';

export interface EventDocument extends IEventProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventStatisticsDocument extends IEventStatistics {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private firestore = inject(Firestore);

  private get eventsCollection() {
    return collection(this.firestore, 'events');
  }

  private get eventStatisticsCollection() {
    return collection(this.firestore, 'event-statistics');
  }

  // Event CRUD operations
  createEvent(eventData: IEventProps): Observable<string | null> {
    const eventDocumentData: Omit<EventDocument, 'id'> = {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(addDoc(this.eventsCollection, eventDocumentData)).pipe(
      map((docRef) => docRef.id),
      catchError((error) => {
        console.error('Error creating event:', error);
        return of(null);
      }),
    );
  }

  getEvent(eventId: string): Observable<EventDocument | null> {
    const eventDoc = doc(this.firestore, 'events', eventId);

    return from(getDoc(eventDoc)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Omit<EventDocument, 'id'>;
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
        console.error('Error getting event:', error);
        return of(null);
      }),
    );
  }

  getAllEvents(): Observable<EventDocument[]> {
    return from(getDocs(this.eventsCollection)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<EventDocument, 'id'>;
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
        console.error('Error getting events:', error);
        return of([]);
      }),
    );
  }

  getActiveEvent(): Observable<EventDocument | null> {
    return from(getDocs(this.eventsCollection)).pipe(
      map((querySnapshot) => {
        const activeDoc = querySnapshot.docs.find((doc) => {
          const data = doc.data() as Omit<EventDocument, 'id'>;
          return data.isActive === true;
        });

        if (activeDoc) {
          const data = activeDoc.data() as Omit<EventDocument, 'id'>;
          return {
            id: activeDoc.id,
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
        console.error('Error getting active event:', error);
        return of(null);
      }),
    );
  }

  updateEvent(
    eventId: string,
    eventData: Partial<IEventProps>,
  ): Observable<boolean> {
    const eventDoc = doc(this.firestore, 'events', eventId);
    const updateData = {
      ...eventData,
      updatedAt: new Date(),
    };

    return from(updateDoc(eventDoc, updateData)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error updating event:', error);
        return of(false);
      }),
    );
  }

  deleteEvent(eventId: string): Observable<boolean> {
    const eventDoc = doc(this.firestore, 'events', eventId);

    return from(deleteDoc(eventDoc)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error deleting event:', error);
        return of(false);
      }),
    );
  }

  // Event Statistics CRUD operations
  createEventStatistics(
    statisticsData: IEventStatistics,
  ): Observable<string | null> {
    const statisticsDocumentData: Omit<EventStatisticsDocument, 'id'> = {
      ...statisticsData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(
      addDoc(this.eventStatisticsCollection, statisticsDocumentData),
    ).pipe(
      map((docRef) => docRef.id),
      catchError((error) => {
        console.error('Error creating event statistics:', error);
        return of(null);
      }),
    );
  }

  getEventStatistics(
    statisticsId: string,
  ): Observable<EventStatisticsDocument | null> {
    const statisticsDoc = doc(this.firestore, 'event-statistics', statisticsId);

    return from(getDoc(statisticsDoc)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Omit<
            EventStatisticsDocument,
            'id'
          >;
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
        console.error('Error getting event statistics:', error);
        return of(null);
      }),
    );
  }

  getEventStatisticsByEventName(
    eventName: string,
  ): Observable<EventStatisticsDocument | null> {
    return from(getDocs(this.eventStatisticsCollection)).pipe(
      map((querySnapshot) => {
        const matchingDoc = querySnapshot.docs.find((doc) => {
          const data = doc.data() as Omit<EventStatisticsDocument, 'id'>;
          return data.eventName === eventName;
        });

        if (matchingDoc) {
          const data = matchingDoc.data() as Omit<
            EventStatisticsDocument,
            'id'
          >;
          return {
            id: matchingDoc.id,
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
        console.error('Error getting event statistics by event name:', error);
        return of(null);
      }),
    );
  }

  getAllEventStatistics(): Observable<EventStatisticsDocument[]> {
    return from(getDocs(this.eventStatisticsCollection)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<EventStatisticsDocument, 'id'>;
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
        console.error('Error getting all event statistics:', error);
        return of([]);
      }),
    );
  }

  updateEventStatistics(
    statisticsId: string,
    statisticsData: Partial<IEventStatistics>,
  ): Observable<boolean> {
    const statisticsDoc = doc(this.firestore, 'event-statistics', statisticsId);
    const updateData = {
      ...statisticsData,
      updatedAt: new Date(),
    };

    return from(updateDoc(statisticsDoc, updateData)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error updating event statistics:', error);
        return of(false);
      }),
    );
  }

  deleteEventStatistics(statisticsId: string): Observable<boolean> {
    const statisticsDoc = doc(this.firestore, 'event-statistics', statisticsId);

    return from(deleteDoc(statisticsDoc)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error deleting event statistics:', error);
        return of(false);
      }),
    );
  }
}
