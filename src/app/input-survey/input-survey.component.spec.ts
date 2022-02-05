import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSurveyComponent } from './input-survey.component';

describe('InputSurveyComponent', () => {
  let component: InputSurveyComponent;
  let fixture: ComponentFixture<InputSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
