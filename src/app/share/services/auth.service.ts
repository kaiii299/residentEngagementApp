import { Injectable, Input } from "@angular/core";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, JsonpClientBackend } from "@angular/common/http";
import { map, retry, switchMap, take } from 'rxjs/operators'
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { userDataInfo } from "./Users"


export interface userInterface{
Email:string
Display:string
FirstName:string
PhoneNumber:string
Gender:string
Role:string
Committee:string
BlockNumber:string
RegisteredTime:string
RegisteredDate:string
Status:string
}

@Injectable()
export class Authservice {
  userInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  authState: any = null;
  currentLogedInUserId: any;
  currentLogedInUserName: string;
  currentUserObject : any;
  newUserId: any;
  storageSub = new Subject<string>();
  userSubscription : any

  constructor(private http: HttpClient, private firebaseAuth: AngularFireAuth, private db: AngularFirestore) {
    this.loadUserInfo();
    this.getSignInUser();
  }

  watchStroage(){
    return this.storageSub.asObservable();
  }

  async signIn(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
      var userId = JSON.stringify(res.user?.uid);
      localStorage.setItem('userId', userId );
      this.storageSub.next('added');
    })
    this.userSubscription = this.firebaseAuth.onAuthStateChanged(user =>{
      if(user === null || user == undefined){
        return null
      }
      return this.db.collection("Users").doc(user.uid).valueChanges();
    })
  }


  async register(email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password).then((userinfo)=>{
      this.newUserId = userinfo.user?.uid
    })
  }

  createNewUser(UserData: any) {
    console.log(this.newUserId)
    return this.db.collection('Users').doc(this.newUserId).set(UserData);
  }

  getAllUsers() {
    return this.db.collection("Users").snapshotChanges();
  }


  getSignInUser() {
    if(this.currentLogedInUserId !== '0'){
       this.currentLogedInUserId = localStorage.getItem("userId")
       this.currentLogedInUserId = JSON.parse(this.currentLogedInUserId)
    }
    if(this.currentLogedInUserId == '0'){
      this.currentLogedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("userId")))
    }
     return this.db.collection('Users').doc(this.currentLogedInUserId).valueChanges()
  }

  async forgetPassword(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email).then(res => {
    })
  }


  logout(){
    this.firebaseAuth.signOut();
    localStorage.setItem("userId", "0");
    this.storageSub.next('removed')
  }

  loadUserInfo() {
    const userData = this.userInfo.getValue();
    if (!userData) {
      const accessToken = localStorage.getItem("access_token")
      if (accessToken) {
        const decryptedUser = this.jwtHelper.decodeToken(accessToken);
        const data = {
          access_token: accessToken,
          refresh_token: localStorage.getItem("refresh_token"),
          username: decryptedUser.username,
          userid: decryptedUser.sub,
          tokenExpiration: decryptedUser.exp
        };
        this.userInfo.next(data);
      }
    }
  }

  userLogin(userPayload: any): Observable<boolean> {

    return this.http.post("http://localhost:3000/login/auth", userPayload).pipe(
      map((value: any) => {
        if (value) {
          localStorage.setItem("access_token", value.access_token);
          localStorage.setItem("refresh_token", value.refresh_token);
          const decryptedUser = this.jwtHelper.decodeToken(value.access_token);

          const data = {
            access_token: value.access_token,
            refresh_token: value.refresh_token,
            username: decryptedUser.username,
            userid: decryptedUser.sub,
            tokenExpiration: decryptedUser.exp
          };

          this.userInfo.next(data);
          return true;
        }
        return false;
      })
      );
    }

    callRefreshToken(tokenPayload: any): Observable<any> {
      return this.http.post('http://localhost:3000/auth/login', tokenPayload);
    }
  }
