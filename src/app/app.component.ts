import { Component, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  currentRoute: any;

  constructor(private router: Router, location: Location,
    ) {
    router.events.subscribe(val => {
      if (location.path() != "") {
        this.currentRoute = location.path();
        //console.log(this.currentRoute)
      } else {
          this.currentRoute = "home";
        }
    });

  }

}
