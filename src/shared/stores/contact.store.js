import { EntityMap } from 'shared/adapters';
import { Contact } from 'shared/domain';

export class ContactStore {
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
