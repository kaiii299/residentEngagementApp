import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResidentService } from '../resident.service';
import { ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { InputSurveyComponent } from '../input-survey/input-survey.component';
import { Constants } from '../constants';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { NavserviceService } from '../share/navservice.service';

@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.component.html',
  styleUrls: ['./resident-detail.component.scss'],
})
export class ResidentDetailComponent implements OnInit {
  residentDetailsForm: any;
  residentDetail: any;
  feedbackForm: any;
  surveys: any = [];

  resid = this.activatedRoute.snapshot.queryParams.id;

  constructor(
    private navService: NavserviceService,
    private residentService: ResidentService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.residentDetailsForm = new FormGroup({
      residentNameControl: new FormControl('', [Validators.required]),
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
    this.navService.eventcbTitle.next('Resient profile')
    const decryptedResid = this.residentService.decryptData(this.resid);
    await this.residentService
      .getResidentById(decryptedResid)
      .toPromise()
      .then((data) => {
        // console.log("get resident details..")
        // console.log(data);
        const residentDetail: any = data.residentData;
        this.residentDetailsForm.patchValue({
          residentNameControl: residentDetail.residentName,
          committeeControl: residentDetail.committee,
          blkNumControl: residentDetail.blkNum,
          unitNumControl: residentDetail.unitNum,
          genderControl: residentDetail.gender,
          raceControl: residentDetail.race,
          ageGpControl: residentDetail.ageGp,
          expertiseControl: residentDetail.expertise,
        });
      });
    })
    console.log(decryptedResid);
    await this.residentService.getSurveyByResidentId(decryptedResid).then((res) => {

      res.sort((a: any, b:any) => {
        return <any>new Date(b.data.date) - <any>new Date(a.data.date);
      });
      this.surveys = res;
    })
  }
  onClickEdit() {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: this.resid },
    };
    this.router.navigate(['updateresident'], navigationExtras);
  }
  onDeleteSurvey(id: any){
    Swal.fire({
      title: 'Are you sure you want to delete this survey ?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed){
        this.residentService.deleteSurvey(id);
        Swal.fire({
          title: 'Survey has been deleted',
          timer: 800,
          icon: 'success',
        })
        window.setTimeout(function(){location.reload()},900)
      }
      else if (result.isDenied){
        Swal.fire('Action has been cancelled')
      }
    })
  }

  openSurveyDialog() {
    this.dialog.open(InputSurveyComponent, {
      width: '50%',
      height: '70%',
      panelClass: 'custom-modalbox',
    });
  }
}
