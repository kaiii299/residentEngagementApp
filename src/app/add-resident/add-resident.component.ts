import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Constants } from '../constants';
import { ResidentService } from '../resident.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { NavserviceService } from '../share/navservice.service';

@Component({
  selector: 'app-add-resident',
  templateUrl: './add-resident.component.html',
  styleUrls: ['./add-resident.component.scss'],
})
export class AddResidentComponent implements OnInit {
  addResidentForm: FormGroup;
  genders = Constants.genders;
  ageGps = Constants.ageGps;
  activitiesList = Constants.activities;
  zonesInfo = Constants.zones;

  committees = Array.from(this.zonesInfo.keys());
  selectedZone: string;
  availableBlocks: any = [];

  constructor(
    private navService: NavserviceService,
    private formBuilder: FormBuilder,
    private residentService: ResidentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.navService.eventcbTitle.next('Add new resident')
    this.addResidentForm = this.formBuilder.group({
      residentName: new FormControl('', [Validators.required]),
      committee: new FormControl('', [Validators.required]),
      blkNum: new FormControl('', [Validators.required]),
      unitNum: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      race: new FormControl('', [Validators.required]),
      ageGp: new FormControl('', [Validators.required]),
      expertise: new FormControl('', [Validators.required]),
      // activities: new FormArray([], [Validators.required]),
      noblk: new FormControl(),
    });

    // console.log(this.addResidentForm.controls.activities);
    // this.activitiesList.forEach(() => this.activitiesFormArray.push(new FormControl(false)));
  }

  // get activitiesFormArray() {
  //   return this.addResidentForm.controls.activities as FormArray;
  // }

  onChange(value: any) {
    this.selectedZone = value;
    this.availableBlocks = this.zonesInfo.get(this.selectedZone);
    console.log(this.zonesInfo.get(this.selectedZone));
  }
  cancel(){
    this.router.navigate(['residentinfo']);
  }

  add(value: any) {
    // let temp_activities = value.activities;
    // var selected_activities = [];
    //   for (let i = 0; i < temp_activities.length; i++) {
    //     let get_activity = this.activitiesList[i];
    //     if (temp_activities[i]) {
    //       selected_activities.push(get_activity);
    //     }
    //   }
    //   console.log(selected_activities.length);
    if (this.addResidentForm.valid) {
      //  value.activities = selected_activities;
      const resident = {
        residentName: value.residentName,
        committee: value.committee,
        blkNum: value.blkNum,
        unitNum: value.unitNum,
        gender: value.gender,
        race: value.race,
        ageGp: value.ageGp,
        expertise: value.expertise,
        // activities: value.activities,
      };
      this.residentService.addResident(resident).then((results) => {
        Swal.fire('Resident has been added to database');
        // console.log(results);
        // console.log(results.id);
        this.router.navigate(['residentinfo']);
      });
    } else {
      Swal.fire('Missing information !');
    }
  }
}
