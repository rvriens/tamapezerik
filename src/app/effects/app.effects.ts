import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError, concatMapTo, tap, filter } from 'rxjs/operators';
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
      tap((a) => {  }),
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
      tap((a) => { }),
      filter((a) => a.useruid != null),
    concatMapTo(
          [EggActions.loadEggStatus(),
          CharacterActions.loadMessages(),
          CharacterActions.loadCharacter()]
      )
    ));

  setUser2$ = createEffect(() =>
      this.actions$.pipe(
      ofType(AppActions.appSetUser),
      filter((a) => a.useruid == null),
      concatMapTo(
          [AppActions.appFinishLoading()]
      )
    ));

  logout$ = createEffect(() =>
    this.actions$.pipe(
    ofType(AppActions.appLogout),
    tap(() => this.authService.logout()),
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private eggstatusService: EggstatusService
  ) {}
}
