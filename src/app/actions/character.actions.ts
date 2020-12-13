import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { createAction, props } from '@ngrx/store';
import { MessageType } from '../reducers/character.reducer';

export const newMessage = createAction('[character] new message', props<{message: string, messagetype: MessageType}>());
export const readMessage = createAction('[character] read message');
