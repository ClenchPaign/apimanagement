import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryOfQuestionsComponent } from './category-of-questions.component';

describe('CategoryOfQuestionsComponent', () => {
  let component: CategoryOfQuestionsComponent;
  let fixture: ComponentFixture<CategoryOfQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryOfQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryOfQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
