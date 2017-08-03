import { ContactStore } from './contact.store';

class AppStore {
    contactStore = new ContactStore();
}

export const appStore = new AppStore();
