import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError, concatMapTo, tap } from 'rxjs/operators';
import * as CharacterActions from '../actions/character.actions';
import * as AppActions from '../actions/app.actions';
import { AuthService } from '../services/auth.service';
// import { MoviesService } from './movies.service';

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

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
