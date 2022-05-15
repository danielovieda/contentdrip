import { Injectable, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UserSettings } from '../usersettings';
import { CampaignService } from '../campaign.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../service/common.service'
import { HttpClient } from '@angular/common/http'
import { ElementRef } from '@angular/core';
import { userService } from '../../service/user.service'
import { ToastrService } from 'ngx-toastr';
import { userSettings } from '../mock-usersettings';
import { FormGroup, FormControl } from '@angular/forms'
import { Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { mergeMap } from 'rxjs/operators';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

@Injectable({
  providedIn: 'root',
})
export class SettingsComponent implements OnInit {

  userSettings = {} as UserSettings;
  subscription!: Subscription;
  user_id!: string
  mediaToSave: string[] = []

  accountUsername: string = '';
  profileIcon: any;
  profileHeader: any;
  profileTitle: string = ''
  email: string = ''
  s3_id: string


  profile: boolean = true;
  socials: boolean = false;
  plan: boolean = false;
  upgrade: boolean = false;
  whichPlan: string = '';

  confirmDelete: boolean = false
  userIdToDelete: string = ''

  confirmProfileDelete: boolean
  profileToDelete: string

  selectedPlan: string = ''

  upgradePrice: string = ''
  upgradeUrl: string = ''
  upgradeLink: string = ''
  ayrLogin = new Array(10)
  activeProfiles = [] as any
  files: File[] = []

  profileIconFile: File
  profileHeaderFile: File

  @ViewChild('welcomeModal') welcomeModal!: ElementRef<HTMLElement>;
  @ViewChild('upgradeButton') upgradeButton!: ElementRef<HTMLElement>;


  //Form Controls

  profileForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('',
    [Validators.required,
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    profileIcon: new FormControl(''),
    profileHeader: new FormControl('')
  })

  constructor(private campaignService: CampaignService, private CommonService: CommonService,
    private http: HttpClient,
    private userService: userService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private title: Title) { }

  ngOnInit() {
    this.spinner.show("loading")
    this.title.setTitle('Settings - contentdrip.io')
    this.userService.init()


    //this.subscription = this.campaignService.settings.subscribe(userSettings => this.userSettings = userSettings);
    this.user_id = this.userService.getId()
    //console.log("before: " + this.accountUsername);
    this.loadAccountInfo();
    //console.log("before: " + this.accountUsername);




  }

  ngAfterViewInit() {

  }

  // ██╗      ██████╗  █████╗ ██████╗     ██████╗ ██████╗  ██████╗ ███████╗██╗██╗     ███████╗
  // ██║     ██╔═══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║██║     ██╔════╝
  // ██║     ██║   ██║███████║██║  ██║    ██████╔╝██████╔╝██║   ██║█████╗  ██║██║     █████╗
  // ██║     ██║   ██║██╔══██║██║  ██║    ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║██║     ██╔══╝
  // ███████╗╚██████╔╝██║  ██║██████╔╝    ██║     ██║  ██║╚██████╔╝██║     ██║███████╗███████╗
  // ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝

  async loadAccountInfo() {
    if (!this.user_id) {
      await this.delay(5000)
    }

    this.userService.getUserProfile().subscribe({
      next: data => {
        //console.log('user profile')
        //console.log(JSON.stringify(data))
        this.accountUsername = data.user_name as string
        this.email = data.email as string
        this.profileIcon = data.profile_picture
        this.profileHeader = data.profile_header
        this.s3_id = data.s3_id
        //console.log('the user data:')
        //console.log(this.accountUsername)
        //console.log(this.email)
        //console.log(this.profileIcon)
        //console.log(this.profileHeader)
      },
      error: error => {
        this.toastr.error('Unable to load profile. Please log out and try again.')
      }
    })

    this.userService.getUserSettings().subscribe({
      next: data => {
        //console.log('data from suer settings common service')
        //console.log(JSON.stringify(data))
        this.userSettings = data as any

        this.loadActiveProfiles()
        this.triggerFalseClick()
      },
    error: error => {
      //console.log('error occurred.')
      }
    })

    this.spinner.hide("loading")
    //console.log('did we get it? ' + JSON.stringify(this.userSettings))
  }

  loadActiveProfiles() {
    if(this.userSettings.ayrshare_profiles) {
      for (const profiles of this.userSettings.ayrshare_profiles) {
        this.getActiveProfiles(profiles.profileKey)
        //console.log(this.activeProfiles)
      }
    }
  }

  // changeSetting(key: any, value: any) {
  //   if (key == 'autoHashTag') {
  //     this.userSettings.autoHashTag = value;
  //   }
  // }

  checkSocial(which: any) {
    if (this.campaignService.getActiveSocials().includes(which)) {
      return true;
    } else {
      return false;
    }
  }

  checkPlan(which: any) {
    return this.userSettings.subscriptionPlan == which ? true : false;
  }

  // ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗    ██████╗ ██████╗  ██████╗ ███████╗██╗██╗     ███████╗
  // ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║██║     ██╔════╝
  // ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗      ██████╔╝██████╔╝██║   ██║█████╗  ██║██║     █████╗
  // ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝      ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║██║     ██╔══╝
  // ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗    ██║     ██║  ██║╚██████╔╝██║     ██║███████╗███████╗
  //  ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝

  async updateAccount() {


    if (this.profileForm.get('email').invalid && this.profileForm.get('email').dirty) {
      this.toastr.warning('Email is invalid.')
      return
    }

    if (this.profileForm.pristine) {
      this.toastr.warning('No changes to make.')
      return
    }

    this.toastr.info('Updating Account...')
    let newUsername = ''
    let newEmail = ''
    let data = {}

    if(this.profileForm.get('username').dirty) {
      newUsername = this.profileForm.get('username').value
      data["user_name"] = newUsername
    }

    if(this.profileForm.get('email').dirty) {
      newEmail = this.profileForm.get('email').value
      data["email"] = newEmail
    }

    if (this.profileForm.get('profileIcon').dirty) {

      await this.onUploadMedia(this.profileIconFile).then((res: any) => {
        data["profile_picture"] = res
      })
      .catch((error) => {
        //console.log('some error in upload ' + error)
      })

    }

    if (this.profileForm.get('profileHeader').dirty) {
          await this.onUploadMedia(this.profileHeaderFile).then((res: any) => {
          data["profile_header"] = res
      })
      .catch((error) => {
        //console.log('some error in upload ' + error)
      })
    }

    if(data["profile_picture"] != null) {
      this.CommonService.getImagekitUrl({media_path: [data["profile_picture"]]}).subscribe({
        next: path => {
          data["profile_picture"] = path[0]
        }
      })
    }



    if(data["profile_header"] != null) {
      this.CommonService.getImagekitUrl({media_path: [data["profile_header"]]}).subscribe({
        next: path => {
          data["profile_header"] = path[0]
        }
      })
    }

    await this.delay(1000)

     this.CommonService.updateProfile(data).subscribe({
       next: data => {
        this.toastr.success('Your profile has been updated.')
         this.refreshSettings()

       },
       error: error => {
         this.toastr.error('An error occurred updating your profile.')
       }
     })



  }

  selectIcon(event: any) {
    this.profileIconFile = event.target.files[0]
  }

  selectHeader(event: any) {
    this.profileHeaderFile = event.target.files[0]
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


  randomAvatar() {
    let avatar = new Array(3)
    avatar[0] = "default_avatar_1.png"
    avatar[1] = "default_avatar_2.png"
    avatar[2] = "default_avatar_3.png"

    return avatar[this.getRandomInt(avatar.length)]
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }



  changePlan(which: string) {
    this.whichPlan = which;
    this.upgrade = true;
    this.openUpgradeModal()
    switch (which) {
      case 'Basic':
        this.upgradePrice = '$19.99'
        this.upgradeUrl = ''
        this.upgradeLink = 'https://buy.stripe.com/fZe7vkgIx6iQ6JOaEE'
        return;
      case 'Influencer':
        this.upgradePrice = '$49.99'
        this.upgradeUrl = ''
        this.upgradeLink = 'https://buy.stripe.com/fZe7vkbod9v2gkocMN'
        return;
      case 'Mega Influencer':
        this.upgradePrice = '$99.99'
        this.upgradeUrl = ''
        this.upgradeLink = 'https://buy.stripe.com/9AQaHwdwldLid8c3ce'
        return;
      default:
        return;
    }

  }

  async openLink(url: string) {
    this.spinner.show("upgrade")
    await this.delay(5000)
    window.open(url, "_blank")
    this.spinner.hide("upgrade")
  }



  validEmail() {
    if(this.email) {
      return true
    } else {
      return false
    }
  }


  deleteMyAccount() {
    if (!this.user_id) {
      this.user_id = this.userService.getId()
    }
    this.userIdToDelete = this.user_id
  }

  async confirmDeleteMyAccount() {
    if (this.confirmDelete) {
        //delete account
        //console.log('deleting account... bye bye')
    }
    this.toastr.warning('Your account has been deleted. Thank you.')
    this.toastr.warning('You will now be logged out. Good bye')
    await this.delay(3000)
    this.userService.auth.logout()
  }

  logout() {
    //TODO: add logout from auth0 this.auth.logout
  }

  triggerFalseClick() { //TODO: update this to trigger welcome Modal -- maybe use dates instead?
    let el: HTMLElement = this.welcomeModal.nativeElement;
    // //console.log(this.userSettings.logins + ' logins')
    // if (this.userSettings.logins < 3) {
    //   el.click();
    //   //console.log('hello')
    // }
    // //console.log('triggered click?')
  }

  openUpgradeModal() {
    let button: HTMLElement = this.upgradeButton.nativeElement
    button.click()
  }


  // █████╗ ██╗   ██╗██████╗     ██████╗ ██████╗  ██████╗ ███████╗██╗██╗     ███████╗███████╗
  // ██╔══██╗╚██╗ ██╔╝██╔══██╗    ██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║██║     ██╔════╝██╔════╝
  // ███████║ ╚████╔╝ ██████╔╝    ██████╔╝██████╔╝██║   ██║█████╗  ██║██║     █████╗  ███████╗
  // ██╔══██║  ╚██╔╝  ██╔══██╗    ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║██║     ██╔══╝  ╚════██║
  // ██║  ██║   ██║   ██║  ██║    ██║     ██║  ██║╚██████╔╝██║     ██║███████╗███████╗███████║
  // ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝


  getActiveProfiles(profileKey: any) {
    //console.log('sending this profile key... ' + profileKey)
    this.CommonService.getActiveProfiles(profileKey).subscribe({
      next: data => {
        //console.log('response from server:' )
        //console.log(data)
        if (data.activeSocialAccounts != undefined && data.status != 'error') {
          this.activeProfiles.push(data.activeSocialAccounts)
        } else {
          this.activeProfiles.push('exclamation-circle')
        }
      },
      error: error => {
        return error
      }
    })
  }

  createProfile(title: string, profileNum: number) {
    if (!title) {
      this.toastr.error('Please enter a title.')
      return
    }
    if (profileNum >= this.userSettings.maxProfiles) {
      this.toastr.error('Please upgrade to add more profiles.')
      return
    }
    let data = { user_id: '', title: '', profile_name: '' }
    data.user_id = this.user_id
    data.title = this.user_id + '-' + profileNum //UUID-0, UUID-1, UUID-2, etc...
    data.profile_name = title

    this.CommonService.createAyrProfile(data).subscribe({
      next: data => {
        this.toastr.success('New profile has been added.')
        this.refreshSettings()
      },
      error: error => {
        this.toastr.error('An error occurred adding your profile.')
      }

    })
  }

  async refreshSettings() {
    await this.delay(2000);
    location.reload()
  }

  deleteAyrProfile(title: string) {
    let data = {title: title}
    this.CommonService.deleteAyrProfile(data).subscribe({
      next: data => {
        this.toastr.success('Profile deleted successfully')
        this.refreshSettings()
      },
      error: error => {
        this.toastr.error('An error occurred while deleting this profile.')
      }
    })
  }

  confirmDeleteMyProfile() {
    if (this.confirmProfileDelete)
      this.deleteAyrProfile(this.profileToDelete)
  }

  async goToLink(profileKey: any){
    this.CommonService.getAyrLoginUrl(profileKey).subscribe({
      next: data => {
        //this.ayrLogin[pos] = data

        window.open(data.url, "_blank");

      },
      error: error => {
        this.toastr.error('An error has occurred. Please try again.')
        //console.log('error occurred generating login url')
        return ''
      }
    })

}

// ██╗   ██╗██████╗ ██╗      ██████╗  █████╗ ██████╗     ███╗   ███╗███████╗██████╗ ██╗ █████╗
// ██║   ██║██╔══██╗██║     ██╔═══██╗██╔══██╗██╔══██╗    ████╗ ████║██╔════╝██╔══██╗██║██╔══██╗
// ██║   ██║██████╔╝██║     ██║   ██║███████║██║  ██║    ██╔████╔██║█████╗  ██║  ██║██║███████║
// ██║   ██║██╔═══╝ ██║     ██║   ██║██╔══██║██║  ██║    ██║╚██╔╝██║██╔══╝  ██║  ██║██║██╔══██║
// ╚██████╔╝██║     ███████╗╚██████╔╝██║  ██║██████╔╝    ██║ ╚═╝ ██║███████╗██████╔╝██║██║  ██║
//  ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝


  async onUploadMedia(files: any) {
    let i = 0

    return new Promise((pass, fail) => {
      //for (const f of files) {
        files.name
        this.CommonService.getPresignURL("mishow-post-store",
        this.s3_id + "/" + files.name ).subscribe((data: any) => {
          let formData: FormData = new FormData()
          formData.append("key", data.url.fields.key)
          formData.append("x-amz-algorithm", data.url.fields["x-amz-algorithm"])
          formData.append("x-amz-credential", data.url.fields["x-amz-credential"])
          formData.append("x-amz-date", data.url.fields["x-amz-date"])
          formData.append("x-amz-security-token", data.url.fields["x-amz-security-token"])
          formData.append("policy", data.url.fields.policy)
          formData.append("x-amz-signature", data.url.fields["x-amz-signature"])
          formData.append("x-amz-server-side-encryption", "AES256")
          formData.append("Content-Type", files.type)
          formData.append("file", files, files.name)

          ////console.log(data.url.url)


          this.http.post(data.url.url, formData).subscribe((res) => {

              //console.log(data.url.fields.key + ' was successfully posted.')

              pass(data.url.fields.key)
              //console.log("🚀 ~ file: settings.component.ts ~ line 494 ~ SettingsComponent ~ this.http.post ~ data.url.fields.key", data.url.fields.key)

          },
          (err) => {
            //console.log('some error: ' + JSON.stringify(err))
          })

        },
        (err) => {
          //console.log('some error occured in the presign URL: ' + err)
        })


      //}
    })

  }




}
