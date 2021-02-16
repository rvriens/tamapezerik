import { createAction, props } from '@ngrx/store';

export const loadEggStatus = createAction('[egg] load status');
export const setEggStatus = createAction('[egg] set egg status', props<{status: number}>());
export const eggAnimation = createAction('[egg] animation');
export const openEgg = createAction('[egg] open egg');
export const eatEgg = createAction('[egg] eat egg');
export const setEatEgg = createAction('[egg] set eat egg', props<{name: string, fullname: string}>());
export const finishAnimation = createAction('[egg] finish egg animation');
