import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, tap, delay, filter } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import * as CharacterActions from '../actions/character.actions';
import { selectUserUid } from '../selectors/app.selectors';
import { Character } from 'functions/src/models/character.model';

@Injectable()
export class CharacterEffects {

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharacterActions.loadMessages),
      withLatestFrom(this.store.select(selectUserUid)),
      mergeMap(([action, userUid]) => this.db.object<{text, type}>(`users/${userUid}/character/message`).snapshotChanges()
        .pipe(
          delay(5000),
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

  loadCharacter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharacterActions.loadCharacter),
      withLatestFrom(this.store.select(selectUserUid)),
      mergeMap(([action, userUid]) => this.db.object<Character>(`users/${userUid}/character`).snapshotChanges()
        .pipe(
          filter(ssc => ssc.type === 'value' && !!ssc.key),
          map(character => CharacterActions.updateCharacter(character.payload.val()) ),
          catchError(() => of(CharacterActions.failedCharacterLoading()))
        )
      )
    )
  );
  failedCharacters$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CharacterActions.failedCharacterLoading),
    tap(() => console.error('failed loading message'))
  ), {dispatch: false});

  randomMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharacterActions.randomMessage),
      withLatestFrom(this.store.select(selectUserUid)),
      mergeMap(([action, userUid]) => this.fns.httpsCallable('randomMessage')({})
        .pipe(
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
