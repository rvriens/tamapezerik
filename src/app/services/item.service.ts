import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireDatabase} from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Item } from 'functions/src/models/item.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private db: AngularFireDatabase,
    private fs: AngularFirestore,
    private fns: AngularFireFunctions,
    private auth: AuthService) { }

    getItems(): Observable<Item[]> {

      const items =  this.fs
                         .collection<Item>('items')
                         .snapshotChanges()
                         .pipe(map( (snaps) =>
                             snaps.map( (snap) => {
                               const item = snap.payload.doc.data();
                               item.id = snap.payload.doc.id;
                               return item;
                             }))
                         );

      return items;

    }
}
