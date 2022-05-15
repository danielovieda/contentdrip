import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  currentRoute: any;

  constructor(private router: Router, location: Location,
    private title: Title) {
    router.events.subscribe(val => {
      if (location.path() != "") {
        this.currentRoute = location.path();
      } else {
          this.currentRoute = "/home";
        }
    });


  }

  ngOnInit(): void {
    this.title.setTitle('Terms of Service and Privacy Policy - contentdrip.io')

    if (this.currentRoute === '/terms') {
      window.scrollTo(0,0)
    }
  }

}
