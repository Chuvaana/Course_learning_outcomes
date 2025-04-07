import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonOverallAssessComponent } from './lesson-overall-assess.component';

describe('LessonOverallAssessComponent', () => {
  let component: LessonOverallAssessComponent;
  let fixture: ComponentFixture<LessonOverallAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonOverallAssessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonOverallAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
