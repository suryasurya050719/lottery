import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryHomeComponent } from './lottery-home.component';

describe('LotteryHomeComponent', () => {
  let component: LotteryHomeComponent;
  let fixture: ComponentFixture<LotteryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotteryHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotteryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
