import { Component, Inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordEmail } from '../../models/reset-password-email.model';
import { PasswordResetService } from '../../services/passwordResetService';
import { TuiAlertService } from '@taiga-ui/core';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.css']
})

export class ResetPasswordEmailComponent extends FeatureManager implements OnInit{
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required)
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

  override ngOnInit(){
    super.ngOnInit();
    const authToken = this.cookieService.get('authToken');
    if(authToken){
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  submit(): void {
    const resetPasswordEmail = new ResetPasswordEmail(this.form.value.email);
    this.passworResetService.resetPasswordEmail(resetPasswordEmail).subscribe(() => {
      this.alerts
          .open('Reset password request created successfully, check your email address.', {
            status: 'success',
          })
      .subscribe();
    });
    setTimeout(() => {
      this.form.reset();
    }, 2000);
  }
}
