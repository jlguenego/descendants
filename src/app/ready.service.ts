import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReadyService {

  isReady = true;
  constructor() { }

  notify(ready: boolean) {
    this.isReady = ready;
  }
}
