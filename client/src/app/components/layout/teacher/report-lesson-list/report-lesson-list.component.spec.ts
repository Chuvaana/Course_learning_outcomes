import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLessonListComponent } from './report-lesson-list.component';

describe('ReportLessonListComponent', () => {
  let component: ReportLessonListComponent;
  let fixture: ComponentFixture<ReportLessonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLessonListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportLessonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
