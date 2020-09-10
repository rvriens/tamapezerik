import { CharacterStatus } from './characterstatus.enum';

export class Character {
    public creating: any;
    public updated: any;
    public name?: string;
    public mood?: string;
    public fullname?: string;
    public type?: string;
    public status?: CharacterStatus;
    public stats?: {love: number; health: number; pezerik: number; hydration: number; food: number; };
    public initial?: string;
    public tip?: string;
}
