import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLotteryComponent } from './create-lottery.component';

describe('CreateLotteryComponent', () => {
  let component: CreateLotteryComponent;
  let fixture: ComponentFixture<CreateLotteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLotteryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLotteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
