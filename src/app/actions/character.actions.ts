import { createAction, props } from '@ngrx/store';
import { MessageType } from '../reducers/character.reducer';

export const loadMessages = createAction('[character] load messages');
export const failedMessageLoading = createAction('[character] failed message loading');
export const newMessage = createAction('[character] new message', props<{message: string, messagetype: MessageType}>());
export const readMessage = createAction('[character] read message');
export const randomMessage = createAction('[character] random message');
