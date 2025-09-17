import { Component, OnInit } from '@angular/core';
import { WeaponService } from '../../services/weaponService';
import { Weapon } from '../../models/weapon.model';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-catalog-preview',
  templateUrl: './catalog-preview.component.html',
  styleUrl: './catalog-preview.component.css',
})
export class CatalogPreviewComponent extends FeatureManager implements OnInit {
  weapons: Weapon[] = [];
  constructor(
    private weaponService: WeaponService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.weaponService.getWeapons().subscribe((data) => {
      // just pick the first 3 weapons
      this.weapons = data.slice(0, 3);
    });
  }
}
