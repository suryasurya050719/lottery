import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestRejectedComponent } from './my-request-rejected.component';

describe('MyRequestRejectedComponent', () => {
  let component: MyRequestRejectedComponent;
  let fixture: ComponentFixture<MyRequestRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRequestRejectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRequestRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
