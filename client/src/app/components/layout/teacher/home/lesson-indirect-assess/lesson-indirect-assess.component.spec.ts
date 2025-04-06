import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonIndirectAssessComponent } from './lesson-indirect-assess.component';

describe('LessonIndirectAssessComponent', () => {
  let component: LessonIndirectAssessComponent;
  let fixture: ComponentFixture<LessonIndirectAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonIndirectAssessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonIndirectAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
