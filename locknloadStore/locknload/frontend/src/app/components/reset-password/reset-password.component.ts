import { Component, Inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ResetPassword } from '../../models/reset-password.model';
import { PasswordResetService } from '../../services/passwordResetService';
import { TuiAlertService } from '@taiga-ui/core';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent extends FeatureManager implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    new_password: new FormControl('', Validators.required),
    new_password_confirmation: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private passworResetService: PasswordResetService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit() {
    super.ngOnInit();
    const authToken = this.cookieService.get('authToken');
    if (authToken) {
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  submit(): void {
    const token = this.router.url.split('/')[2];
    const resetPasswordEmail = new ResetPassword(
      token,
      this.form.value.email,
      this.form.value.new_password,
      this.form.value.new_password_confirmation
    );

    this.passworResetService.resetPassword(resetPasswordEmail).subscribe(() => {
      this.alerts
        .open('Reset password conclued with success.', {
          status: 'success',
        })
        .subscribe();
    });
    setTimeout(() => {
      this.form.reset();
    }, 2000);
  }
}
