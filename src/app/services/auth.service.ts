import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: User;
    userSubscription = new Subject<User>();

    constructor(
        public  afAuth: AngularFireAuth,
        public  router: Router,
        private alertCtrl: AlertController) {
        this.afAuth.authState.subscribe(user => {
            // console.log('user 1', user);
            this.userSubscription.next(user);
            // console.log('user 2', user);
            if (user) {
              this.user = user;
              localStorage.setItem('user', JSON.stringify(this.user));
            } else {
              localStorage.setItem('user', null);
            }
          });
     }

     async getUserUid(): Promise<string> {
         if (this.user != null) {
            return this.user.uid;
         }
         return new Promise<string>(resolve =>
                        this.userSubscription.subscribe(
                            user => resolve(user ? user.uid : null)
                            )
                        );
     }

     async loginMobile(phone: string, container: any) {
        let recaptchaVerifier: auth.RecaptchaVerifier = null;
        try {
            recaptchaVerifier = new auth.RecaptchaVerifier(container);
            const confirmationResult = await this.afAuth.signInWithPhoneNumber(phone, recaptchaVerifier);

            const prompt = await this.alertCtrl.create({
                header: 'Voer controle code in',
                inputs: [{ name: 'confirmationCode', placeholder: 'Controle code' }],
                buttons: [
                  { text: 'Annuleren', role: 'cancel'},
                  { text: 'Verzenden',
                    handler: async d => {
                        const user = await confirmationResult.confirm(d.confirmationCode);
                        // console.log('confirmation', JSON.stringify(user));
                        // this.user = user.user;
                        window.location.reload();
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
                        // console.log('confirmation', JSON.stringify(user));
                        // this.user = user.user;
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
        const  user  =  JSON.parse(localStorage.getItem('user'));
        return  user  !==  null;
    }
}
