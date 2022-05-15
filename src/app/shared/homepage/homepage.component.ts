import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { userService } from 'src/app/service/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private titleService: Title,
    public userService: userService,
    private meta: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('Post like an Influencer - contentdrip.io')
    this.meta.removeTag("name='description'")
    this.meta.addTags([
      { name: 'keywords', content:'Twitter Marketing, Instagram Marketing, Automated Posting'},
      { name: 'robots', content: 'index, follow'},
      { name: 'author', content: 'contentdrip.io' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: '2021-09-20', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' }
    ], true)

    this.meta.updateTag({name: 'description', content: 'this is the homepage'}, "name='description'")

    this.meta.updateTag({name: 'description', content: 'this is the homepage 2'}, "name='description'")

    this.userService.init()

    console.log(this.meta.getTags("name='robots'"))
    console.log('tags?')
  }

}
