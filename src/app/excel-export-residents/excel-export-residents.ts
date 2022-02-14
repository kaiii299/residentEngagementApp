import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { SpreadsheetComponent, BeforeSaveEventArgs } from '@syncfusion/ej2-angular-spreadsheet';
import { DialogDataResident } from '../resident-info/resident-info.component';

@Component({
  selector: 'excel-export-residents',
  templateUrl: './excel-export-residents.html',
  styleUrls: ['./excel-export-residents.scss']
})
export class ExcelExportResidents{
  data: any;
  dataArray = Array();
  tempArray = Array();
  residentData = Array();
  fileName = "resident-data.xlsx"

  constructor(public dialogRef: MatDialogRef<ExcelExportResidents>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data:DialogDataResident) {
      dialogRef.disableClose = true;
      this.data = _data;
      this.dataArray = this.data;
      this.dataArray.forEach((doc)=>{
        const data = doc
        this.data = data
        delete this.data.id
        console.log("this.data");
        console.log(this.data);
        this.tempArray.push(this.data)
      })
      this.tempArray.forEach((doc)=>{
        this.residentData.push(doc.data)
      })
     }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
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
