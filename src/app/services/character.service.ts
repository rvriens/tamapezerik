import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Character } from '../../../functions/src/models/character.model';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ItemAction } from 'functions/src/models/itemaction.model';
import { Store } from '@ngrx/store';
import { selectUserUid } from '../selectors/app.selectors';
import { AppState } from '../reducers/app.state';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  character: BehaviorSubject<Character> = new BehaviorSubject<Character>(null);

  constructor(private db: AngularFireDatabase,
              private fns: AngularFireFunctions,
              private store: Store<AppState>) {
    this.initStatusWatcher();
  }

  getCharacter(): Subject<Character> {
    return this.character;
  }

  async giveItem(item: string): Promise<ItemAction> {
    const giveItem = this.fns.httpsCallable('giveItem');
    const result: ItemAction = await giveItem({item}).toPromise();
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

    this.store.select(selectUserUid).subscribe(uid =>
          {
           if (!uid) { return; }
           this.db.database.ref(`users/${uid}/character`).on('value', (snapshot) => {
              const character = snapshot.val();
              sessionStorage.setItem('character', JSON.stringify(character));
              this.character.next(character);
            });
         });

  }
}
