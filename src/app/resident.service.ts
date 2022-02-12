import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Resident } from '././resident';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  baseUrl = Constants.baseURL;
  secretKey = Constants.secretKey;

  eventcbResidentData = new Subject<any>();
  eventcbResidentData$ = this.eventcbResidentData.asObservable();

  searchOption= []
  public residentsData : Resident[]

  constructor(private firestore: AngularFirestore, private http: HttpClient, private router: Router) { }

  encryptData(value: any) {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decryptData(textToDecrypt: any) {
    console.log("decrpt");
    console.log(textToDecrypt);
    var bytes = CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim());
    console.log(bytes);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // addResident(resident: object) {
  //   return this.firestore.collection('residents').add(resident);
  // }

  async addResident(resident: object) {
    let residentList = [];
    residentList.push(resident);
    return await this.http.post(this.baseUrl+"/createResident", residentList).toPromise().then((data) => {
      console.log("resident data =>>>> ");
      console.log(data);
      return data;
    }).catch(err => {
      console.log(err);
    });
  }

  async addResidentList(residentList:any) {
    return await this.http.post(this.baseUrl+"/createResident", residentList).toPromise().then((data) => {
      console.log("resident data =>>>> ");
      console.log(data);
      return data;
    }).catch(err => {
      console.log(err);
    });
  }

  async getAllResidents(body: any) {
    //return this.firestore.collection('residents').valueChanges({ idField: 'id' });
    return await this.http.post(this.baseUrl + "/getAllResidents",body).toPromise().then((data) => {
      return data;
    }).catch(err => {
      if (err instanceof HttpErrorResponse) {
        if (err) {
          console.log(err);
          console.log("user not loged in");
        }
      }
    })
  }

  getResidentById(id: any){
    // return this.firestore.collection('residents').doc(id).valueChanges();
    return this.http.get(this.baseUrl + "/getResident/" + id) as Observable<any>
  }

  getResidentByFilter(commiittee: string, ageGp: string) {
    console.log("filter");
    var residentRef = this.firestore.collection<any>('residents', tempRes => {
      return tempRes
        .where('committee', '==', commiittee)
        .where('ageGp', '==', ageGp)
    });
    return residentRef.valueChanges({ idField: 'id' });
  }

  async updateResidentInfo(id: string, resident: Object) {
    //return this.firestore.collection('residents').doc(id).update(resident);
    return await this.http.put(this.baseUrl + "/updateResident/" + id,resident, {responseType: 'text'}).toPromise().then((data)=>{
      console.log(resident)
    })

  }

  deleteResident(id: string) {
    this.firestore.collection('residents').doc(id).delete().then(function () {
      Swal.fire("Resident has been removed from the records!");
      setTimeout(function(){
        location.reload(),80000;
      })
    }).catch(
      function (error) {
        console.error("Error removing document: ", error);
      });
  }


  async searchResidentData(body: any) {
    return await this.http.post(this.baseUrl +"/searchResidentByName ", body).toPromise().then((data) => {
      return data;
    }).catch(err => {
      if (err instanceof HttpErrorResponse) {
        if (err) {
          console.log(err);
          console.log("user not loged in");
        }
      }
    })
  }

  async filterResident(body: any) {
    return await this.http.post(this.baseUrl +"/filterResident ", body).toPromise().then((data) => {
      return data;
    }).catch(err => {
      if (err instanceof HttpErrorResponse) {
        if (err) {
          console.log(err);
          console.log("user not loged in");
        }
      }
    })
  }

  async addSurvey(survey: object) {
    return await this.http.post(this.baseUrl+"/createSurvey", survey).toPromise().then((data) => {
      console.log("svury data =>>>> ");
      console.log(data);
      return data;
    }).catch(err => {
      console.log(err);
    });
  }

  async getSurveyByResidentID(residentId: String) {
    return await this.http.get(this.baseUrl+"/getSurveyByResidentId/"+residentId).toPromise().then((response:any) => {
      return response;
    }).catch(err => {
      console.log(err);
    });
  }
}
