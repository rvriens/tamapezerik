import * as functions from 'firebase-functions';

// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';

import { Character } from './models/character.model';
import { CharacterStatus } from './models/characterstatus.enum';
import { ItemAction } from './models/itemaction.model';

admin.initializeApp();

type FunctionOnDataSnapshot = (childSnapshot: admin.database.DataSnapshot) => Promise<any>;
export const asyncForEach = async (dataSnapshot: admin.database.DataSnapshot, childFunction: FunctionOnDataSnapshot) => {
    const toWait: any[] = [];
    dataSnapshot.forEach(childSnapshot => {
        toWait.push(childFunction((childSnapshot)));
    });
    await Promise.all(toWait);
};

exports.cronjobUpdateCharacters = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {

  console.log('This will be run every 5 minutes!');
  

  /*
  async context => {

        // Consistent timestamp
        const now = admin.firestore.Timestamp.now();
                // Query all documents ready to perform
        const query = db.collection('tasks').where('performAt', '<=', now).where('status', '==', 'scheduled');

        const tasks = await query.get();
  */

  
  const activeCharacters = await admin.database().ref(`/users`).orderByChild("character/status").equalTo(1).once('value');
  
  await asyncForEach(activeCharacters, async action => {
    const characterKey = action.key;
    const user: any = action.val();
    if (characterKey !== null) {
      await characterUpdate(characterKey, user.character);
    }
  });

  return null;
});

async function characterUpdate(characterKey: string, character: Character): Promise<void> {
  console.log("key", characterKey, "value", JSON.stringify(character));
  const modStats: any = {
    hydration: -0.2,
    food: -0.2,
    love: -0.2,
    health: 0.6,
    pezerik: -0.5
  };
  const stats: any = character.stats;

  let minStat = 100;
  Object.keys(modStats).forEach(
    key => {
      stats[key] += modStats[key];
      if (stats[key] > 100) {
        stats[key] = 100;
      }
      if (stats[key] < 0) {
        stats[key] = 0;
      }
      if (stats[key] < minStat) {
        minStat = stats[key];
      }
    }
  );
  let newMood = 'neutral';
  if (minStat < 15) {
    newMood = 'sad';
  }
  if (minStat > 60) {
    newMood = 'happy'
  }
  if (character.mood !== newMood) {
    await admin.database().ref(`/users/${characterKey}/character/mood`).set(newMood);
  }
  if (minStat <= 0) {
    await admin.database().ref(`/users/${characterKey}/character/status`).set(CharacterStatus.Dead);
  }
  await admin.database().ref(`/users/${characterKey}/character/stats`).set(stats);

}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hi there");
});

exports.closeOpening = functions.https.onCall(async (data, context) => {

  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }

  const cs: CharacterStatus = (await admin.database().ref(`/users/${context.auth.uid}/character/status`).once('value')).val();
  if (cs !== CharacterStatus.Opening) {
      return false;
  }

  await admin.database().ref(`/users/${context.auth.uid}/character/status`).set(CharacterStatus.Alive);
  
  
  return true;
});


exports.confirmDead = functions.https.onCall(async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
          'while authenticated.');
    }
  
    const x: Character = (await admin.database().ref(`/users/${context.auth.uid}/character`).once('value')).val();
    if (x && x.status !== CharacterStatus.Dead) {
        return false;
    }

    await admin.database().ref(`/users/${context.auth.uid}/character/status`).set(CharacterStatus.DeadConfirmed);

    return true;
});

