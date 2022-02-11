import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { SpreadsheetComponent, BeforeSaveEventArgs } from '@syncfusion/ej2-angular-spreadsheet';
import { DialogDataResident } from '../resident-info/resident-info.component';

@Component({
    selector: 'excel-import-residents',
    templateUrl: './excel-import-residents.html',
    styleUrls: ['./excel-import-residents.scss']
})
export class ExcelImportResidents{

    constructor(){
        
    }
}