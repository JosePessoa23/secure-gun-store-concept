// src/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NavigationService } from './services/navigation.service';
import { UserService } from './services/userService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this.navigationService.blockBackNavigation();
  }

  canActivate(): Observable<boolean> {
    return this.userService.getUser().pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login'], { replaceUrl: true });
          return false;
        }
      }),
      catchError(() => {
        this.userService.logout();
        this.router.navigate(['/login'], { replaceUrl: true });
        return of(false);
      })
    );
  }
}
