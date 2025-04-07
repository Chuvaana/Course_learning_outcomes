import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAssessmentComponent } from './lesson-assessment.component';

describe('LessonAssessmentComponent', () => {
  let component: LessonAssessmentComponent;
  let fixture: ComponentFixture<LessonAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
