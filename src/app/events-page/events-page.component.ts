import { Component, OnInit, ViewChild } from '@angular/core';
import {

  MbscCalendarEvent,
  MbscDatepickerOptions,
  MbscEventcalendarOptions,
  MbscPopup,
  MbscPopupOptions,
  Notifications,
  setOptions

} from '@mobiscroll/angular';


setOptions({
  theme: 'ios',
  themeVariant: 'light'
});


@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
  providers: [Notifications]

})
export class EventsPageComponent implements OnInit {


  constructor(private notify: Notifications) { }
  @ViewChild('popup', { static: false })
    popup!: MbscPopup;
    @ViewChild('colorPicker', { static: false })
    colorPicker: any;
    popupEventTitle: string | undefined;
    popupEventDescription = '';
    popupEventAllDay = true;
    popupEventDates: any;
    popupEventStatus = 'busy';
    calendarSelectedDate: any = new Date();
    switchLabel: any = 'All-day';
    tempColor = '';
    selectedColor = '';
    colorAnchor: HTMLElement | undefined;
    colors = ['#ffeb3c', '#ff9900', '#f44437', '#ea1e63', '#9c26b0', '#3f51b5', '', '#009788', '#4baf4f', '#7e5d4e'];
    myEvents: MbscCalendarEvent[] = [{
      id: 1,
      start: '2021-12-08T13:00',
      end: '2021-12-08T13:45',
      title: 'Lunch @ Butcher\'s',
      description: '',
      allDay: false,
      free: true,
      color: '#009788'
  }, {
      id: 2,
      start: '2021-12-31T15:00',
      end: '2021-12-31T16:00',
      title: 'General orientation',
      description: '',
      allDay: false,
      free: false,
      color: '#ff9900'
  }, {
      id: 3,
      start: '2021-12-30T18:00',
      end: '2021-12-30T22:00',
      title: 'Dexter BD',
      description: '',
      allDay: false,
      free: true,
      color: '#3f51b5'
  }, {
      id: 4,
      start: '2022-01-01T10:30',
      end: '2022-01-01T11:30',
      title: 'Stakeholder mtg.',
      description: '',
      allDay: false,
      free: false,
      color: '#f44437'
  }];
    
  tempEvent!: MbscCalendarEvent;
  calendarOptions: MbscEventcalendarOptions = {
      clickToCreate: 'double',
      dragToCreate: true,
      dragToMove: true,
      dragToResize: true,
      view: {
          calendar: { type: 'month', labels: true }
      },
      onEventClick: (args) => {
        this.isEdit = true;
        this.tempEvent = args.event;
        // fill popup form with event data
        this.loadPopupForm(args.event);
        // set popup options
        this.popupHeaderText = 'Edit event';
        this.popupButtons = this.popupEditButtons;
        this.popupAnchor = args.domEvent.currentTarget;
        // open the popup
        this.popup.open();
    },
    onEventCreated: (args) => {
        setTimeout(() => {
            this.isEdit = false;
            this.tempEvent = args.event;
            // fill popup form with event data
            this.loadPopupForm(args.event);
            // set popup options
            this.popupHeaderText = 'New Event';
            this.popupButtons = this.popupAddButtons;
            this.popupAnchor = args.target;
            // open the popup
            this.popup.open();
        });
    },
    onEventDeleted: (args) => {
      setTimeout(() => {
          this.deleteEvent(args.event);
      });
  },
  onEventUpdated: () => {
      // here you can update the event in your storage as well, after drag & drop or resize
      
  }
};
popupHeaderText!: string;
popupAnchor: HTMLElement | undefined;
popupAddButtons = ['cancel', {
  handler: () => {
      this.saveEvent();
  },
  keyCode: 'enter',
  text: 'Add',
  cssClass: 'mbsc-popup-button-primary'
}];
popupEditButtons = ['cancel', {
  handler: () => {
      this.saveEvent();
  },
  keyCode: 'enter',
  text: 'Save',
  cssClass: 'mbsc-popup-button-primary'
}];
popupButtons: any = [];
popupOptions: MbscPopupOptions = {
  display: 'bottom',
  contentPadding: false,
  fullScreen: true,
  onClose: () => {
      if (!this.isEdit) {
          // refresh the list, if add popup was canceled, to remove the temporary event
          this.myEvents = [...this.myEvents];
      }
  },
  responsive: {
      medium: {
          display: 'anchored',
          width: 400,
          fullScreen: false,
          touchUi: false
      }
  }
};
datePickerControls = ['date'];
datePickerResponsive: any = {
  medium: {
      controls: ['calendar'],
      touchUi: false
  }
};
datetimePickerControls = ['datetime'];
datetimePickerResponsive = {
  medium: {
      controls: ['calendar', 'time'],
      touchUi: false
  }
};
datePickerOptions: MbscDatepickerOptions = {
  select: 'range',
  showRangeLabels: false,
  touchUi: true
};
isEdit = false;
colorOptions: MbscPopupOptions = {
  display: 'bottom',
  contentPadding: false,
  showArrow: false,
  showOverlay: false,
  buttons: [
      'cancel',
      {
          text: 'Set',
          keyCode: 'enter',
          handler: () => {
              this.selectedColor = this.tempColor;
              this.colorPicker.close();
          },
          cssClass: 'mbsc-popup-button-primary'
      }
  ],
  responsive: {
      medium: {
          display: 'anchored',
          buttons: [],
      }
  }
};


  ngOnInit(): void {
  }

  loadPopupForm(event: MbscCalendarEvent): void {
    this.popupEventTitle = event.title;
    this.popupEventDescription = event.description;
    this.popupEventDates = [event.start, event.end];
    this.popupEventAllDay = event.allDay || false;
    this.popupEventStatus = event.status || 'busy';
    this.selectedColor = event.color || '';
}
saveEvent(): void {
    this.tempEvent.title = this.popupEventTitle;
    this.tempEvent.description = this.popupEventDescription;
    this.tempEvent.start = this.popupEventDates[0];
    this.tempEvent.end = this.popupEventDates[1];
    this.tempEvent.allDay = this.popupEventAllDay;
    this.tempEvent.status = this.popupEventStatus;
    this.tempEvent.color = this.selectedColor;
    if (this.isEdit) {
        // update the event in the list
        this.myEvents = [...this.myEvents];
        // here you can update the event in your storage as well
      
    } else {
        // add the new event to the list
        this.myEvents = [...this.myEvents, this.tempEvent];
        // here you can add the event to your storage as well
        
    }
    // navigate the calendar
    this.calendarSelectedDate = this.popupEventDates[0];
    // close the popup
    this.popup.close();
}
deleteEvent(event: MbscCalendarEvent): void {
    this.myEvents = this.myEvents.filter(item => item.id !== event.id);
    this.notify.snackbar({
        button: {
            action: () => {
                this.myEvents = [...this.myEvents, event];
            },
            text: 'Undo'
        },
        message: 'Event deleted'
    });
    // here you can delete the event from your storage as well
  
}
onDeleteClick(): void {
    this.deleteEvent(this.tempEvent);
    this.popup.close();
}

selectColor(color: string): void {
    this.tempColor = color;
}

openColorPicker(ev: any): void {
    this.selectColor(this.selectedColor || '');
    this.colorAnchor = ev.currentTarget;
    this.colorPicker.open();
}

changeColor(ev: any): void {
    const color = ev.currentTarget.getAttribute('data-value');
    this.selectColor(color);

    if (!this.colorPicker.s.buttons.length) {
        this.selectedColor = color;
        this.colorPicker.close();
    }
}

}


