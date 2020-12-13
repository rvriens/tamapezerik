import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as CharacterActions from '../actions/character.actions';

@Injectable()
export class CharacterEffects {

  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharacterActions.newMessage.name),
      mergeMap(() => new Observable<boolean>()
        .pipe(
          map(movies => ({ type: '[] Movies Loaded Success', payload: movies })),
          catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
  ) {}
}
