import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  user,
} from '@angular/fire/auth';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { IUserProps } from '../model/user/IUserProps';
import { UserService } from './user.service';

export interface AuthResult {
  success: boolean;
  message: string;
  user?: IUserProps;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private userService = inject(UserService);
  private googleProvider = new GoogleAuthProvider();

  // Reactive signals for auth state
  currentUser = signal<IUserProps | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // Observable for auth state changes
  user$ = user(this.auth);

  constructor() {
    // Listen to auth state changes
    this.user$.subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.setCurrentUser(firebaseUser);
      } else {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
    });
  }

  // Email and Password Sign In
  signInWithEmail(email: string, password: string): Observable<AuthResult> {
    this.isLoading.set(true);

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credential) => {
        // Check if user exists in Firestore
        return this.userService.getUserByUid(credential.user.uid).pipe(
          map((userDoc) => {
            if (userDoc) {
              // User exists in Firestore, use stored data
              const userProps: IUserProps = {
                name: userDoc.name,
                email: userDoc.email,
                userType: userDoc.userType,
              };
              this.currentUser.set(userProps);
              this.isAuthenticated.set(true);
              this.isLoading.set(false);

              return {
                success: true,
                message: 'Login realizado com sucesso!',
                user: userProps,
              };
            } else {
              // User doesn't exist in Firestore, create with default role
              const defaultUserType = this.userService.getDefaultUserRole(
                credential.user.email,
              );
              const userProps = this.createUserProps(
                credential.user,
                defaultUserType,
              );

              // Store user in Firestore (fire and forget)
              this.userService
                .createUser(credential.user.uid, userProps)
                .subscribe({
                  next: (success) => {
                    if (success) {
                      console.log(
                        'User document created in Firestore during login',
                      );
                    } else {
                      console.error(
                        'Failed to create user document in Firestore during login',
                      );
                    }
                  },
                });

              this.currentUser.set(userProps);
              this.isAuthenticated.set(true);
              this.isLoading.set(false);

              return {
                success: true,
                message: 'Login realizado com sucesso!',
                user: userProps,
              };
            }
          }),
        );
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: this.getErrorMessage(error.code),
        });
      }),
    );
  }

  // Email and Password Sign Up
  signUpWithEmail(
    email: string,
    password: string,
    displayName: string,
  ): Observable<AuthResult> {
    this.isLoading.set(true);

    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(
      switchMap((credential) => {
        // Update user profile with display name
        return from(updateProfile(credential.user, { displayName })).pipe(
          switchMap(() => {
            // Determine user role and create user props
            const defaultUserType = this.userService.getDefaultUserRole(
              credential.user.email,
            );
            const userProps = this.createUserProps(
              credential.user,
              defaultUserType,
            );

            // Store user in Firestore
            return this.userService
              .createUser(credential.user.uid, userProps)
              .pipe(
                map((success) => {
                  if (success) {
                    console.log('New user document created in Firestore');
                  } else {
                    console.error(
                      'Failed to create user document in Firestore',
                    );
                  }

                  this.currentUser.set(userProps);
                  this.isAuthenticated.set(true);
                  this.isLoading.set(false);

                  return {
                    success: true,
                    message: 'Conta criada com sucesso!',
                    user: userProps,
                  };
                }),
              );
          }),
        );
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: this.getErrorMessage(error.code),
        });
      }),
    );
  }

  // Google Sign In
  signInWithGoogle(): Observable<AuthResult> {
    this.isLoading.set(true);

    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      switchMap((credential) => {
        // Check if user exists in Firestore
        return this.userService.getUserByUid(credential.user.uid).pipe(
          switchMap((userDoc) => {
            if (userDoc) {
              // User exists in Firestore, use stored data
              const userProps: IUserProps = {
                name: userDoc.name,
                email: userDoc.email,
                userType: userDoc.userType,
              };
              this.currentUser.set(userProps);
              this.isAuthenticated.set(true);
              this.isLoading.set(false);

              return of({
                success: true,
                message: 'Login com Google realizado com sucesso!',
                user: userProps,
              });
            } else {
              // User doesn't exist in Firestore, create with default role
              const defaultUserType = this.userService.getDefaultUserRole(
                credential.user.email,
              );
              const userProps = this.createUserProps(
                credential.user,
                defaultUserType,
              );

              // Store user in Firestore
              return this.userService
                .createUser(credential.user.uid, userProps)
                .pipe(
                  map((success) => {
                    if (success) {
                      console.log(
                        'New Google user document created in Firestore',
                      );
                    } else {
                      console.error(
                        'Failed to create Google user document in Firestore',
                      );
                    }

                    this.currentUser.set(userProps);
                    this.isAuthenticated.set(true);
                    this.isLoading.set(false);

                    return {
                      success: true,
                      message: 'Login com Google realizado com sucesso!',
                      user: userProps,
                    };
                  }),
                );
            }
          }),
        );
      }),
      catchError((error) => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: this.getErrorMessage(error.code),
        });
      }),
    );
  }

  // Sign Out
  signOut(): Observable<AuthResult> {
    this.isLoading.set(true);

    return from(signOut(this.auth)).pipe(
      map(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.isLoading.set(false);
        this.router.navigate(['/']);

        return {
          success: true,
          message: 'Logout realizado com sucesso!',
        };
      }),
      catchError((error) => {
        this.isLoading.set(false);
        console.error('Logout error:', error);
        return of({
          success: false,
          message: 'Erro ao fazer logout',
        });
      }),
    );
  }

  // Helper method to create IUserProps from Firebase User
  private createUserProps(
    firebaseUser: User,
    userType: 'owner' | 'admin' | 'user',
  ): IUserProps {
    return {
      name:
        firebaseUser.displayName ||
        firebaseUser.email?.split('@')[0] ||
        'Usuário',
      email: firebaseUser.email || '',
      userType,
    };
  }

  // Helper method to set current user
  private setCurrentUser(firebaseUser: User): void {
    // Try to get user data from Firestore first
    this.userService.getUserByUid(firebaseUser.uid).subscribe({
      next: (userDoc) => {
        if (userDoc) {
          // User exists in
          // Firestore, use stored
          // data
          const userProps: IUserProps = {
            name: userDoc.name,
            email: userDoc.email,
            userType: userDoc.userType,
          };
          this.currentUser.set(userProps);
          this.isAuthenticated.set(true);
        } else {
          // User doesn't exist in
          // Firestore, create with
          // default role
          const defaultUserType = this.userService.getDefaultUserRole(
            firebaseUser.email,
          );
          const userProps = this.createUserProps(firebaseUser, defaultUserType);

          // Store user in Firestore
          this.userService.createUser(firebaseUser.uid, userProps).subscribe({
            next: (success) => {
              if (success) {
                console.log('User document created in Firestore');
              } else {
                console.error('Failed to create user document in Firestore');
              }
            },
          });

          this.currentUser.set(userProps);
          this.isAuthenticated.set(true);
        }
      },
      error: (error) => {
        console.error('Error retrieving user from Firestore:', error);
        // Fallback to email pattern
        // approach
        const userType = this.getUserType(firebaseUser.email);
        const userProps = this.createUserProps(firebaseUser, userType);
        this.currentUser.set(userProps);
        this.isAuthenticated.set(true);
      },
    });
  }

  // Determine user type based on email (simple implementation)
  private getUserType(email: string | null): 'owner' | 'admin' | 'user' {
    if (!email) return 'user';

    // Simple role assignment based on email patterns
    // In a real app, this would come from a database
    if (email.includes('owner@') || email.includes('proprietario@')) {
      return 'owner';
    } else if (email.includes('admin@') || email.includes('administrador@')) {
      return 'admin';
    }
    return 'user';
  }

  // Helper method to get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Este email já está em uso';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      case 'auth/popup-closed-by-user':
        return 'Login cancelado pelo usuário';
      default:
        return 'Erro de autenticação. Tente novamente';
    }
  }

  // Check if user has specific userType
  hasUserType(userType: 'owner' | 'admin' | 'user'): boolean {
    const currentUser = this.currentUser();
    return currentUser?.userType === userType;
  }

  // Check if user has admin or owner privileges
  hasAdminPrivileges(): boolean {
    const currentUser = this.currentUser();
    return (
      currentUser?.userType === 'admin' || currentUser?.userType === 'owner'
    );
  }

  // Check if user is owner
  isOwner(): boolean {
    return this.hasUserType('owner');
  }
}
