import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopOutComponent } from './pop-out.component';

describe('PopOutComponent', () => {
  let component: PopOutComponent;
  let fixture: ComponentFixture<PopOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
