import { Injectable } from '@angular/core';
import { CAMPAIGNS } from './mock-campaign';
import { Campaign } from './campaign';
import { BehaviorSubject, Observable } from 'rxjs';
import { userSettings } from './mock-usersettings';
import { UserSettings } from './usersettings';
import { HttpClient } from "@angular/common/http";
import * as env from "../../environments/environment";
import { userService } from '../service/user.service'

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private whichCampaign = new BehaviorSubject('');
  campaignId = this.whichCampaign.asObservable();

  private userSettings = new BehaviorSubject(userSettings);
  settings = this.userSettings.asObservable();

  private campaignUrl = env.environment.CAMPAIGN_URL;

  private campaignListUrl = env.environment.SECURED_GET_CAMPAIGN_LIST

  private deleteCampaignUrl = env.environment.DELETE_CAMPAIGN_URL

  private deleteCampaignAllPostsLinksUrl = env.environment.DELETE_CAMPAIGN_ALL_V2_URL


  constructor(private http: HttpClient, private userService: userService){

  }

  newCampaign() {
    return CAMPAIGNS;
  }

  getCampaigns(user_id: string, skip?: number, limit?: number): Observable<any> {
    return this.http.get<any[]>(`${this.campaignListUrl}`, {headers: {'Authorization': this.userService.getToken()}})
  }


  deleteCampaign(campaign_id: string): Observable<any> {
    return this.http.delete<any[]>(`${this.deleteCampaignUrl}` + "?campaign_id=" + campaign_id, {headers: {'Authorization': this.userService.getToken()}})
  }

  updateCampaign(whichCampaign: string) {
    //updates the entire campaign object by id
  }

  saveCampaign(whichCampaign: Campaign) {
    //saves a new campaign object to the database
  }

  showPosts(whichCampaign: string) {
    //return all posts of a campaign
    this.whichCampaign.next(whichCampaign);
    //console.log('(campaign service) event triggered from component ' + whichCampaign);
  }

  sendPost(whichPost: string[]){
    //send an an array of posts to the backend to be sent
  }

  deleteAllScheduled(whichCampaign: string){
    //call https://docs.ayrshare.com/rest-api/endpoints/post#delete-a-post to
    //delete all scheduled posts that haven't been send to social networks yet
  }

  deleteBulkPosts() {
    //delete a large set of posts by id
  }

  deleteSinglePost() {
    //delete a single post
  }

  getUserSettings(id: UserSettings) {
    //load data from db

    this.userSettings.next(id);
  }

  getActiveSocials() {
    //service to check which activeSocials exist on account
    return ["facebook", "reddit", "twitter", "instagram", "telegram"];
  }

  getAccountInfo(which: string) {
    //service to get curernt account info
    switch(which) {
      case 'username':
        return "testing";
      case 'profileIcon':
        return 'assets/avatar.svg';
      case 'profileHeader':
        return 'assets/header.jpeg';
      default:
        return '404';
    }
  }

  deleteCampaignAllPostsLinks(campaign_id: string): Observable<any> {
    return this.http.delete<any[]>(`${this.deleteCampaignAllPostsLinksUrl}` + campaign_id, {headers: {'Authorization': this.userService.getToken()}})
  }

}
