// Make GUI folders removable
dat.GUI.prototype.removeFolder = function( name ) {
    var folder = this.__folders[name];
    if ( !folder ) {
        return;
    }
    folder.close();
    this.__ul.removeChild( folder.domElement.parentNode );
    delete this.__folders[name];
    this.onResize();
}

var GUI = new dat.GUI();

var params = {
    rotate: false,
    rotateX: true,
    rotateY: false,
    rotateZ: false,
    showCube: false,
    sphereWireframe: false,
};

GUI.add( params, 'showCube' ).name( 'DisplayCube' ).onChange( function() {
    if (params.showCube) {
        scene.add( cube );
    } else {
        scene.remove( scene.getObjectByName( 'cube' ) );
    }
} );

GUI.add( params, 'sphereWireframe' ).name( 'WireframeSphere' ).onChange( function() {
    sphere.material.wireframe = params.sphereWireframe;
} );

GUI.add( params, 'rotate' ).name( 'RotateObject' ).onChange( function() {
    params.rotate ? toggleAxesFolder( true ) : toggleAxesFolder( false );

    // If no axis was selected when enabled, choose X axis as default
    if ( !params.rotateX || !params.rotateY || !params.rotateZ ) params.rotateX = true;
} );

GUI.open();


function toggleAxesFolder( rotationIsEnabled ) {

    function toggleRotation() {
        params.rotate = ( params.rotateX || params.rotateY || params.rotateZ );
    }

    function addAxesFolder() {
        var rotationAxes = GUI.addFolder('Axes');
        rotationAxes.add( params, 'rotateX' ).name( 'x' ).onChange( toggleRotation );
        rotationAxes.add( params, 'rotateY' ).name( 'y' ).onChange( toggleRotation );
        rotationAxes.add( params, 'rotateZ' ).name( 'z' ).onChange( toggleRotation );
        rotationAxes.open();
    };

    rotationIsEnabled ? addAxesFolder() : GUI.removeFolder( 'Axes' );
}
