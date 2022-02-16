import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,FormArray } from '@angular/forms';
import { ResidentService } from '../resident.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../constants';
import { Router, NavigationExtras } from '@angular/router';
import { Authservice } from '../share/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-resident',
  templateUrl: './update-resident.component.html',
  styleUrls: ['./update-resident.component.scss']
})
export class UpdateResidentComponent implements OnInit {
  updateResidentForm:any;
  zonesInfo = Constants.zones;
  genders = Constants.genders;
  ageGps = Constants.ageGps;
  activitiesList = Constants.activities;
  committees = Array.from(this.zonesInfo.keys());
  selectedZone: string;
  availableBlocks :any = [];

  resid = this.activatedRoute.snapshot.queryParams.id;
  

  constructor(private formBuilder: FormBuilder, private residentService: ResidentService,private activatedRoute: ActivatedRoute, private router: Router) {
    this.updateResidentForm = new FormGroup({
       residentNameControl:new FormControl('', [Validators.required]),
        committeeControl: new FormControl('', [Validators.required]),
        blkNumControl: new FormControl('', [Validators.required]),
        unitNumControl: new FormControl('', [Validators.required]),
        genderControl: new FormControl('', [Validators.required]),
        raceControl: new FormControl('', [Validators.required]),
        ageGpControl: new FormControl('', [Validators.required]),
        expertiseControl: new FormControl('', [Validators.required]),
    });
    
   }
  async ngOnInit() {
    const decryptedResid = this.residentService.decryptData(this.resid);
    await this.residentService.getResidentById(decryptedResid).toPromise().then((data) => {
      // console.log("update resident data");
      // console.log(data);
      let residentDetail: any = data.residentData;
      this.selectedZone = residentDetail.committee;
      this.availableBlocks = this.zonesInfo.get(this.selectedZone);
      this.updateResidentForm.patchValue({
        residentNameControl: residentDetail.residentName,
        committeeControl: residentDetail.committee,
        blkNumControl: residentDetail.blkNum,
        unitNumControl: residentDetail.unitNum,
        genderControl: residentDetail.gender,
        raceControl: residentDetail.race,
        ageGpControl: residentDetail.ageGp,
        expertiseControl: residentDetail.expertise,
      }); 
    })
    //this.activitiesList.forEach(() => this.activitiesFormArray.push(new FormControl(false)));
  }
  get activitiesFormArray() {
    return this.updateResidentForm.controls.activities as FormArray;
  }

  onChangeCommittee(value: any) {
    this.selectedZone = value;
    this.availableBlocks =this.zonesInfo.get(this.selectedZone);
    // console.log(this.zonesInfo.get(this.selectedZone));
   
    this.updateResidentForm.patchValue({
           blkNumControl: '',
    });
  }
  
  onChangeBlkNumList(value: any){
    // console.log(value);
  }
  cancel(){
    this.router.navigate(['residentinfo']);
  }

  updateResidentInfo(value : any){
    if (this.updateResidentForm.valid){
      let resident = {
        residentName: value.residentNameControl,
        committee: value.committeeControl,
        blkNum: value.blkNumControl,
        unitNum: value.unitNumControl,
        gender: value.genderControl,
        race: value.raceControl,
        ageGp: value.ageGpControl,
        expertise: value.expertiseControl,
      }
      const decryptedResid = this.residentService.decryptData(this.resid);
      this.residentService.updateResidentInfo(decryptedResid,resident).then(res => {
        Swal.fire("The resident's information hase been successfully updated")
        this.router.navigate(['residentinfo']);
      })
    }
  }

}
