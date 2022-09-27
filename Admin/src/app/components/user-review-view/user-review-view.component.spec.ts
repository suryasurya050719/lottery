import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewViewComponent } from './user-review-view.component';

describe('UserReviewViewComponent', () => {
  let component: UserReviewViewComponent;
  let fixture: ComponentFixture<UserReviewViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReviewViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReviewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
