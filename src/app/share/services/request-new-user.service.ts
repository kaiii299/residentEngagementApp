import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Constants } from 'src/app/constants';
import { userService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RequestNewUserService {

baseurl = Constants.baseURL;

eventcbRequestUserData = new Subject<any>();
eventcbRequestUserData$ = this.eventcbRequestUserData.asObservable();
  constructor(
    private userService: userService,
    private http: HttpClient,
    private db: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
  ) { }

  async rejectRequestUser(uid: any){
    //delete the user
  }

}
