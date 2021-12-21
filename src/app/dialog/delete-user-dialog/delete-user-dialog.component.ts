import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent implements OnInit {
deleteConfirmation = ''
message =""
text: any

constructor(public dialogRef: MatDialogRef<DeleteUserDialogComponent>){
dialogRef.disableClose = true;
}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(){
    if(this.deleteConfirmation == "DELETE"){
      alert("account deleted")
      this.dialogRef.close()
    }
    else{
      this.message = "Try again"
      this.deleteConfirmation =''
    }
  }

}
