class Model {

    constructor(datastore) {

        this.datastore = datastore;

        this.reactor = new Reactor();
        this.reactor.registerEvent('documentLoaded');
        this.reactor.registerEvent('createPagemark');

        // The currently loaded document.
        this.docMeta = null;

    }

    /**
     * Called when a new document has been loaded.
     */
    documentLoaded(fingerprint, nrPages) {

        // TODO: test this method.

        console.log("New document loaded!");

        this.docMeta = this.datastore.getDocMeta(fingerprint);

        if(this.docMeta == null) {
            // this is a new document...
            this.docMeta = DocMeta.create(nrPages);
            this.datastore.sync(fingerprint, docMeta);
        }

        this.reactor.dispatchEvent('documentLoaded', {fingerprint, nrPages});

    }

    registerListenerForDocumentLoaded(eventListener) {
        this.reactor.addEventListener('documentLoaded', eventListener);
    }

    createPagemark(num) {
        this.reactor.dispatchEvent('createPagemark', {num});

        // FIXME: we need a fingerprint in the docInfo too.

        // TODO: consider only marking the page read once the datastore has
        //        been written.
        this.datastore.sync(this.docMeta.docInfo.fingerprint, docMeta);

    }

    registerListenerForCreatePagemark(eventListener) {
        this.reactor.addEventListener('createPagemark', eventListener);
    }

}

// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

class Event {

    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback){
        this.callbacks.push(callback);
    }

}

class Reactor {

    constructor() {
        this.events = {};
    }

    registerEvent(eventName){
        var event = new Event(eventName);
        this.events[eventName] = event;
    }

    dispatchEvent(eventName, eventArgs){
        this.events[eventName].callbacks.forEach(function(callback){
            callback(eventArgs);
        });
    }

    addEventListener(eventName, callback){
        this.events[eventName].registerCallback(callback);
    }

}
