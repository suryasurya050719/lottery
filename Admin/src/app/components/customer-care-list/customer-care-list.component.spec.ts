import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCareListComponent } from './customer-care-list.component';

describe('CustomerCareListComponent', () => {
  let component: CustomerCareListComponent;
  let fixture: ComponentFixture<CustomerCareListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCareListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
