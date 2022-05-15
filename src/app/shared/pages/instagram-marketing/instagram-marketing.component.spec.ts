import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMarketingComponent } from './instagram-marketing.component';

describe('InstagramMarketingComponent', () => {
  let component: InstagramMarketingComponent;
  let fixture: ComponentFixture<InstagramMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
