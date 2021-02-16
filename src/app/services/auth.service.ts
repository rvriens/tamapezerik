import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, BehaviorSubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers/app.reducer';
import { appSetUser } from '../actions/app.actions';
import { map } from 'rxjs/operators';
import { selectLoading, selectUser, selectUserUid } from '../selectors/app.selectors';
import { AppState } from '../reducers/app.state';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userIsLoggedIn = false;

    constructor(
        public  afAuth: AngularFireAuth,
        public  router: Router,
        public store: Store<AppState>,
        private alertCtrl: AlertController) {

            this.store.pipe(select(selectUser)).subscribe( u =>
                {
                    this.userIsLoggedIn = !!u?.uid;
                 } );
     }

     async initAuthFirebase(): Promise<void> {

        this.afAuth.authState.subscribe(user => {
            if (user?.uid) {
                this.store.dispatch(appSetUser({useruid: user.uid, isAnonymous: user.isAnonymous, isPhone: !!user.phoneNumber}));
            }
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            } else {
              localStorage.setItem('user', null);
            }
          });

        const currentUser = await this.afAuth.currentUser;
        if (!currentUser) {
            this.store.dispatch(appSetUser({useruid: null, isAnonymous: false, isPhone: false}));
        }

     }

     async getUserUid(): Promise<string> {
         return this.store.select(selectUserUid).toPromise();
     }

     async loginMobile(phone: string, container: any) {
        let recaptchaVerifier: auth.RecaptchaVerifier = null;
        try {
            recaptchaVerifier = new auth.RecaptchaVerifier(container);

            /* Link current */
            let currentUser = await this.afAuth.currentUser;
            if (currentUser && !currentUser.isAnonymous) {
                currentUser = null;
            }
            const confirmationResult =  await (currentUser ? currentUser.linkWithPhoneNumber(phone, recaptchaVerifier) :
                                                             this.afAuth.signInWithPhoneNumber(phone, recaptchaVerifier));

            const prompt = await this.alertCtrl.create({
                header: 'Voer controle code in',
                inputs: [{ name: 'confirmationCode', placeholder: 'Controle code' }],
                buttons: [
                  { text: 'Annuleren', role: 'cancel'},
                  { text: 'Verzenden',
                    handler: async d => {
                        this.confirmPhoneCode(confirmationResult, d.confirmationCode);
                    }
                 }
                ]});
            await prompt.present();
            this.router.navigate(['/']);
        } catch (e) {
            // alert('Error!'  +  e.message);
            alert('Inloggen mislukt: '  +  e.message);
        }
        if (recaptchaVerifier) {
            recaptchaVerifier.clear();
        }

     }

     async confirmPhoneCode(confirmationResult: auth.ConfirmationResult, code: string): Promise<void> {
        try {
            const user = await confirmationResult.confirm(code);
            window.location.reload();
        } catch (error) {
            console.log('fout login', error);
            if (error.code === 'auth/credential-already-in-use') {
                const prompt2 = await this.alertCtrl.create({
                    header: 'Nummer is al gekoppeld. Bestaande verwijderen?',
                    buttons: [
                    { text: 'Annuleren', role: 'cancel'},
                    { text: 'Ja',
                        handler: async f => {
                        try {
                            await this.afAuth.signInWithCredential(error.credential);
                        } catch (error) {
                            console.log('recover error', error);
                        }
                        window.location.reload();
                        }
                    }]
                });
                await prompt2.present();
            }
        }
    }


    async emailSignin(email: string) {
        const provider = new auth.GoogleAuthProvider();
        try {
            await this.afAuth.sendSignInLinkToEmail(email, {url: 'https://escaperoom75.web.app/login/email', handleCodeInApp: true});
            localStorage.setItem('authemail', email);

        } catch (e) {
            // alert('Error!'  +  e.message);
            alert('Inloggen mislukt: '  +  e.message);
        }
        // return this.updateUserData(credential.user);
      }

    async tryMailLinkLogin(url: string) {
          if (!await this.afAuth.isSignInWithEmailLink(url)) {
            return;
          }
          let email = localStorage.getItem('authemail');
          if (!email) {
            const prompt = await this.alertCtrl.create({
                header: 'Voer emailadres in:',
                inputs: [{ name: 'email', placeholder: 'E-mail' }],
                buttons: [
                  { text: 'Annuleren', role: 'cancel'},
                  { text: 'Verzenden',
                    handler: async d => {
                        email = d.email;
                        this.afAuth.signInWithEmailLink(email, url);
                        this.router.navigate(['/']);

                    }
                 }
                ]});
            await prompt.present();
            return;
          }
          this.afAuth.signInWithEmailLink(email, url);
          this.router.navigate(['/']);
          localStorage.removeItem('authemail');
      }

    async googleSignin() {
        const provider = new auth.GoogleAuthProvider();
        try {
            const user = await this.afAuth.signInWithPopup(provider);
            this.router.navigate(['/']);
        } catch (e) {
            // alert('Error!'  +  e.message);
            alert('Inloggen mislukt: '  +  e.message);
        }
        // return this.updateUserData(credential.user);
      }

    async facebookSignin() {
        const provider = new auth.FacebookAuthProvider();
        try {
            const user = await this.afAuth.signInWithPopup(provider);
            this.router.navigate(['/']);
        } catch (e) {
            // alert('Error!'  +  e.message);
            alert('Inloggen mislukt: '  +  e.message);
        }
        // return this.updateUserData(credential.user);
      }

    async anonymouslySignin() {
          try {
            const user =  await this.afAuth.signInAnonymously();
          } catch (e) {
            alert('Inloggen mislukt: '  +  e.message);
          }
      }



     // async  login(email: string, password: string) {
     //    try {
     //        await  this.afAuth.auth.signInWithEmailAndPassword(email, password);
     //        this.router.navigate(['/']);
     //    } catch (e) {
     //        alert('Error!'  +  e.message);
     //    }
     // }

    async logout() {
        await this.afAuth.signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('keys');
        this.router.navigate(['/']);
    }

    get isLoggedIn(): boolean {
        // const  user  =  JSON.parse(localStorage.getItem('user'));
        // return  user  !==  null;
        return this.userIsLoggedIn;
    }
}
