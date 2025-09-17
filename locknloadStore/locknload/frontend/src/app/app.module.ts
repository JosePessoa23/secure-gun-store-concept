import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { TUI_SANITIZER } from '@taiga-ui/core';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { CatalogPreviewComponent } from './components/catalog-preview/catalog-preview.component';
import { WeaponCardComponent } from './components/weapon-card/weapon-card.component';
import { WeaponCatalogComponent } from './components/weapon-catalog/weapon-catalog.component';
import { ShoppingCartService } from './services/shopping-cart-service.service';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ShoppingCartItemComponent } from './components/shopping-cart-item/shopping-cart-item.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CreateWeaponComponent } from './components/create-weapon/create-weapon.component';
import { ResetPasswordEmailComponent } from './components/reset-password-email/reset-password-email.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TaigaUiModule } from './taiga-ui';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { catchError, of } from 'rxjs';
import { ConfigService } from './config/config.service';
import { ApplicationsListComponent } from './components/applications-list/applications-list.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CheckStatusComponent } from './components/check-status/check-status.component';
import { ItsMeComponent } from './components/its-me/its-me.component';
import { TwoFactorComponent } from './components/two-factor/two-factor.component';
import { ActiveSessionsComponent } from './components/active-sessions/active-sessions.component';

export function initializeApp(configService: ConfigService) {
  return () =>
    configService
      .loadConfig()
      .pipe(
        catchError((error) => {
          console.error('Failed to load config', error);
          return of({});
        })
      )
      .toPromise()
      .then((config) => configService.setConfig(config as any));
}




@NgModule({
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    TaigaUiModule,
    AppRoutingModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    LoginComponent,
    CatalogPreviewComponent,
    WeaponCardComponent,
    WeaponCatalogComponent,
    ShoppingCartComponent,
    ShoppingCartItemComponent,
    CheckoutComponent,
    CreateWeaponComponent,
    ResetPasswordEmailComponent,
    ResetPasswordComponent,
    ApplicationsListComponent,
    ChangePasswordComponent,
    UserDashboardComponent,
    CheckStatusComponent,
    ItsMeComponent,
    TwoFactorComponent,
    ActiveSessionsComponent
  ],
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: 'longDate' },
    },
    ShoppingCartService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
