// src/services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private previousUrl = '';
  private currentUrl = '';

  constructor(private router: Router, private location: Location) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public blockBackNavigation() {
    this.location.subscribe(event => {
      if (event.type === 'popstate' && this.router.url === '/login') {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }
}
