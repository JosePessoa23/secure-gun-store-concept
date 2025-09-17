import { Component } from '@angular/core';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent extends FeatureManager {

  constructor(featureService: FeatureService) {
    super(featureService);
  }

  index = 2;
  baseSrc = 'assets/images/carousel/';

  readonly imageItems = [
    this.baseSrc + 'card1.png',
    this.baseSrc + 'card2.png',
    this.baseSrc + 'card3.png',
  ];
}
