import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-events-page',
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
  templateUrl: './events-page.component.html',
  template: `<ejs-schedule> </ejs-schedule>`,
  styleUrls: ['./events-page.component.scss'],


})
export class EventsPageComponent implements OnInit  {
  items: any;
  public test: string | any[];
  public currentView = "WorkWeek";
  public data: any;
  public selectedDate = new Date();
  constructor(db: AngularFirestore) {
    this.data = db.collection("Agenda");
    this.items = db
      .collection("Agenda")
      .valueChanges()
      .subscribe(data => {
        this.items = data;
        this.test = data;
        let schObj = (document.querySelector(".e-schedule") as any)
          .ej2_instances[0];
        let length = this.test.length;
        for (let i = 0; i < length; i++) {
          let endTime = this.test[i].EndTime.seconds.toString() + "000";
          let srtTime = this.test[i].StartTime.seconds.toString() + "000";
          this.test[i].StartTime = new Date(parseInt(srtTime));
          this.test[i].EndTime = new Date(parseInt(endTime));
        }
        schObj.eventSettings.dataSource = this.test;
      });
  }
  ngOnInit(): void {
    
  }
  public onActionBegin(args: any): void {
    if (args.requestType == "eventChange") {
      this.data
        .doc(args.changedRecords[0].DocumentId)
        .update({ Subject: args.changedRecords[0].Subject });
      this.data
        .doc(args.changedRecords[0].DocumentId)
        .update({ EndTime: args.changedRecords[0].EndTime });
      this.data
        .doc(args.changedRecords[0].DocumentId)
        .update({ StartTime: args.changedRecords[0].StartTime });
      this.data
        .doc(args.changedRecords[0].DocumentId)
        .update({ Location: args.changedRecords[0].Location });
      this.data
        .doc(args.changedRecords[0].DocumentId)
        .update({ IsAllDay: args.changedRecords[0].IsAllDay });
      this.data
        .doc(args.changedRecords[0].DocumentId)
        .update({ RecurrenceRule: args.changedRecords[0].RecurrenceRule });
    } else if (args.requestType == "eventCreate") {
      let guid = (
        this.GuidFun() +
        this.GuidFun() +
        "-" +
        this.GuidFun() +
        "-4" +
        this.GuidFun().substr(0, 3) +
        "-" +
        this.GuidFun() +
        "-" +
        this.GuidFun() +
        this.GuidFun() +
        this.GuidFun()
      ).toLowerCase();
      args.data[0].DocumentId = guid.toString();
      this.data.doc(guid).set(args.data[0]);
    } else if (args.requestType == "eventRemove") {
      this.data.doc(args.deletedRecords[0].DocumentId).delete();
    }
  }
  public GuidFun() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}