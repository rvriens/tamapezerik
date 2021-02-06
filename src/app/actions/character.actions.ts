import { createAction, props } from '@ngrx/store';
import { Character } from 'functions/src/models/character.model';
import { MessageType } from '../reducers/character.reducer';

export const loadMessages = createAction('[character] load messages');
export const failedMessageLoading = createAction('[character] failed message loading');
export const newMessage = createAction('[character] new message', props<{message: string, messagetype: MessageType}>());
export const readMessage = createAction('[character] read message');
export const randomMessage = createAction('[character] random message');
export const loadCharacter = createAction('[character] load character');
export const updateCharacter = createAction('[character] update character', props<Character>());
export const failedCharacterLoading = createAction('[character] failed character loading');

export const loadOwner = createAction('[character] load owner');
export const updateOwner = createAction('[character] update owner', props<{name: string}>());
export const failedOwnerLoading = createAction('[character] failed owner loading');
