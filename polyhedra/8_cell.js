// Creating 8-cell's object prototype
function EightCell( position ) {
    this.position = position;
    // Default Vector4 value is (0, 0, 0, 1)
    this._vertexes = [
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
        new THREE.Vector4,
    ];
}

Object.defineProperty(EightCell.prototype, 'vertexes', {
    get: function() {
        var edgeHalf = 0.5;
        var val = 0;
        this._vertexes[0].set( val - edgeHalf, val + edgeHalf, val + edgeHalf, val + edgeHalf );
        this._vertexes[1].set( val + edgeHalf, val + edgeHalf, val + edgeHalf, val + edgeHalf );
        this._vertexes[2].set( val + edgeHalf, val - edgeHalf, val + edgeHalf, val + edgeHalf );
        this._vertexes[3].set( val - edgeHalf, val - edgeHalf, val + edgeHalf, val + edgeHalf );
        this._vertexes[4].set( val - edgeHalf, val + edgeHalf, val - edgeHalf, val + edgeHalf );
        this._vertexes[5].set( val + edgeHalf, val + edgeHalf, val - edgeHalf, val + edgeHalf );
        this._vertexes[6].set( val + edgeHalf, val - edgeHalf, val - edgeHalf, val + edgeHalf );
        this._vertexes[7].set( val - edgeHalf, val - edgeHalf, val - edgeHalf, val + edgeHalf );
        this._vertexes[8].set( val - edgeHalf, val + edgeHalf, val + edgeHalf, val - edgeHalf );
        this._vertexes[9].set( val + edgeHalf, val + edgeHalf, val + edgeHalf, val - edgeHalf );
        this._vertexes[10].set( val + edgeHalf, val - edgeHalf, val + edgeHalf, val - edgeHalf );
        this._vertexes[11].set( val - edgeHalf, val - edgeHalf, val + edgeHalf, val - edgeHalf );
        this._vertexes[12].set( val - edgeHalf, val + edgeHalf, val - edgeHalf, val - edgeHalf );
        this._vertexes[13].set( val + edgeHalf, val + edgeHalf, val - edgeHalf, val - edgeHalf );
        this._vertexes[14].set( val + edgeHalf, val - edgeHalf, val - edgeHalf, val - edgeHalf );
        this._vertexes[15].set( val - edgeHalf, val - edgeHalf, val - edgeHalf, val - edgeHalf );
        return this._vertexes;
    }
});

Object.defineProperty(EightCell.prototype, 'projected_vertexes', {
    get: function() {
        return applyStereographicProjection4D( this.vertexes );
    }
});

Object.defineProperty(EightCell.prototype, 'last_cell_vertice_indexes', {
    get: function() {
        return [8, 11, 12, 15, 13, 14, 9, 10];
    }
});

hypercube = new EightCell( new THREE.Vector4(0, 0, 1, 1) );
