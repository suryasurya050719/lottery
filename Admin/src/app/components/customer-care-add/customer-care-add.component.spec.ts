import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCareAddComponent } from './customer-care-add.component';

describe('CustomerCareAddComponent', () => {
  let component: CustomerCareAddComponent;
  let fixture: ComponentFixture<CustomerCareAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCareAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCareAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
