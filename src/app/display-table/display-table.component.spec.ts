import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTableComponent } from './display-table.component';

describe('DisplayTableComponent', () => {
  let component: DisplayTableComponent;
  let fixture: ComponentFixture<DisplayTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
