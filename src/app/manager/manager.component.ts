import { Component, OnInit, ViewChild, ɵallowSanitizationBypassAndThrow } from '@angular/core';
import { Injectable } from '@angular/core';
import { Campaign } from './campaign';
import { CampaignService } from './campaign.service';
import { Subscription } from 'rxjs';
import { UserSettings } from './usersettings';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER, SPACE, X} from '@angular/cdk/keycodes';
import { DatepickerModule, DatepickerOptions } from 'ng2-datepicker';
import { ElementRef } from '@angular/core';
import { Media } from './media';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../service/common.service';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as angular from 'angular';
import * as _ from 'lodash'
import { userService } from '../service/user.service'
import { Title } from '@angular/platform-browser';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';


@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})

@Injectable({
  providedIn: 'root',
})
export class ManagerComponent implements OnInit {
  //mockCampaign: Campaign[];
  newCampaign = {} as Campaign;
  campaignMedia = {} as any
  mediaUrl = {} as any
  mediaToLoad = [] as any
  finalMedia = {} as any
  mediaObjForUrls = { watermark: { watermarkText: '', watermarkPos: ''}, media: []} as any
  activeSocialAccounts = [] as any


  addNew: boolean = false;
  startDate: any;
  endDate: any;
  startDatePicker: any;
  endDatePicker: any;

  subscription!: Subscription;
  camp!: string;
  userSettings = {} as UserSettings;
  forbiddenLinks = ["bit.ly","short.ly"];
  campaignLink!: string[];
  linkError: boolean = false;
  linkErrorMessage: string = '';
  descriptionError: boolean = false;
  descriptionErrorMessage: string = '';
  showCampaignTab: boolean = false;
  showPostsTab: boolean = false;
  showOptionsTab: boolean = false;
  showMediaTab: boolean = false;
  hashTagCount: number = 0;
  hashTagError: boolean = false;
  isHashTagValid: boolean = true;
  isUsernameValid: boolean = true;
  confirmClearAllTags: boolean = false;
  confirmClearAllUsers: boolean = false;
  scheduleError: boolean = false;
  scheduleErrorMessage: string[] = [];
  useuniqueDistro: boolean = false;
  estimatedPosts: number = 0;
  activeCampaigns: number = 0;
  startHour!: number;
  startMinute: any = 0;
  endHour: any = 0;
  endMinute: any = 0;
  user_id: string = '';
  mediaLoaded: boolean = false
  creationDate: any;
  watermarkTextInput: string = '' //use this for the actual input, since we encode the text during campaign creation

  campaignTitle!: string;
  campaignDescription!: string;
  errorMessage: string = '';

  areTagsVirgin: boolean = true
  silentMode: boolean = false


  //modals
  modalTitle: string = '';
  modalMessage: string = '';
  modalAlert: string = '';

  //for chips
  removable = true;
  selectable = true;
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;



  descriptionPool: Array<string> = [];
  linkPool: Array<any> = [];
  newAttribute: any = {};
  postText: Array<string> = [];
  firstTime: boolean = true;

  bar: string = '';
  scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  watermarkPositions = [
    { name: "Top Left", value: "xo-10,oy-10" }, //cdwm_1
    { name: "Top Right", value: "xo-N10,oy-10" }, //cdwm_2
    { name: "Bottom Left", value: "xo-10,oy-N10" }, //cdwm_3
    { name: "Bottom Right", value: "xo-N10,oy-N10" }, //cdwm_4
    { name: "Random", value: "random"}
  ];

  optionsStart: DatepickerOptions = {
    inputClass: 'form-control bg-transparent border-0',
    format: 'MM/dd/yy',
  }

  optionsEnd: DatepickerOptions = {
    inputClass: 'form-control bg-transparent border-0 align-content-middle',
    format: 'MM/dd/yy',
    calendarClass: 'datepicker-default calendarEnd'
  }



//media controls
masterFacebookSwitch: boolean = false;
masterRedditSwitch: boolean = false;
masterTwitterSwitch: boolean = false;
masterInstagramSwitch: boolean = false;

//verification variables
verMedia = { error: false, message: ''}
verNetworks = { error: false, message: ''}
verTags = { error: false, message: ''}
verSchedule = { error: false, message: ''}
verPost = { error: false, message: ''}
verCampaign = { error: false, message: ''}
verMeta = { error: false, data: [''], message: ''}

currentProfile: number = 0

campaignList: any[];
userProfile: any

wmBgColor: string = '#000000'
wmOpacity: number = 85
wmTextColor: string = '#FFFFFF'
wmTextSize: number = 30
wmTextFont: string = 'Roboto'
wmSample: string
wmSampleText: string
wmNetwork: string = 'Instagram'


campaignForPostService: string //IMPORTANT -- SEND THIS TO POST SERVICE TO START CREATING POSTS FOR THE CAMPAIGN

  @ViewChild('InfoModal') InfoModal!: ElementRef<HTMLElement>;
  @ViewChild('verifyCampaignModal') verifyCampaignModal!: ElementRef<HTMLElement>;
  @ViewChild('networkCheckbox') facebookAccount!: ElementRef<HTMLElement>;

  constructor(private campaignService: CampaignService,
    private spinner: NgxSpinnerService,
    private CommonService: CommonService,
    public datepipe: DatePipe,
    private toastr: ToastrService,
    private userService: userService,
    private title: Title) {

    this.campaignList = {} as any
   }

  ngOnInit(): void {
      this.userService.init()
      this.loading()

      this.title.setTitle('Manage campaigns - contentdrip.io')
      //this.subscription = this.campaignService.settings.subscribe(userSettings => this.userSettings = userSettings);

  }

