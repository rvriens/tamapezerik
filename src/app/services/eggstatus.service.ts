import { Injectable } from '@angular/core';

export enum EggStatus {
  Alive,
  Dead,
  New,
  Opening
}

@Injectable({
  providedIn: 'root'
})
export class EggstatusService {

  constructor() { }

  async getEggStatus(): Promise<EggStatus> {
    return EggStatus.New;
  }
}
