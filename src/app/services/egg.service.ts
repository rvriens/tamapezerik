import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EggService {

  private isOpening = false;

  constructor(
    private db: AngularFireDatabase,
    private fns: AngularFireFunctions,
    private auth: AuthService) { }

  async openEgg(): Promise<void> {
    if (this.isOpening) { return; }
    this.isOpening = true;
    try {
      const openEgg = this.fns.httpsCallable('openEgg');
      const result = await openEgg({}).toPromise();
      if (result) {
        //
      }
    } catch (error) {
      throw error;
    } finally {
      this.isOpening = false;
    }
  }

  async closeOpening(alias: string): Promise<void> {
    const closeOpening = this.fns.httpsCallable('closeOpening');
    const result = await closeOpening({alias}).toPromise();
    if (result) {
      //
    }
  }

  async confirmDead(): Promise<void> {
    const confirmDead = this.fns.httpsCallable('confirmDead');
    const result = await confirmDead({}).toPromise();
    if (result) {
      //
    }
  }

  async killEgg(): Promise<void> {
    const killEgg = this.fns.httpsCallable('killEgg');
    const result = await killEgg({}).toPromise();
    if (result) {
      //
    }
  }

}
