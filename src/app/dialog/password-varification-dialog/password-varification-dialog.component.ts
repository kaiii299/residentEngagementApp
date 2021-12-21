import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';

@Component({
  selector: 'app-password-varification-dialog',
  templateUrl: './password-varification-dialog.component.html',
  styleUrls: ['./password-varification-dialog.component.scss']
})
export class PasswordVarificationDialogComponent implements OnInit {
  passwordConfirmation =""
  message =""

  constructor(public dialogRef: MatDialogRef<UserProfileComponent>){
    dialogRef.disableClose = true;
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmPassword(){
    if(this.passwordConfirmation == "Password"){
      
      this.dialogRef.close()
    }
    else{
      this.message ="Wrong password.Try Again"
    }
  }
}
