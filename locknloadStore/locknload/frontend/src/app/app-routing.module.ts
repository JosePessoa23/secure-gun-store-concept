import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { WeaponCatalogComponent } from './components/weapon-catalog/weapon-catalog.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CreateWeaponComponent } from './components/create-weapon/create-weapon.component';
import { ResetPasswordEmailComponent } from './components/reset-password-email/reset-password-email.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ApplicationsListComponent } from './components/applications-list/applications-list.component';
import { UserApplicationViewComponent } from './components/user-application-view/user-application-view.component';
import { AuthGuard } from './auth.guard'; // Import the Auth Guard
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserPurchaseHistoryComponent } from './components/user-purchaseHistory/user-purchaseHistory.component';
import { UserDeleteComponent } from './components/user-delete/user-delete.component';
import { CheckStatusComponent } from './components/check-status/check-status.component';
import { ItsMeComponent } from './components/its-me/its-me.component';
import { TwoFactorComponent } from './components/two-factor/two-factor.component';
import { ActiveSessionsComponent } from './components/active-sessions/active-sessions.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'purchaseHistory',
        component: UserPurchaseHistoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'userDetails',
        component: UserDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'application/:email',
        component: UserApplicationViewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'delete',
        component: UserDeleteComponent,
        canActivate: [AuthGuard],
      },
      { path: 'tfa', component: TwoFactorComponent, canActivate: [AuthGuard] },
      { path: 'activeSessions', component: ActiveSessionsComponent, canActivate: [AuthGuard] },
    ],
  },
  {
    path: 'catalog',
    component: WeaponCatalogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    canActivate: [AuthGuard],
  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  {
    path: 'create-weapon',
    component: CreateWeaponComponent,
    canActivate: [AuthGuard],
  },
  { path: 'reset-password-email', component: ResetPasswordEmailComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  {
    path: 'applicationsList',
    component: ApplicationsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'applicationsList/user/:email',
    component: UserApplicationViewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'licenseApplication', component: UserDashboardComponent }, // Accessible for non-authenticated users
  { path: 'status/email/:email/:token', component: CheckStatusComponent },
  { path: 'itsMe', component: ItsMeComponent },
  // Wildcard route for a 404 page, if needed
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
