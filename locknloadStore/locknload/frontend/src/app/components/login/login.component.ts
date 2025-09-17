import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent extends FeatureManager  implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    twoFactorCode: new FormControl(''),
  });
  isLoggedIn = false;
  hasTwoFactor = false;
  checkedTwoFactor = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit() {
    super.ngOnInit();
    const authToken = this.cookieService.get('authToken');
    this.isLoggedIn = !!authToken;
    if (this.isLoggedIn) {
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  onSubmit() {
    if (!this.checkedTwoFactor) {
      this.userService.checkTwoFactor(this.loginForm.value.email).subscribe(
        (response) => {
          this.checkedTwoFactor = true;
          if (response.has2fa) {
            this.hasTwoFactor = true;
          } else {
            this.login();
          }
        },
        (response) => {
          this.alerts
            .open(response.error, {
              status: 'error',
            })
            .subscribe();
        }
      );
    } else {
      this.login();
    }
  }

  login() {
    this.userService
      .loginUser(
        this.loginForm.value.email,
        this.loginForm.value.password,
        this.hasTwoFactor ? this.loginForm.value.twoFactorCode : null
      )
      .subscribe(
        (response) => {
          this.router.navigate(['/home']);
        },
        (response) => {
          console.log(response.error.error);
          this.alerts
            .open(response.error.error, {
              status: 'error',
            })
            .subscribe();
        }
      );
  }
}
