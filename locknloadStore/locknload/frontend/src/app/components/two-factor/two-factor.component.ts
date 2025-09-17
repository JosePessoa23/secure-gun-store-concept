import { Component } from '@angular/core';
import { UserService } from '../../services/userService';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css'],
})
export class TwoFactorComponent extends FeatureManager {
  qrCode: SafeHtml = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService,
    private sanitizer: DomSanitizer,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  setupTwoFactor() {
    const token = this.cookieService.get('authToken');
    this.userService.setupTwoFactor(token).subscribe((response) => {

      this.qrCode = this.sanitizer.bypassSecurityTrustHtml(response);
    });
  }
}
