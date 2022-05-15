import { Component, Injectable, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { CommonService } from '../service/common.service'


@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})

@Injectable({
  providedIn: 'root'
})
export class LinkComponent implements OnInit {
  route!: string
  url!: string

  notFound: boolean = false

  constructor(router: Router, location: Location, private CommonService: CommonService) {
    router.events.subscribe((val: any) => {
      if (location.path() != '') {
        this.route = location.path()
      }
    })
   }

  ngOnInit() {
    this.CommonService.getLinkUrl(this.route.substring(6,this.route.length)).subscribe((data: any) => {
      if (data) {
      this.url = data.url
      window.location.href = this.url
      } else {
        this.notFound = true
      }
    })
  }


}
