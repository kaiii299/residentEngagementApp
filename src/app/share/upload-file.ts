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
  selector: 'upload-file-dialog',
  templateUrl: './upload-file-dialog.html',
  styleUrls: ['./upload-file.scss'],
})
export class uploadFileDialog {
  deleteConfirmation = '';
  message = '';
  text: any;
  fileData: [][];
  fileName = 'user-details.xlsx';
  data: Object[] = [];
  file: any;

  constructor(
    public dialogRef: MatDialogRef<uploadFileDialog>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) {
    dialogRef.disableClose = true;
    let excelSheet = localStorage.getItem('excelSheet')
    if(excelSheet){
      this.data = JSON.parse(excelSheet)
    }
  }

  ngOnInit(): void {}

  @ViewChild('default')
    public spreadsheetObj: SpreadsheetComponent;
    public openUrl = 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open';
    public saveUrl = 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save';
    created() {
        this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:F1');
        this.spreadsheetObj.cellFormat({ fontWeight: 'bold' }, 'E31:F31');
        this.spreadsheetObj.cellFormat({ textAlign: 'right' }, 'E31');
        this.spreadsheetObj.numberFormat('$#,##0.00', 'F2:F31');
    }

    beforeSave (args: BeforeSaveEventArgs) {
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsName];
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  close(): void {
    if (this.data) {
      Swal.fire({
        title: 'Save data?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('excelSheet', JSON.stringify(this.data));
          Swal.fire({
            title: 'Changes saved',
            timer: 800,
            icon: 'success',
          });
        } else if (result.isDenied) {
          localStorage.removeItem('excelSheet')
        }
      });
    }
    this.dialogRef.close();
  }

  // exportexcel(): void {
  //   /* pass here the table id */
  //   let element = document.getElementById('excel-table');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.fileName);
  // }
}
