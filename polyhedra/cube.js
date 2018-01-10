// Calculate cube's vertexes
THREE.EdgesGeometry.prototype.vertexes = function( position ) {
    this._vertexes || ( this._vertexes = [
        new THREE.Vector3,
        new THREE.Vector3,
        new THREE.Vector3,
        new THREE.Vector3,
        new THREE.Vector3,
        new THREE.Vector3,
        new THREE.Vector3,
        new THREE.Vector3
    ] );

    position.z = 0;
    var edgeHalf = 1;
    this._vertexes[0].set( position.x - edgeHalf, position.y + edgeHalf, position.z + edgeHalf );
    this._vertexes[1].set( position.x + edgeHalf, position.y + edgeHalf, position.z + edgeHalf );
    this._vertexes[2].set( position.x + edgeHalf, position.y - edgeHalf, position.z + edgeHalf );
    this._vertexes[3].set( position.x - edgeHalf, position.y - edgeHalf, position.z + edgeHalf );
    this._vertexes[4].set( position.x - edgeHalf, position.y + edgeHalf, position.z - edgeHalf );
    this._vertexes[5].set( position.x + edgeHalf, position.y + edgeHalf, position.z - edgeHalf );
    this._vertexes[6].set( position.x + edgeHalf, position.y - edgeHalf, position.z - edgeHalf );
    this._vertexes[7].set( position.x - edgeHalf, position.y - edgeHalf, position.z - edgeHalf );

    return this._vertexes;

};

THREE.LineSegments.prototype.vertexes = function() {
    return this.geometry.vertexes( this.position );
};

// Wireframe cube
var cubeGeometry = new THREE.BoxGeometry( 2, 2, 2 );
var wireframeGeometry = new THREE.EdgesGeometry( cubeGeometry );
var wireframeMaterial = new THREE.LineBasicMaterial( {
    color: 0x000000,
    linewidth: 2
} );
cube = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );

cube.addToScene = function() {
    sphericalizeObject( this );
    addPlaneShape( this );
    this.position.z = 1;
}

cube.removeFromScene = function() {
    scene.remove( scene.getObjectByName( 'shape-vertexes' ) );
    scene.remove( scene.getObjectByName( 'plane-vertexes' ) );
}
