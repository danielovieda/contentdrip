import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { ManagerComponent } from './manager/manager.component';
import { SettingsComponent } from './manager/settings/settings.component';
import { PricingComponent } from './shared/pricing/pricing.component';
import { HomepageComponent } from './shared/homepage/homepage.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PagesComponent } from './shared/pages/pages.component';
import { SidebarComponent } from './manager/sidebar/sidebar.component';
import { MainComponent } from './manager/main/main.component';
import { DatepickerModule } from 'ng2-datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from "ngx-spinner";

import { HttpClientModule, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonService } from './service/common.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LinkComponent } from './link/link.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { StripeModule } from 'stripe-angular';
import { MediaComponent } from './media/media.component'
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import * as env from "../environments/environment";
import { MatTooltipModule } from '@angular/material/tooltip'
import { LinkyModule } from 'ngx-linky';

import { ToastrModule } from 'ngx-toastr';
import { NgxStripeModule } from 'ngx-stripe';
import { ColorBlockModule } from 'ngx-color/block';

//auth0 imports

import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { AuthModule } from '@auth0/auth0-angular';
import { NotfoundComponent } from './shared/pages/notfound/notfound.component';
import { HowitworksComponent } from './shared/howitworks/howitworks.component';
import { TwitterMarketingComponent } from './shared/pages/twitter-marketing/twitter-marketing.component';
import { FacebookMarketingComponent } from './shared/pages/facebook-marketing/facebook-marketing.component';
import { InstagramMarketingComponent } from './shared/pages/instagram-marketing/instagram-marketing.component';


import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const gtag: Function;

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ManagerComponent,
    SettingsComponent,
    PricingComponent,
    HomepageComponent,
    FooterComponent,
    PagesComponent,
    SidebarComponent,
    MainComponent,
    LinkComponent,
    CheckoutComponent,
    MediaComponent,
    NotfoundComponent,
    HowitworksComponent,
    TwitterMarketingComponent,
    FacebookMarketingComponent,
    InstagramMarketingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DatepickerModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    NgxSpinnerModule,
    AuthModule.forRoot({
      domain: 'mishow.us.auth0.com',
      clientId: 'htVgTqBtSBtwwMKCL49fYJKe4DPsNDwz',
      // httpInterceptor: {
      //   allowedList: [`${env.environment.SECURED_GET_USER_URL}`]
      // }
    }),
    HttpClientModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    ImagekitioAngularModule.forRoot({
      publicKey:  env.environment.publicKey,
      urlEndpoint: env.environment.urlEndpoint,
    }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }), // ToastrModule added
    MatTooltipModule,
    NgxStripeModule.forRoot('pk_test_51J8H7jAZN8s5xOaiIGB0VdmP16hoEyGfc3Vtyx15xM6OaBHpyXOEQ9GxW9rKOD9YW051LfDt1uIyYsrT1Zf2yWjE00SOm14Oqk'),
    LinkyModule,
    ColorBlockModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    CommonService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private router: Router) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      /** START : Code to Track Page View  */
       gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
       })
      /** END */
    })
  }


}
