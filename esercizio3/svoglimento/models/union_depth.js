module.exports = class UnionByDepth {
    constructor() {
        this.parent = [];
        this.depth = [];
    }

    makeSet(x) {
        this.parent[x] = x;
        this.depth[x] = 0;
    }

    findSet(x) {
        while(x !== this.parent[x]) {
            x = this.parent[x];
        }
        return x;
    }

    union(x,y) {
        let x1 = this.findSet(x);
        let y1 = this.findSet(y);

        if(this.depth[x1] > this.depth[y1]) {
            this.parent[y1] = x1;
        }
        else {
            this.parent[x1] = y1;
            if(this.depth[y1] === this.depth[x1]) {
                this.depth[y1]++;
            }
        }
    }
};