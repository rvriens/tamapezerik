import { createAction, props } from '@ngrx/store';

export const loadEggStatus = createAction('[egg] load status');
export const setEggStatus = createAction('[egg] set egg status', props<{status: number}>());
export const openEgg = createAction('[egg] open egg');
