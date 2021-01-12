import { firestore } from "firebase-admin";

export class ItemHistory {
    public counthour?: number;
    public lasthour?: firestore.Timestamp;
    public countday?: number;
    public lastday?: firestore.Timestamp;
}