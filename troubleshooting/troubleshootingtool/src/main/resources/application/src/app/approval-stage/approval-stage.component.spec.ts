import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalStageComponent } from './approval-stage.component';

describe('ApprovalStageComponent', () => {
  let component: ApprovalStageComponent;
  let fixture: ComponentFixture<ApprovalStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
