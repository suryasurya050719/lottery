import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestApprovedComponent } from './my-request-approved.component';

describe('MyRequestApprovedComponent', () => {
  let component: MyRequestApprovedComponent;
  let fixture: ComponentFixture<MyRequestApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRequestApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRequestApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
