import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQaEntryComponent } from './add-qa-entry.component';

describe('AddQaEntryComponent', () => {
  let component: AddQaEntryComponent;
  let fixture: ComponentFixture<AddQaEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddQaEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQaEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
