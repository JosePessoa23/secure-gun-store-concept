// src/services/base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected apiUrl: string;

  constructor(
    protected http: HttpClient,
    protected configService: ConfigService
  ) {
    this.apiUrl = this.configService.apiUrl;
  }

  protected getAuthHeaders(additionalHeaders?: { [key: string]: string }): HttpHeaders {
    const authToken = sessionStorage.getItem('authToken');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    if (additionalHeaders) {
      for (const key in additionalHeaders) {
        headers = headers.set(key, additionalHeaders[key]);
      }
    }

    return headers;
  }

  protected get<T>(endpoint: string, params?: HttpParams, additionalHeaders?: { [key: string]: string }): Observable<T> {
    const headers = this.getAuthHeaders(additionalHeaders);
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers, params, withCredentials: true });
  }

  protected post<T>(endpoint: string, body: any, additionalHeaders?: { [key: string]: string }): Observable<T> {
    const headers = this.getAuthHeaders(additionalHeaders);
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, { headers , withCredentials: true });
  }

  protected put<T>(endpoint: string, body: any, additionalHeaders?: { [key: string]: string }): Observable<T> {
    const headers = this.getAuthHeaders(additionalHeaders);
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, { headers , withCredentials: true });
  }


}
