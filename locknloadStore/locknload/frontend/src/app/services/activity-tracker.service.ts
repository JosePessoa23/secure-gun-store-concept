// src/services/activity-tracker.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './userService';

@Injectable({
  providedIn: 'root',
})
export class ActivityTrackerService {
  private lastActivity: number = Date.now();
  private inactivityLimit: number = 30 * 60 * 1000; // Default to 30 minutes
  private reAuthLimit: number = 12 * 60 * 60 * 1000; // Default to 12 hours

  constructor(private router: Router, private userService: UserService) {
    this.setupActivityListeners();
    this.setupIdleCheck();
  }

  private setupActivityListeners() {
    ['click', 'mousemove', 'keydown', 'scroll'].forEach(event => {
      window.addEventListener(event, () => this.updateLastActivity());
    });
  }

  private updateLastActivity() {
    this.lastActivity = Date.now();
  }

  private setupIdleCheck() {
    setInterval(() => {
      const now = Date.now();
      const idleTime = now - this.lastActivity;
      if (idleTime > this.inactivityLimit || idleTime > this.reAuthLimit) {
        this.userService.logout();
        this.router.navigate(['/login']);
      }
    }, 10000); // Check every 10 seconds
  }

  setInactivityLimit(minutes: number) {
    this.inactivityLimit = minutes * 60 * 1000;
  }

  setReAuthLimit(hours: number) {
    this.reAuthLimit = hours * 60 * 60 * 1000;
  }
}
