import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ApplicationDTO } from '../../dto/applicationDTO';
import { LicenseService } from '../../services/licenseService';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-user-application-view',
  templateUrl: './user-application-view.component.html',
  styleUrl: './user-application-view.component.css',
})
export class UserApplicationViewComponent implements OnInit {
  email = '';
  application: ApplicationDTO = {
    name: '',
    email: '',
    birthDate: new Date(),
    address: '',
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private licenseService: LicenseService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
    this.licenseService.getApplication(this.email).subscribe(
      (data) => {
        this.application = data;
        console.log(this.application);
      },
      (error) => {
        console.error('Error fetching applications', error);
      }
    );
  }

  formatDate(date: Date): string {
    const dataObj = new Date(date || Date());
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  downloadMedicalCertificate() {
    if (this.application.medicalCertificate) {
      const uint8Array = new Uint8Array(
        this.application.medicalCertificate.data
      );
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      FileSaver.saveAs(
        blob,
        'MedicalCertificate_' + this.application.email + '.pdf'
      );
    }
  }

  downloadDocumentId() {
    if (this.application.documentId) {
      const uint8Array = new Uint8Array(this.application.documentId.data);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      FileSaver.saveAs(blob, 'DocID_' + this.application.email + '.pdf');
    }
  }

  approveApplication(approve: string) {
    console.log(approve);
    this.licenseService.approveApplication(this.email, approve).subscribe(
      (data) => {
        this.router.navigate(['/applicationsList']);
        this.alerts.open('Operation performed successfully.', {}).subscribe();
      },
      (error) => {
        if (error.status == 401 || error.status == 403) {
          this.router.navigate(['/applicationsList']);
          this.alerts.open('Insufficient permissions', {}).subscribe();
          console.error('Operation failed.');
        } else {
          this.router.navigate(['/applicationsList']);
          this.alerts.open('Operation failed.', {}).subscribe();
          console.error('Operation failed.');
        }
      }
    );
  }
}
