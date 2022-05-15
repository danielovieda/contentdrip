import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterMarketingComponent } from './twitter-marketing.component';

describe('TwitterMarketingComponent', () => {
  let component: TwitterMarketingComponent;
  let fixture: ComponentFixture<TwitterMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
