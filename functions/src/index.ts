import * as functions from 'firebase-functions';

// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';

import { Character } from './models/character.model';
import { CharacterStatus } from './models/characterstatus.enum';
import { ItemAction } from './models/itemaction.model';
import { ItemHistory } from './models/itemhistory.model';

admin.initializeApp();

type FunctionOnDataSnapshot = (childSnapshot: admin.database.DataSnapshot) => Promise<any>;
export const asyncForEach = async (dataSnapshot: admin.database.DataSnapshot, childFunction: FunctionOnDataSnapshot) => {
    const toWait: any[] = [];
    dataSnapshot.forEach(childSnapshot => {
        toWait.push(childFunction((childSnapshot)));
    });
    await Promise.all(toWait);
};

exports.cronjobEndCharacters = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  console.log('This will be run every 1 hours!');
  
  const activeCharacters = await admin.database().ref(`/users`).orderByChild("character/status").equalTo(1).once('value');
  
  await asyncForEach(activeCharacters, async action => {
    const characterKey = action.key;
    // const user: any = action.val();
    if (characterKey !== null) {
      await admin.database().ref(`/users/${characterKey}/character/mood`).set('sad');
      const message = {text: 'Dees was carnaval 2021 "As dès kôs...!". Bedankt voor het verzorgen! Volgend jaar doen we het anders! "Psies in de prik...!"', type: 1};
      await admin.database().ref(`/users/${characterKey}/character/message`).set(message);
    }
  });

  return null;
});

exports.cronjobUpdateCharacters = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {

  console.log('This will be run every 24 hours!');
  if (1 === 1)
    return null;
  const activeCharacters = await admin.database().ref(`/users`).orderByChild("character/status").equalTo(1).once('value');
  
  await asyncForEach(activeCharacters, async action => {
    const characterKey = action.key;
    const user: any = action.val();
    if (characterKey !== null) {
      if (await characterUpdate(characterKey, user.character)) {
        await characterHighScore(characterKey, user.character);
      }
      if (!user.character.message && Math.floor(Math.random() * 10) === 0 ) {
        await loadMessage(characterKey, user.character.type, user.character.stats);
      }
    }
  });

  return null;
});

exports.cronjobCleanupCharacters = functions.pubsub.schedule('every 6 hours').onRun(async (context) => {

  console.log('This will be run every 6 hours!');

  // 2 = Dead
  // 3 = DeadConfirmed
  const inactiveCharacters = await admin.database().ref(`/users`).orderByChild("character/status").startAt(2).endAt(3).once('value');
  
  await asyncForEach(inactiveCharacters, async action => {
    const characterKey = action.key;
    const user: any = action.val();
    if (characterKey !== null) {
      await characterDelete(characterKey, user.character);
    }
  });

  return null;
});

async function characterDelete(characterKey: string, character: Character): Promise<void> {
  const date = admin.firestore.Timestamp.now();

  if (character.status === 3) {
    await characterRemove(characterKey);
  } else if (character.status === 2) {

    // bereken uren na laatste update
    const oneHour = 60 * 60 * 1000; // minutes*seconds*milliseconds
    const updateDate = <number>character.updated;
    const secondDate = date.toMillis();
    const diffHours = Math.abs((updateDate - secondDate) / oneHour);
    if (diffHours > 48) {
      await characterRemove(characterKey);
    }
  }
}

async function characterRemove(characterKey: string): Promise<void> {
  try {
    console.log('Cleanup character', characterKey);
    await admin.firestore().collection('/userlog').doc(characterKey).delete();
    await admin.database().ref(`/users/${characterKey}`).remove();
  } catch {
    console.error('Failed deleting', characterKey);
  }

}

