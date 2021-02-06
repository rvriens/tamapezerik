import { Action, createReducer, on } from '@ngrx/store';
import { Character } from 'functions/src/models/character.model';
import * as CharacterActions from '../actions/character.actions';

export enum MessageType {
    INFO = 1,
    OK = 2,
    WARNING = 10,
    ERROR = 11
}

export interface State {
  message: {
        text: string,
        type: MessageType
    };
  away: number;
  character: Character;
  owner: string;
}


export const initialState: State = {
    message: null,
    away: 0,
    character: null,
    owner: null
  };


const characterReducer = createReducer(
    initialState,
    on(CharacterActions.newMessage, (state, {message, messagetype }) =>
        ({ ...state,
            message: {...state.message, text: message, type: messagetype}})),
    on(CharacterActions.readMessage, (state) =>
        ({ ...state,
            message: null})),
    on(CharacterActions.loadMessages, (state) =>
        ({ ...state})),
    on(CharacterActions.failedMessageLoading, (state) =>
        ({ ...state})),
    on(CharacterActions.loadCharacter, (state) =>
        ({ ...state})),
    on(CharacterActions.updateCharacter, (state, character) =>
        ({ ...state, character})),
    on(CharacterActions.loadOwner, (state) =>
        ({ ...state, owner: null })),
    on(CharacterActions.updateOwner, (state, owner) =>
        ({ ...state, owner: owner.name })),
  );

export function reducer(state: State | undefined, action: Action) {
    return characterReducer(state, action);
  }
