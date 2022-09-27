import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCentreComponent } from './game-centre.component';

describe('GameCentreComponent', () => {
  let component: GameCentreComponent;
  let fixture: ComponentFixture<GameCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameCentreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
