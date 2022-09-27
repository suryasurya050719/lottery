import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletReivewComponent } from './wallet-review.component';

describe('WalletReviewComponent', () => {
  let component: WalletReivewComponent;
  let fixture: ComponentFixture<WalletReivewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletReivewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletReivewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
