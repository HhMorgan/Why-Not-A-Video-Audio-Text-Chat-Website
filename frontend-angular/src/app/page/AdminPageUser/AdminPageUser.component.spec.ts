import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageUserComponent } from './AdminPageUser.component';

describe('AdminViewUsersComponent', () => {
  let component: AdminPageUserComponent;
  let fixture: ComponentFixture<AdminPageUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPageUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
