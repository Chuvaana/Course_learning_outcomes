import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonDirectIndirectComponent } from './lesson-direct-indirect.component';

describe('LessonDirectIndirectComponent', () => {
  let component: LessonDirectIndirectComponent;
  let fixture: ComponentFixture<LessonDirectIndirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonDirectIndirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonDirectIndirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
