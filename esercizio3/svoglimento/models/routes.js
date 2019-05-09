/**
 * Struttura che memorizza i percorsi possibili calcolati dall'algoritmo di HK
 * @type {module.Routes}
 */
module.exports = class Routes {
    static get _LIST_SEPARATOR() { return "," };
    constructor() {
        this.routes = {};
    }

    set(node,list,cost) {
        if(this.routes[node] == null)
            this.routes[node] = {};

        this.routes[node][list.join(Routes._LIST_SEPARATOR)] = cost;
        return cost;
    }

    get(node,list) {
        if(this.routes[node] != null &&
            this.routes[node][list.join(Routes._LIST_SEPARATOR)] != null) {
            return this.routes[node][list.join(Routes._LIST_SEPARATOR)];
        }
        return null;
    }
};