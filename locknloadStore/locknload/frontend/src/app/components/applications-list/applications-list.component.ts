import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationDTO } from '../../dto/applicationDTO';
import { LicenseService } from '../../services/licenseService';
import { TuiAlertService } from '@taiga-ui/core';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'applications-list',
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.css',
})
export class ApplicationsListComponent
  extends FeatureManager
  implements OnInit
{
  applications: ApplicationDTO[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private licenseService: LicenseService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.licenseService.getPendingApplications().subscribe(
      (data) => {
        this.applications = data;
      },
      (error) => {
        if (error.status == 401 || error.status == 403) {
          this.router.navigate(['/login']);
          this.alerts.open('Insufficient permissions', {}).subscribe();
          console.error('Operation failed.');
        }
        console.error('Error fetching applications', error);
      }
    );
  }

  redirectToDetails(email: string) {
    // Redireciona para a página de detalhes da aplicação com base no ID da aplicação
    this.router.navigate(['/applicationsList/user/', email]);
  }
}
