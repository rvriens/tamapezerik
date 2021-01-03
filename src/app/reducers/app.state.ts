import { initialState as appReducerInitalState, State as AppReducerState } from './app.reducer';
import { initialState as characterInitialState, State as CharacterState } from './character.reducer';
import { initialState as eggInitialState, State as EggState } from './egg.reducer';
import { EggStatus } from './egg.reducer';

export interface AppState {
    app: AppReducerState;
    character: CharacterState;
    egg: EggState;
}

export const initalAppState: AppState = {
        app: appReducerInitalState,
        character: characterInitialState,
        egg: eggInitialState,
    };
