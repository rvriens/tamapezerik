import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EggService {

  constructor(
    // private db: AngularFireDatabase,
    // private fns: AngularFireFunctions,
    private auth: AuthService) { }

  async openEgg(): Promise<void> {
  }

  async closeOpening(): Promise<void> {
  }

}
