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
  data = Array();
  file: any;
  _filter: boolean ;
  isSaved:boolean = false;

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
  @ViewChild('default')
  public spreadsheetObj: SpreadsheetComponent;
  public openUrl =
    'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open';
  public saveUrl =
    'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save';
    created() {
      this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:F1');
      this.spreadsheetObj.cellFormat({ fontWeight: 'bold' }, 'E31:F31');
      this.spreadsheetObj.cellFormat({ textAlign: 'left' }, 'E31');
      if(this._filter == true){
        alert(this._filter);
        this.spreadsheetObj.sort({ sortDescriptors: { field: 'B' } }, 'A2:G51').then(() => {
          // Filtered D(Department  field) column with value 'Services'
          this.spreadsheetObj.applyFilter([{ field: 'C', operator: 'equal', value: '' }], 'A1:G51');
        });
      }
    }

  ngOnInit(): void {}

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsName];
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  beforeSave(args: BeforeSaveEventArgs) {}

  filter(){

  }

  save(){
    Swal.fire({
      title: 'Save data?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((res)=>{
      if(res.isConfirmed){
        this.isSaved = true;
        Swal.fire('Success','changes saved','success');
        localStorage.setItem('excelSheet', JSON.stringify(this.data));
      }else{
        localStorage.clear();
        Swal.fire('','Changes not saved','error');
      }
    })
  }

  close(): void {
    if (this.data != this.data && this.isSaved == false) {
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
}
