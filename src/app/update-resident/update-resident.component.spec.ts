import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResidentComponent } from './update-resident.component';

describe('UpdateResidentComponent', () => {
  let component: UpdateResidentComponent;
  let fixture: ComponentFixture<UpdateResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateResidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
