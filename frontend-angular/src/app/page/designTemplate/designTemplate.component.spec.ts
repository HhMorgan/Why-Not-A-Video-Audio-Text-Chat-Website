import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignTemplateComponent } from './designTemplate.component';

describe('DesignTemplateComponent', () => {
  let component: DesignTemplateComponent;
  let fixture: ComponentFixture<DesignTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
