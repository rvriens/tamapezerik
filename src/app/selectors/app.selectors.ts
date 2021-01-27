import { AppState } from '../reducers/app.state';


export const selectUser = (state: AppState) => state.app?.user;
export const selectUserUid = (state: AppState) => state.app?.user?.uid;
export const selectIsAnonymous = (state: AppState) => state.app?.user?.isAnonymous;
export const selectIsPhone = (state: AppState) => state.app?.user?.isPhone;

export const selectLoading = (state: AppState) => state.app.loading;
