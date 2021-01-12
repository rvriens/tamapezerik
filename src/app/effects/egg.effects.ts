import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError, concatMapTo, tap, filter, withLatestFrom } from 'rxjs/operators';
import * as EggActions from '../actions/egg.actions';
import * as AppActions from '../actions/app.actions';
import { AuthService } from '../services/auth.service';
import { EggService } from '../services/egg.service';
import { EggstatusService } from '../services/eggstatus.service';
import { selectLoading } from '../selectors/app.selectors';
import { selectUserUid } from '../selectors/app.selectors';
import { AngularFireFunctions } from '@angular/fire/functions';
import { stringify } from '@angular/compiler/src/util';

@Injectable()
export class EggEffects {

    loadEggStatus$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EggActions.loadEggStatus),
        tap(() => this.eggstatusService.loadEggStatus()),
    ), {dispatch: false});

    setEggStatus$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EggActions.setEggStatus),
        withLatestFrom(this.store.select(selectLoading)),
        filter(([action, apploading]) => apploading),
        map(() => AppActions.appFinishLoading())
    ));

    openEgg$ = createEffect(() =>
      this.actions$.pipe(
      ofType(EggActions.openEgg),
      tap((a) => this.eggService.openEgg()),
    ), {dispatch: false});

    eatEgg$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EggActions.eatEgg),
      mergeMap(() => this.fns.httpsCallable<any, {name: string, fullname: string}>('eatEgg')({})),
      tap(x => console.log('eat character', x)),
      map(eatcharacter => EggActions.setEatEgg(eatcharacter))
    ));

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private eggstatusService: EggstatusService,
    private eggService: EggService,
    private fns: AngularFireFunctions,
    private store: Store
  ) {}
}
