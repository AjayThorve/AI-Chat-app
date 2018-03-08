import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DataService {

  private m = new Subject<String>();
  message$ = this.m.asObservable();

  sendMessage(msg: string) {
    console.log('content pushed')
    this.m.next(msg);
  }

}
