// src/services/password-reset.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResetPasswordEmail } from '../models/reset-password-email.model';
import { ResetPassword } from '../models/reset-password.model';
import { ConfigService } from '../config/config.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService extends BaseService {
  constructor(
    http: HttpClient,
    configService: ConfigService
  ) {
    super(http, configService);
  }

  resetPasswordEmail(resetPasswordEmail: ResetPasswordEmail) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(
      `${this.apiUrl}/reset-password/email`,
      resetPasswordEmail,
      { headers }
    );
  }

  resetPassword(resetPassword: ResetPassword) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(
      `${this.apiUrl}/reset-password`,
      resetPassword,
      { headers }
    );
  }

  changePassword(changePassword: any) {
    return this.put<any>('reset-password', changePassword);
  }
}
