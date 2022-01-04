import { Injectable } from '@angular/core';

@Injectable()
export class windowService {

  get windowRef() {
    return window
  }

}
