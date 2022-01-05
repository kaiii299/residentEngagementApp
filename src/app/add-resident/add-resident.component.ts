import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Constants } from '../constants';
import { ResidentService } from '../resident.service';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-add-resident',
  templateUrl: './add-resident.component.html',
  styleUrls: ['./add-resident.component.scss']
})
export class AddResidentComponent implements OnInit {
  addResidentForm: FormGroup;
  committees = Constants.committees;
  genders = Constants.genders;
  ageGps = Constants.ageGps;
  activitiesList = Constants.activities;


  constructor(private formBuilder: FormBuilder, private residentService: ResidentService, private router: Router) {
  }

  ngOnInit(): void {
    this.addResidentForm = this.formBuilder.group({
      residentName: new FormControl('', [Validators.required]),
      committee: new FormControl('', [Validators.required]),
      blkNum: new FormControl('', [Validators.required]),
      unitNum: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      race: new FormControl('', [Validators.required]),
      ageGp: new FormControl('', [Validators.required]),
      expertise: new FormControl('', [Validators.required]),
      activities: new FormArray([], [Validators.required]),
    });

    //console.log(this.addResidentForm.controls.activities);
    this.activitiesList.forEach(() => this.activitiesFormArray.push(new FormControl(false)));
  }

  get activitiesFormArray() {
    return this.addResidentForm.controls.activities as FormArray;
  }

  add(value: any) {
    console.log(value);
    let temp_activities = value.activities;
    var selected_activities = [];
      for (let i = 0; i < temp_activities.length; i++) {
        let get_activity = this.activitiesList[i];
        if (temp_activities[i]) {
          selected_activities.push(get_activity);
        }
      }
      console.log(selected_activities.length);
    if (this.addResidentForm.valid && selected_activities.length != 0) {
       value.activities = selected_activities;
      let resident = {
        residentName: value.residentName,
        committee: value.committee,
        blkNum: value.blkNum,
        unitNum: value.unitNum,
        gender: value.gender,
        race: value.race,
        ageGp: value.ageGp,
        expertise: value.expertise,
        activities: value.activities,
      }
      this.residentService.addResident(resident).then(results => {
        alert("Resident has been successfully added")
        //console.log(results);
        //console.log(results.id);
        this.router.navigate(['residentinfo']);
      });
      
    } else {
      alert("Missing information !");
    }
  }
}