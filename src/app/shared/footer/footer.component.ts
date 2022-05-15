import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../homepage/homepage.component.css']
})
export class FooterComponent implements OnInit {
  currentRoute: any;
  pages: any;




  constructor(private router: Router, private location: Location) {
    router.events.subscribe(val => {
      if (location.path() != "") {
        this.currentRoute = location.path();
      } else {
          this.currentRoute = "/home";
        }
    });

    this.pages = ["/home", "/pricing", "/terms", "/logout", "/privacy", "/refunds"];
  }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

}
