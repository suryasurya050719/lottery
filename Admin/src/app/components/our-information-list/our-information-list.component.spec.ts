import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurInformationListComponent } from './our-information-list.component';

describe('OurInformationListComponent', () => {
  let component: OurInformationListComponent;
  let fixture: ComponentFixture<OurInformationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurInformationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurInformationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
