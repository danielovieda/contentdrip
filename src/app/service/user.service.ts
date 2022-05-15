import { Injectable, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as env from "../../environments/environment";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class userService {
  private userUrl = env.environment.SECURED_GET_USER_URL //url for getting user profile information
  private settingsUrl = env.environment.SETTINGS_URL //updated url for getting user settings with token

  token: any
  user_id: string
  s3_id: string
  cd_profile: any
  auth_profile: any
  cd_settings: any

  constructor(public auth: AuthService,
    @Inject(DOCUMENT) public document: Document,
    private http: HttpClient) { }


    init() {
      if (this.auth.isAuthenticated$) {
        this.auth.idTokenClaims$.subscribe({
          next: data => {


            if (data.__raw) {
              this.saveToken(data.__raw)


            }


          },
          error: error => {
            console.log('User service error.')
          }
        })

        this.auth.user$.subscribe({
          next: data => {
            this.save_auth_profile(data)
            //console.log('this is the auth profile')
            //console.log(JSON.stringify(this.authProfile))
            this.saveId(data.sub)
          }
          })


        // this.getUserProfile().subscribe({
        //   next: data => {
        //     this.save_profile(data)
        //   },
        //   error: error => {
        //     console.log('error saving profile')
        //   }
        // })

        // this.getUserSettings().subscribe({
        //   next: data => {
        //     console.log("🚀 ~ file: user.service.ts ~ line 67 ~ userService ~ this.getUserSettings ~ data", data)
        //     this.save_settings(data)
        //   },
        //   error: data => {
        //     console.log("🚀 ~ file: user.service.ts ~ line 70 ~ userService ~ this.getUserSettings ~ data", data)
        //   }
        // })

      }
    }


    // █████╗ ██╗   ██╗████████╗██╗  ██╗ ██████╗
    // ██╔══██╗██║   ██║╚══██╔══╝██║  ██║██╔═████╗
    // ███████║██║   ██║   ██║   ███████║██║██╔██║
    // ██╔══██║██║   ██║   ██║   ██╔══██║████╔╝██║
    // ██║  ██║╚██████╔╝   ██║   ██║  ██║╚██████╔╝
    // ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝

    loginWithRedirect() {
      this.auth.loginWithRedirect()
    }

    logout() {
      this.auth.logout()
    }

    saveToken(token: any) {
      //console.log('savetoken from userservice called')
      this.token = token
    }


    // ██████╗ ██████╗  ██████╗        ██╗███████╗███████╗████████╗
    // ██╔══██╗██╔══██╗██╔═══██╗      ██╔╝██╔════╝██╔════╝╚══██╔══╝
    // ██████╔╝██████╔╝██║   ██║     ██╔╝ ███████╗█████╗     ██║
    // ██╔═══╝ ██╔══██╗██║   ██║    ██╔╝  ╚════██║██╔══╝     ██║
    // ██║     ██║  ██║╚██████╔╝██╗██╔╝   ███████║███████╗   ██║██╗
    // ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝╚═╝    ╚══════╝╚══════╝   ╚═╝╚═╝




  saveId(user_id: string) {
    this.user_id = user_id
  }

  getToken() {
    return this.token
  }

  getId() {
    return this.user_id
  }

  get_media_id() {
    return this.s3_id
  }

  save_media_id(id: string) {
    this.s3_id = id
  }

  save_profile(data: any) {
    this.cd_profile = data
  }

  save_auth_profile(data: any) {
    this.auth_profile = data
  }

  get_profile() {
    return this.cd_profile
  }

  save_settings(data: any) {
    this.cd_settings = data
  }

  get_settings(): Observable<any> {
    return this.cd_settings
  }



  // ██████╗ █████╗ ██╗     ██╗     ███████╗
  // ██╔════╝██╔══██╗██║     ██║     ██╔════╝
  // ██║     ███████║██║     ██║     ███████╗
  // ██║     ██╔══██║██║     ██║     ╚════██║
  // ╚██████╗██║  ██║███████╗███████╗███████║
  //  ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝

  getUserProfile(): Observable<any> {
    return this.http.get<any[]>(`${this.userUrl}`, {headers: {'Authorization': this.token}})
  }

  getUserSettings(): Observable<any> {
    //console.log('getting settings...')
    //console.log('do I have token?')
    //console.log('token from user service: ')
    //console.log(this.userService.getToken())
    //console.log("🚀 ~ file: user.service.ts ~ line 170 ~ userService ~ getUserSettings ~ this.token", this.token)
    return this.http.get<any[]>(`${this.settingsUrl}`, {headers: {'Authorization': this.token}})

  }


}
