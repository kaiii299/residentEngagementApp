import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { DialogData } from "../user-profile/user-profile.component";
import { SpreadsheetComponent, BeforeSaveEventArgs } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'app-excel-export-residents',
  templateUrl: './excel-export-residents.component.html',
  styleUrls: ['./excel-export-residents.component.scss']
})
export class ExcelExportResidentsComponent implements OnInit {

  data: any;
  dataArray = Array();
  tempArray = Array();
  residentData = Array();
  fileName = "resident-data.xlsx"

  constructor(public dialogRef: MatDialogRef<ExcelExportResidentsComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
      this.data = dialogData
      this.dataArray = this.data
      this.dataArray.forEach((doc)=>{
        const data = doc
        this.data = data
        delete this.data.id
        this.tempArray.push(this.data)
      })
      this.tempArray.forEach((doc)=>{
        this.residentData.push(doc.data)
      })
     }

  ngOnInit(): void {
  }

  beforeSave (args: BeforeSaveEventArgs) {
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

}
