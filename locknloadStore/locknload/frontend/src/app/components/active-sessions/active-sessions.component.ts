import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-active-sessions',
  templateUrl: './active-sessions.component.html',
  styleUrl: './active-sessions.component.css',
})
export class ActiveSessionsComponent extends FeatureManager implements OnInit {
  activeSessions: any[] = [];

  constructor(
    private userService: UserService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getActiveSessions();
  }

  getActiveSessions(): void {
    this.userService.getActiveSessions().subscribe((res) => {
      this.activeSessions = res.sessions;
    });
  }

  endSession(sessionId: string): void {
    this.userService.endSession(sessionId).subscribe(() => {
      this.getActiveSessions();
    });
  }

  endAllSessions(): void {
    this.userService.endAllSessions().subscribe(() => {
      this.getActiveSessions();
    });
  }
}
