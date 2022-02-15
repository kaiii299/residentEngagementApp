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
import { userService } from './services/user.service';
import { confirmationDialog } from './confirmatonDialog';
import { Subject } from 'rxjs/internal/Subject';
import { subscribe } from 'functions/src/router/filter';

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
  uploadedData = Array();
  file: any;
  _filter: boolean;
  isUploaded: boolean = false;
  isUploadFile = false;
  noEmptyArray = Array();
  _role: any;
  data:any;
  email: any;
  password:any;
  userId: any;
  newUserData = Array();

  eventcbnewData = new Subject<any>();
  eventcbnewData$ = this.eventcbnewData.asObservable();

  constructor(
    public userService: userService,
    public dialogRef: MatDialogRef<uploadFileDialog>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: DialogData
  ) {
    dialogRef.disableClose = true;
    let excelSheet = localStorage.getItem('excelSheet');
    if (excelSheet) {
      this.uploadedData = JSON.parse(excelSheet);
    }
  }
  @ViewChild('default')
  public spreadsheetObj: SpreadsheetComponent;
  public openUrl =
    'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open';
  public saveUrl =
    'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save';

  ngOnInit(): void {
    this.data = this._data;
    this._role = this.data.role
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsName];
      this.uploadedData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log(this.uploadedData);
    };
    reader.readAsBinaryString(target.files[0]);
    this.isUploadFile = true;
  }

  upload() {
    this.uploadedData.shift();
    this.noEmptyArray = this.uploadedData.filter((o) => o != 0); // remove all the empty arrays // higer order function
    Swal.fire({
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText:'Create',
      title:`Do you want to create ${this.noEmptyArray.length} users?`
    }).then((res)=>{
      if(res.isConfirmed){
        this.noEmptyArray.forEach((doc) => {
          this.uploadedData.shift(); //removes the header aka first item
          JSON.stringify(doc);
      let userObject: any = {}
      if(this._role == "Admin") {
        userObject['requestStatus'] = "Accepted";
        userObject['status'] = "Active";
      }
      userObject['userName'] = doc[0];
      userObject['phoneNumber'] = doc[1];
      userObject['role'] = doc[2];
      userObject['committee'] = doc[3];
      userObject['blockNumber'] = doc[4];
      userObject['requestStatus'] = "Pending"
      userObject['status'] = "Inactive"
      this.email = userObject['email'] = doc[0] + '@gmail.com'
      this.password = userObject['password'] = doc[0] + 'password'
      // this.userService.register(this.email, this.password).then(res => {
        delete userObject.password; // remove password
        this.newUserData.push(userObject)
      //   console.log(userObject);
      // }).catch(error => {
      //   Swal.fire('The email address is not valid',`${error}`,'error')
      //   console.log(error)
      // });
      this.userService.createNewuserBatch(this.newUserData)
      this.dialogRef.close();
    })
  }
  })
}


  beforeSave(args: BeforeSaveEventArgs) {
    args.fileName = 'New Users Data';
  }

  filter() {
    if (this.uploadedData !== []) {
      this.spreadsheetObj.applyFilter();
    } else {
      Swal.fire('Error', 'cannot filter empty file', 'error');
    }
  }

  save() {
    Swal.fire({
      title: 'Do you wnat to save changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
      icon: 'question',
    }).then((res) => {
      if (res.isConfirmed) {
        this.spreadsheetObj.save();
      }
    });
  }

  close(): void {
    if (this.uploadedData !== []) {
      Swal.fire({
        title: 'DO you want to save before closing?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.spreadsheetObj.save();
          this.dialogRef.close();
        } else if (result.isDenied) {
          this.dialogRef.close();
        }
      });
    }
  }
}
