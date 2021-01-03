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

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private eggstatusService: EggstatusService,
    private eggService: EggService,
    private store: Store
  ) {}
}
