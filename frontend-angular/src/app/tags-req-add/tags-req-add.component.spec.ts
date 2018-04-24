import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsReqAddComponent } from './tags-req-add.component';

describe('TagsReqAddComponent', () => {
  let component: TagsReqAddComponent;
  let fixture: ComponentFixture<TagsReqAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsReqAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsReqAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