  async loading() {
    await this.delay(1000)
      this.user_id = this.userService.getId()

       this.subscription = this.userService.getUserSettings().subscribe({
         next: userSettings => {
           this.userSettings = userSettings
         }
       })

      this.userService.getUserProfile().subscribe({
        next: data => {
          this.userProfile = data
        },
        error: error => {
          this.toastr.error('Error getting profile.')
        }
      })

      this.activeCampaigns = this.CommonService.getActiveCampaigns();
      this.datepipe = new DatePipe('en-US');
      this.getCampaigns();
  }


  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  getCampaigns() {
      this.spinner.show("campaignLoading")
      this.campaignService.getCampaigns(this.user_id).subscribe({
        next: data => {
          this.campaignList = data
        },
        error: data => {
          this.toastr.error('Unable to get campaigns.')
        }
    })
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide("campaignLoading");
    }, 3000);
  }

  addNewCampaign() {
    this.addNew = true;
    this.hideAllBut('campaign');

    let activeCampaigns = 0;
    for (let k in this.campaignList) if (this.campaignList[k].status === 'active') activeCampaigns++

    if (activeCampaigns >= this.userSettings.maxCampaigns) {
      this.triggerFalseClick();
    }
    //initialize newCampaign object:
    this.newCampaign.user_id = this.user_id;
    this.newCampaign.campaign_id = uuidv4();
    this.newCampaign.status = "draft"
    this.newCampaign.title = "";
    this.newCampaign.description = "";
    this.newCampaign.startDate = "";
    this.newCampaign.endDate = "";
    this.newCampaign.timezone = "America/Los_Angeles"
    this.newCampaign.platforms = [];
    this.newCampaign.links = [];
    this.newCampaign.links.push('');
    this.newCampaign.postText = [];
    this.newCampaign.postText.push ('');
    if (this.userSettings.subscriptionPlan === 0) {
      this.newCampaign.morphLevel = 0
    } else {
    this.newCampaign.morphLevel = this.userSettings.maxMorphLevel;
    }
    this.newCampaign.profileKeys = ''
    this.newCampaign.hashTagPool = ["#Add", "#Up", "#To", "#" + this.userSettings.maxHashTagsPerCampaign.toString(), "#Hashtags", "#For", "#Your", "#Campaign"];
    this.newCampaign.autoHashTag = this.userSettings.hasAutoHashTag;
    this.newCampaign.smartSchedule = false
    this.newCampaign.scheduleDays = this.userSettings.defaultScheduleDays;
    this.watermarkTextInput = this.userSettings.defaultWatermark;
    this.newCampaign.watermarkPos = this.userSettings.defaultWatermarkPosition;
    this.newCampaign.watermarkImg = this.userSettings.defaultWatermarkImg;
    this.newCampaign.autoRepost = false;
    this.newCampaign.repostRepeat = 0;
    this.newCampaign.repostDays = 0;
    this.newCampaign.igLocation = [];
    this.newCampaign.igUsers = [];
    this.newCampaign.subreddits = [];
    this.newCampaign.igUsersToTag = 10
    this.newCampaign.uniqueDistro = false //TODO: update this when unique distro is implemented
    this.newCampaign.postsPerDay = 1
    this.newCampaign.subscriptionPlan = this.userSettings.subscriptionPlan
    if (this.userSettings.subscriptionPlan !== 0) {
      this.newCampaign.useMorph = true
    }

    //reset start/end dates


    this.startHour = this.userSettings.defaultStartHour;
    this.startMinute = this.userSettings.defaultEndMinute;
    this.endHour = this.userSettings.defaultEndHour;
    this.endMinute = this.userSettings.defaultEndMinute;
    this.campaignMedia = []
    this.newCampaign.media = [{}] as any
    this.getMedia()
  }

  refreshPlatforms(profileKey: any) {
    // // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 310 ~ ManagerComponent ~ refreshPlatforms ~ profileKey", profileKey)
    //console.log('refreshPlatforms triggered')
    //console.log(profileKey)
    this.newCampaign.profileKeys = profileKey
    this.CommonService.getActiveProfiles(profileKey).subscribe({
      next: data => {
        this.getActiveSocialAccounts(data)
        //console.log(data)
        this.newCampaign.profileKeys = profileKey
      },
      error: error => {
        //console.log('an error occurred getting profiles')
      }
    })
  }

  getActiveSocialAccounts(data: any) {
    if (!data.activeSocialAccounts) {
      this.activeSocialAccounts = []
      //this.activeSocialAccounts[0] = "none"
      return
    }
    this.activeSocialAccounts = data.activeSocialAccounts;
    //console.log('from getActiveSocialAccounts():')
    //console.log(this.activeSocialAccounts)
  }

  goBack() {
    this.addNew = false;
    this.hideAllBut();
    this.newCampaign = {} as Campaign;
  }

  setCampaignTitle(e: any){
    this.newCampaign.title = e.target.value;
  }

  setCampaignDescription(e: any) {
    this.newCampaign.description = e.target.value;
  }


  setSocialNetworks(which: string, e: any) { //TODO: when disabled, remove all from media too
    if (e.target.checked) {
      this.newCampaign.platforms.push(which);
    } else {
      const index: number = this.newCampaign.platforms.indexOf(which);
      if (index !== -1) {
        this.newCampaign.platforms.splice(index, 1);
      }
      if (which === 'reddit' && this.newCampaign.subreddits.length >= 1) {
        this.newCampaign.subreddits = []
        this.toastr.info('Subreddits have been cleared.')
      }
      if (which === 'instagram' && this.newCampaign.igUsers.length >= 1) {
        this.newCampaign.igUsers = []
        this.toastr.info('Instagram users have been cleared.')
      }
    }
  }

  checkForMaxPlatforms() {
    if (this.newCampaign.platforms.length == this.userSettings.maxSocialNetworks)
      this.toastr.error("You've reached the maximum amount of networks. Consider upgrading to add more.");

  }



  checkLink(event: any) { //add foreach here to fix scanning through all short links
    ////console.log('key triggered ' + event);
    if (event.toLowerCase().indexOf("bit.ly") !== -1) {
        if (!this.userSettings) { //TODO: allowshortlinks was used here as a check...
        this.linkError = true;
        this.linkErrorMessage = "You may not use a link shortening service. Consider upgrading to the <strong>Influencer plan</strong> to use a link shortening service.";
      } else {
        this.linkError = false;
      }
    }
  }

  hideAllBut(whichTab?: string) {
    switch(whichTab) {
      case 'campaign':
        this.showPostsTab = false;
        this.showOptionsTab = false;
        this.showCampaignTab = true;
        this.showMediaTab = false;
        break;
      case 'posts':
        this.showPostsTab = true;
        this.showOptionsTab = false;
        this.showCampaignTab = false;
        this.showMediaTab = false;
        break;
      case 'options':
        this.showPostsTab = false;
        this.showOptionsTab = true;
        this.showCampaignTab = false;
        this.showMediaTab = false;
        break;
      case 'media':
        if (this.campaignMedia.length > 40) {
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
            this.showMediaTab = true;
          }, 3000);
      } else {
        this.showMediaTab = true;
      }
        this.showPostsTab = false;
        this.showOptionsTab = false;
        this.showCampaignTab = false;
        break;
      default:
        this.showPostsTab = false;
        this.showOptionsTab = false;
        this.showCampaignTab = false;
        this.showMediaTab = false;
    }
  }

  addDescriptionField(index: number) {
    if ((this.newCampaign.postText.length + 1) <= this.userSettings.maxTextPerCampaign) {
      //console.log('postText? ' + JSON.stringify(this.descriptionPool));
      //this.descriptionPool[index] = description;
      this.newCampaign.postText.push('');
    } else {
      this.descriptionError = true;
      this.descriptionErrorMessage = "You've reached the maximum amount of posts for this campaign. Please consider upgrading to add more.";

    }
  }

  delDescriptionField(index: any) {
    if (this.newCampaign.postText.length == 1) {
      this.newCampaign.postText = [''];
      return;
    } else {
      this.newCampaign.postText.splice(index, 1);
      ////console.log('after deleting: ' + JSON.stringify(this.descriptionPool));

      if (this.newCampaign.postText.length == 0) {
        this.newCampaign.postText.push('');
      }

      if(this.descriptionError) {
        this.descriptionError = false;
      }
    }
  }

  addLinkField() {
     if ((this.newCampaign.links.length + 1) <= this.userSettings.maxLinksPerCampaign) {
      this.newCampaign.links.push('');
     } else {
       this.linkError = true;
       this.linkErrorMessage = "You've reached the maximum allowable links for this campaign. Please consider upgrading to add more."
     return;
     }

  }

  delLinkField(index: any) {
    if (this.newCampaign.links.length == 1 ) {
      this.newCampaign.links = [''];
      return;
    } else {
    this.newCampaign.links.splice(index, 1);
      if (this.linkError) {
        this.linkError = false;
      }
    }
  }


  optimizerSwitch() {
    this.newCampaign.smartSchedule = this.newCampaign.smartSchedule ? false : true;
    if (this.newCampaign.smartSchedule) {
      this.startHour = 9;
      this.startMinute = 35;
      this.endHour = 21;
      this.endMinute = 30
      this.verifySchedule();
    } else {
      this.startHour = this.userSettings.defaultStartHour;
      this.startMinute = this.userSettings.defaultEndMinute;
      this.endHour = this.userSettings.defaultEndHour;
      this.endMinute = this.userSettings.defaultEndMinute;
      this.verifySchedule();
    }
  }

  distroSwitch() {
    this.newCampaign.uniqueDistro = this.newCampaign.uniqueDistro ? false : true;
  }

  useMorphSwitch() {
    this.newCampaign.useMorph = this.newCampaign.useMorph ? false : true
  }

  autoHashTagSwitch() {
    this.newCampaign.autoHashTag = this.newCampaign.autoHashTag ? false : true;
  }

  autoRepostSwitch() {
    this.newCampaign.autoRepost = this.newCampaign.autoRepost ? false : true;
    if (!this.newCampaign.autoRepost) {
      this.newCampaign.repostRepeat = 0
      this.newCampaign.repostDays = 0
    }
  }

  // ██╗███╗   ██╗███████╗ ██████╗     ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗
  // ██║████╗  ██║██╔════╝██╔═══██╗    ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║
  // ██║██╔██╗ ██║█████╗  ██║   ██║    ██╔████╔██║██║   ██║██║  ██║███████║██║
  // ██║██║╚██╗██║██╔══╝  ██║   ██║    ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║
  // ██║██║ ╚████║██║     ╚██████╔╝    ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗
  // ╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝     ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝


  modalInfo(what: string) { //modal titles and messages based on what the modal is
    this.modalAlert = what;
    switch(what) {
      case 'link':
        this.modalTitle = "Campaign Links";
        this.modalMessage = `You can add a link to your posts which will be automatically shortened using our service, if it is not shortened already.
        <strong>For best results</strong>, use our link shortener which will track click analytics to better schedule your posts in the future. Smart Scheduling
        is only available on the Influencer plan and above.`;
        return;
      case 'optimizer':
        this.modalTitle = "Smart Schedule";
        this.modalMessage = `Maximize the amount of engagement you receive by continously checking and improving the times of day in which your posts are sent.
        When you turn <strong>on</strong> smart scheduling, we select an initial 12-hour window to collect engagement data and target those peak engagement times.
        Depending on the engagement of your posts, it may take up to two weeks to collect enough data to fully optimize your post times.`;
        return;
      case 'morph':
        this.modalTitle = "Description Morph";
        this.modalMessage = `After you create your campaign, posts will be generated using the descriptions you've provided.
        For paid users, each description will be morphed using AI which will make subtle changes to the text, ensuring
        that each description is as unique and natural as possible.`;
        return;
      case 'hashtag':
        this.modalTitle = "Auto-Hashtags";
        this.modalMessage = `Append trending hashtags to your posts by enabling this feature.
        When this feature is enabled, we will automatically balance the amount of hashtags that your post has to prevent any issues.
        <i>If your total post length is near maximum length of the social network, this will not work.</i>`;
        return;
      case 'socialNetworks':
        this.modalTitle = "Social Networks";
        this.modalMessage = `Choose which social networks you'd like to send posts to.
        Each post will be automatically generated to meet the requirements of each social network.
        For example, Instagram will only allow 1 image to be sent per post. Therefore, only 1 image will be sent.`;
        return;
      case 'hashtagPool':
        this.modalTitle = "Campaign Hashtags";
        this.modalMessage = `This is your pool of hashtags to be used on your posts.
        Hashtags are chosen so that there is a healthy distribution across your social network accounts.`;
      return;
      case 'unique':
        this.modalTitle = "Unique Distribution";
        this.modalMessage = `Enabling unique distribution will ensure that no same media will be posted to
        different social networks. Meaning, if it is being posted to Instagram it <strong>will not</strong> be posted to Twitter.
        This will ensure your audience gets a unique experience and promotes them to follow you on different platforms
        so they don't miss anything.`;
        return;
      case 'maxCampaigns':
        this.modalTitle = "Maximum Campaigns Reached";
        this.modalMessage = ``;
        return;
      case 'verifyCampaign':
        this.modalTitle = "Creating Campaign"
        this.modalMessage = ``
        return;
      case 'postsPerDay':
        this.modalTitle = "Posts Per Day"
        this.modalMessage = `Set the maximum amount of posts per day. Your campaign will continue posting
        until all media has been exhausted. Click the atom button to estimate your total posts and end date.`
        return;
      case 'autoRepost':
        this.modalTitle = "Auto Repost"
        this.modalMessage = `Using this feature will automatically duplicate your posts and publish after the set amount of days.
        You can repost a single post <strong>up to 10 times</strong>, after a <strong>minimum wait time of 3 days</strong> up to 10 days.`
        return;
      case 'igUsers':
        this.modalTitle = "Tag Instagram Users"
        this.modalMessage = `Add instagram users to your campaign by simply adding their @username. If you would like to
        add more users into your campaign, please consider upgrading.`
        return;
      case 'igLocation':
        this.modalTitle = "Add Instagram Location"
        this.modalMessage = `You can currently only add one location per campaign. You will be able to add multiple locations in the future.`
        return;
      case 'redditOptions':
        this.modalTitle = "Subreddits"
        this.modalMessage = `Add the subreddits you would like to post to here. The subreddit must have API posting enabled. If you are unsure
        of this, contact the subreddit mod if you are not a mod. <strong>Do not include /r/</strong> in this input box.`
        return;
      case 'useMorph':
        this.modalTitle = "Description Morph"
        this.modalMessage = `<strong>Strongly suggested.</strong> Use our AI to modify your description in order to make multiple unique posts.
        If you do not use description morph, and only have a few descriptions in your campaign, our system may reject your post in order to protect
        your social media account(s). This feature is not available on free accounts.`
        return;
      default:
        this.modalTitle = "404";
        this.modalMessage = "An error has occurred. Please try again.";
    }


  }


  // ██╗   ██╗███████╗██████╗ ██╗███████╗██╗   ██╗     ██████╗ █████╗ ███╗   ███╗██████╗  █████╗ ██╗ ██████╗ ███╗   ██╗
  // ██║   ██║██╔════╝██╔══██╗██║██╔════╝╚██╗ ██╔╝    ██╔════╝██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║██╔════╝ ████╗  ██║
  // ██║   ██║█████╗  ██████╔╝██║█████╗   ╚████╔╝     ██║     ███████║██╔████╔██║██████╔╝███████║██║██║  ███╗██╔██╗ ██║
  // ╚██╗ ██╔╝██╔══╝  ██╔══██╗██║██╔══╝    ╚██╔╝      ██║     ██╔══██║██║╚██╔╝██║██╔═══╝ ██╔══██║██║██║   ██║██║╚██╗██║
  //  ╚████╔╝ ███████╗██║  ██║██║██║        ██║       ╚██████╗██║  ██║██║ ╚═╝ ██║██║     ██║  ██║██║╚██████╔╝██║ ╚████║
  //   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝        ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝

  openVerifyCampaignModal() {
    let el: HTMLElement = this.verifyCampaignModal.nativeElement;
    el.click();
  }

  async verifyCampaign(campaign: Campaign) { // <=================================
    let postCampaign = true
    this.clearVerify()


    this.openVerifyCampaignModal()

    if (this.newCampaign.links[0] === '' && this.newCampaign.links.length === 1) {
      this.newCampaign.links = []
    }

    // if (!this.estimateTotalPosts()) {
    //   postCampaign = false
    // }

    //verify the campaign object and components DONE
    //schedule times --> TODO: done
    //duplicate hash tags TODO: DONE
    //verify morphlevel of user TODO: DONE
    //check media -- if a media doesnt have a social network, do what? -- DONE
    //this.spinner.show("create");

    //make morph level maximum available from user
    if (this.newCampaign.morphLevel > this.userSettings.maxMorphLevel) {
      this.newCampaign.morphLevel = this.userSettings.maxMorphLevel;
    }

    await this.delay(1000)
    if (this.newCampaign.platforms.length === 0) {
      this.verNetworks.error = true
      this.verNetworks.message = 'Select at least one social network.'
      postCampaign = false
    }
    //filter out duplicates for hashtags
    this.newCampaign.hashTagPool = this.newCampaign.hashTagPool.filter
    ((element, i) => i === this.newCampaign.hashTagPool.indexOf(element))
    //filter out blank descriptions
    this.newCampaign.postText = this.newCampaign.postText.filter(item => item)
    await this.delay(1000);
    let mediaMissing = this.checkMedia()
    if (mediaMissing > 0) {
      this.verMedia.error = true
      this.verMedia.message = 'You have (' + mediaMissing + ') media not assigned to social networks.'
      if (this.campaignMedia.length === 0) {
        postCampaign = false
      } else {
         this.campaignMedia = this.campaignMedia.filter((item: any) => item)
      }
    } else if (mediaMissing === 999) {
      this.verMedia.error = true
      this.verMedia.message = 'You forgot to add media.'
      postCampaign = false
    } else {
      this.verMedia.message = 'OK'

      this.campaignMedia = this.campaignMedia.filter((item: any) => item)
    }

    this.newCampaign.media = this.campaignMedia
      // ----------- Append watermark data to string

      if (this.watermarkTextInput) {
        this.newCampaign.watermarkText = this.buildWatermarkStr()
      }





      // this.mediaObjForUrls.watermark.watermarkText = this.newCampaign.watermarkText
      // this.mediaObjForUrls.watermark.watermarkPos = this.newCampaign.watermarkPos

      // //console.log('pushing media...')
      // for (let i = 0; i < this.campaignMedia.length; i++ ) {
      //   this.mediaObjForUrls.media.push(this.campaignMedia[i].path)
      //   //console.log(this.campaignMedia[i].path)
      // }

      // //console.log('full object going to service')
      // //console.log(JSON.stringify(this.mediaObjForUrls))


      // await this.getSignedURLs(this.newCampaign.campaign_id, this.mediaObjForUrls)
      // if (!this.mediaUrl || this.mediaUrl === null) {
      //   //console.log('media failed')
      // } else {

      //   //console.log('objects from teh service:')
      //   //console.log(JSON.stringify(this.mediaUrl))
      //   //console.log('now merging objects...')
      //   //lets merge the objects
      //   this.finalMedia = _.merge({}, this.newCampaign.media, this.mediaUrl)
      //   //console.log('finalized media object:')
      //   //console.log(this.finalMedia)
      //   this.newCampaign.media =_.merge(this.newCampaign.media, this.finalMedia)
      // }





    await this.delay(1000);

    //if (this.userSettings.subscriptionPlan >= 1) {
      this.newCampaign.igUsersToTag = 10
    //}

    // if (!this.verifySchedule()) {
    //   this.verSchedule.error = true
    //   this.verSchedule.message = 'Double check schedule options for errors.'
    //   postCampaign = false
    // } else {

    //   this.newCampaign.startDate = this.startDate

    // }

    if (this.startDatePicker === null) {
      this.toastr.error('Please enter a start date.')
      postCampaign = false
      return
    }

    this.newCampaign.startDate = this.datepipe.transform(this.startDatePicker, 'yyyy-MM-dd') + ' ' + this.startHour + ':' + this.startMinute;

    if (this.returnEndDate(this.startDatePicker, this.newCampaign.scheduleDays, this.newCampaign.postsPerDay) != null) {
      this.newCampaign.endDate = this.returnEndDate(this.startDatePicker, this.newCampaign.scheduleDays, this.newCampaign.postsPerDay)
    } else {
      postCampaign = false
      this.toastr.error('Error calculating end date.')
    }

    //set status properly

    let rightNow = new Date()
    if (this.startDatePicker > rightNow) {
      this.newCampaign.status = "scheduled"
    } else {
      this.newCampaign.status = "active"
    }

    await this.delay(1000);
    if(this.newCampaign.title.length < 1) {
      this.verMeta.data.push('Title')
    }
    if(this.areTagsVirgin) {
      this.verMeta.data.push('Hashtags')
    }
    for (let i = 0; i < this.newCampaign.postText.length; i++) {
      if (this.newCampaign.postText[i].length <= 20) {
        this.verMeta.data.push('Post Text')
      }
    }
    if(this.verMeta.data.length >= 1 && this.verMeta.data[0] !== '') {
      this.verMeta.error = true
      this.verMeta.message = 'Errors in: '
    }

    await this.delay(1000);

    this.newCampaign.postsPerDay = +this.newCampaign.postsPerDay
    let createDate = new Date()
    this.newCampaign.creationDate = this.datepipe.transform(createDate, 'yyyy-MM-dd h:mm:ss a z')
    this.campaignForPostService = this.newCampaign.campaign_id

    console.log(JSON.stringify(this.newCampaign))

    if (postCampaign) {
      //console.log(this.newCampaign)
      await this.createCampaign();
      //console.log('campaign created successfully')
      this.verCampaign.message = 'Campaign successfully created.'
      await this.createPosts()

    } else {
      this.verCampaign.error = true
      this.verCampaign.message = 'Campaign not created. Please fix the errors above first.'
      //console.log('campaign contains errors')
    }




  }

  // ██╗    ██╗ █████╗ ████████╗███████╗██████╗ ███╗   ███╗ █████╗ ██████╗ ██╗  ██╗
  // ██║    ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝
  // ██║ █╗ ██║███████║   ██║   █████╗  ██████╔╝██╔████╔██║███████║██████╔╝█████╔╝
  // ██║███╗██║██╔══██║   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗
  // ╚███╔███╔╝██║  ██║   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗
  //  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝

  buildWatermarkStr(): string {
    let text = btoa(this.watermarkTextInput).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')
    let bgColor = this.wmBgColor.substring(1).toUpperCase()
    let textColor = this.wmTextColor.substring(1).toUpperCase()
    let textFont = this.wmTextFont
    let textSize = this.wmTextSize
    let opacity = this.wmOpacity
    return 'ote-' + text + ',oa-' + opacity + ',ots-' + textSize + ',otbg-' + bgColor + ',otc-' + textColor + ',otf-' + textFont
  }

  loadPreview() {
    //console.log('bgColor ' + this.wmBgColor.substring(1) +
    //' textColor ' + this.wmTextColor.substring(1) +
    //' textSize ' + this.wmTextSize +
    //' textFont ' + this.wmTextFont +
    //' wmOpacity ' + this.wmOpacity
    //)

    //console.log("🚀 ~ file: manager.component.ts ~ line 840 ~ ManagerComponent ~ loadPreview ~ this.wmBgColor", this.wmBgColor)

    let path = this.campaignMedia[this.getRandomInt(this.campaignMedia.length)].path

    this.wmSampleText = btoa(this.watermarkTextInput).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')

    let bgColor = this.wmBgColor.substring(1).toUpperCase()
    let textColor = this.wmTextColor.substring(1).toUpperCase()
    let textFont = this.wmTextFont
    let textSize = this.wmTextSize
    if (this.wmOpacity < 100) {
      var opacity = this.wmOpacity
    }
    let text = this.wmSampleText
    let named = this.wmNetwork.toLowerCase() + "_cd"
    var x = ''
    var y = ''
    //console.log("🚀 ~ file: manager.component.ts ~ line 853 ~ ManagerComponent ~ loadPreview ~ this.wmSampleText", this.wmSampleText)

    switch(this.newCampaign.watermarkPos) {
      case "xo-10,oy-10":
        x = '10'
        y = '10'
        break
      case "xo-N10,oy-10":
        x = 'N10'
        y = '10'
        break
      case "xo-10,oy-N10":
        x = '10'
        y = 'N10'
        break
      case "xo-N10,oy-N10":
        x = 'N10'
        y = 'N10'
        break
    }



    this.getWatermarkPreview(path, named, text, bgColor, opacity, textColor, textSize, textFont, x, y)

    // watermarkPositions = [
    //   { name: "Top Left", value: "xo-10,oy-10" }, //cdwm_1
    //   { name: "Top Right", value: "xo-N10,oy-10" }, //cdwm_2
    //   { name: "Bottom Left", value: "xo-10,oy-N10" }, //cdwm_3
    //   { name: "Bottom Right", value: "xo-N10,oy-N10" }, //cdwm_4
    //   { name: "Random", value: "random"}
    // ];
  }


  getWatermarkPreview(path: string, named: string, text: string, bgColor: string, opacity: number, textColor: string, textSize: number, textFont: string, x: string, y: string) {
    let data = { path: path,
      named: named,
      overlay_text_encoded: text,
      overlay_alpha: opacity,
      overlay_text_font_family: textFont,
      overlay_text_font_size: textSize,
      overlay_text_background: bgColor,
      overlay_text_color: textColor,
      x: x,
      y: y
    }

    this.CommonService.getWatermarkSample(data).subscribe({
      next: data => {
      // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 883 ~ ManagerComponent ~ this.CommonService.getWatermarkSample ~ data", data)
        this.wmSample = data.url
      }
    })



  }

   // CHECK MEDIA FUNCTION =======================================================
  checkMedia() {
    //console.log('CHECK MEDIA FUNCTION ====')
    let mediaError = false
    let mediaCount = 0;

    //console.log('checking media and cleaning media...')
    //console.log(JSON.stringify(this.campaignMedia))

    //check media for any missing social networks
    for (let i = 0; i < this.campaignMedia.length; i++) {
      if (this.campaignMedia[i].platforms.length === 0) {
        mediaCount++
        mediaError = true
        delete this.campaignMedia[i]
      }
    }

    //console.log('media has been cleaned?')
    //console.log(this.campaignMedia)

    if (!mediaError) {
      return 0
    } else {
      return mediaCount
    }
  }


  // ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗     ██████╗ █████╗ ███╗   ███╗██████╗  █████╗ ██╗ ██████╗ ███╗   ██╗
  // ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██╔════╝██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║██╔════╝ ████╗  ██║
  // ██║     ██████╔╝█████╗  ███████║   ██║   █████╗      ██║     ███████║██╔████╔██║██████╔╝███████║██║██║  ███╗██╔██╗ ██║
  // ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝      ██║     ██╔══██║██║╚██╔╝██║██╔═══╝ ██╔══██║██║██║   ██║██║╚██╗██║
  // ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗    ╚██████╗██║  ██║██║ ╚═╝ ██║██║     ██║  ██║██║╚██████╔╝██║ ╚████║
  //  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝     ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝

  async createCampaign() {

    //console.log("🚀 ~ file: manager.component.ts ~ line 948 ~ ManagerComponent ~ this.CommonService.createCampaign ~ this.newCampaign", this.newCampaign)
    //send campaign object to the backend
     this.CommonService.createCampaign(this.newCampaign).subscribe({

       next: data => {
         //console.log(data);
       },
       error: error => {
         this.errorMessage = error.message;
         return false
       }
     })

     await this.delay(1000)

     this.campaignList = {} as any

     this.getCampaigns();


  }

  async createPosts() {
    //console.log('generating posts...')
    let data = {campaign_id: this.campaignForPostService}
    //console.log(JSON.stringify(data))
    this.CommonService.generateCampaignPosts(data).subscribe({
      next: data => {
        this.toastr.success('Posts are now being created.')
        this.toastr.info('Post generation may take up to 30 minutes depending on total amount of posts.')
        this.goBack()
      },
      error: error => {

      }
    })
  }

  clearVerify() {
    this.verMedia.error = false
    this.verMedia.message = ''
    this.verNetworks.error = false
    this.verNetworks.message = ''
    this.verSchedule.error = false
    this.verSchedule.message = ''
    this.verCampaign.error = false
    this.verCampaign.message = ''
    this.verMeta.error = false
    this.verMeta.message = ''
    this.verMeta.data = ['']
  }



  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }






  updatePosition(e: any) {
    this.newCampaign.watermarkPos = e.target.value;
  }

  modDay(e: any) {
    if (e.target.checked) {
      this.newCampaign.scheduleDays.push(e.target.value);
    } else {
      const index = this.newCampaign.scheduleDays.indexOf(e.target.value);

      if (index >= 0) {
        this.newCampaign.scheduleDays.splice(index, 1);
      }
    }
  }

  updateEndDate() {
    //console.log('update end date')
    this.endDatePicker = new Date();
    this.endDatePicker.setDate(this.startDatePicker.getDate() + 90);
    this.newCampaign.endDate = this.datepipe.transform(this.endDatePicker, 'yyyy-MM-dd') + ' 22:00'
  }

  verifySchedule() {
    this.scheduleErrorMessage = [];
    if (this.startDatePicker == null) {
      this.startDatePicker = new Date();
    }
    let now = new Date()
    if (this.startDatePicker < now) {
      this.toastr.error('Start date must not be in the past.')
      return false
    }

    //  if (this.newCampaign.endDate === '') {
    //   this.endDatePicker = new Date();
    //   this.endDatePicker.setDate(this.startDatePicker.getDate() + 90);
    //  }

    // if(this.startDatePicker > this.endDatePicker) {
    //   this.scheduleError = true;
    //   this.scheduleErrorMessage.push('Start date must come before end date.')
    //   return false
    // }

    if (this.newCampaign.scheduleDays.length >= 1 && this.scheduleError) {
      this.scheduleError = false;
    }

    if (this.newCampaign.scheduleDays.length == 0) {
      this.scheduleError = true;
      this.scheduleErrorMessage.push("Please select at least one day of the week to post.");
      return false;
    }

    if ((this.endHour * 60 + this.endMinute*1) - (this.startHour * 60 + this.startMinute*1) < 60) {
      this.scheduleError = true;
      this.scheduleErrorMessage.push("Your total available schedule must be at least one hour. Please adjust your end times.");
    } else {
      this.scheduleError = false;
      this.startDate = this.datepipe.transform(this.startDatePicker, 'yyyy-MM-dd') + ' ' + this.startHour + ':' + this.startMinute;
      this.endDate = this.datepipe.transform(this.endDatePicker, 'yyyy-MM-dd') + ' ' + this.endHour + ':' + this.endMinute;
      return true;
    }

    if (this.scheduleError) {
      return false;
    }

    return false;

  }


  addChip(event: MatChipInputEvent, where: string) {

    const value = (event.value || '').trim();

    switch(where) {
      case 'hashtags':
        if (!event.value.charAt(0).includes("#") || event.value.length <= 3 || (event.value.match(/#/g) || []).length > 1 || event.value.substring(1).match(/[^a-zA-Z0-9]/g) || this.newCampaign.hashTagPool.includes(event.value)) {
          this.isHashTagValid = false;
          return;
        }
        if (this.newCampaign.hashTagPool.length > this.userSettings.maxHashTagsPerCampaign) {
          this.hashTagError = true;
          return;
        }
        this.isHashTagValid = true;


        // Add the hashtag
        if (value) {
          this.areTagsVirgin = false
          this.newCampaign.hashTagPool.push(event.value);
        }
        break;
      case 'users':
        if (!event.value.charAt(0).includes("@") || event.value.length <= 3 || this.newCampaign.igUsers.includes(event.value.substring(1))) {
          this.isUsernameValid = false;
          return;
        }
        if (this.newCampaign.igUsers.length*1 > this.userSettings.maxIgUsers*6) {
          this.isUsernameValid = false;
          return;
        }

        // Add the username
        if (value) {
          this.newCampaign.igUsers.push(event.value.substring(1));
          this.isUsernameValid = true;
        }
        break;
      case 'subreddit':
        if (value) {
          if (this.doesSubExist(value)) {
            this.newCampaign.subreddits.push(event.value);
          }
        }
        break;
    }

    event.chipInput!.clear();

  }

  removeChip(what: string, where: string) {

    switch(where) {
      case 'hashtags':
        let index = this.newCampaign.hashTagPool.indexOf(what);
        if (index >= 0) {
          this.newCampaign.hashTagPool.splice(index, 1);
          if (this.newCampaign.hashTagPool.length <= this.userSettings.maxHashTagsPerCampaign) {
            this.hashTagError = false;
          }
        }
        break;
      case 'users':
        let index2 = this.newCampaign.igUsers.indexOf(what);
        if (index2 >= 0) {
          this.newCampaign.igUsers.splice(index2, 1);
          if (this.newCampaign.igUsers.length <= this.userSettings.maxIgUsers) {
            //this.hashTagError = false; TODO
          }
        }
        break;
      case 'subreddit':
        let index3 = this.newCampaign.subreddits.indexOf(what);
        if (index3 >= 0) {
          this.newCampaign.subreddits.splice(index3, 1);
        }
        break;
    }
  }

  pasteChips(event: ClipboardEvent, where: string) {

    switch(where) {
      case 'hashtags':
        event.preventDefault(); //Prevents the default action
        event.clipboardData!
        .getData('Text') //Gets the text pasted
        .split(/;|,| |\n/) //Splits it when a SEMICOLON or COMMA or NEWLINE or space
        .forEach(value => {
        if(value.trim() && value.trim().charAt(0).includes("#") && !this.newCampaign.hashTagPool.includes(value.trim())){
          this.newCampaign.hashTagPool.push( value.trim() ); //Push if valid
        } else {
          this.isHashTagValid = false;
        }
        })
        break;
      case 'users':
        event.preventDefault(); //Prevents the default action
        event.clipboardData!
        .getData('Text') //Gets the text pasted
        .split(/;|,| |\n/) //Splits it when a SEMICOLON or COMMA or NEWLINE or space
        .forEach(value => {
        if(value.length > 3 && value.trim() && value.trim().charAt(0).includes("@") && this.newCampaign.igUsers.length < this.userSettings.maxIgUsers && !this.newCampaign.igUsers.includes(value.trim().substring(1))){
          this.newCampaign.igUsers.push( value.substring(1).trim() ); //Push if valid
        } else {
          this.isUsernameValid = false;
        }
        });
        break;
      case 'subreddit':
        break;
    }

  }

  removeAllChips(confirm: boolean, where: string) {
    switch(where) {
      case 'hashtags':
        if (!confirm) {
          if (this.confirmClearAllTags) {
            this.confirmClearAllTags = false;
          } else {
            this.confirmClearAllTags = true;
            return;
          }
        } else {
          this.newCampaign.hashTagPool = [];
          this.confirmClearAllTags = false;
          this.hashTagError = false;
          this.isHashTagValid = true;
        }
        break;
      case 'users':
        if (!confirm) {
          if (this.confirmClearAllUsers) {
            this.confirmClearAllUsers = false;
          } else {
            this.confirmClearAllUsers = true;
            return;
          }
        } else {
          this.newCampaign.igUsers = [];
          this.confirmClearAllUsers = false;
          this.hashTagError = false; //TODO: Fix these
          this.isHashTagValid = true;
        }
        break;
    }

  }

  doesSubExist(sub: string) { // TODO:
    //function to check if subreddit exists? need backend service
    //to check this to prevent posting errors
    return true;
  }

  mediaNetworkSwitch(which: string, id: number) {
    console.warn('triggeredddd');
    //for (let i = 0; i <= this.campaignMedia.length; i++) {
      if (this.campaignMedia[id].platforms.indexOf(which) == -1) {
        this.campaignMedia[id].platforms.push(which);
      } else {
        this.campaignMedia[id].platforms.splice(this.campaignMedia[id].platforms.indexOf(which), 1);
      }
    //}
  }

  masterNetworkSwitch(which: string, addOrRemove: boolean) {

    switch(which) {
      case 'facebook':
        this.masterFacebookSwitch = this.masterFacebookSwitch ? false : true;
        break;
      case 'reddit':
        this.masterRedditSwitch = this.masterRedditSwitch ? false : true;
        break;
      case 'twitter':
        this.masterTwitterSwitch = this.masterTwitterSwitch ? false : true;
        break;
      case 'instagram':
        this.masterInstagramSwitch = this.masterInstagramSwitch ? false : true;
        break;
    }

    if (!addOrRemove) {
      for (let i = 0; i < this.campaignMedia.length; i++) {
        //console.log('event ??')
        if (this.campaignMedia[i].platforms.indexOf(which) == -1) {
          this.campaignMedia[i].platforms.push(which);
        }
      }
    } else {
      for (let i = 0; i < this.campaignMedia.length; i++) {
        //console.log('another event')
        if (this.campaignMedia[i].platforms.indexOf(which) >= 0) {
          this.campaignMedia[i].platforms.splice(this.campaignMedia[i].platforms.indexOf(which), 1);
        }
      }
    }

  }

  // selectFiles(event: any) {
  //   this.spinner.show();
  //   this.campaignMedia = [];
  //   this.masterFacebookSwitch = false;
  //   this.masterInstagramSwitch = false;
  //   this.masterRedditSwitch = false;
  //   this.masterTwitterSwitch = false;

  //   if (event.target.files) {
  //     for(let i = 0; i < event.target.files.length; i++) {
  //       this.campaignMedia.push({post_id: '', mediaUrl: '', platforms: []});
  //       let reader = new FileReader();

  //       reader.readAsDataURL(event.target.files[i]);

  //       reader.onload = (event:any) => {
  //         //console.warn(event.target.result);
  //         this.campaignMedia[i].mediaUrl = event.target.result;
  //       }
  //     }
  //   }

  //   setTimeout(() => {
  //     this.spinner.hide();
  //   }, 5000);


  //     // for(let i = 0; i <= fauxMedia.length; i++) {
  //     //   //console.log('looping: ' + fauxMedia[i])
  //     //   this.campaignMedia[i].mediaUrl = fauxMedia[i];

  //     // }

  // }


  // // // // // // ███████╗███████╗████████╗██╗███╗   ███╗ █████╗ ████████╗███████╗
  // // // // // // ██╔════╝██╔════╝╚══██╔══╝██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
  // // // // // // █████╗  ███████╗   ██║   ██║██╔████╔██║███████║   ██║   █████╗
  // // // // // // ██╔══╝  ╚════██║   ██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝
  // // // // // // ███████╗███████║   ██║   ██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
  // // // // // // ╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

  estimateTotalPosts() {
    ////console.log(JSON.stringify(this.campaignMedia));
    if (!this.startDatePicker) {
      if (!this.silentMode)
        this.toastr.error('Please select a start date.')
      return false
    }

    if (this.newCampaign.platforms.length === 0) {
      if (!this.silentMode)
        this.toastr.error('Please enable a social platform.')
      return false
    }

    if (this.campaignMedia.length === 0) {
      if (!this.silentMode)
        this.toastr.error('Please add your media.')
      return false
    }



    let estimate: number = 0;
    let unique: number = 0;
    let reposts: number = 0;



    for (let i = 0; i < this.campaignMedia.length; i++) {
      estimate += this.campaignMedia[i].platforms.length;
    }

    if (this.campaignMedia.length == 0 || estimate === 0) {
      if (!this.silentMode)
        this.toastr.error('You forgot to add media to your campaign!')
      return false;
    }

    if (!this.silentMode)
      this.toastr.info('Estimating ...','',{timeOut: 1000})

    let repostNum = this.newCampaign.repostRepeat


    this.calculateEndDate(this.startDatePicker, this.newCampaign.scheduleDays, this.newCampaign.postsPerDay, Math.ceil(estimate / this.newCampaign.platforms.length))

    if (repostNum != 0) {
        repostNum = +repostNum + 1
        unique = estimate

        reposts = (estimate * repostNum) - estimate
        if (!this.silentMode)
          this.toastr.info('Your campaign will create <strong>' + unique + ' unique posts</strong> and <strong>' + reposts + ' reposts</strong> for a total of <strong> ' + (unique + reposts) + '</strong> posts.','',
        { enableHtml: true, timeOut: 8000})
        return true;
    }


    this.toastr.info('Your campaign will create <strong>' + estimate + ' unique posts</strong>.','',
    { enableHtml: true, timeOut: 8000})

    return true;
  }

  calculateEndDate(start: string, days: string[], postsPerDay: number, totalPosts: number) {
    if (!start || days.length === 0) {
      this.toastr.error('Please choose a start date or fix errors in schedule options.')
      return
    }
    //console.log('calculateEndDate() function')
    let startDate = new Date(start)
    //console.log(startDate)
    //console.log(days)
    //console.log(postsPerDay)
    //console.log(totalPosts)
    //console.log('days of posts: ' + Math.ceil(totalPosts / postsPerDay))

    let count: number = 0
    let noOfDaysToAdd = Math.ceil(totalPosts / postsPerDay)
    let endDate
    let p: number = 0

    if (!days.includes(startDate.getDay().toString())) {
      ////console.log('before mod: ' + startDate)
      //startDate.setDate(startDate.getDate() + (7 - startDate.getDay()) % 7+1)
      //console.log('start date isnt included in schedule. new startdate: ' + startDate)
      let i: number = startDate.getDay()
      while (!days.includes(i.toString())) {
        if (i >= 6) {
          i = 0
        }
        i++
        p++
        if (p >= 14)
          break
      }
      //console.log('wasnt found.. so lets add i to the date')
      startDate.setDate(startDate.getDate() + (i === 0 ? 0 : i-1))
      //console.log('shoudl this be the new start date? ' + startDate)
    }

    if (Math.ceil(totalPosts / postsPerDay) >= 2) {
      ////console.log('what is the start date getDay() + ' startDate.getDay())
       while(count < noOfDaysToAdd){
         endDate = new Date(startDate.setDate(startDate.getDate() + 1));
         if(days.includes(endDate.getDay().toString())) {
           //Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
           count++;
         }
       }
    } else {
      endDate = new Date(startDate)
    }

  //console.log('campaign ends on ' + endDate)

  this.newCampaign.endDate = endDate.toISOString()
  this.toastr.info('Your campaign ends on ' + this.datepipe.transform(endDate, 'EEEE, MMM d, y') + '.','',{timeOut: 8000})


  }

  // *** WORKING ON THIS ONE BELOW ------------------------------------------------- ||||||

  returnEndDate(start: string, days: string[], postsPerDay: number): string {
    // // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 1374 ~ ManagerComponent ~ returnEndDate ~ start", start)
    //console.log('checked')
    if (!start || days.length === 0) {
      return null
    }

    let estimate: number = 0

    for (let i = 0; i < this.campaignMedia.length; i++) {
      estimate += this.campaignMedia[i].platforms.length;
    }

    let totalPosts = Math.ceil(estimate / this.newCampaign.platforms.length)
    // // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 1371 ~ ManagerComponent ~ returnEndDate ~ totalPosts", totalPosts)

    let startDate = new Date(start)
    // // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 1363 ~ ManagerComponent ~ returnEndDate ~ startDate", startDate)


    let count: number = 0
    let noOfDaysToAdd = Math.ceil(totalPosts / postsPerDay)
    let endDate
    let p: number = 0

    if (!days.includes(startDate.getDay().toString())) {

      let i: number = startDate.getDay()
      //console.log("🚀 ~ file: manager.component.ts ~ line 1400 ~ ManagerComponent ~ returnEndDate ~ startDate.getDay()", startDate.getDay())
      while (!days.includes(i.toString())) {
        // // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 1409 ~ ManagerComponent ~ returnEndDate ~ i", i)
        if (i >= 6) {
          i = -1
        }
        i++
        p++
        // // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 1410 ~ ManagerComponent ~ returnEndDate ~ p", p)
        if (p >= 14)
          break
      }



      startDate.setDate(startDate.getDate() + (i === 0 ? 7 : i-1))
      //console.log("🚀 ~ file: manager.component.ts ~ line 1417 ~ ManagerComponent ~ returnEndDate ~ (i === 0 ? 7 : i-1)", (i === 0 ? 7 : i-1))



    }

    // // // // // // // // // // // // // // // // // console.log("🚀 ~ file: manager.component.ts ~ line 1389 ~ ManagerComponent ~ returnEndDate ~ startDate", startDate)

    if (Math.ceil(totalPosts / postsPerDay) >= 2) {

       while(count < noOfDaysToAdd){
         endDate = new Date(startDate.setDate(startDate.getDate() + 1));
         if(days.includes(endDate.getDay().toString())) {

           count++;
         }
       }
    } else {
      endDate = new Date(startDate)

    }

    // // // // // // // // // // // // // // // // // //console.log("🚀 ~ file: manager.component.ts ~ line 1406 ~ ManagerComponent ~ returnEndDate ~ endDate", endDate)
    //console.log("🚀 ~ file: manager.component.ts ~ line 1448 ~ ManagerComponent ~ returnEndDate ~ this.datepipe.transform(endDate,yyyy-MM-dd ) + this.endHour + : + this.endMinute", this.datepipe.transform(endDate,"yyyy-MM-dd ") + this.endHour + ":" + this.endMinute)

    return this.datepipe.transform(endDate,"yyyy-MM-dd ") + this.endHour + ":" + this.endMinute

  }

  returnStartDate() {

  }

  getWeekdayNum(day: string) {
    switch(day) {


      case "monday":
        return "1"
      case "tuesday":
        return "2"
      case "wednesday":
        return "3"
      case "thursday":
        return "4"
      case "friday":
        return "5"
      case "saturday":
        return "6"
      case "sunday":
        return "0"
    }

    return "0"
  }

  // ██╗      ██████╗  █████╗ ██████╗     ███╗   ███╗███████╗██████╗ ██╗ █████╗
  // ██║     ██╔═══██╗██╔══██╗██╔══██╗    ████╗ ████║██╔════╝██╔══██╗██║██╔══██╗
  // ██║     ██║   ██║███████║██║  ██║    ██╔████╔██║█████╗  ██║  ██║██║███████║
  // ██║     ██║   ██║██╔══██║██║  ██║    ██║╚██╔╝██║██╔══╝  ██║  ██║██║██╔══██║
  // ███████╗╚██████╔╝██║  ██║██████╔╝    ██║ ╚═╝ ██║███████╗██████╔╝██║██║  ██║
  // ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝

  getMedia() {
    //console.log('get media() called from manager.ts')
    if (this.campaignMedia.length > 0 ) {
      return
    }
    this.campaignMedia = [];
    this.masterFacebookSwitch = false;
    this.masterInstagramSwitch = false;
    this.masterRedditSwitch = false;
    this.masterTwitterSwitch = false;
    let mediaLoadError = false


    this.CommonService.getMedia(this.userProfile.s3_id).subscribe({
      next: val => {
        this.mediaToLoad = val
        //console.log('getting media data?')
        //console.log(val)
        if (val === null && this.showMediaTab === true) {
          this.toastr.warning('Please upload media.')
          this.mediaLoaded = false
        }

        ////console.log('some media: ' + this.mediaToLoad)
      },
      error: error => {
        //console.log('error getting media')
        mediaLoadError = true
        this.mediaToLoad.media = []
    }
   })

   if (this.mediaToLoad.media) {
    for (const m of this.mediaToLoad.media) {
      this.campaignMedia.push({//media_id: m.media_id,

        //post_id: '',
        path: m.path,
        thumbnail: m.thumbnail,
        facebook: '',
        twitter: '',
        instagram: '',
        reddit: '',
        telegram: '',
        platforms: []
        });
    }
  }

   if (!mediaLoadError) {
     this.mediaLoaded = true
   }

   //console.log("🚀 ~ file: manager.component.ts ~ line 1582 ~ ManagerComponent ~ getMedia ~ this.campaignMedia", this.campaignMedia)

  }

  async getSignedURLs(camp_id: string, media: any) {
    this.CommonService.getSignedUrls(camp_id, media).subscribe({
      next: val => {
        this.newCampaign.media = val as any
        this.toastr.info('test')
      },
      error: error => {
        //console.log('error occurred getting signed urls')
        return false
      }
    })

  }



  // ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
  // ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
  // ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
  // ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
  // ██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
  // ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝

  printJson() {
    //console.log('current campaign object:')
    //console.log(JSON.stringify(this.newCampaign))
    //console.log('current media object:')
    //console.log(JSON.stringify(this.campaignMedia))
    //console.log('putting media into the campaign object...')
    this.checkMedia()
    this.campaignMedia = this.campaignMedia.filter((item: any) => item)
    this.newCampaign.media = this.campaignMedia
    //console.log('this is what the final shoudl be:')
    //console.log(JSON.stringify(this.newCampaign))
  }

  triggerFalseClick() {
    let el: HTMLElement = this.InfoModal.nativeElement;
    el.click();
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  counter(i: number) {
    return new Array(i);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  replaceAll(string: string, search: string, replace: string) {
    return string.split(search).join(replace);
  }

  checkUsers() {
    console.log(this.newCampaign.igUsers)
  }



}
