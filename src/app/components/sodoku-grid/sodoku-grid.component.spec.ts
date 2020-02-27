import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SodokuGridComponent } from './sodoku-grid.component';

describe('SodokuGridComponent', () => {
  let component: SodokuGridComponent;
  let fixture: ComponentFixture<SodokuGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SodokuGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SodokuGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
