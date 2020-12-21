import { Action, createReducer, on } from '@ngrx/store';
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
}


export const initialState: State = {
    message: null,
    away: 0,
  };


const characterReducer = createReducer(
    initialState,
    on(CharacterActions.newMessage, (state, {message, messagetype }) =>
        ({ ...state,
            message: {...state.message, message, type: messagetype}})),
    on(CharacterActions.readMessage, (state) =>
        ({ ...state,
            message: null})),
  );

export function reducer(state: State | undefined, action: Action) {
    return characterReducer(state, action);
  }
