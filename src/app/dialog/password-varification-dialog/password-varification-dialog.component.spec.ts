import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordVarificationDialogComponent } from './password-varification-dialog.component';

describe('PasswordVarificationDialogComponent', () => {
  let component: PasswordVarificationDialogComponent;
  let fixture: ComponentFixture<PasswordVarificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordVarificationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordVarificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
