import { createAction, props } from '@ngrx/store';

export const appInit = createAction('[app] init');
export const appStartLoading = createAction('[app] loading');
export const appFinishLoading = createAction('[app] finish loading');
export const appInitAuth = createAction('[app] init authentication');
export const appLogout = createAction('[app] logout');
export const appSetUser = createAction('[app] set user', props<{useruid: string, isAnonymous: boolean, isPhone: boolean}>());



