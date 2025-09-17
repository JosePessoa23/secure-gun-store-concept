// src/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { BaseService } from './base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FingerPrintService } from '../services/finger-print.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private authStatus = new BehaviorSubject<boolean>(this.isTokenPresent());
  private fingerprint = '';

  constructor(
    http: HttpClient,
    configService: ConfigService,
    private fingerprintService: FingerPrintService
  ) {
    super(http, configService);
    this.fingerprintService.getFingerprint().then((fingerprint) => {
      this.fingerprint = fingerprint;
    });
  }

  private isTokenPresent(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  loginUser(
    email: string,
    password: string,
    twoFactorCode: string
  ): Observable<any> {
    const body = { email, password, fingerprint: this.fingerprint };
    let additionalHeaders = {};
    if (twoFactorCode) {
      additionalHeaders = { twoFactorCode: twoFactorCode };
    }
    return this.post<any>('auth/signin', body, additionalHeaders).pipe(
      tap((response) => {
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('userNif', response.userDTO.nif);
        sessionStorage.setItem('userEmail', response.userDTO.email);
        this.authStatus.next(true);
      })
    );
  }

  getUser(): Observable<any> {
    return this.get<any>('auth/currentUser');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userNif');
    sessionStorage.removeItem('userEmail');
    this.authStatus.next(false);
  }

  updateUser(body: any): Observable<any> {
    return this.put<any>('auth/update', body);
  }

  deleteUser(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/auth/delete`, {
      headers: this.getAuthHeaders(),
    });
  }

  itsMe(email: string, token: string, fingerprint: string): Observable<any> {
    const body = { email, token, fingerprint };
    return this.post<any>('auth/itsme', body);
  }

  setupTwoFactor(token: string): Observable<any> {
    return this.get<any>('auth/tfa', undefined, { token: token });
  }

  checkTwoFactor(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/has2fa`, {
      headers: this.getAuthHeaders({ email: email }),
    });
  }

  getActiveSessions(): Observable<any> {
    //sessions
    return this.get<any>('auth/sessions');
  }

  endSession(sessionId: string): Observable<any> {
    return this.post<any>('auth/killSession', { sessionID: sessionId });
  }

  endAllSessions(): Observable<any> {
    return this.post<any>('auth/killAllSessions', {});
  }
}
