module.exports = class Queue {
    constructor() {
        this._content = [];
    }
    /**
     * @param {Object} element l'elemento da aggiungere alla coda
     */
    enqueue(element) {
        this._content.push(element);
    }

    dequeue() {
        return this._content.shift();
    }

    empty() {
        return this._content.length == 0;
    }
}