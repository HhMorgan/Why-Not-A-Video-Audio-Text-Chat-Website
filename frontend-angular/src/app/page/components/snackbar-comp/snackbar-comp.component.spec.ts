import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarCompComponent } from './snackbar-comp.component';

describe('SnackbarCompComponent', () => {
  let component: SnackbarCompComponent;
  let fixture: ComponentFixture<SnackbarCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
