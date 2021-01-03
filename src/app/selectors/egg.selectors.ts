import { AppState } from '../reducers/app.state';


export const selectEggStatus = (state: AppState) => state.egg.status;
export const selectEggLoading = (state: AppState) => state.egg.loading || state.app.loading;
