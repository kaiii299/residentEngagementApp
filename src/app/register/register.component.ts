import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { Authservice } from '../share/services/auth.service';


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

  strength = "0"
  strengthColor = ""
  strengthMessage = ""
  hide = true;
  disabled = true;

  message = "";
  email = ""
  displayName = "";
  firstName = "";
  phoneNumber = "";
  password = "";
  repeatPassword = "";
  gender = "";
  blockNumber = "";
  roleValue = "";
  committeesValue = "";
  registeredDate = "";
  registeredTime = "";
  status = "Active";
  messageColor = ""

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  ThirdFormGroup: FormGroup;

  roles: string[] = [
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


  constructor(private _formBuilder: FormBuilder, private authService: Authservice) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required,],
      usernameCtrl: ['', Validators.required,],
      firstNameCtrl: ['', Validators.required,],
      phoneNumberCtrl: ['', Validators.required,],
      passwordCtrl: ['', Validators.required,],
      repeatPasswordCtrl: ['', Validators.required,],
    });
    this.secondFormGroup = this._formBuilder.group({
      roleCtrl: ['', Validators.required],
    });
    this.ThirdFormGroup = this._formBuilder.group({
      blockCtrl: ['', Validators.required],
    });
  }

  getErrorMessage() {
    if (this.email == "") {
      this.message = "Email cannot be empty"
    }
    if (this.displayName == "") {
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
    else if (this.strengthColor == "red") {
      this.message = "Password too weak"
    }
    else {
      this.message = ""
      this.myStepper.next();
    }
  }

  checkPasswordStrength(event: Event) {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const passwordValue = (event.target as HTMLInputElement).lang;
    if (this.password.length == 0) {
      this.message = "";
      this.strengthMessage = "weak";

    }
    if (this.password.length < 8 && this.password.length > 0) {
      this.strengthMessage = "weak";
      this.strengthColor = "red";
      this.strength = "10";
    }
    if (this.password.length > 8) {
      this.strengthMessage = "Medium";
      this.strengthColor = "Organge";
      this.strength = "50";
    }
    if (this.password.length > 10 && this.password.match(format)) {
      this.strengthMessage = "Strong";
      this.strengthColor = "green";
      this.strength = "100";
    }
  }

  createNewuser() {
    if (this.firstFormGroup.invalid, this.secondFormGroup.invalid, this.ThirdFormGroup.invalid) {
      this.message = "There are still missing form fields"
    }
    else {
      this.registeredDate = new Date().toLocaleDateString();
      this.registeredTime = new Date().toLocaleTimeString();

      let newUser:any = {}
      newUser['Email'] = this.email;
      newUser['DisplayName']  = this.displayName;
      newUser['FirstName'] = this.firstName;
      newUser['PhoneNumber']  = this.phoneNumber;
      newUser['Gender'] = this.gender;
      newUser['Role'] = this.roleValue;
      newUser['Commmittee'] = this.committeesValue;
      newUser['BlockNumber'] = this.blockNumber;
      newUser['RegsitrationDate'] = this.registeredDate;
      newUser['RegistrationTime'] = this.registeredTime;
      newUser['Status'] = this.status;

      this.authService.register(this.email, this.password).then(res => {
        this.authService.createNewUser(newUser).then(res => {
          this.message = "User created successfully."
          this.messageColor = "Green"
        }).catch(error => {
          this.message = "Failed to create user. Try again"
          this.messageColor = "red"
          console.log(error)
        })
      }).catch(error => {
        this.message = "The Email address is already in use"
        this.messageColor = "red"
        console.log(error)
      });
    }
  }

}
