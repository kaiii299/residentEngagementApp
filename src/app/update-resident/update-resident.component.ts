import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Constants } from '../constants';
import { Authservice } from '../share/services/auth.service';

@Component({
  selector: 'app-update-resident',
  templateUrl: './update-resident.component.html',
  styleUrls: ['./update-resident.component.scss']
})
export class UpdateResidentComponent implements OnInit {
  updateResidentForm: FormGroup;


  committees = Constants.committees;
  genders = Constants.genders;
  ageGps = Constants.ageGps;
  activities = Constants.activities;
  testResident: any ={};

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //this.testResident = this.residentInformation.getResidentById(1);
    console.log(this.testResident);

    this.updateResidentForm = this.formBuilder.group({
      residentNameControl: this.testResident.residentName,
      committeeControl: this.testResident.committee,
      blkNumControl: this.testResident.blkNum,
      unitNumControl: this.testResident.unitNum,
      genderControl: this.testResident.gender,
      raceControl: this.testResident.race,
      ageGpControl: this.testResident.expertise,
      expertiseControl: this.testResident.committee,
    });
  }

}
