import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionChatMobileComponent } from './session.component';

describe('LandingComponent', () => {
  let component: SessionChatMobileComponent;
  let fixture: ComponentFixture<SessionChatMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionChatMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionChatMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
