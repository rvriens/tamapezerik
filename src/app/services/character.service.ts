import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Character } from '../../../functions/src/models/character.model';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ItemAction } from 'functions/src/models/itemaction.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  character: BehaviorSubject<Character> = new BehaviorSubject<Character>(null);

  private initWatcher: Promise<void>;

  constructor(private db: AngularFireDatabase,
              private fns: AngularFireFunctions,
              private auth: AuthService) {
    this.initWatcher = this.initStatusWatcher();
  }

  getCharacter(): Subject<Character> {
    return this.character;
  }

  async giveItem(item: string): Promise<ItemAction> {
    const giveItem = this.fns.httpsCallable('giveItem');
    const result: ItemAction = await giveItem({item}).toPromise();
    console.log('give item', result);
    if (result) {
      return result;
    }
    return null;
  }

  private async initStatusWatcher() {

    const characterSession = sessionStorage.getItem('character');
    if (!characterSession) {
      this.character.next(JSON.parse(characterSession));
    }
    if (!this.auth.isLoggedIn) {
       this.auth.userSubscription.subscribe(u => {
         if (u?.uid) {
           this.initStatusWatcher();
         }
       });
       return;
    }
    const uid = await this.auth.getUserUid();

    this.db.database.ref(`users/${uid}/character`).on('value', (snapshot) => {
      const character = snapshot.val();
      sessionStorage.setItem('character', JSON.stringify(character));
      this.character.next(character);
    });
  }
}
