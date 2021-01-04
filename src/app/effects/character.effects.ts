import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, tap, delay, filter } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import * as CharacterActions from '../actions/character.actions';
import { selectUserUid } from '../selectors/app.selectors';

@Injectable()
export class CharacterEffects {

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharacterActions.loadMessages),
      withLatestFrom(this.store.select(selectUserUid)),
      tap(([a, userUid]) => console.log('loadMessage', a, userUid)),
      delay(5000),
      mergeMap(([action, userUid]) => this.db.object<{text, type}>(`users/${userUid}/character/message`).snapshotChanges()
        .pipe(
          tap(x => console.log('message', x)),
          filter(ssc => ssc.type === 'value' && !!ssc.key),
          map(message => CharacterActions.newMessage({message: message.payload.val().text, messagetype: message.payload.val().type}) ),
          catchError(() => of(CharacterActions.failedMessageLoading()))
        )
      )
    )
  );

  failedMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharacterActions.failedMessageLoading),
      tap(() => console.error('failed loading message'))
    ), {dispatch: false});


  randomMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharacterActions.randomMessage),
      withLatestFrom(this.store.select(selectUserUid)),
      tap(([a, userUid]) => console.log('randomMessage', a, userUid)),
      mergeMap(([action, userUid]) => this.fns.httpsCallable('randomMessage')({})
        .pipe(
          tap(x => console.log('message', x)),
          catchError(() => of(CharacterActions.failedMessageLoading()))
        )
      )
    ), {dispatch: false}
  );
  // this.db.database.ref(`users/${userUid}/character/status`).on

  readMessage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CharacterActions.readMessage),
    mergeMap(() => this.fns.httpsCallable('readMessage')({})
      .pipe(
        tap(x => console.log('readMessage', x)),
        catchError(() => of(CharacterActions.failedMessageLoading()))
      )
    )
  ), {dispatch: false}
);

  constructor(
    private actions$: Actions,
    private db: AngularFireDatabase,
    private fns: AngularFireFunctions,
    private store: Store
  ) {}
}
