import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-howitworks',
  templateUrl: './howitworks.component.html',
  styleUrls: ['./howitworks.component.scss']
})
export class HowitworksComponent implements OnInit {

  constructor(private titleService: Title,
    private meta: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('How it works - contentdrip.io')
    //this.meta.updateTag({name: 'description', content: 'how it works'}, "name='description'")

    this.meta.addTag({name: 'description', content: "adding a tag description forced"}, true)
  }

}
