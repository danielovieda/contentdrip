import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import * as env from "../../environments/environment";
import jwt_decode from "jwt-decode";
import { userService } from '../service/user.service'



@Injectable({
  providedIn: "root"
})
export class CommonService {
  token: any;
  userData: any;

  //detail = this.getLoggedUserDetail();
  //private profileurl = env.environment.PROFILE_URL;
  private campaignUrl = env.environment.CAMPAIGN_URL
  private settingsUrl = env.environment.SETTINGS_URL //updated url for getting user settings with token
  private linkUrl = env.environment.LINK_URL
  private postUrl = env.environment.POST_URL
  private mediaUrl = env.environment.MEDIA_URL
  private addMediaUrl = env.environment.ADDMEDIA_URL
  private getMediaUrl = env.environment.GETMEDIA_URL
  private createProfileUrl = env.environment.CREATE_PROFILE_URL
  private getSignedUrl = env.environment.GETSIGNEDURLS
  private activeProfilesUrl = env.environment.ACTIVE_PROFILES_URL
  private userUrl = env.environment.SECURED_GET_USER_URL //url for getting user profile information

  private ayrLoginJWT = env.environment.GET_LOGIN_URL

  private getCampaignList = env.environment.SECURED_GET_CAMPAIGN_LIST

  private campaignUrlv2 = env.environment.CAMPAIGN_V2_URL

  private deleteAyrProfileUrl = env.environment.DELETE_AYR_PROFILE_URL

  private generatePostsUrl = env.environment.GENERATE_POSTS_URL

  private deleteSinglePostUrl = env.environment.DELETE_SINGLE_POST_URL

  private deleteMediaUrl = env.environment.DELETE_MEDIA_URL

  private getIkUrl = env.environment.GET_SIGNED_URL_V2

  private getWatermarkSampleUrl = env.environment.WATERMARK_SAMPLE_URL_V1


  constructor(private http: HttpClient, private userService: userService) {}

  //get_profile(): Observable<any> {
    //return this.http.get<any[]>(`${this.profileurl}` + "profile");
  //}

  //getLoggedUserDetail() {
    //const token = localStorage.getItem("access_token");

    // decode the token to get its payload
    //return token ? jwt_decode(token) : null;
  //}

  getUserId() {
    return this.userData.user_id
  }

  setUser(data: any) {
    this.userData = data
  }

  createCampaign(data: any): Observable<any[]> {
    return this.http.post<any[]>(this.campaignUrlv2, data, {headers: {'Authorization': this.userService.getToken()}} );
  }

  getUserSettings(): Observable<any> {
    //console.log('getting settings...')
    //console.log('token from user service: ')
    //console.log(this.userService.getToken())
    return this.http.get<any[]>(`${this.settingsUrl}`, {headers: {'Authorization': this.userService.getToken()}})
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any[]>(`${this.userUrl}`, {headers: {'Authorization': this.userService.getToken()}})
  }

  getActiveCampaigns() {
    return 2;
  }

  getLinkUrl(short: any): Observable<any[]> {
    return this.http.get<any>(`${this.linkUrl}` + "?link=" + short)
  }

  getPosts(campaign_id: any): Observable<any[]> {
      return this.http.get<any>(`${this.postUrl}` + campaign_id, {headers: {'Authorization': this.userService.getToken()}})
  }

  //TODO UPDATE DELTE

  deletePost(post_id: any): Observable<any[]> {
    return this.http.delete<any>(`${this.deleteSinglePostUrl}` + post_id, {headers: {'Authorization': this.userService.getToken()}})
  }

  getPresignURL(bucket: string, filename: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.mediaUrl}` + bucket + "?file-name=" + filename
    );
  }

  addMedia(data: any): Observable<any[]> {
    return this.http.post<any[]>(this.addMediaUrl, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  getMedia(user_id: any): Observable<any> {
    return this.http.get<any[]>(`${this.getMediaUrl}`, {headers: {'Authorization': this.userService.getToken()}})
  }

  createAyrProfile(data: any): Observable<any[]> {

    let url = this.createProfileUrl
    return this.http.post<any[]>(url, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  getAyrUrl(data: any): Observable<any[]> {
    return this.http.post<any[]>(this.createProfileUrl, data)
  }

  getSignedUrls(camp_id: string, data: any): Observable<any[]> {
    return this.http.post<any[]>(this.getSignedUrl + camp_id, data)
  }

  getActiveProfiles(profileKey: any): Observable<any> {
    return this.http.get<any[]>(`${this.activeProfilesUrl}` + "?profileKey=" + profileKey)
  }

  getAyrLoginUrl(profileKey: any): Observable<any> {
    let data = { profile_key: profileKey}
    return this.http.post<any[]>(`${this.ayrLoginJWT}`, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  updateProfile(data: any): Observable<any>{
    return this.http.put<any[]>(`${this.userUrl}`, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  deleteAyrProfile(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.deleteAyrProfileUrl}`, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  generateCampaignPosts(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.generatePostsUrl}`, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  deleteMedia(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.deleteMediaUrl}`, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  getImagekitUrl(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.getIkUrl}`, data, {headers: {'Authorization': this.userService.getToken()}})
  }

  getWatermarkSample(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.getWatermarkSampleUrl}`, data)
  }


}