async function characterUpdate(characterKey: string, character: Character): Promise<boolean> {
  // console.log("key", characterKey, "value", JSON.stringify(character));
  const date = admin.firestore.Timestamp.now();

  // bereken uren actief
  const oneMinute = 60 * 1000; // minutes*seconds*milliseconds
  const updateDate = <number>character.updated;
  const updateDiffMinutes = Math.round(Math.abs((updateDate - date.toMillis()) / oneMinute));

  // Voor de avond spelers (of niet!)
  if ( updateDiffMinutes > 30 && (date.toDate().getHours() > 22 || date.toDate().getHours() < 8)) {
    if (Math.floor(Math.random() * 10) < 8 ) {
      return false;
    }
  }

  let modStats: any = {
    hydration: 0,
    food: 0,
    love: 0,
    health: 0.1,
    pezerik: 0
  };

  // voor de spelers die inactief zijn
  if (updateDiffMinutes > 8) {
    modStats = {
      hydration: -0.2,
      food: -0.2,
      love: -0.2,
      health: 0.4,
      pezerik: -0.5
    }
  }
  const stats: any = character.stats;

  let minStat = 100;
  let avgStat = 0;
  Object.keys(modStats).forEach(
    key => {
      if (modStats[key] < 0) {
        if (stats[key] < 20) {
          modStats[key] = modStats[key] / 1.4;
        } else if (stats[key] < 15) {
          modStats[key] = modStats[key] / 1.7;
        } else if (stats[key]  < 10) {
          modStats[key] = modStats[key] / 2;
        }
      }
      if (modStats[key] > 0) {
        if (stats[key] > 80) {
          modStats[key] = modStats[key] / 1.4;
        } else if (stats[key] > 85) {
          modStats[key] = modStats[key] / 1.7;
        } else if (stats[key]  > 90) {
          modStats[key] = modStats[key] / 2;
        }
      }
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
      avgStat += stats[key];
    }
  );
  avgStat = avgStat / Object.keys(modStats).length / 12;

  // iedere 5 minuten 12 per uur.: = 288x per dag
  let points = character.points ?? 0;
  points += avgStat;

  // bereken uren actief
  const oneHour = 60 * 60 * 1000; // minutes*seconds*milliseconds
  const firstDate = <number>character.creating;
  const secondDate = date.toMillis();
  const diffHours = Math.round(Math.abs((firstDate - secondDate) / oneHour));


  //
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
    await admin.database().ref(`/users/${characterKey}/character/updated`).set(admin.database.ServerValue.TIMESTAMP);
  }
  await admin.database().ref(`/users/${characterKey}/character/stats`).set(stats);
  await admin.database().ref(`/users/${characterKey}/character/points`).set(points);
  if (character.hours !== diffHours) {
    await admin.database().ref(`/users/${characterKey}/character/hours`).set(diffHours);
  }
  
  character.stats = stats;
  character.points = points;

  return true;
}


async function characterHighScore(characterKey: string, character: Character): Promise<void> {

  if (!character.unique)
    return;
  if (character.status !== 1)
    return;
  
  console.log('update highscore', character.unique);
  await admin.firestore().collection('highscore').doc(character.unique).set(
    {
      hours: character.hours,
      points: character.points,
      originalname: character.name,
      name: character.alias ?? character.fullname,
      lastupdated: admin.firestore.Timestamp.now(),
      userid: characterKey
    }, {merge: true}
  );

}





// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hi there");
});

exports.randomMessage = functions.https.onCall(async (data, context) => {

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

  const [message, messagecat] = await loadMessage(context.auth.uid);

  return {message: message, cat: messagecat};
});

exports.readMessage = functions.https.onCall(async (data, context) => {

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

  await admin.database().ref(`/users/${context.auth.uid}/character/message`).remove();

  return true;
});

async function loadMessage(userUid: string, type: string | null = null, stats: {[key: string]: number} | null = null): Promise<any[]> {

  let messagecat: string | null = null;

  if (stats) {
    
    let smallestvalue = 200;
    Object.keys(stats).forEach(
      key => {
        if (stats[key] < smallestvalue) {
          smallestvalue = stats[key];
          messagecat = key;
        }
      }
    );
  }

  if (!messagecat) {
    const documents = await admin.firestore().collection('messages').listDocuments();
    const randomIndex = Math.floor(Math.random() * documents.length);
    messagecat = documents[randomIndex].id;
  
  }
  console.log('messagecat', messagecat);

  const documentscat = await admin.firestore().collection(`messages/${messagecat}/messages`).listDocuments();
  const randomIndexcat = Math.floor(Math.random() * documentscat.length);
  const id = documentscat[randomIndexcat].id;
  console.log('messageid', id);

  const messagedoc = await admin.firestore().collection(`messages/${messagecat}/messages`).doc(id).get();
  const messagedocdata: any = messagedoc.data();
  let message = {};
  if (messagedocdata?.message) {
    if (messagedocdata?.notfor) {
      let localtype = type;
      if (!localtype) {
        localtype = (await admin.database().ref(`/users/${userUid}/character/message`).once('value')).val();
      }
      const notfor: string[] = messagedocdata?.notfor;
      if (notfor.some((q) => q === localtype)) {
        return await loadMessage(userUid, type, stats);
      }
    }

    message = {text: messagedocdata.message, type: 1};
    console.log('message', message, messagedocdata);
    await admin.database().ref(`/users/${userUid}/character/message`).set(message);
  }
  return [message, messagecat];
}

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

    await admin.firestore().collection('/userlog').doc(context.auth.uid).delete();

    await admin.database().ref(`/users/${context.auth.uid}/character/status`).set(CharacterStatus.DeadConfirmed);

    return true;
});

