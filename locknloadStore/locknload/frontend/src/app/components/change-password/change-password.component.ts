import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TuiAlertService } from '@taiga-ui/core';
import { PasswordResetService } from '../../services/passwordResetService';
import { CookieService } from 'ngx-cookie-service';
import * as zxcvbn from 'zxcvbn';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent extends FeatureManager {
  form: FormGroup = new FormGroup({
    token: new FormControl(''),
    email: new FormControl('', Validators.required),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    newPasswordConfirmation: new FormControl('', Validators.required),
  });

  changed = false;
  passwordStrength = 0;

  constructor(
    private service: PasswordResetService,
    private fb: FormBuilder,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private cookieService: CookieService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  submit(): void {
    const changePassword = this.form.value;
    changePassword.token = this.cookieService.get('authToken');
    this.service.changePassword(this.form.value).subscribe((response) => {
      if (response) {
        this.changed = true;

        this.alerts
          .open('Password changed successfully', {
            status: 'success',
          })
          .subscribe();
      } else {
        this.alerts
          .open('Password change failed', {
            status: 'error',
          })
          .subscribe();
      }
    });
  }

  onPasswordInput(): void {
    const password = this.form.get('newPassword')?.value || '';
    const result = zxcvbn(password);
    this.passwordStrength = result.score;
  }

  getPasswordStrengthLabel(): string {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[this.passwordStrength] || 'Very Weak';
  }

  getPasswordStrengthColor(): string {
    const colors = ['#ff4b4b', '#ff8851', '#ffca51', '#8bc34a', '#4caf50'];
    return colors[this.passwordStrength] || '#ff4b4b';
  }
}
