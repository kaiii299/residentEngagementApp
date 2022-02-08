import { Component, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { DialogData } from '../user-profile/user-profile.component';
import Swal from 'sweetalert2';
import { SpreadsheetComponent, BeforeSaveEventArgs } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'excel-preview-dialog',
  templateUrl: './excel-preview-dialog.html',
  styleUrls: ['./excel-preview-dialog.scss'],
})
export class excelPreviewDialog {
  deleteConfirmation = '';
  message = '';
  text: any;
  BufferArray = Array();
  userData = Array() ;
  dataArray = Array();
  data: any;
  fileName = 'user-details.xlsx';

  constructor(public dialogRef: MatDialogRef<excelPreviewDialog>,
     private dialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public _data: DialogData) {
    dialogRef.disableClose = true;
    this.data = _data
    this.dataArray = this.data
    this.dataArray.forEach((doc)=>{
      const data = doc
      this.data = data
      delete this.data.id
      this.BufferArray.push(this.data)
    })
    this.BufferArray.forEach((doc)=>{
      this.userData.push(doc.data)
    })
  }

  ngOnInit(): void { }

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

