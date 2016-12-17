import firebase from 'firebase';
import { action, map, observable } from 'mobx';
import 'core/init/firebase-init';

export default class FirebaseMap {

    @observable map = map();
    @observable isLoading = true;

    /**
     * toViewModel is a function that converts the domain model received from Firebase to a view model.
     * Signature: toViewModel(id, domainModel)
     */
    constructor(toViewModel) {
        this.url = null;
        this.ref = null;
        this.toViewModel = toViewModel;
    }

    @action
    startListening(url) {
        console.log('FirebaseMap.startListening', url);

        // Clear the map
        this.map.clear();
        this.isLoading = true;

        // Start listening
        this.url = url;
        this.ref = firebase.database().ref(url);
        this.ref.on('child_added', this.onChildAdded.bind(this));
        this.ref.on('child_changed', this.onChildChanged.bind(this));
        this.ref.on('child_removed', this.onChildRemoved.bind(this));

        // Get the initial values only once
        this.ref.once('value', this.onInitialValue.bind(this));
    }

    stopListening() {
        if (this.ref) {
            console.log('FirebaseMap.stopListening', this.ref.parent.toString(), this.ref.key);
            this.ref.off();
            this.ref = null;
            this.url = null;
        }
    }

    @action
    onChildAdded(snapshot) {
        // Ignore until initial loading has been completed.
        // child_added events for initial data will always fire before the value events.
        // Until the first value event has been received, child_added events can be ignored.
        if (this.isLoading === false) {
            this.addSnapshotToMap(snapshot);
        }
    }

    @action
    onChildChanged(snapshot) {
        // Ignore until initial loading has been completed.
        if (this.isLoading === false) {
            this.addSnapshotToMap(snapshot);
        }
    }

    @action
    onChildRemoved(snapshot) {
        // Ignore until initial loading has been completed.
        if (this.isLoading === false) {
            this.map.delete(snapshot.key);
        }
    }

    @action
    onInitialValue(snapshot) {
        snapshot.forEach(childSnapshot => {
            this.addSnapshotToMap(childSnapshot);
        });
        this.isLoading = false;
    }

    saveViewModel(viewModel) {
        if (viewModel && viewModel.id) {
            return firebase.database().ref(`${this.url}/${viewModel.id}`).set(viewModel.toDomainModel());
        }
        else {
            return Promise.reject({
                code: 'error',
                message: 'Cannot save entity: identifier not specified'
            });
        }
    }

    // Adds a snapshot to the map (after converting to the view model)
    addSnapshotToMap(snapshot) {
        let id = snapshot.key;
        let domainModel = snapshot.val();
        let viewModel = this.toViewModel.call(this, id, domainModel);
        this.map.set(id, viewModel);
    }

    // Expose map methods
    has(key) { return this.map.has(key); }
    set(key, value) { return this.map.set(key, value); }
    delete(key) { return this.map.delete(key); }
    get(key) { return this.map.get(key); }
    keys() { return this.map.keys(); }
    values() { return this.map.values(); }
    entries() { return this.map.entries(); }
    forEach(callback, thisArg) { this.map.forEach(callback, thisArg); }
    clear() { this.map.clear(); }
    get size() { return this.map.size; }
}
