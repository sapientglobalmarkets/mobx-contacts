/**
 * This module should be imported by any module that uses firebase.
 *
 *     import 'core/init/firebase-init';
 *
 * Even though this import is not importing anything, it has the side-effect of initializing firebase.
 */
import firebase from 'firebase';

// Initialize firebase
var config = {
    apiKey: 'AIzaSyAhjQLO9CPLSIz3R41APt7cNS3F6RRjoP4',
    authDomain: 'mobx-contacts.firebaseapp.com',
    databaseURL: 'https://mobx-contacts.firebaseio.com',
    storageBucket: 'mobx-contacts.appspot.com',
    messagingSenderId: '434241241011'
};
firebase.initializeApp(config);
