import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Constants } from '../constants';
import { ResidentInformation } from '../resident-information';

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


  constructor(private formBuilder: FormBuilder, private residentInformation: ResidentInformation) {
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
    if (this.addResidentForm.valid) {
      console.log(value);
      let temp_activities = value.activities;
      var selected_activities = [];
      for (let i = 0; i < temp_activities.length; i++) {
        let get_activity = this.activitiesList[i];
        if (temp_activities[i]) {
          selected_activities.push(get_activity);
        }
      }
      value.activities = selected_activities;
      this.residentInformation.addResident(value)
    } else {
      alert("Missing information !");
    }
  }
}