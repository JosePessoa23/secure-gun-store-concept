import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: AppConfig;
  private securityLevel = 'L2';

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>('/assets/config.json');
  }

  setConfig(config: AppConfig): void {
    this.config = config;
  }

  get apiUrl(): string {
    return this.config?.apiUrl;
  }

  getSecurityLevel(): string {
    return this.securityLevel;
  }

  setSecurityLevel(level: string): void {
    this.securityLevel = level;
  }
}
