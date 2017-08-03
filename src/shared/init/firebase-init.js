// This module should be imported by any module that uses firebase.
//
//     import firebase from 'firebase';
//     import 'shared/init/firebase-init';
//
// Even though this import is not importing anything, it has the side-effect of initializing firebase.

import firebase from 'firebase';
import { config } from 'config';

// Initialize firebase
firebase.initializeApp(config.firebase);
