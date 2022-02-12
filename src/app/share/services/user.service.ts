import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Constants } from 'src/app/constants';
import { Authservice } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class userService {
  baseUrl = Constants.baseURL;

  eventcbUserData = new Subject<any>();
  eventcbUserData$ = this.eventcbUserData.asObservable();

  eventcbPendingData = new Subject<Object>();
  eventcbFilterData$ = this.eventcbPendingData.asObservable();

  newUserId: any | undefined | null;
  currentLogedInUserId: any;

  userNameExist = false;

  currentCommittee : any | null;
  currentRole: any;

  normalRNMembers = "Normal RN Members"

  constructor(
    private authService: Authservice,
  private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.authService.eventcbCommittee$.subscribe((committee)=>{
      this.currentCommittee = committee
    })
    const _currentcommittee = localStorage.getItem('committee');
    if(_currentcommittee){
      this.currentCommittee = this.authService.decryptData(_currentcommittee);
    }

    this.authService.eventcbRole$.subscribe((role)=>{
      this.currentRole = role
    })
    const _currentRole = localStorage.getItem('role');
    if(_currentRole){
      this.currentRole = this.authService.decryptData(_currentRole);
    }
  }

  async getAllUsers() {
    if(this.currentRole !== this.normalRNMembers){
      return await this.http
      .get(this.baseUrl + '/getAllUsers')
      .toPromise()
      .then((data) => {
        this.eventcbUserData.next(data);
      })
    }else{
      return await this.http
      .post(this.baseUrl + '/getAllUsersNormalRn', {'committee': this.currentCommittee})
      .toPromise()
      .then((data) => {
        this.eventcbUserData.next(data);
      })
    }
  }

  async searchUserData(keyword: any, _committee: any) {
    if(this.currentRole !== this.normalRNMembers){
      return await this.http
      .post(this.baseUrl + '/searchUserByName', {keyword: keyword})
      .toPromise()
      .then((data) => {
        this.eventcbUserData.next(data);
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err) {
            console.log(err);
            Swal.fire('ERROR', `${err.message}`, 'error');
          }
        }
      });
    }else{
       _committee = this.currentCommittee;
      return await this.http
      .post(this.baseUrl + '/searchUserByNameNormalRn', {keyword: keyword,committee: _committee})
      .toPromise()
      .then((data) => {
        this.eventcbUserData.next(data);
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err) {
            console.log(err);
            Swal.fire('ERROR', `${err.message}`, 'error');
          }
        }
      });

    }
  }

  async filterUser(body:any){
    if(this.currentRole = this.normalRNMembers){
       return await this.http.post(this.baseUrl + '/filter', body).toPromise().then((data)=>{
      this.eventcbUserData.next(data);
    }).catch((err)=>{
      Swal.fire('ERROR',`${err.message}`,'error')
    });

    }
    return await this.http.post(this.baseUrl + '/filter', body).toPromise().then((data)=>{
      this.eventcbUserData.next(data);
    }).catch((err)=>{
      Swal.fire('ERROR',`${err.message}`,'error')
    });
  }

  async register(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userinfo) => {
        this.newUserId = userinfo.user?.uid;
      });
  }

  createNewUser(_userData: any) {
    return this.db.collection('Users').doc(this.newUserId).set(_userData);
  }

  createNewUserFromRequest(_userData: any, uid: any) {
    return this.db.collection('Users').doc(uid).set(_userData);
  }


  getUserById(id: any) {
    return this.http.get(this.baseUrl + '/getUser/' + id) as Observable<any>;
  }

  async updateUserData(uid: any, userData: any) {
    const data = await this.http
      .put(this.baseUrl + '/update/' + uid, userData, { responseType: 'text' })
      .toPromise();
    console.log(data);
  }

  async forgetPassword(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).then((res) => {});
  }



  checkUserName(userName: any){
    var residentRef = this.db.collection<any>('Users', tempRes => {
      return tempRes
        .where('userName', '==', userName)
    });
    return residentRef.valueChanges();
  }

  checkPendingUsers(){
    var residentRef = this.db.collection<any>('Users', tempRes => {
      return tempRes
        .where('requestStatus', '==', 'Pending')
    });
    return residentRef.valueChanges();
  }

   checkEmailExist(email: any){
    var residentRef = this.db.collection<any>('Users', tempRes => {
      return tempRes
        .where('email', '==', email)
    });
    return residentRef.valueChanges();
  }



  deleteUserbyId(uid: any) {
    console.log(uid);
    this.http
      .delete(this.baseUrl + '/deleteUser/' + uid)
      .toPromise()
      .then(() => {
        console.log('User DELETED');
      })
      .catch((err) => {
        console.log('There is an error', err);
      });
    if (uid != this.currentLogedInUserId) {
      this.authService.goback;
    } else {
      localStorage.clear();
    }
  }
}
