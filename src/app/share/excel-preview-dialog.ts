import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'excel-preview-dialog',
  templateUrl: './excel-preview-dialog.html',
})
export class excelPreviewDialog {
  deleteConfirmation = '';
  message = '';
  text: any;

  constructor(public dialogRef: MatDialogRef<excelPreviewDialog>, private dialog: MatDialog) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void { }

  close(): void {
    this.dialogRef.close();
  }

  confirmExport() {
  }
}

