import { Component, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { DialogData } from '../user-profile/user-profile.component';
import Swal from 'sweetalert2';
import {
  SpreadsheetComponent,
  BeforeSaveEventArgs,
} from '@syncfusion/ej2-angular-spreadsheet';

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
  userData = Array();
  dataArray = Array();
  data: any;
  isSaved = false;
  fileName = 'user-details.xlsx';
  _filter:boolean;
  constructor(
    public dialogRef: MatDialogRef<excelPreviewDialog>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) {
    dialogRef.disableClose = true;
    this.data = _data;
    this.dataArray = this.data;
    this.dataArray.forEach((doc) => {
      const data = doc;
      this.data = data;
      delete this.data.id;
      this.BufferArray.push(this.data);
    });
    this.BufferArray.forEach((doc) => {
      this.userData.push(doc.data);
    });
  }

  @ViewChild('default')
  public spreadsheetObj: SpreadsheetComponent;
  public openUrl =
    'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open';
  public saveUrl =
    'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save';


  ngOnInit(): void {
  }

  _close() {
      Swal.fire({
        title: 'Do you want to save changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.spreadsheetObj.save();
          Swal.fire({
            title: 'Changes saved',
            timer: 800,
            icon: 'success',
          });
          this.dialogRef.close();
        } else if (result.isDenied) {
          Swal.fire('Changes not saved','', 'error')
          this.dialogRef.close();
          this.isSaved = false
        }
      });
  }

  save(){
    this.spreadsheetObj.save();
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsName];
      this.userData = XLSX.utils.sheet_to_json(ws, { header: 1 });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  filter(){
    this.spreadsheetObj.applyFilter();
  }

  beforeSave(args: BeforeSaveEventArgs) {
  }

}
