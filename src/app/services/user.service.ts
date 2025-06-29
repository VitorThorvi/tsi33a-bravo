import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';
import { IUserProps } from '../model/user/IUserProps';

export interface UserDocument extends IUserProps {
  uid: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);

  // Create or update user document in Firestore
  createUser(uid: string, userData: IUserProps): Observable<boolean> {
    const userDoc = doc(this.firestore, 'users', uid);
    const userDocumentData: UserDocument = {
      ...userData,
      uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(setDoc(userDoc, userDocumentData)).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      }),
    );
  }

  // Get user document from Firestore by UID
  getUserByUid(uid: string): Observable<UserDocument | null> {
    const userDoc = doc(this.firestore, 'users', uid);

    return from(getDoc(userDoc)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserDocument;
          // Convert Firestore timestamps to Date objects
          return {
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

  // Get user document from Firestore by email
  getUserByEmail(email: string): Observable<UserDocument | null> {
    const userQuery = query(
      this.getUsersCollection(),
      where('email', '==', email),
    );

    return from(getDocs(userQuery)).pipe(
      map((querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data() as UserDocument;
          // Convert Firestore timestamps to Date objects
          return {
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

  // Update user role
  updateUserRole(
    uid: string,
    userType: 'owner' | 'admin' | 'user',
  ): Observable<boolean> {
    const userDoc = doc(this.firestore, 'users', uid);
    const updateData = {
      userType,
      updatedAt: new Date(),
    };

    return from(setDoc(userDoc, updateData, { merge: true })).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      }),
    );
  }

  // Check if user exists in Firestore
  userExists(uid: string): Observable<boolean> {
    return this.getUserByUid(uid).pipe(map((user) => user !== null));
  }

  // Get default user role based on email (fallback method)
  getDefaultUserRole(email: string | null): 'owner' | 'admin' | 'user' {
    if (!email) return 'user';

    // Simple role assignment based on email patterns
    // This is a fallback for when user doesn't exist in Firestore yet
    if (email.includes('owner@') || email.includes('proprietario@')) {
      return 'owner';
    } else if (email.includes('admin@') || email.includes('administrador@')) {
      return 'admin';
    }
    return 'user';
  }

  private getUsersCollection() {
    return collection(this.firestore, 'users');
  }
}
