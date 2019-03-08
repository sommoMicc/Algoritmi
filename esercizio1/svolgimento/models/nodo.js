module.exports = class Node {
    constructor(value) {
        this.value = value;
        this.children = new Set();
    }

    connect(node) {
        return this.children.add(node);
    }

    disconnect(node) {
        return this.children.delete(node);
    }
}