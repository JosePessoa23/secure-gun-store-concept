// feature.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureService extends BaseService {

  constructor(http: HttpClient, configService: ConfigService) {
    super(http, configService);
  }

  getFeatures() {
    return this.get<any>('auth/features');
  }

}
