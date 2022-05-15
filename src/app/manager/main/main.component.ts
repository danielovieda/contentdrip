import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { CampaignService } from '.././campaign.service';
import { CommonService } from '../../service/common.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})
export class MainComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  posts: any;
  confirm: boolean = false
  postToDelete!: string
  linkToDelete!: string
  postIndex: number = 0
  noPosts: boolean = false
  selectedCampId: string = ''
  ayrId: string = ''
  loadingPosts: boolean = false

  constructor(private campService: CampaignService,
    private CommonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.subscription = this.campService.campaignId.subscribe(camp => this.showMyPosts(camp))
    this.loadingPosts = false
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showMyPosts(whichCampaign: string) {

    this.loadingPosts = true
    this.spinner.show("postSpinner")

    if (whichCampaign === '') {
      return
    }
    this.selectedCampId = whichCampaign
    this.CommonService.getPosts(whichCampaign).subscribe({
      next: val => {
        this.posts = val
        this.noPosts = false

        //console.log('GETTING POSTS BITCH')
        console.log(this.posts)

      },
      error: error => {
        this.noPosts = true
        this.posts = []
        //console.log('an error occurred')
      }
    })

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide("postSpinner");
    }, 3000);
    this.loadingPosts = false

  }

  shownList: any

 toggleList(list: any) {
     if (this.isListExpanded(list)) {
         this.shownList = null;
     } else {
         this.shownList = list;
     }
  };

  isListExpanded(list: any) {
     return this.shownList === list;
  };

  deletePost(post_id: any, link_id: any, campaign_id: any, ayr_id: any, index: number){
    //console.log('triggered delete for: ' + post_id)

    //console.log('pull post_id from campaign_id: ' + campaign_id)
    this.CommonService.deletePost(post_id).subscribe({
      next: data => {
      //console.log("🚀 ~ file: main.component.ts ~ line 96 ~ MainComponent ~ this.CommonService.deletePost ~ data", data)

        this.toastr.success('Post deleted successfully.')
        this.removeItem(index)
        this.postToDelete = ''
      },
      error: error => {
        this.toastr.error('An error has occurred. Please try again.')
      }
    })
  }

  confirmDelete(index: number) {
    //console.log('AYR ID BABY: ' + this.ayrId)
    if (this.confirm) {
      this.deletePost(this.postToDelete, this.linkToDelete, this.selectedCampId, this.ayrId, index)
    }
  }

  removeItem(index: any) {
    this.posts.splice(index, 1)
  }

}
