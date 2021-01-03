import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError, concatMapTo, tap } from 'rxjs/operators';
import * as CharacterActions from '../actions/character.actions';
import * as EggActions from '../actions/egg.actions';
import * as AppActions from '../actions/app.actions';
import { AuthService } from '../services/auth.service';
import { EggstatusService } from '../services/eggstatus.service';

@Injectable()
export class AppEffects {

  initApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.appInit),
      tap((a) => {
          console.log('action', a);
        }),
      concatMapTo(
            [AppActions.appStartLoading(),
             AppActions.appInitAuth()]
        )
      )
    );

  initAuth$ = createEffect(() =>
      this.actions$.pipe(
      ofType(AppActions.appInitAuth),
      tap(() => this.authService.initAuthFirebase()),
    ), {dispatch: false});

  setUser$ = createEffect(() =>
      this.actions$.pipe(
      ofType(AppActions.appSetUser),
      tap((a) => {
        console.log('action', a);
      }),
    concatMapTo(
          [EggActions.loadEggStatus()]
      )
    ), {dispatch: false});

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private eggstatusService: EggstatusService
  ) {}
}
