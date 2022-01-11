import { Component, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import * as XLSX from 'xlsx';
import { DialogData } from "../user-profile/user-profile.component";

@Component({
  selector: 'excel-preview-dialog',
  templateUrl: './excel-preview-dialog.html',
  styleUrls: ['./excel-preview-dialog.scss'],
})
export class excelPreviewDialog {
  deleteConfirmation = '';
  message = '';
  text: any;
  fileName = 'user-details.xlsx';
  userList: any;

  constructor(public dialogRef: MatDialogRef<excelPreviewDialog>,
     private dialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public _data: DialogData) {
    dialogRef.disableClose = true;
    var _userList = _data;
    this.userList = _userList
    console.log(this.userList)
  }

  ngOnInit(): void { }

  close(): void {
    this.dialogRef.close();
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

