import { Component, Inject, OnInit } from '@angular/core';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { CookieService } from 'ngx-cookie-service';
import { ShoppingCartService } from './services/shopping-cart-service.service';
import { Router } from '@angular/router';
import { UserService } from './services/userService';
import { ActivityTrackerService } from './services/activity-tracker.service';
import { ConfigService } from './config/config.service';
import { FeatureManager } from './components/feature-manager';
import { FeatureService } from './services/features.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends FeatureManager implements OnInit {
  title = 'locknload';
  isLoggedIn = false;
  cartItemCount = 0;

  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private cookieService: CookieService,
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private userService: UserService,
    private activityTrackerService: ActivityTrackerService,
    private configService: ConfigService,
    featureService: FeatureService
  ) {
    super(featureService);
    this.setActivityLimits();
  }

  isOpen = false;

  private setActivityLimits() {
    const securityLevel = this.configService.getSecurityLevel();
    if (securityLevel === 'L1') {
      this.activityTrackerService.setReAuthLimit(30 * 24); // 30 days
    } else if (securityLevel === 'L2') {
      this.activityTrackerService.setReAuthLimit(12); // 12 hours
      this.activityTrackerService.setInactivityLimit(30); // 30 minutes
    } else if (securityLevel === 'L3') {
      this.activityTrackerService.setReAuthLimit(12); // 12 hours
      this.activityTrackerService.setInactivityLimit(15); // 15 minutes
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  override ngOnInit() {
    super.ngOnInit();
    this.userService.getAuthStatus().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.cartItemCount = this.shoppingCartService.getItems().length;
    this.shoppingCartService.cartUpdated$.subscribe(() => {
      this.cartItemCount = this.shoppingCartService.getItems().length;
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
