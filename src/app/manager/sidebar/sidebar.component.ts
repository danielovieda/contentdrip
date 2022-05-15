
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Campaign } from '.././campaign';
import { CampaignService } from '../campaign.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent  {
  @Input() sideBarCampaign!: Campaign[];

  subscription!: Subscription;
  camp!: string;
  confirm: boolean = false;
  campaignToDelete: string = ''
  campIndex: number = 0

  constructor(private campService: CampaignService,
    private toastr: ToastrService,
    private CommonService: CommonService) { }

  ngOnInit(): void {
    this.subscription = this.campService.campaignId.subscribe(camp => this.camp = camp)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showPost(post: string) {
    this.campService.showPosts(post);
  }

  deleteCampaign(campaign_id: string) {
    //console.log("🚀 ~ file: sidebar.component.ts ~ line 38 ~ SidebarComponent ~ deleteCampaign ~ campaign_id", campaign_id)
    this.campService.deleteCampaignAllPostsLinks(campaign_id).subscribe({
      next: val => {
        //console.log(JSON.stringify(val))
        this.toastr.success('Campaign and all posts deleted.','',{timeOut: 1500})
      },
      error: error => {
        this.toastr.error('An error has occurred, please try again.')
      }
    })

  }

  trackByFn(i: number) {
    return i
  }

  removeItem(index: any) {
    this.sideBarCampaign.splice(index, 1)
  }

  confirmDelete() {
    if (this.confirm) {
      this.deleteCampaign(this.campaignToDelete)
    }
  }

  makePosts(campaign_id: string) {
    let data = {campaign_id: campaign_id}
    this.CommonService.generateCampaignPosts(data).subscribe({
      next: data => {
        this.toastr.success('Generating Posts...')
      }
    })
  }

  shownList: any

  toggleList(list: any) {
      if (this.isListExpanded(list)) {
          this.shownList = null;
      } else {
          this.shownList = list;
      }
   }

   isListExpanded(list: any) {
      return this.shownList === list;
   }

   getWeekdayNum(day: string) {
    switch(day) {
      case '0':
        return "SUN"
      case '1':
        return "MON"
      case '2':
        return "TUE"
      case '3':
        return "WED"
      case '4':
        return "THU"
      case '5':
        return "FRI"
      case '6':
        return "SAT"
    }

    return "0"
  }

}
