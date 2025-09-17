// feature-manager.directive.ts
import { Directive, OnInit } from '@angular/core';
import { FeatureService } from '../services/features.service';

@Directive()
export class FeatureManager implements OnInit {
  features: string[] = [];

  constructor(private featureService: FeatureService) {}

  ngOnInit() {
    this.featureService.getFeatures().subscribe(response => {
      this.features = response.features;
    });
  }

  hasFeature(feature: string): boolean {
    return this.features.includes(feature);
  }
}
