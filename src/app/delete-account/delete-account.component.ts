import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData{
  DELETE: string
}

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {
  deleteConfirmation =""
  message =""
  DELETE =""
  constructor(public dialog: MatDialog ,public dialogRef: MatDialogRef<DeleteAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteAccountComponent, {
      width: '250px',
      data: {delete: this.DELETE},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.DELETE = result;
    });
  }

  cancle(){
    this.dialogRef.close();
  }
}

