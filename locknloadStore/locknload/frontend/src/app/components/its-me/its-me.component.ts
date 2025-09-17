import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FingerPrintService } from '../../services/finger-print.service';
import { UserService } from '../../services/userService';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-its-me',
  templateUrl: './its-me.component.html',
  styleUrl: './its-me.component.css',
})
export class ItsMeComponent extends FeatureManager implements OnInit {

  private email!: string;
  private token!: string;
  private fingerprint!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private fingerPrintService: FingerPrintService,
    private userService: UserService,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // get the query params email, token and fingerprint
    this.email = this.activatedRoute.snapshot.queryParams['email'];
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    this.fingerprint = this.activatedRoute.snapshot.queryParams['fingerprint'];
  }

  itsMe(): void {
    this.userService.itsMe(this.email, this.token, this.fingerprint).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
