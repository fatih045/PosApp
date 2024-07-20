import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseplaceComponent } from './chooseplace.component';

describe('ChooseplaceComponent', () => {
  let component: ChooseplaceComponent;
  let fixture: ComponentFixture<ChooseplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseplaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
