import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';


export interface User {
    uid: string;
}
export interface State {
  loading: boolean;
  user: User;
}

export const initialState: State = {
    loading: false,
    user: null
  };


const appReducer = createReducer(
    initialState,
    on(AppActions.appStartLoading, (state: State) => ({ ...state, loading: true})),
    on(AppActions.appFinishLoading, (state: State) => ({ ...state, loading: false})),
    on(AppActions.appSetUser, (state: State, {useruid}) => ({ ...state, user: {uid: useruid}}))
  );

export function reducer(state: State | undefined, action: Action) {
    return appReducer(state, action);
  }
