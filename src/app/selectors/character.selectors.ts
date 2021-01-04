import { AppState } from '../reducers/app.state';

export const selectMessage = (state: AppState) => state.character.message;

export const selectPoints = (state: AppState) => state.character.character?.points;
export const selectHours = (state: AppState) => state.character.character?.hours;
