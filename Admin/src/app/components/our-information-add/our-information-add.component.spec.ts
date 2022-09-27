import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurInformationAddComponent } from './our-information-add.component';

describe('OurInformationAddComponent', () => {
  let component: OurInformationAddComponent;
  let fixture: ComponentFixture<OurInformationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurInformationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurInformationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
