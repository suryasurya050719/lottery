import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinningReportComponent } from './winning-report.component';

describe('WinningReportComponent', () => {
  let component: WinningReportComponent;
  let fixture: ComponentFixture<WinningReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinningReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinningReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
