import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../user-profile/user-profile.component';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmationDialog.html',
})
export class confirmationDialog {
  deleteConfirmation = '';
  message: any;
  text: any;
  data: any;
  reload: boolean;

  constructor(
    public dialogRef: MatDialogRef<confirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.data = this.dialogData;
    this.message = this.data.message;
    this.reload = this.data.reload;
  }

  close() {
    this.dialogRef.close();
    if (this.reload == true) {
      setTimeout(() => {
        location.reload(), 80000;
      });
    }
  }
}
