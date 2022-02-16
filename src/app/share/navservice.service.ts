import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavserviceService {

  eventcbTitle = new BehaviorSubject<string>("Resident App");
  eventcbTitle$ = this.eventcbTitle.asObservable();
  
  constructor() { }
}
