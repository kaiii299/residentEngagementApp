import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  StepperSelectionEvent,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { Authservice } from '../share/services/auth.service';
import { Constants } from '../constants';
import { Observable } from 'rxjs/internal/Observable';
import { RequestNewUserService } from '../share/services/request-new-user.service';
import { userService } from '../share/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NavserviceService } from '../share/navservice.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class RequestComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;

  strength = '0';
  strengthColor = '';
  strengthMessage = '';
  hide = true;
  disabled = true;

  userDataArray = Array();
  userNameArray = Array();
  userEmailArray = Array();
  isExistUserName: any;
  isExistEmail: any;
  message: string;
  email = '';
  userName = '';
  firstName: string;
  phoneNumber: string;
  password = '';
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

  eventcbIsExistUserName = new EventEmitter<any>();
  eventcbIsExistUserName$ = this.eventcbIsExistUserName.asObservable();

  eventcbIsExistEmail = new EventEmitter<any>();
  eventcbIsExistEmail$ = this.eventcbIsExistEmail.asObservable();

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  ThirdFormGroup: FormGroup;

  roles = Constants.roles;
  committees = Constants.committees;
  blockNumbers = Constants.blkNum;

  myControl = new FormControl('', Validators.required);

  filterdBlockNumbers: Observable<string[]>;

  constructor(
    private router: Router,
    private navService: NavserviceService,
    private userService: userService,
    private requestNewUserService: RequestNewUserService,
    private _formBuilder: FormBuilder,
    private authService: Authservice
  ) {}

  ngOnInit(): void {
    this.navService.eventcbTitle.next("Request page");

    this.firstFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      usernameCtrl: ['', Validators.required],
      firstNameCtrl: ['', Validators.required],
      phoneNumberCtrl: ['', Validators.required],
      passwordCtrl: ['', Validators.required],
      repeatPasswordCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      roleCtrl: ['', Validators.required],
    });
  }

  async checkUserExist() {
    if (this.userName){
      this.userService.checkUserName(this.userName).subscribe((res) => {
        res.length !==0? this.isExistUserName = true : this.isExistUserName = false;
      });
    }
    else if (this.email.trim()){
      this.userService.checkEmailExist(this.email).subscribe((res: any) => {
        res.length !==0? this.isExistEmail = true : this.isExistEmail = false;
      });
    }
    else if (this.email == '' || this.userName == ''){
      this.isExistEmail = false;
      this.isExistUserName = false;
    }
  }

  getErrorMessage() {
    if (this.email == '') {
      this.message = 'Email cannot be empty';
    }
    if (this.userName == '') {
      this.message = 'Username cannot be empty';
    }
    if (this.firstName == '') {
      this.message = 'First name cannot be empty';
    }
    if (this.password == '') {
      this.message = 'Password cannot be empty';
    }
    if (this.phoneNumber.length < 8) {
      this.message = 'Invalid Phone Number';
    } else if (this.isExistUserName == true) {
      this.message = 'Username is in use';
    } else if (this.strengthColor == 'red') {
      Swal.fire('Password too weak', 'Minium 8 character. Include uppercase, numbers and special characters', 'warning');
    } else if (this.password !== this.repeatPassword) {
      Swal.fire('Password does not match', '', 'error');
    } else {
      this.message = '';
      this.myStepper.next();
    }
  }

  checkPasswordStrength(event: Event) {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const passwordValue = (event.target as HTMLInputElement).lang;
    if (this.password.length == 0) {
      this.message = '';
      this.strengthMessage = 'weak';
    }
    if (this.password.length < 8 && this.password.length > 0) {
      this.strengthMessage = 'weak';
      this.strengthColor = 'red';
      this.strength = '10';
    }
    if (this.password.length > 8) {
      this.strengthMessage = 'Medium';
      this.strengthColor = 'Organge';
      this.strength = '50';
    }
    if (this.password.length > 10 && this.password.match(format)) {
      this.strengthMessage = 'Strong';
      this.strengthColor = 'green';
      this.strength = '100';
    }
  }

  createNewRequestuser() {
    if (
      (this.firstFormGroup.invalid,
      this.secondFormGroup.invalid,
      !this.blockNumberValue)
    ) {
      Swal.fire('There are still missing fields', '', 'error');
    } else {
      this.registeredDate = new Date().toLocaleDateString();
      this.registeredTime = new Date().toLocaleTimeString();

      const newUser: any = {};
      newUser.email = this.email.trim();
      newUser.userName = this.userName;
      newUser.firstName = this.firstName;
      newUser.phoneNumber = this.phoneNumber;
      newUser.gender = this.gender;
      newUser.role = this.roleValue;
      newUser.committee = this.committeesValue;
      newUser.blockNumber = this.blockNumberValue;
      newUser.registrationDate = this.registeredDate;
      newUser.registrationTime = this.registeredTime;
      newUser.status = 'Pending';
      newUser.requestStatus = 'Pending';
      newUser.isRequested = true;

      this.userService.register(this.email.trim(), this.password).then(res => {
        this.userService.createNewUser(newUser).then(res => {
          Swal.fire('Request sent!', 'Reqest is now pending', 'success');
          this.router.navigate(['/']);
        }).catch(error => {
          Swal.fire('Error sending Email', '', 'error');
          // console.log(error)
        });
      }).catch(error => {
        Swal.fire('The email address is not valid', `${error}`, 'error');
        // console.log(error)
      });
    }
  }

  onChange(event: any) {
    this.committeesValue = event;
    // console.log(this.committeesValue);
    this.availableBlocks = this.zonesInfo.get(this.committeesValue);
    // console.log(this.zonesInfo.get(this.committeesValue));
  }

  back() {
    this.authService.goback();
  }
}
