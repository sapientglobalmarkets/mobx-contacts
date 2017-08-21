import { EntityMap } from 'shared/adapters';
import { Contact } from 'shared/domain';

class ContactStore {
    constructor() {
        this.contactMap = new EntityMap(Contact.toViewModel);
    }

    startListening() {
        this.contactMap.startListening('contacts');
    }

    stopListening() {
        this.contactMap.stopListening();
    }
}

export const contactStore = new ContactStore();
