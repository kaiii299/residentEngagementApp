import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  
  constructor(private firestore: AngularFirestore) { }

  addResident( resident: object){
    return this.firestore.collection('residents').add(resident);
  }
  getAllResidents() {
    return this.firestore.collection('residents').valueChanges({ idField: 'id'});
  }
  getResidentById(id: string){
    return this.firestore.collection('residents').doc(id).valueChanges();
  }
  updateResidentInfo(id: string, resident: Object){
    console.log(resident)
    return this.firestore.collection('residents').doc(id).update(resident);
  }
  deleteResident(id: string){
    this.firestore.collection('residents').doc(id).delete().then(function () { 
        alert("Resident has been removed from the records!"); 
    }).catch(
        function(error) { 
        console.error("Error removing document: ", error); 
    });
  }

}
