import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { CharacterStatus } from '../../../functions/src/models/characterstatus.enum';
import { isNumber } from 'util';
import { Store } from '@ngrx/store';
import { selectUserUid } from '../selectors/app.selectors';
import { AppState } from '../reducers/app.state';


export enum EggStatus {
  Alive,
  Dead,
  New,
  Opening,
  DeadConfirmed
}

@Injectable({
  providedIn: 'root'
})
export class EggstatusService {
  eggStatus: BehaviorSubject<EggStatus> = new BehaviorSubject<EggStatus>(null);

  private initWatcher: Promise<void>;

  constructor(private db: AngularFireDatabase,
              private store: Store<AppState>,
              private auth: AuthService) {
    this.initWatcher = this.initStatusWatcher();
  }

  getEggStatus(): Subject<EggStatus> {
    return this.eggStatus;
  }

  private async initStatusWatcher() {

    const eggStatusSession = sessionStorage.getItem('eggStatus');
    if (!eggStatusSession && isNumber(eggStatusSession)) {
      this.eggStatus.next(parseInt(eggStatusSession, 10));
    }

    this.store.select(selectUserUid).subscribe( uid => {
      if (!uid) {
        this.eggStatus.next(EggStatus.New);
        return;
      }

      this.db.database.ref(`users/${uid}/character/status`).on('value', (snapshot) => {
        const status: CharacterStatus = snapshot.val();
        if (!status) {
          this.eggStatus.next(EggStatus.New);
        }
        let eggStatus: EggStatus;
        switch (status) {
          case CharacterStatus.Alive:
            eggStatus = EggStatus.Alive;
            this.eggStatus.next(EggStatus.Alive);
            break;
          case CharacterStatus.Dead:
            eggStatus = EggStatus.Dead;
            break;
          case CharacterStatus.DeadConfirmed:
              eggStatus = EggStatus.DeadConfirmed;
              break;
          case CharacterStatus.Opening:
            eggStatus = EggStatus.Opening;
            break;
          default:
            eggStatus = EggStatus.New;
            break;
        }
        sessionStorage.setItem('eggStatus', eggStatus.toString());
        this.eggStatus.next(eggStatus);
        console.log('egg status', eggStatus);
      });
    });
  }
}
