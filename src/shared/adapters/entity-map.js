import firebase from 'firebase';
import 'shared/init/firebase-init';
import { action, observable, ObservableMap } from 'mobx';

export class EntityMap {
    // Map of id -> viewModel
    @observable map = new ObservableMap();

    @observable isLoading = true;

    /**
     * @param toViewModel(id, domainModel) - converts the domain model received from Firebase to a view model.
     * @param {Object} options
     * @param {function} options.onInitialValue - called when all values are initially received
     * @param {function} options.onChildAdded - called when a child is added
     * @param {function} options.onChildChanged - called when a child is changed
     * @param {function} options.onChildRemoved - called when a child is removed
     */
    constructor(toViewModel, options = {}) {
        this.url = null;
        this.ref = null;
        this.toViewModel = toViewModel;
        this.options = options;
    }

    isListenerRunning() {
        return this.ref !== null;
    }

    @action
    // This is used when the map needs to be initialized from data stored in local store
    initFromObjectMap(srcMap) {
        this.map.clear();
        for (const id in srcMap) {
            const viewModel = this.toViewModel(id, srcMap[id]);
            this.map.set(id, viewModel);
        }
        this.isLoading = false;
    }

    @action
    startListening(url) {
        if (this.ref) {
            this.stopListening();
        }

        this.url = url;
        console.log('EntityMap.startListening', this.url);

        // Clear the map
        this.map.clear();
        this.isLoading = true;

        // Start listening
        this.ref = firebase.database().ref(url);
        this.ref.on('child_added', this.onChildAdded);
        this.ref.on('child_changed', this.onChildChanged);
        this.ref.on('child_removed', this.onChildRemoved);

        // Get the initial values only once
        this.ref.once('value', this.onInitialValue);
    }

    stopListening() {
        if (this.ref) {
            console.log('EntityMap.stopListening', this.url);
            this.ref.off();
            this.ref = null;
            this.url = null;
        }
    }

    @action
    onChildAdded = snapshot => {
        const id = snapshot.key;

        // Ignore until initial loading has been completed.
        // child_added events for initial data will always fire before the value events.
        // Until the first value event has been received, child_added events can be ignored.
        if (this.isLoading === false) {
            this.addSnapshotToMap(snapshot);
        }

        // Bubble up to the parent
        if (this.options.onChildAdded) {
            this.options.onChildAdded(id);
        }
    };

    @action
    onChildChanged = snapshot => {
        const id = snapshot.key;

        // Ignore until initial loading has been completed.
        if (this.isLoading === false) {
            this.addSnapshotToMap(snapshot);
        }

        // Bubble up to the parent
        if (this.options.onChildChanged) {
            this.options.onChildChanged(id);
        }
    };

    @action
    onChildRemoved = snapshot => {
        const id = snapshot.key;

        // Ignore until initial loading has been completed.
        if (this.isLoading === false) {
            this.map.delete(snapshot.key);
        }

        // Bubble up to the parent
        if (this.options.onChildRemoved) {
            this.options.onChildRemoved(id);
        }
    };

    @action
    onInitialValue = snapshot => {
        snapshot.forEach(childSnapshot => {
            this.addSnapshotToMap(childSnapshot);
        });

        this.isLoading = false;

        // Bubble up to the parent
        if (this.options.onInitialValue) {
            this.options.onInitialValue();
        }
    };

    toDomainModel() {
        const domainMap = {};
        this.map.forEach((value, key) => {
            domainMap[key] = value.toDomainModel();
        });
        return domainMap;
    }

    saveViewModel(viewModel) {
        if (viewModel && viewModel.id) {
            return firebase
                .database()
                .ref(`${this.url}/${viewModel.id}`)
                .set(viewModel.toDomainModel());
        } else {
            return Promise.reject({
                code: 'error',
                message: 'Cannot save entity: identifier not specified'
            });
        }
    }

    // Adds a snapshot to the map (after converting to the view model)
    addSnapshotToMap(snapshot) {
        const id = snapshot.key;
        const domainModel = snapshot.val();
        const viewModel = this.toViewModel(id, domainModel);
        this.map.set(id, viewModel);
    }

    // Expose map methods
    has(key) {
        return this.map.has(key);
    }
    set(key, value) {
        return this.map.set(key, value);
    }
    delete(key) {
        return this.map.delete(key);
    }
    get(key) {
        return this.map.get(key);
    }
    keys() {
        return this.map.keys();
    }
    values() {
        return this.map.values();
    }
    entries() {
        return this.map.entries();
    }
    forEach(callback, thisArg) {
        this.map.forEach(callback, thisArg);
    }
    clear() {
        this.map.clear();
    }
    get size() {
        return this.map.size;
    }
}
