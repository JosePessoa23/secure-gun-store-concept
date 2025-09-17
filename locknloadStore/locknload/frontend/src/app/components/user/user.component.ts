import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'], // Changed `styleUrl` to `styleUrls`
})
export class UserComponent extends FeatureManager {
  constructor(private router: Router, featureService: FeatureService) {
    super(featureService);
  }
}
