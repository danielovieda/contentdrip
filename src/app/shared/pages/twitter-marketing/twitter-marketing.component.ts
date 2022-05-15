import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-twitter-marketing',
  templateUrl: './twitter-marketing.component.html',
  styleUrls: ['./twitter-marketing.component.scss']
})
export class TwitterMarketingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0,0)
  }

}
