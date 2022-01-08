import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ResidentService } from '../resident.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../constants';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-update-resident',
  templateUrl: './update-resident.component.html',
  styleUrls: ['./update-resident.component.scss']
})
export class UpdateResidentComponent implements OnInit {
  updateResidentForm:any;
  committees = Constants.committees;
  genders = Constants.genders;
  ageGps = Constants.ageGps;
  activities = Constants.activities;

  residentId: string;

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

  ngOnInit(): void {
    this.residentId = this.activatedRoute.snapshot.queryParams.id;
    console.log(this.residentId);
    if(this.residentId){
      this.residentService.getResidentById(this.residentId).subscribe(residentInfo =>{
        let residentDetail:any = residentInfo;
         console.log(residentDetail);
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
    }
  }
  updateResidentInfo(value : any){
    console.log(value);
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
      console.log(resident)
      this.residentService.updateResidentInfo(this.residentId,resident).then(res => {
        alert("The resident's information hase been successfully updated")
        this.router.navigate(['residentinfo']);
      })
    }
  }

}
