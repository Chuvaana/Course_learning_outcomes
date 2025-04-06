import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonInfoComponent } from './lesson-info.component';

describe('LessonInfoComponent', () => {
  let component: LessonInfoComponent;
  let fixture: ComponentFixture<LessonInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
