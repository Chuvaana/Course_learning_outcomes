import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPollAnalysisComponent } from './lesson-poll-analysis.component';

describe('LessonPollAnalysisComponent', () => {
  let component: LessonPollAnalysisComponent;
  let fixture: ComponentFixture<LessonPollAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonPollAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPollAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
