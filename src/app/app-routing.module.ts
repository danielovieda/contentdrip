import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ManagerComponent } from './manager/manager.component';
import { SettingsComponent } from './manager/settings/settings.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './shared/homepage/homepage.component';
import { PagesComponent } from './shared/pages/pages.component';
import { PricingComponent } from './shared/pricing/pricing.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { LinkComponent } from './link/link.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MediaComponent } from './media/media.component';
import { NotfoundComponent } from './shared/pages/notfound/notfound.component';
import { HowitworksComponent } from './shared/howitworks/howitworks.component';
import { TwitterMarketingComponent } from './shared/pages/twitter-marketing/twitter-marketing.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'campaigns', component: ManagerComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'pricing', component: PricingComponent},
  { path: '', component: HomepageComponent},
  { path: 'home', component: HomepageComponent},
  { path: 'terms', component: PagesComponent},
  { path: 'privacy', component: PagesComponent},
  { path: 'refunds', component: PagesComponent},
  { path: 'link', component: LinkComponent},
  { path: 'link/:short', component: LinkComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'checkout/success', component: CheckoutComponent},
  { path: 'checkout/failure', component: CheckoutComponent},
  { path: 'media', component: MediaComponent},
  { path: '404', component: NotfoundComponent},
  { path: 'howitworks', component: HowitworksComponent},
  { path: 'twitter-marketing', component: TwitterMarketingComponent},
  { path: '**', pathMatch: 'full', component: NotfoundComponent }
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  // ...any other options you'd like to use
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
