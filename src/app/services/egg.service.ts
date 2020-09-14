import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EggService {

  constructor(
    private db: AngularFireDatabase,
    private fns: AngularFireFunctions,
    private auth: AuthService) { }

  async openEgg(): Promise<void> {
    const openEgg = this.fns.httpsCallable('openEgg');
    const result = await openEgg({}).toPromise();
    console.log('openegg result', result);
    if (result) {
      //
    }
  }

  async closeOpening(): Promise<void> {
    const closeOpening = this.fns.httpsCallable('closeOpening');
    const result = await closeOpening({}).toPromise();
    console.log('close Opening', result);
    if (result) {
      //
    }
  }

  async confirmDead(): Promise<void> {
    const confirmDead = this.fns.httpsCallable('confirmDead');
    const result = await confirmDead({}).toPromise();
    console.log('Confirm dead', result);
    if (result) {
      //
    }
  }

  async killEgg(): Promise<void> {
    const closeOpening = this.fns.httpsCallable('killEgg');
    const result = await closeOpening({}).toPromise();
    console.log('killEgg', result);
    if (result) {
      //
    }
  }

}
