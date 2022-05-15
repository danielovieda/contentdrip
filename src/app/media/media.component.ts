import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service'
import { HttpClient } from '@angular/common/http'
import { NgxSpinnerService } from 'ngx-spinner'
import { userService } from '../service/user.service'
import { ToastrService } from 'ngx-toastr'
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  files: File[] = []
  user_id: string = ''
  mediaToSave: string[] = []
  uploadSuccess: boolean = false
  userSettings: any
  mediaObj = [] as any

  constructor(private CommonService: CommonService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private userService: userService,
    private toastr: ToastrService,
    private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Upload media - contentdrip.io')
    this.CommonService.getUserProfile().subscribe({
      next: data => {
        this.user_id = data.s3_id
        //console.log('inside media get user')
        //console.log('s3 media id : ' + this.user_id)
      },
      error: data => {

      }
    })

    this.CommonService.getUserSettings().subscribe({
      next: data => {
        this.userSettings = data
        //console.log(JSON.stringify(data))
      },
      error: error => {
        //console.log('Error occurrred getting user settings.')
      }
    })

    this.getMedia()


  }

  onSelect(event: any) {
    //console.log(event)
    if (this.files.length + event.addedFiles.length >= this.userSettings.maxCampaigns * this.userSettings.maxImages) {
      this.toastr.error('Your maximum upload for images is: ' + this.userSettings.maxCampaigns * this.userSettings.maxImages)
      return
    }

    // for (let i = 0; i < event.addedFiles.length; i++) {
    //   if (this.files.find(name => name = event.addedFiles[i].name)) {
    //     //console.log('found dup')
    //     //console.log(this.files.find(name => name === event.addedFiles[i].name))
    //   } else {
    //     this.files.push(event.addedFiles[i])
    //     delete event.addedFiles[i]
    //   }
    // }
    this.files.push(...event.addedFiles)
    //console.log(this.files)
  }

  onRemove(event: any) {
    //console.log(event)
    this.files.splice(this.files.indexOf(event), 1)
  }

  refreshUser() {
    this.CommonService.getUserProfile().subscribe({
      next: data => {
        this.user_id = data.s3_id
        //console.log('inside media get user')
        //console.log('s3 media id : ' + this.user_id)
      },
      error: data => {

      }
    })
  }

  upload() {
    //console.log('triggered')
    if (this.files.length === 0) {
      //console.log('no files')
      this.toastr.warning('Please add files.')
      return
    }
    this.spinner.show()
    this.onUploadMedia(this.files)
    .then ((res: any) => {
      res.forEach((element: any) => {
        //console.log('something here? ' + element)
      })
    })
    .catch((err) => {
      this.toastr.error('An error occurred during upload. Please try again.')
      //console.log('some error in the upload ' + err)
    })
    .finally(() => {
      //console.log('finally done')
    })

    let updateObj = {}
    updateObj = {user_id: this.user_id, media: this.mediaToSave}

    //console.log(JSON.stringify(updateObj))

    // this.CommonService.addMedia(updateObj).subscribe((res) => {
    //   //console.log('returned: ' + JSON.stringify(res))
    // },
    // (err) => {
    //   //console.log(JSON.stringify(err))
    // })

  }

  async onUploadMedia(files: any) {
    if (!this.user_id) {
      this.refreshUser()
      this.toastr.error('An error has occurred. Please try again.')
      throw Error('User ID missing')
    }
    let i = 0
    this.mediaToSave = []
    return new Promise((pass, fail) => {
      for (const f of files) {
        f.name
        this.CommonService.getPresignURL("mishow-post-store",
        this.user_id + "/" + f.name ).subscribe((data: any) => {
          let formData: FormData = new FormData()
          formData.append("key", data.url.fields.key)
          formData.append("x-amz-algorithm", data.url.fields["x-amz-algorithm"])
          formData.append("x-amz-credential", data.url.fields["x-amz-credential"])
          formData.append("x-amz-date", data.url.fields["x-amz-date"])
          formData.append("x-amz-security-token", data.url.fields["x-amz-security-token"])
          formData.append("policy", data.url.fields.policy)
          formData.append("x-amz-signature", data.url.fields["x-amz-signature"])
          formData.append("x-amz-server-side-encryption", "AES256")
          formData.append("Content-Type", f.type)
          formData.append("file", f, f.name)

          ////console.log(data.url.url)


          this.http.post(data.url.url, formData).subscribe((res) => {
              i += 1
              //console.log(data.url.fields.key + ' was successfully posted.')
              this.mediaToSave.push(data.url.fields.key)
              pass(this.mediaToSave)
              //console.log(f.count)
              if (i === files.length) {
                  this.addMedia()

              }
          },
          (err) => {
            //console.log('some error: ' + JSON.stringify(err))
          })

        },
        (err) => {
          //console.log('some error occured in the presign URL: ' + err)
          this.spinner.hide()
        })


      }
    })

  }

  addMedia() {
    let updateObj = {}
    updateObj = {user_id: this.user_id, media: this.mediaToSave}
    //console.log('about to add: ' + JSON.stringify(updateObj))
    this.CommonService.addMedia(updateObj).subscribe((res) => {
      this.files = []
      this.spinner.hide()
      this.uploadSuccess = true
    },
    (err) => {
      //console.log(err)
      this.spinner.hide()
    })
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  getRandomIntBetween(min: any, max: any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getMedia() {
    this.CommonService.getMedia(this.user_id).subscribe({
      next: data => {
        this.mediaObj = data.media
        // console.log("🚀 ~ file: media.component.ts ~ line 220 ~ MediaComponent ~ this.CommonService.getMedia ~ data", data)
      },
      error: error => {
      // console.log("🚀 ~ file: media.component.ts ~ line 222 ~ MediaComponent ~ this.CommonService.getMedia ~ error", error)
    }
   })
  }

  removeItem(index: any) {
    this.mediaObj.splice(index, 1)
  }

  deleteMedia(path: string, i: number) {
    // console.log("🚀 ~ file: media.component.ts ~ line 235 ~ MediaComponent ~ deleteMedia ~ path", path)

    let data = { user_id: this.user_id, media: [ path ] }

    this.CommonService.deleteMedia(data).subscribe({
      next: data => {
        this.toastr.success('Deleted.')
        this.removeItem(i)
      },
      error: error => {
        this.toastr.error('Unable to delete, please try again.')
      }
    })

  }



}
