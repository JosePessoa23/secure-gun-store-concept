// src/services/weapon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Weapon } from '../models/weapon.model';
import { ConfigService } from '../config/config.service';
import { CookieService } from 'ngx-cookie-service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class WeaponService extends BaseService {
  constructor(http: HttpClient, configService: ConfigService) {
    super(http, configService);
  }

  getWeapons() {
    return this.get<any>('weapon');
  }

  createWeapon(weapon: Weapon) {
    return this.post<any>('weapon', weapon);
  }

  getWeaponsNameAsc() {
    return this.get<any>('weapon/ByNameAsc');
  }

  getWeaponsNameDesc() {
    return this.get<any>('weapon/ByNameDesc');
  }

  getWeaponsPriceAsc() {
    return this.get<any>('weapon/PriceAsc');
  }

  getWeaponsPriceDesc() {
    return this.get<any>('weapon/PriceDesc');
  }

  filterByName(name: string) {
    return this.get<any>(`weapon/filterByName/${name}`);
  }
}
