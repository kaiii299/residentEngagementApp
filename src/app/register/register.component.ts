import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { Authservice } from '../share/services/auth.service';
import { Constants } from '../constants';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';

function autocompleteStringValidator(validOptions: Array<string>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.indexOf(control.value) !== -1) {
      return null
    }
    return { 'invalidAutocompleteString': { value: control.value } }
  }
}
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

  message: string;
  email: string;
  userName = "";
  firstName: string;
  phoneNumber: string;
  password ="";
  repeatPassword: string;
  gender: string;
  blockNumberValue: any;
  roleValue: string;
  committeesValue: string;
  registeredDate: string;
  registeredTime: string;
  status = "Active";
  messageColor: string;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  ThirdFormGroup: FormGroup;

  roles = Constants.roles;
  committees = Constants.committees;
  blockNumbers = Constants.blkNum;

  myControl = new FormControl("",[autocompleteStringValidator(this.blockNumbers),Validators.required]);

  filterdBlockNumbers: Observable<string[]>;

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

    this.filterdBlockNumbers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
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
    if (this.firstFormGroup.invalid, this.secondFormGroup.invalid, this.myControl.invalid) {
      this.message = "There are still missing form fields"
    }
    else {
      this.registeredDate = new Date().toLocaleDateString();
      this.registeredTime = new Date().toLocaleTimeString();

      let newUser: any = {}
      newUser['email'] = this.email;
      newUser['userName'] = this.userName;
      newUser['firstName'] = this.firstName;
      newUser['phoneNumber'] = this.phoneNumber;
      newUser['gender'] = this.gender;
      newUser['role'] = this.roleValue;
      newUser['committee'] = this.committeesValue;
      newUser['blockNumber'] = this.blockNumberValue;
      newUser['regsitrationDate'] = this.registeredDate;
      newUser['registrationTime'] = this.registeredTime;
      newUser['status'] = this.status;

      console.log(newUser)
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
        this.message = "The Email address is in use"
        this.messageColor = "red"
        console.log(error)
      });
    }
  }

  _filter(value: string): string[] {
    if (value === '') {
      return this.blockNumbers.slice()
    }
    const filterValue = value.toLowerCase()
    return this.blockNumbers.filter(option => option.toLowerCase().includes(filterValue))
  }

}
