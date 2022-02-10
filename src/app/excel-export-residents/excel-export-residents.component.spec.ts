import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelExportResidentsComponent } from './excel-export-residents.component';

describe('ExcelExportResidentsComponent', () => {
  let component: ExcelExportResidentsComponent;
  let fixture: ComponentFixture<ExcelExportResidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelExportResidentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelExportResidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
