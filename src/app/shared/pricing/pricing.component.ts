import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { userService } from 'src/app/service/user.service';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  constructor(private title: Title, public userService: userService) {}

  ngOnInit() {
    this.title.setTitle('Affordable options to schedule social media posts - contentdrip.io')
  }


}
