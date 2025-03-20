import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosComponent } from './clos.component';

describe('ClosComponent', () => {
  let component: ClosComponent;
  let fixture: ComponentFixture<ClosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
