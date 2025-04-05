import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdGradeComponent } from './bd-grade.component';

describe('BdGradeComponent', () => {
  let component: BdGradeComponent;
  let fixture: ComponentFixture<BdGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BdGradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BdGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
