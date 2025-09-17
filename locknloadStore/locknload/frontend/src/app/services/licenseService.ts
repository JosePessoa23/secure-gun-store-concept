import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { TuiDay } from '@taiga-ui/cdk';
import { CookieService } from 'ngx-cookie-service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LicenseService extends BaseService {
  constructor(http: HttpClient, configService: ConfigService) {
    super(http, configService);
  }

  uploadFile(
    bytesMC: Uint8Array,
    fileNameMC: string,
    bytesID: Uint8Array,
    fileNameID: string,
    name: string,
    email: string,
    address: string,
    birthDate: TuiDay,
    dataConsent: boolean
  ) {
    const formData = new FormData();
    formData.append('medicalCertificate', new Blob([bytesMC]), fileNameMC);
    formData.append('documentId', new Blob([bytesID]), fileNameID);
    formData.append('email', email);
    formData.append('name', name);
    formData.append('address', address);
    formData.append('birthDate', birthDate.toUtcNativeDate().toISOString());
    formData.append('dataConsent', dataConsent.toString());

    return this.http.post<any>(`${this.apiUrl}/license/upload`, formData);
  }

  getStatus(email: string, token: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(
      `${this.configService.apiUrl}/license/applicationStatus/` +
        email +
        '/' +
        token,
      { headers }
    );
  }

  getPendingApplications() {
    return this.get<any>('license/application/ordered/date');
  }

  getApplication(email: string) {
    return this.get<any>('license/application/' + email);
  }

  approveApplication(email: string, approve: string) {
    return this.post<any>(
      'license/application/approve/' + email + '/' + approve,
      {}
    );
  }
}
