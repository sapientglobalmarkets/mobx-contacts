import FirebaseMap from 'core/utils/firebase-map';
import Contact from './models/contact';

class ContactStore {

    constructor() {
        this.contactMap = new FirebaseMap(Contact.toViewModel);
    }

    startListening() {
        this.contactMap.startListening('contacts');
    }

    stopListening() {
        this.contactMap.stopListening();
    }
}

let contactStore = new ContactStore();

export default contactStore;
