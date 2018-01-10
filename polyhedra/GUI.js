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
var sphericalize;

var params = {
    rotate: false,
    rotateX: true,
    rotateY: false,
    rotateZ: false,
    showCube: false,
    showSphere: false,
    sphereWireframe: false,

    cube: false,
    hypercube: true,
    sphericalize: true,
};

showSphere = GUI.add( params, 'showSphere' ).name( 'DisplaySphere ').onChange( function() {
    if ( params.showSphere ) {
        scene.add( sphere );
    } else {
        scene.remove( sphere );
    }
} );


rotate = GUI.add( params, 'rotate' ).name( 'RotateObject' ).onChange( function() {
    params.rotate ? toggleAxesFolder( true ) : toggleAxesFolder( false );

    // If no axis was selected when enabled, choose X axis as default
    if ( !params.rotateX || !params.rotateY || !params.rotateZ ) params.rotateX = true;
} );

cubeObject = GUI.add( params, 'cube' ).name( 'Cube' ).onChange( function() {
    resetScene();
    disableOtherObjects();
    sphericalize.domElement.parentNode.parentNode.style.display = 'none';
    if ( params.cube ) {
        rotationDegree = 0;
        scene.add( plane );
        cube.addToScene();
        showSphere.domElement.parentNode.parentNode.style.display = 'block';
        rotate.domElement.parentNode.parentNode.style.display = 'block';
        if (params.rotate) {
            toggleAxesFolder( true );
            rotate.domElement.click();
        }
        if (params.showSphere) {
            scene.add( sphere );
        }
    } else {
        showSphere.domElement.parentNode.parentNode.style.display = 'none';
        rotate.domElement.parentNode.parentNode.style.display = 'none';
        if (params.rotate) {
            toggleAxesFolder( false );
            rotate.domElement.click();
        }

    }
} );


hypercubeObject = GUI.add( params, 'hypercube' ).name( 'Hypercube' ).onChange( function() {
    resetScene();
    if ( params.hypercube ) {
        current_polytope = hypercube;
        sphericalize.domElement.parentNode.parentNode.style.display = 'block';
        if (params.rotate) {
            rotate.domElement.click();
        }
        if (params.cube) {
            cubeObject.domElement.click();
        }
        buildPolyheroid( hypercube );
    } else {
        sphericalize.domElement.parentNode.parentNode.style.display = 'none';

    }
} );

sphericalize = GUI.add( params, 'sphericalize' ).name( 'Sphericalize' ).onChange( function() {
    resetScene();
    sphericalize_polytopes = params.sphericalize;
    buildPolyheroid( current_polytope );
} );

showSphere.domElement.parentNode.parentNode.style.display = 'none';
rotate.domElement.parentNode.parentNode.style.display = 'none';
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

function disableOtherObjects() {
    params.hypercube && hypercubeObject.domElement.click();
}

function resetScene() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}
