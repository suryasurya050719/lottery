import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPriceDetailsComponent } from './ticket-price-details.component';

describe('TicketPriceDetailsComponent', () => {
  let component: TicketPriceDetailsComponent;
  let fixture: ComponentFixture<TicketPriceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPriceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPriceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
