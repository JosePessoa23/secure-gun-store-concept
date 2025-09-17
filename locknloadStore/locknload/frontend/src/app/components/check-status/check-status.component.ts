import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LicenseService } from '../../services/licenseService';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationStatusDTO } from '../../dto/applicationStatusDTO';
import { TuiAlertService } from '@taiga-ui/core';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'check-status',
  templateUrl: './check-status.component.html',
  styleUrls: ['./check-status.component.css'],
})
export class CheckStatusComponent extends FeatureManager implements OnInit {
  form: FormGroup;
  status: ApplicationStatusDTO = {
    status: '',
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private licenseService: LicenseService,
    private route: ActivatedRoute,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    featureService: FeatureService
  ) {
    super(featureService);
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required],
    });
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.route.params.subscribe((params) => {
      console.log(params);
      this.form.get('email')?.setValue(params['email']);
      this.form.get('token')?.setValue(params['token']);
    });

    this.licenseService
      .getStatus(this.form.get('email')?.value, this.form.get('token')?.value)
      .subscribe(
        (response) => {
          this.status = response;
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/']);
          this.alerts
            .open('Invalid link, please contact support.', {})
            .subscribe();
        }
      );
  }

  getStatusDate(): string {
    const dataObj = new Date(this.status.date || Date());
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }
}
