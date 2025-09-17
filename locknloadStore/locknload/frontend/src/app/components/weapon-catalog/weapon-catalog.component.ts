import { Component, OnInit } from '@angular/core';
import { Weapon } from '../../models/weapon.model';
import { WeaponService } from '../../services/weaponService';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'weapon-catalog',
  templateUrl: './weapon-catalog.component.html',
  styleUrl: './weapon-catalog.component.css',
})
export class WeaponCatalogComponent extends FeatureManager implements OnInit {
  weapons: Weapon[] = [];
  nameSortOrder = 'asc';
  priceSortOrder = 'asc';

  constructor(
    private weaponService: WeaponService,
    private router: Router,
    private sanitizer: DomSanitizer,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.weaponService.getWeapons().subscribe((data) => {
      // just pick the first 3 weapons
      this.weapons = data;
    });
  }

  toggleWeaponsNameSort() {
    if (this.nameSortOrder === 'asc') {
      this.getWeaponsNameDesc();
      this.nameSortOrder = 'desc';
    } else {
      this.getWeaponsNameAsc();
      this.nameSortOrder = 'asc';
    }
  }

  toggleWeaponsPriceSort() {
    if (this.priceSortOrder === 'asc') {
      this.getWeaponsPriceDesc();
      this.priceSortOrder = 'desc';
    } else {
      this.getWeaponsPriceAsc();
      this.priceSortOrder = 'asc';
    }
  }

  getWeapons() {
    this.weaponService.getWeapons().subscribe((data) => {
      // just pick the first 3 weapons
      this.weapons = data;
    });
  }

  addWeapon() {
    this.router.navigate(['/create-weapon']);
  }

  getWeaponsNameAsc() {
    this.weaponService.getWeaponsNameAsc().subscribe((data) => {
      // just pick the first 3 weapons
      this.weapons = data;
    });
  }

  getWeaponsNameDesc() {
    this.weaponService.getWeaponsNameDesc().subscribe((data) => {
      // just pick the first 3 weapons
      this.weapons = data;
    });
  }

  getWeaponsPriceAsc() {
    this.weaponService.getWeaponsPriceAsc().subscribe((data) => {
      // just pick the first 3 weapons
      this.weapons = data;
    });
  }

  getWeaponsPriceDesc() {
    this.weaponService.getWeaponsPriceDesc().subscribe((data) => {
      // just pick the first 3 weapons
      this.weapons = data;
    });
  }

  filtrarByName() {
    const inputBox = document.getElementById('inputBox') as HTMLInputElement;
    const name = inputBox.value;
    const flag = this.sanitizer.sanitize(1, name);
    console.log(flag);
    if (flag === name) {
      this.weaponService.filterByName(name).subscribe((data) => {
        this.weapons = data;
      });
    }
  }
}
