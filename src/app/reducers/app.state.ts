import { State as AppReducerState } from './app.reducer';
import { State as CharacterState } from './character.reducer';

export interface AppState {
    app: AppReducerState;
    character: CharacterState;
}
