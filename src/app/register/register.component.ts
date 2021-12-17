import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class RegisterComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;


  hide = true;
  disabled = true;

  message = "";
  email = ""
  userName = "";
  firstName = "";
  password = "";
  repeatPassword = "";
  gender = "";
  blockNumber = "";
  userTypeValue ="";
  committeesValue = "";
  dateTime =""
  status ="" //active / sudpended

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  ThirdFormGroup: FormGroup;

  userTypes: string[] = [
    "Admin",
    "CC staff",
    "Key Ccc",
    "RN Manager",
    "Key RN Manager",
    "Normal RN Manager"
  ]

  committees: string[] = [
    "Taman Jurong Zone A RN",
    "Taman Jurong Zone B RC",
    "Taman Jurong Zone C RN",
    "Taman Jurong Zone D RC",
    "Taman Jurong Zone E RC",
    "Taman Jurong Zone F RC",
    "Taman Jurong Zone G RN",
    "9 @ Yuan Ching NC",
    "Caspian NC",
    "Lakefront Residences NC",
    "Lakeholmz Condo NC",
    "Lakelife RN",
    "Lakepoint Condo NC",
    "Lakeside Grove NC",
  ]


  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required,],
      usernameCtrl: ['', Validators.required,],
      firstNameCtrl: ['', Validators.required,],
      passwordCtrl: ['', Validators.required,],
      repeatPasswordCtrl: ['', Validators.required,],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.ThirdFormGroup = this._formBuilder.group({
      blockCtrl: ['', Validators.required],
    });
  }


  getErrorMessage() {
    if (this.email == "") {
      this.message = "Email cannot be empty"
    }
    if (this.userName == "") {
      this.message = "Username cannot be empty"
    }
    if (this.firstName == "") {
      this.message = "First name cannot be empty"
    }
    if (this.password == "") {
      this.message = "Password cannot be empty"
    }
    if (this.password != this.repeatPassword) {
      this.message = "Password does not match"
    }
    else {
      this.myStepper.next();
    }
  }

  register(){
    if (this.blockNumber == "") {
      this.message = "Block number cannot be empty"
    }
    if(this.firstFormGroup.invalid, this.secondFormGroup.invalid, this.ThirdFormGroup.invalid){
      this.message = "There are still missing form fields"
    }
    else{
      alert("done done done")
      console.log(this.email, this.userName, this.firstName, this.password, this.repeatPassword,this.committeesValue,this.userTypeValue,this.gender, this.blockNumber)
    }
  }


}
