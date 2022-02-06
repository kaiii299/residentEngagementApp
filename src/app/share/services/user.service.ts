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


@Injectable({
  providedIn: 'root'
})
export class userService{

  baseUrl = Constants.baseURL;

  eventcbUserData = new Subject<any>();
  eventcbUserData$ = this.eventcbUserData.asObservable();

  eventcbFilterData = new Subject<Object>();
  eventcbFilterData$ = this.eventcbFilterData.asObservable();

  newUserId: any | undefined;
  currentLogedInUserId: any;

  userNameExist = false;

  constructor(
    private authService: Authservice,
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  getUserbyFilter(category: any, keyword: any) {
    this.http
      .get(this.baseUrl + '/search/' + category + '/' + keyword)
      .toPromise()
      .then((data) => {
        console.log(data);
        this.eventcbFilterData.next(data);
      });
  }

  // getUserbyFilter(committee: any, role: any, status: any) {
  //   this.http
  //     .get(this.baseUrl + '/search/' + committee + '/' + role + '/' + status)
  //     .toPromise()
  //     .then((data) => {
  //       console.log(data);
  //       this.eventcbFilterData.next(data);
  //     });
  // }
  
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

  createNewUserFromRequest(_userData: any, uid: any){
    return this.db.collection('Users').doc(uid).set(_userData);
    }

  getUserById(id: any) {
    return this.http.get(this.baseUrl + '/getUsers/' + id) as Observable<any>;
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
