import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { Authservice } from '../share/services/auth.service';
import { Constants } from '../constants';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { userService } from '../share/services/user.service';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';

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
  isExist: any;
  userData: any;
  userDataArray = Array();
  userNameArray = Array();
  email: string;
  userName = "";
  firstName: string;
  phoneNumber: string;
  password = "";
  repeatPassword: string;
  gender: string;
  blockNumberValue: any;
  roleValue: string;
  committeesValue: string;
  zonesInfo = Constants.zones;
  committeeArrays = Array.from(this.zonesInfo.keys());
  selectedZone: string;
  availableBlocks: any = [];
  registeredDate: string;
  registeredTime: string;
  messageColor: string;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  ThirdFormGroup: FormGroup;

  roles = Constants.roles;
  committees = Constants.committees;
  blockNumbers = Constants.blkNum;

  myControl = new FormControl("", Validators.required);

  filterdBlockNumbers: Observable<string[]>;

  eventcbIsExist = new EventEmitter<any>();
  eventcbIsExist$ = this.eventcbIsExist.asObservable();

  constructor(private userService: userService, private _formBuilder: FormBuilder, private authService: Authservice) { }

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
  }


  checkUserName() {
      this.authService.getAllUsers();
      this.authService.eventcbUserData$.subscribe((data) => {
        this.userDataArray = data;
        this.userDataArray.forEach((_userData) => {
          this.userNameArray.push(_userData.data.userName);
        });
        if (this.userNameArray.includes(this.userName)) {
          this.isExist = true;
          this.eventcbIsExist.emit(this.isExist);
        }
        else {
          this.isExist = false;
          this.eventcbIsExist.emit(this.isExist);

        }
        // console.log(this.userName);
        const emptyArr = Array()
        this.userNameArray = emptyArr;
      })
    }

  getErrorMessage() {
    if (this.email == "") {
      this.message = "Email cannot be empty";
    }
    if (this.userName == "") {
      this.message = "Username cannot be empty";
    }
    if (this.firstName == "") {
      this.message = "First name cannot be empty";
    }
    if (this.password == "") {
      this.message = "Password cannot be empty";
    }
    if (this.phoneNumber.length < 8) {
      this.message = "Invalid Phone Number";
    }
    else if (this.isExist == true) {
      this.message = "Username is in use";
    }
    else if (this.strengthColor == "red") {
      this.message = "Password too weak.";
    }
    else if (this.password !== this.repeatPassword) {
      this.message = "Password does not match";
    }
    else {
      this.message = "";
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
    if (this.firstFormGroup.invalid, this.secondFormGroup.invalid, !this.blockNumberValue) {
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
      newUser['registrationDate'] = this.registeredDate;
      newUser['registrationTime'] = this.registeredTime;
      newUser['status'] = "Active";
      newUser['requestStatus'] = "Accepted";
      newUser['isRequested'] = false;

      console.log(newUser)
      this.userService.register(this.email, this.password).then(res => {
        this.userService.createNewUser(newUser).then(res => {
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

  onChange(event: any) {
    this.committeesValue = event;
    console.log(this.committeesValue);
    this.availableBlocks = this.zonesInfo.get(this.committeesValue);
    console.log(this.zonesInfo.get(this.committeesValue));
  }

  back() {
    this.authService.goback();
  }

}
