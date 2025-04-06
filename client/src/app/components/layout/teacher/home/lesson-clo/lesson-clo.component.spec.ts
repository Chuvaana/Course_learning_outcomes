import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCloComponent } from './lesson-clo.component';

describe('LessonCloComponent', () => {
  let component: LessonCloComponent;
  let fixture: ComponentFixture<LessonCloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonCloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonCloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