exports.eatEgg = functions.https.onCall(async (data, context) => {
 
  const documents = await admin.firestore().collection('characters').listDocuments();
  const randomIndex = Math.floor(Math.random() * documents.length);
  const id = documents[randomIndex].id;

  const character: {name?: string, fullname?: string} = {name: 'empty', fullname: 'Henkie'};

  const characterdoc = await admin.firestore().collection('characters').doc(id).get();
  if (characterdoc.data()) {
    const characterData = characterdoc.data();
    if (characterData) {
        character.name = characterData.name;
        character.fullname = characterData.fullname;
    }
  }
  return character;
  
});

async function getOwner(auth: {uid: string,  token: admin.auth.DecodedIdToken}): Promise<string | null> {

  const phone =  auth.token.phone_number;
  if (!phone) return null;
  
  const phonedoc = await admin.firestore().collection('phones').doc(phone).get();
  if (!phonedoc.exists) return null;

  

  const name = phonedoc.data()?.name;

  console.log('getOwner', phone, name);

  if (name) {
    await admin.database().ref(`/users/${auth.uid}/owner/name`).set(name);
  }

  return name
}

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

  await getOwner(context.auth)

  const documents = await admin.firestore().collection('characters').listDocuments();
  const randomIndex = Math.floor(Math.random() * documents.length);
  const id = documents[randomIndex].id;

  const character: Character = {
    creating: admin.database.ServerValue.TIMESTAMP,
    updated: admin.database.ServerValue.TIMESTAMP,
    unique: admin.firestore().collection('_').doc().id,
    points: 0,
    hours: 0,
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

  await loadMessage(context.auth.uid, character.type);

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

  if (1 === 1 && item !== 'sing')
    return {success: false, message: 'Carnaval is alweer voorbij! 😢'};

  const cs: CharacterStatus = (await admin.database().ref(`/users/${context.auth.uid}/character/status`).once('value')).val();
  if (cs !== CharacterStatus.Alive) {
      return false;
  }

  const date = admin.firestore.Timestamp.now()

  const stats: any = (await admin.database().ref(`/users/${context.auth.uid}/character/stats`).once('value')).val();

  // item history
  const itemhistorySnap = await admin.firestore().collection(`userlog/${context.auth.uid}/items`).doc(item).get();
  let itemhistory: ItemHistory | null = null;
  const itemhistoryData = itemhistorySnap.data();
  if (itemhistoryData) {
    itemhistory = {
      counthour: itemhistoryData.counthour,
      lasthour: itemhistoryData.lasthour,
      countday: itemhistoryData.countday,
      lastday: itemhistoryData.lastday,
    };
  }

  const speed  = 0.3;
  if (itemhistory) {
    
    const oneHour = 60 * 60 * 1000 * speed;
    const lastHour = itemhistory.lasthour?.toMillis();
    console.log('date diff', date.toMillis(), lastHour, date.toMillis() - (lastHour ?? 0), oneHour)
    if (!lastHour || (date.toMillis() - lastHour) > oneHour) {
      itemhistory.lasthour = date;
      itemhistory.counthour = 0;
    }
    const oneDay = 24 * 60 * 60 * 1000 * speed;
    const lastDay = itemhistory.lastday?.toMillis();
    if (!lastDay || (date.toMillis() - lastDay) >  oneDay) {
      itemhistory.lastday = date;
      itemhistory.countday = 0;
    }

  }

  let maxperday: number | null = null;
  let maxperhour: number | null = null;
  let mutstats: {[key: string]: number} = {};

  const itemdoc = await admin.firestore().collection('items').doc(item).get();

    const itemData = itemdoc.data();

    if (itemData) {
      maxperday = itemData.maxperday;
      maxperhour = itemData.maxperhour;
      mutstats = itemData.stats;
    }

    const type: string = (await admin.database().ref(`/users/${context.auth.uid}/character/type`).once('value')).val();
    const name: string = (await admin.database().ref(`/users/${context.auth.uid}/character/name`).once('value')).val();

    const itemTypeDoc = await admin.firestore().collection('items').doc(item).collection('types').doc(type).get();

    const itemTypeData = itemTypeDoc.data();

    if (itemTypeData?.stats) {
      mutstats = itemTypeData.stats;
    }
    if (itemTypeData?.maxperday) {
      maxperday = itemTypeData.maxperday;
    }
    if (itemTypeData?.maxperhour) {
      maxperhour = itemTypeData.maxperhour;
    }

    const itemNameDoc = await admin.firestore().collection('items').doc(item).collection('names').doc(name).get();
    const itemNameData = itemNameDoc.data();
    if (itemNameData?.stats) {
      mutstats = itemNameData.stats;
    }
    if (itemNameData?.maxperday) {
      maxperday = itemNameData.maxperday;
    }
    if (itemNameData?.maxperhour) {
      maxperhour = itemNameData.maxperhour;
    }

    if (maxperday === 0 || !mutstats) {
      return {success: false, message: 'Dat is toch helemaal niks voor mij!'}
    }

    if (itemhistory?.countday && maxperday && itemhistory.countday >= maxperday) {
      // const message = {text: 'Even genoeg gehad voor vandaag', type: 2};
      // await admin.database().ref(`/users/${context.auth.uid}/character/message`).set(message);
      return {success: false, message: 'Even genoeg gehad voor vandaag'}
    }
    if (itemhistory?.counthour && maxperhour && itemhistory.counthour >= maxperhour) {
      // const message = {text: 'Even genoeg gehad', type: 2};
      // await admin.database().ref(`/users/${context.auth.uid}/character/message`).set(message);
      return {success: false, message: 'Even genoeg gehad'}
    }

    Object.keys(stats).forEach(
      key => {
        if (mutstats[key] && (stats[key] + mutstats[key]) < 100)
          stats[key] += mutstats[key];
      }
    );
  

  const newhistory: ItemHistory = {
    counthour: (itemhistory?.counthour ?? 0) + 1,
    lasthour: itemhistory?.lasthour ?? date,
    countday: (itemhistory?.countday ?? 0) + 1,
    lastday: itemhistory?.lastday ?? date,
  }
  await admin.firestore().collection(`userlog/${context.auth.uid}/items`).doc(item).set(newhistory)
  await admin.database().ref(`/users/${context.auth.uid}/character/stats`).set(stats);
  await admin.database().ref(`/users/${context.auth.uid}/character/updated`).set(admin.database.ServerValue.TIMESTAMP);

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

  const alias = data.alias;
  console.log('close opening - alias', data);
  if (alias) {
    await admin.database().ref(`/users/${context.auth.uid}/character/alias`).set(alias);
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

  await admin.firestore().collection('/userlog').doc(context.auth.uid).delete();
  await admin.database().ref(`/users/${context.auth.uid}/character/status`).set(CharacterStatus.DeadConfirmed);

  return true;
});

exports.ownerMessage = functions.https.onCall(async (data, context) => {

    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
          'while authenticated.');
    }

    if (!(await admin.database().ref(`/users/${context.auth.uid}/owner`).once('value')).exists())
      throw new functions.https.HttpsError('failed-precondition', 'No owner');

    const userUid: string = data.uid; 
    const message: string = data.message;
    
    await admin.database().ref(`/users/${userUid}/character/message`).set({text: message, type: 1});

    return true;
});

exports.ownerPoints = functions.https.onCall(async (data, context) => {

  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }

  if (!(await admin.database().ref(`/users/${context.auth.uid}/owner`).once('value')).exists())
    throw new functions.https.HttpsError('failed-precondition', 'No owner');

  const userUid: string = data.uid; 
  const addpoints: number = data.points;

  if (addpoints) {
    let points = (await admin.database().ref(`/users/${userUid}/character/points`).once('value')).val();
    points += addpoints;
    await admin.database().ref(`/users/${userUid}/character/points`).set(points);
  }

  return true;
});
