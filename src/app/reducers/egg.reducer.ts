import { Action, createReducer, on } from '@ngrx/store';
import * as EggActions from '../actions/egg.actions';

export enum EggStatus {
  Alive,
  Dead,
  New,
  Opening,
  DeadConfirmed
}

export interface State {
  loading: boolean;
  status: EggStatus;
  eatcharacter: {name: string, fullname: string};
}


export const initialState: State = {
    loading: false,
    status: EggStatus.New,
    eatcharacter: null
  };


const eggReducer = createReducer(
    initialState,
    on(EggActions.loadEggStatus, (state) =>
        ({...state, loading: true})),
    on(EggActions.openEgg, (state) =>
        ({...state, loading: true})),
    on(EggActions.setEggStatus, (state, {status}) =>
        ({ ...state, loading: false, status})),
    on(EggActions.eatEgg, (state ) =>
        ({ ...state, eatcharacter: null })),
    on(EggActions.setEatEgg, (state, eatcharacter ) =>
        ({ ...state, eatcharacter }))
  );

export function reducer(state: State | undefined, action: Action) {
    return eggReducer(state, action);
  }
