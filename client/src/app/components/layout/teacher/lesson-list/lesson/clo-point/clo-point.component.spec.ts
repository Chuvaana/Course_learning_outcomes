import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloPointComponent } from './clo-point.component';

describe('CloPointComponent', () => {
  let component: CloPointComponent;
  let fixture: ComponentFixture<CloPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloPointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
