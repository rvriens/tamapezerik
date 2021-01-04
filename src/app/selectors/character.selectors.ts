import { AppState } from '../reducers/app.state';

export const selectMessage = (state: AppState) => state.character.message;