exports.openEgg = functions.https.onCall(async (data, context) => {
  //const key: string = data.key;
  //let answer: string = data.answer;
  // answer = answer.toLowerCase();

  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }

  const x: Character = (await admin.database().ref(`/users/${context.auth.uid}/character`).once('value')).val();
  if (x && x.status !== CharacterStatus.DeadConfirmed) {
      return false;
  }

  const documents = await admin.firestore().collection('characters').listDocuments();
  const randomIndex = Math.floor(Math.random() * documents.length);
  const id = documents[randomIndex].id;

  const character: Character = {
    creating: admin.database.ServerValue.TIMESTAMP,
    updated: admin.database.ServerValue.TIMESTAMP,
    status: CharacterStatus.Opening,
    stats: {
        love: 50,
        health: 50,
        pezerik: 50,
        hydration: 50,
        food: 50
    }
  };
  const characterdoc = await admin.firestore().collection('characters').doc(id).get();
  if (characterdoc.data()) {
    const characterData = characterdoc.data();
    if (characterData) {
        character.name = characterData.name;
        character.fullname = characterData.fullname;
        character.type = characterData.type;
    }
  }
  if ( character.type) {
  const typedoc = await admin.firestore().collection('types').doc(character.type).get();
    if (typedoc.data()) {
      const typeData = typedoc.data();
      if (typeData) {
          character.stats = typeData.stats;
          character.initial = typeData.initial;
          character.tip = typeData.tip;
      }
    }
  }

  await admin.database().ref(`/users/${context.auth.uid}/character`).set(character);

  return true;
});

exports.giveItem = functions.https.onCall(async (data, context) => {

    const item = data.item;
//       const key = data.key;
//       const value = data.value;

  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }

  const cs: CharacterStatus = (await admin.database().ref(`/users/${context.auth.uid}/character/status`).once('value')).val();
  if (cs !== CharacterStatus.Alive) {
      return false;
  }

  const stats: any = (await admin.database().ref(`/users/${context.auth.uid}/character/stats`).once('value')).val();

  const itemdoc = await admin.firestore().collection('items').doc(item).get();
  if (itemdoc.data()) {
    const itemData = itemdoc.data();
    if (itemData) {
      Object.keys(itemData.stats).forEach(
        key => {
          stats[key] += itemData.stats[key];
        }
      );
    }
  }

  await admin.database().ref(`/users/${context.auth.uid}/character/stats`).set(stats);

  const itemAction = new ItemAction();
  itemAction.success = true;
  // itemAction.message = "" 
  itemAction.animation = item;
  return itemAction;
});

exports.closeOpening = functions.https.onCall(async (data, context) => {

  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }

  const cs: CharacterStatus = (await admin.database().ref(`/users/${context.auth.uid}/character/status`).once('value')).val();
  if (cs !== CharacterStatus.Opening) {
      return false;
  }

  await admin.database().ref(`/users/${context.auth.uid}/character/status`).set(CharacterStatus.Alive);

  return true;
});

exports.killEgg = functions.https.onCall(async (data, context) => {

  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }

  await admin.database().ref(`/users/${context.auth.uid}/character/status`).set(CharacterStatus.DeadConfirmed);

  return true;
});


//   
//   exports.openRoom = functions.https.onCall(async (data, context) => {
//   
//       const room = data.room;
//       const key = data.key;
//       const value = data.value;
//       
//       // Checking attribute.
//     //   if (!(typeof text === 'string') || text.length === 0) {
//     //   // Throwing an HttpsError so that the client gets the error details.
//     //   throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
//     //       'one arguments "text" containing the message text to add.');
//     // }
//   
//     // Checking that the user is authenticated.
//     if (!context.auth) {
//       // Throwing an HttpsError so that the client gets the error details.
//       throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
//           'while authenticated.');
//     }
//   
//       const roomkeysnap = await admin.database().ref(`/rooms/${room}/key`).once('value');
//       if (roomkeysnap.val() !== key)
//           throw new functions.https.HttpsError('failed-precondition', 'key room not matching');
//   
//       const keysnap = await admin.database().ref(`/keys/${key}/value`).once('value');
//       if (keysnap.val() !== value)
//           throw new functions.https.HttpsError('not-found', 'Invalid key value');
//       const obj: any = {};
//       obj[room] = true;
//       return admin.database().ref(`/open/${context.auth.uid}`).push(obj);
//     });
