import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { CommonService } from "src/app/service/common.service";
import { RedirectLoginOptions } from '@auth0/auth0-spa-js'
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { userService } from '../../service/user.service'
import { Title } from '@angular/platform-browser';




@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['../../shared/homepage/homepage.component.css']
})

export class NavigationComponent implements OnInit {
  userDetail: any;
  token: any;
  nav: boolean = false;
  profileJson: string
  user: any
  navAlert: boolean = false
  navAlertMessage: string = ''
  authProfile: any

  constructor(private CommonService: CommonService, public auth: AuthService,
    @Inject(DOCUMENT) public document: Document, private http: HttpClient,
    private toastr: ToastrService,
    public userService: userService,
    public titleService: Title)
     {


  }

  ngOnInit(): void {
    // if (this.auth.isAuthenticated$) {
    //   this.auth.idTokenClaims$.subscribe({
    //     next: data => {

    //       //this.header = this.header.append('Authorization', data.__raw)
    //       if (data.__raw) {
    //         this.userService.saveToken(data.__raw)
    //         //console.log('data.raw')
    //         //console.log(data.__raw)
    //         this.getUserInfo(data.__raw)

    //       }
    //       ////console.log(data.__raw)

    //     },
    //     error: error => {
    //       //console.log('some error in idTokenclaim')
    //     }
    //   })

    //   this.auth.user$.subscribe({
    //     next: data => {
    //       this.authProfile = data
    //       //console.log('this is the auth profile')
    //       //console.log(JSON.stringify(this.authProfile))
    //       this.userService.saveId(data.sub)
    //     }
    //   })
    // }




    // this.auth.user$.subscribe({
    //   next: data => {
    //     //console.log(JSON.stringify(data))
    //   },
    //   error: error => {
    //     //console.log('some error in auth user subscription')
    //   }
    // })
    // ///

    // //console.log('triggering secured API....')

    // this.getUserInfo()


   }

   toggleNav() {
     this.nav = this.nav ? false : true;
     //this.toastr.success('hello')
   }

  //  loginWithRedirect() {
  //    this.auth.loginWithRedirect()
  //  //{redirect_uri: 'https://contentdrip.auth.us-east-2.amazoncognito.com/oauth2/idpresponse'} as RedirectLoginOptions
  //   }

    // getUserInfo(token: any) {
    //   //console.log('get user info triggered')
    //   //console.log('token data: ' + token)
    //   //console.log('token data from the userService: ')
    //   //console.log(this.userService.getToken())
    //   this.http
    //   .get(`${env.SECURED_GET_USER_URL}`, {headers: {'Authorization': token}})
    //   .subscribe({
    //     next: data => {

    //       //this.CommonService.setUser(data)
    //       //this.user = data
    //       ////console.log(JSON.stringify(data))
    //       ////console.log('user: ')
    //       ////console.log(JSON.stringify(this.user))
    //       this.navAlert = true
    //       this.navMessage('Thank you for being part of Content Drip.')
    //     },
    //     error: error => {
    //       //console.log('some error: ' + JSON.stringify(error))
    //     }
    //   })
    // }

    navMessage(message: string) {
      this.navAlert = true
      this.navAlertMessage = message
    }


}
